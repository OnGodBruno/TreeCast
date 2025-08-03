import type { SkillNode, SupportNode, Node, SkillTree } from './SkillTree.js';
import { randInt } from './Random.js';

type Effect = (skill: SkillNode) => void;

// Order of calculations idea:
// 1. Roll the different base damages (fire, cold, phys)
// 2. Sum up all multipliers for each type and apply them to each type of base damage
// 3. Sum up all the base damages to get the total damage
// 4. Apply critical chance and multiplier
// 5. Round the final damage value


//TODO: when using a fire skill and you get added cold damage from somewhere -> add the cold tag (maybe always so that user can see it)
//TODO: the level in the tree should give a buff effect to a support (like +5% increased modifier for each level in the tree , additive) 
export class DamageCalculator {
    private skillTree: SkillTree;
    private damage: Record<string, number> = {};
    private totalDamage: number = 0;
    private damageMultiplier: Record<string, number> = {"fire": 0, "cold": 0, "lightning": 0, "physical": 0};
    private criticalChance: number = 0;
    private criticalMultiplier: number = 1.5;

    constructor(skillTree: SkillTree) {
        this.skillTree = skillTree;
    }

    effects: Record<string, Effect> = {
        "Fire Mastery": (skill) => { if (skill.tags.includes('fire')) this.damageMultiplier['fire'] += 0.2 },
        "Leftpaw's Favor": (skill) => {
            for (const [type, range] of Object.entries(skill.baseDamage)) {
                this.damage[type] = Math.max(this.damage[type], this.rollDamage(type, skill))
            }
        },
        "Splintered Fate": () => this.criticalChance += 0.2,
    };

    // finds and returns all support nodes that affect the skill node
    private findPathToSkillNode(root: Node, targetId: string, path: Node[] = []): Node[] | null {
        // Add current node to path
        const newPath = [...path, root];

        if (root.id === targetId) {
            return path;
        }

        if ('children' in root) {
            for (const child of root.children) {
                const result = this.findPathToSkillNode(child, targetId, newPath);
                if (result) return result;
            }
        }

        return null; // not found
    }

    // Every time you cast a skill, call this function
    // The skill is not attribute of the DamageCalculator, it is passed as an argument
    calculateDamage(skill: SkillNode, debug: boolean = false): [string, number] {
        this.skillTree = this.skillTree.getSkillTree();
        this.initRollDamage(skill);
        let orderOfCalculation = this.findPathToSkillNode(this.skillTree.root, skill.id);

        if (!orderOfCalculation) {
            console.error("No path found to the skill node, cannot calculate damage.");
            return ["Error", 0];
        }

        // Apply effects from root to leaf
        if (debug) console.log("Initial damage:", this.damage);

        for (const node of orderOfCalculation) {
            const effectFn = this.effects[node.name];
            if (effectFn) {
                effectFn(skill);
                if (debug) console.log(`Applied effect from ${node.name}`);
            }
        }

        //Initial rolled damage
        if (debug) console.log("Damage before modifiers:", this.damage);

        //Apply damage multiplier
        for (const [type, range] of Object.entries(skill.baseDamage)) {
            if (this.damageMultiplier[type]) {
                this.damage[type] *= (1 + this.damageMultiplier[type]);
                if (debug) console.log(`Applied multiplier for ${type}:`, this.damageMultiplier[type]);
            }
        }
        
        // Sum up all the base damages
        for (const type in this.damage) {
            this.totalDamage += this.damage[type];
        }
        if (debug) console.log("Total damage before critical hit:", this.totalDamage);

        // Apply critical chance
        if (Math.random() < this.criticalChance) {
            this.totalDamage *= this.criticalMultiplier;
            if (debug) console.log("Critical hit! Damage multiplied by", this.criticalMultiplier);
        }

        this.totalDamage = Math.floor(this.totalDamage);
        if (debug) console.log("Final damage:", this.totalDamage);
        
        const returnDamage = this.totalDamage;
        // Reset for next calculation
        this.damage = {};
        this.totalDamage = 0;
        this.damageMultiplier = {"fire": 0, "cold": 0, "lightning": 0, "physical": 0};
        this.criticalChance = 0;
        this.criticalMultiplier = 1.5;

        return [skill.name, returnDamage];
    }

    private initRollDamage(skill: SkillNode): void {
        for (const [type, range] of Object.entries(skill.baseDamage)) {
            this.damage[type] = this.rollDamage(type, skill);
        }  
    }

    private rollDamage(type: string, skill: SkillNode): number{
        const range = skill.baseDamage[type];
        if (!range) {
            console.error(`No damage range found for type: ${type}`);
            return 0;
        }
        const rolledDamage = randInt(range[0], range[1]);
        return rolledDamage;
    }

}