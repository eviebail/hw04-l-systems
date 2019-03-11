
//expansionRules.set('A', 'AB');
//expansionRules.set('B', 'A');

export default class ExpansionRule {
    expansionRules : Map<string, Map<string, number>>;
    constructor() {
        this.expansionRules = new Map();
        let rule : Map<string, number> = new Map();
        rule.set("FF", 1.0);
        rule.set("XF", 0.0);
        let ruleX : Map<string, number> = new Map();
        ruleX.set("[-FX][+FX]FX", 0.6);
        ruleX.set("[+F][-FX][+F][+FX]FX", 0.4);
        let ruleP : Map<string, number> = new Map();
        ruleP.set("+", 1.0);
        let ruleM : Map<string, number> = new Map();
        ruleM.set("-", 1.0);
        let ruleS : Map<string, number> = new Map();
        ruleS.set("[", 1.0);
        let ruleR : Map<string, number> = new Map();
        ruleR.set("]", 1.0);

        this.expansionRules.set("F", rule);
        this.expansionRules.set("X", ruleX);
        this.expansionRules.set("+", ruleP);
        this.expansionRules.set("-", ruleM);
        this.expansionRules.set("[", ruleS);
        this.expansionRules.set("]", ruleR);
    }

    getRule(rule : string) : Map<string, number> {
        return this.expansionRules.get(rule);
    }
}


