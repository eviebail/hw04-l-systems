import Turtle from "./Turtle";
import ExpansionRule from "./ExpansionRule";
import {vec3} from 'gl-matrix';
import {mat4} from 'gl-matrix';
import {quat} from 'gl-matrix';
import DrawingRule from "./DrawingRule";

export default class LSystem {
    current : number;
    expansion : ExpansionRule;
    drawRules : DrawingRule;
    axiom : string;
    turtleHistory : Turtle[] = new Array();
    drawPositions : Turtle[];
    grammar : string;

    constructor() {
        this.current = 0;
        this.expansion = new ExpansionRule();
        this.axiom = "F";
        this.grammar = this.axiom;
        this.turtleHistory.push(new Turtle(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), 0));
        this.drawRules = new DrawingRule(this);
        this.drawPositions = new Array();
    }

    map(input : string, xi : number) : string {
        //get set of expansions based on the curr char
        let rule = this.expansion.getRule(input); // string, number
        let sumProb = 0;

        for (let [v,p] of rule) {
            sumProb += p;
            if (xi < sumProb) {
                return v;
            }
        }
        return input;
    }

    expand() {
        //start with original axiom!
        let numExpansions = 3;
        let currString = "";
        this.grammar = this.axiom;
        for (let i = 0; i < numExpansions; ++i) {
            //console.log("Grammar: " + this.grammar);
            for (let j = 0; j < this.grammar.length; ++j) {
                let xi = Math.random();
                currString += this.map(this.grammar.charAt(j), xi); //this.expansion.getExpansion(this.grammar.charAt(j));
            }
            this.grammar = currString;
            
            currString = "";
        }
        console.log("Grammar: " + this.grammar);
    }

    mapDraw(input : string, xi : number) : any {
        let rule = this.drawRules.getRule(input); // string, number
        let sumProb = 0;

        for (let [v,p] of rule) {
            sumProb += p;
            if (xi < sumProb) {
                return v;
            }
        }
    }

    draw() : vec3[][] {
        //take the grammar and convert it to executable functions!
        let pos : vec3[] = new Array();
        let fo : vec3[] = new Array();
        let ri : vec3[] = new Array();
        let up : vec3[] = new Array();
        for (let i = 0; i < this.grammar.length; ++i) {
            let xi = Math.random();
            //get the function ptr
            let func = this.mapDraw(this.grammar.charAt(i), xi);
            if (func) {
                //call the function and save the new turtle pos to be saved
                let p = func(this.current, this.turtleHistory, this.drawPositions)
                //console.log("Pos returned: " + p);
                //console.log("TH Size: " + this.turtleHistory.length);
                // for (let g = 0; g < this.turtleHistory.length; g++) {
                //     console.log("Turtle pos " + this.turtleHistory[g].position);
                // }
                if (p[0][0] != -1) {
                    //pos forward right up
                    pos.push(p[0]);
                    fo.push(p[1]);
                    ri.push(p[2]);
                    up.push(p[3]);
                }
                //console.log(pos.length);
                //maybe let's let each function do this -> //this.drawPositions.push(this.turtleHistory[this.current]);
            }
            //console.log(pos.length);
        }
        let container : vec3[][] = new Array();
        container.push(pos);
        container.push(fo);
        container.push(ri);
        container.push(up);
        return container;
    }

    runSystem() : vec3[][] {
        this.expand();
        let pos = this.draw();
        return pos;
    }

    moveForward(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveForward(2.0);
        //console.log("Orientation: " + t.forward);
        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(t.position[0], t.position[1], t.position[2]);
        let rotation : mat4 = mat4.fromValues(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
        let angle = vec3.dot(vec3.fromValues(0,1,0), t.forward);
        let axis = vec3.fromValues(0,0,0);
        vec3.cross(axis, vec3.fromValues(0,1,0), t.forward);
        mat4.rotate(rotation, rotation, angle, axis);
        let o = vec3.fromValues(rotation[0], rotation[1], rotation[2]);
        let r = vec3.fromValues(rotation[4], rotation[5], rotation[6]);
        let u = vec3.fromValues(rotation[8], rotation[9], rotation[10]);
        let y = vec3.fromValues(rotation[12], rotation[13], rotation[14]);
        console.log("Matrix: " + o + ", " + r + ", " + u);
        let rest = vec3.fromValues(rotation[3], rotation[7], rotation[11]);
        //console.log("The rest: " + y + ", " + rest + ": " + rotation[15]);
        //pos forward right up
        let result = new Array();
        result.push(tPos);
        result.push(o);
        result.push(r);
        result.push(u);
        return result;
    }
    moveBackward(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveForward(-4.0);
        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(t.position[0], t.position[1], t.position[2]);
        let rotation : mat4 = mat4.fromValues(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
        let angle = vec3.dot(vec3.fromValues(0,1,0), t.forward);
        let axis = vec3.fromValues(0,0,0);
        vec3.cross(axis, vec3.fromValues(0,1,0), t.forward);
        mat4.rotate(rotation, rotation, angle, axis);
        let o = vec3.fromValues(rotation[0], rotation[1], rotation[2]);
        let r = vec3.fromValues(rotation[4], rotation[5], rotation[6]);
        let u = vec3.fromValues(rotation[8], rotation[9], rotation[10]);
        let y = vec3.fromValues(rotation[12], rotation[13], rotation[14]);
        let result = new Array();
        result.push(tPos);
        result.push(o);
        result.push(r);
        result.push(u);
        return result;
    }
    //case 1 for rotate about up for testing
    rotateLeftUp(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        console.log("HI LU!");
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveRotate(1, 10);
        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(-1,0,0);
        let result = new Array();
        result.push(tPos);
        return result;
    }
    rotateRightUp(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        console.log("HI RU!");
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveRotate(1, 50);
        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(-1,0,0);
        let result = new Array();
        result.push(tPos);
        return result;
    }
    rotateLeftRight(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        console.log("HI LR!");
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveRotate(2, 10);
        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(-1,0,0);
        let result = new Array();
        result.push(tPos);
        return result;
    }
    rotateRightRight(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        console.log("HI RR!");
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveRotate(2, 50);
        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(-1,0,0);
        let result = new Array();
        result.push(tPos);
        return result;
    }
    save(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory[turtleHistory.length - 1];
        let newTurtle = new Turtle(vec3.fromValues(0,0,0), vec3.fromValues(0,1,0), 0);
        newTurtle.copy(t);
        turtleHistory.push(newTurtle);
        //console.log("Turtle saved: " + newTurtle.position);
        let result = new Array();
        result.push(vec3.fromValues(-1, 0, 0));
        return result;
    }
    reset(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory.pop();
        //console.log("Turtle popped: " + t.position);
        let result = new Array();
        result.push(vec3.fromValues(-1, 0, 0));
        return result;
    }
}