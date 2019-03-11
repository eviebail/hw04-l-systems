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
    numExpansions : number;

    constructor(ax : number, numIter : number) {
        this.current = 0;
        this.expansion = new ExpansionRule();
        if (ax == 0) {
            this.axiom = "FXX";
        } else if (ax  == 1) {
            this.axiom = "XFX";
        } else {
            this.axiom = "[-FX]FX";
        }
        this.numExpansions = numIter;
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
        let numExpansions = this.numExpansions;
        let currString = "";
        this.grammar = this.axiom;
        for (let i = 0; i < numExpansions; ++i) {
            for (let j = 0; j < this.grammar.length; ++j) {
                let xi = Math.random();
                currString += this.map(this.grammar.charAt(j), xi); //this.expansion.getExpansion(this.grammar.charAt(j));
            }
            this.grammar = currString;
            
            currString = "";
        }
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
        let scale : vec3[] = new Array();
        let depth : vec3[] = new Array();
        for (let i = 0; i < this.grammar.length; ++i) {
            let xi = Math.random();
            //get the function ptr
            let func = this.mapDraw(this.grammar.charAt(i), xi);
            if (func) {
                //call the function and save the new turtle pos to be saved
                let p = func(this.current, this.turtleHistory, this.drawPositions)
                if (p[0][0] != -1) {
                    //pos forward right up
                    pos.push(p[0]);
                    fo.push(p[1]);
                    ri.push(p[2]);
                    up.push(p[3]);
                    //only scale the branches and not the leaves
                    if (p[5] > 2) {
                        scale.push(vec3.fromValues(2,2,1));
                    } else {
                        scale.push(p[4]);
                    }
                    depth.push(p[5]);
                }
            }
        }
        let container : vec3[][] = new Array();
        container.push(pos);
        container.push(fo);
        container.push(ri);
        container.push(up);
        container.push(scale);
        container.push(depth);
        return container;
    }

    runSystem() : vec3[][] {
        this.expand();
        let pos = this.draw();
        return pos;
    }

    moveForward(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveForward(0.7);
        
        let sc = vec3.fromValues(t.scale[0], t.scale[1], t.scale[2]);
        vec3.multiply(sc, t.scale, [0.8, 0.8, 0.8]);
        t.rescale(sc);

        if (t.scale[0] < 0.3) {
            let s = vec3.fromValues(t.scale[0], t.scale[1], t.scale[2]);
            vec3.multiply(s, t.scale, [2.0, 2.0, 2.0]);
            t.rescale(s);
        }

        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(t.position[0], t.position[1], t.position[2]);
        let tScale = vec3.fromValues(t.scale[0], t.scale[1], t.scale[2]);
        let rotation : mat4 = mat4.fromValues(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
        let angle = vec3.dot(t.orientation, vec3.fromValues(0,1,0));
        let axis = vec3.fromValues(0,0,0);
        vec3.cross(axis, t.orientation, vec3.fromValues(0,1,0));
        mat4.rotate(rotation, rotation, angle, axis);
        let o = vec3.fromValues(rotation[0], rotation[1], rotation[2]);
        let r = vec3.fromValues(rotation[4], rotation[5], rotation[6]);
        let u = vec3.fromValues(rotation[8], rotation[9], rotation[10]);
        //save depth so main knows whether to draw a branch or a leaf
        let depth = vec3.fromValues(t.depth, 0, 0);
        let result = new Array();
        result.push(tPos);
        result.push(o);
        result.push(r);
        result.push(u);
        result.push(tScale);
        result.push(depth);
        return result;
    }

    //case 1 for rotate about up for testing
    rotateLeftUp(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveRotate(1, -45);
        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(-1,0,0);
        let result = new Array();
        result.push(tPos);
        return result;
    }
    rotateRightUp(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveRotate(1, 45);
        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(-1,0,0);
        let result = new Array();
        result.push(tPos);
        return result;
    }
    rotateLeftRight(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveRotate(2, -45);
        turtleHistory[turtleHistory.length - 1] = t;
        let tPos = vec3.fromValues(-1,0,0);
        let result = new Array();
        result.push(tPos);
        return result;
    }
    rotateRightRight(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory[turtleHistory.length - 1];
        t.moveRotate(2, 45);
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
        newTurtle.increaseDepth();
        turtleHistory.push(newTurtle);
        let result = new Array();
        result.push(vec3.fromValues(-1, 0, 0));
        return result;
    }
    reset(curr : number, turtleHistory : Turtle[], drawPositions : Turtle[]) : vec3[] {
        let t = turtleHistory.pop();
        let result = new Array();
        result.push(vec3.fromValues(-1, 0, 0));
        return result;
    }
}