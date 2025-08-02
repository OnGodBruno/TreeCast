import { randInt } from './Random.js';
// Order of calculations idea:
// 1. Roll the different base damages (fire, cold, phys)
// 2. Sum up all multipliers for each type and apply them to each type of base damage
// 3. Sum up all the base damages to get the total damage
// 4. Apply critical chance and multiplier
// 5. Round the final damage value
export class DamageCalculator {
    constructor(skillTree) {
        this.damage = {};
        this.totalDamage = 0;
        this.damageMultiplier = { "fire": 0, "cold": 0, "lightning": 0, "physical": 0 };
        this.criticalChance = 0;
        this.criticalMultiplier = 1.5;
        this.effects = {
            "Fire Mastery": (skill) => { if (skill.tags.includes('fire'))
                this.damageMultiplier['fire'] += 0.2; },
            "Leftpaw's Favor": (skill) => {
                for (const [type, range] of Object.entries(skill.baseDamage)) {
                    this.damage[type] = Math.max(this.damage[type], this.rollDamage(type, skill));
                }
            },
            "Splintered Fate": () => this.criticalChance += 0.2,
        };
        this.skillTree = skillTree;
    }
    // finds and returns all support nodes that affect the skill node
    findPathToSkillNode(root, targetId, path = []) {
        // Add current node to path
        const newPath = [...path, root];
        if (root.id === targetId) {
            return path;
        }
        if ('children' in root) {
            for (const child of root.children) {
                const result = this.findPathToSkillNode(child, targetId, newPath);
                if (result)
                    return result;
            }
        }
        return null; // not found
    }
    // Every time you cast a skill, call this function
    // The skill is not attribute of the DamageCalculator, it is passed as an argument
    calculateDamage(skill) {
        this.skillTree = this.skillTree.getSkillTree();
        this.initRollDamage(skill);
        let orderOfCalculation = this.findPathToSkillNode(this.skillTree.root, skill.id);
        if (!orderOfCalculation) {
            console.error("No path found to the skill node, cannot calculate damage.");
            return 0;
        }
        // Apply effects from root to leaf
        console.log("Initial damage:", this.damage);
        for (const node of orderOfCalculation) {
            const effectFn = this.effects[node.name];
            if (effectFn) {
                effectFn(skill);
                console.log(`Applied effect from ${node.name}`);
            }
        }
        //Initial rolled damage
        console.log("Damage before modifiers:", this.damage);
        //Apply damage multiplier
        for (const [type, range] of Object.entries(skill.baseDamage)) {
            if (this.damageMultiplier[type]) {
                this.damage[type] *= (1 + this.damageMultiplier[type]);
                console.log(`Applied multiplier for ${type}:`, this.damageMultiplier[type]);
            }
        }
        // Sum up all the base damages
        for (const type in this.damage) {
            this.totalDamage += this.damage[type];
        }
        console.log("Total damage before critical hit:", this.totalDamage);
        // Apply critical chance
        if (Math.random() < this.criticalChance) {
            this.totalDamage *= this.criticalMultiplier;
            console.log("Critical hit! Damage multiplied by", this.criticalMultiplier);
        }
        this.totalDamage = Math.floor(this.totalDamage);
        console.log("Final damage:", this.totalDamage);
        const returnDamage = this.totalDamage;
        // Reset for next calculation
        this.damage = {};
        this.totalDamage = 0;
        this.damageMultiplier = { "fire": 0, "cold": 0, "lightning": 0, "physical": 0 };
        this.criticalChance = 0;
        this.criticalMultiplier = 1.5;
        return returnDamage;
    }
    initRollDamage(skill) {
        for (const [type, range] of Object.entries(skill.baseDamage)) {
            this.damage[type] = this.rollDamage(type, skill);
        }
    }
    rollDamage(type, skill) {
        const range = skill.baseDamage[type];
        if (!range) {
            console.error(`No damage range found for type: ${type}`);
            return 0;
        }
        const rolledDamage = randInt(range[0], range[1]);
        return rolledDamage;
    }
}
//# sourceMappingURL=DamageCalculator.js.map