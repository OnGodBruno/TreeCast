import { EnemySkill } from './EnemySkill.js';
import { EnemyDamageCalculator } from './EnemyDamageCalculator.js';

export type EnemyType = {
    name: string;
    health: number;
    skillSet: Array<{ id: string; chance: number }>; // number = chance to cast
    resistances: Record<string, number>;
};

export class Enemy {
    private enemyType: EnemyType;
    private skills: Array<{ id: string; chance: number }>;
    private EnemyDamageCalculator: EnemyDamageCalculator;

    constructor(enemyData: EnemyType) {
        this.enemyType = enemyData;
        this.skills = enemyData.skillSet;
        this.EnemyDamageCalculator = new EnemyDamageCalculator(this);
    }

    getSkills(): Array<{ id: string; chance: number }> {
        return this.skills;
    }

    // No application yet, just printing the skill and its damage
    attack(): void {
        const [skillName, damage] = this.EnemyDamageCalculator.calculateDamage();
        console.log(`[Enemy] ${this.enemyType.name} attacks with ${skillName} for ${damage} damage.`);
    }


}








