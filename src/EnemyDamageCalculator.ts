import { Enemy, EnemyType } from './Enemy.js';
import { EnemySkills, EnemySkill } from './EnemySkill.js';
import { randInt } from './Random.js';

export class EnemyDamageCalculator {
    private enemy: Enemy;
    private damage: Record<string, number> = {};
    private totalDamage: number = 0;
    private criticalChance: number = 0.05;
    private criticalMultiplier: number = 1.5;

    constructor(Enemy: Enemy) {
        this.enemy = Enemy;
    }

    // Every time enemies cast a skill, call this function
    // The skill is not attribute of the DamageCalculator, it is passed as an argument
    calculateDamage(debug: boolean = false): [string, number] {
        const skillId = this.chooseRandomSkill(this.enemy.getSkills());
        const skill = EnemySkills.find(skill => skill.id === skillId);

        if (!skill) {
            console.error("No skill found for id:", skillId);
            return ["ERROR", 0];
        }

        this.initRollDamage(skill);

        // Apply effects from root to leaf
        if (debug) console.log("[Enemy] Initial damage:", this.damage);

        // Sum up all the base damages
        for (const type in this.damage) {
            this.totalDamage += this.damage[type];
        }
        if (debug) console.log("[Enemy] Total damage before critical hit:", this.totalDamage);

        // Apply critical chance
        if (Math.random() < this.criticalChance) {
            this.totalDamage *= this.criticalMultiplier;
            if (debug) console.log("[Enemy] Critical hit! Damage multiplied by", this.criticalMultiplier);
        }

        this.totalDamage = Math.floor(this.totalDamage);
        if (debug) console.log("[Enemy] Final damage:", this.totalDamage);

        const returnDamage = this.totalDamage;
        // Reset for next calculation
        this.damage = {};
        this.totalDamage = 0;
        this.criticalChance = 0.05;
        this.criticalMultiplier = 1.5;

        return [skill.name, returnDamage];
    }

    chooseRandomSkill(skillSet: Array<{ id: string; chance: number }>): string {
        // Sum up all chances
        const totalChance = skillSet.reduce((sum, skill) => sum + skill.chance, 0);
        const roll = Math.random() * totalChance;

        let cumulative = 0;
        // Find the first skill that exceeds the roll
        for (const skill of skillSet) {
            cumulative += skill.chance;
            if (roll < cumulative) {
                return skill.id;
            }
        }

        // Fallback
        throw new Error("Failed to roll a skill due to empty or invalid skill set.");
    }

    private initRollDamage(skill: EnemySkill): void {
        for (const [type, range] of Object.entries(skill.baseDamage)) {
            this.damage[type] = this.rollDamage(type, skill);
        }
    }

    private rollDamage(type: string, skill: EnemySkill): number {
        const range = skill.baseDamage[type];
        if (!range) {
            console.error(`No damage range found for type: ${type}`);
            return 0;
        }
        const rolledDamage = randInt(range[0], range[1]);
        return rolledDamage;
    }

}