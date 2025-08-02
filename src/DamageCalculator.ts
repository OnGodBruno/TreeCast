import type { SkillNode, SupportNode, Node, SkillTree } from './SkillTree';

type Effect = () => void;

// Order of calculations idea:
// 1. Roll the base damage 
// 2. Sum up all multipliers and apply them to the base damage
// 3. Apply critical chance and multiplier
// 4. Round the final damage value


export class DamageCalculator {
    private skillTree: SkillTree;
    private skill: SkillNode;
    private damage: number = 0;
    private damageMultiplier: number = 1;
    private criticalChance: number = 0;
    private criticalMultiplier: number = 1.5;

    constructor(skillTree: SkillTree, skill: SkillNode) {
        this.skillTree = skillTree;
        this.skill = skill;
        this.damage = this.rollDamage();
        this.calculateDamage();
    }

    effects: Record<string, Effect> = {
        "Fire Mastery": () => {if(this.skill.tags.includes('fire')) this.damageMultiplier += 0.2},
        "Leftpaw's Favor": () => this.damage = Math.max(this.damage, this.rollDamage()),
        "Splintered Fate": () => this.criticalChance += 0.1,
    };

    // finds and returns all support nodes that affect the skill node
    findPathToSkillNode(root: Node, targetId: string, path: Node[] = []): Node[] | null {
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

    calculateDamage(): void {
        let orderOfCalculation = this.findPathToSkillNode(this.skillTree.root, this.skill.id);

        if (!orderOfCalculation) {
            console.error("No path found to the skill node, cannot calculate damage.");
            return;
        }

        // Apply effects from root to leaf
        console.log("Initial damage:", this.damage);
        for (const node of orderOfCalculation) {
            const effectFn = this.effects[node.name];
            if (effectFn) {
                effectFn();
                console.log(`Applied effect from ${node.name}`);
            }
        }
        
        //Initial rolled damage
        console.log("Damage before modifiers:", this.damage);

        //Apply damage multiplier
        this.damage *= this.damageMultiplier;
        console.log("Damage after multipliers:", this.damage);

        // Apply critical chance
        if (Math.random() < this.criticalChance) {
            this.damage *= this.criticalMultiplier;
            console.log("Critical hit! Damage multiplied by", this.criticalMultiplier);
        }

        this.damage = Math.round(this.damage);
        console.log("Final damage:", this.damage);
    }

    rollDamage(): number {
        let damage = this.randInt(this.skill.baseDamage[0], this.skill.baseDamage[1]);
        return damage;
    }

    randInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}