import Turtle from "./Turtle";
import LSystem from "./LSystem";
import { timingSafeEqual } from "crypto";

export default class DrawingRule {
    lsystem : LSystem;
    drawRules : Map<string,Map<any,number>>;
    constructor(l : LSystem) { 
        this.lsystem = l;
        this.drawRules = new Map();
        //generate drawRules!!
        let rule : Map<any, number> = new Map();
        rule.set(this.lsystem.moveForward.bind(this), 1.0);
        let ruleX : Map<any, number> = new Map();
        let ruleR : Map<any, number> = new Map();
        ruleR.set(this.lsystem.rotateRightUp.bind(this), 0.6);
        ruleR.set(this.lsystem.rotateRightRight.bind(this), 0.4);
        let ruleL : Map<any, number> = new Map();
        ruleL.set(this.lsystem.rotateLeftUp.bind(this), 0.4);
        ruleL.set(this.lsystem.rotateLeftRight.bind(this), 0.6);

        let ruleSave : Map<any, number> = new Map();
        ruleSave.set(this.lsystem.save.bind(this), 1.0);
        let ruleReset : Map<any, number> = new Map();
        ruleReset.set(this.lsystem.reset.bind(this), 1.0);

        this.drawRules.set("F", rule);
        this.drawRules.set("X", ruleX);
        this.drawRules.set("+", ruleR);
        this.drawRules.set("-", ruleL);
        this.drawRules.set("[", ruleSave);
        this.drawRules.set("]", ruleReset);
    }

    getRule (rule : string) : Map<any, number> {
        return this.drawRules.get(rule);
    }

}

