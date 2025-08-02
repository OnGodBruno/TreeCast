import { EnemySkill } from './EnemySkill.js';
import { EnemyDamageCalculator } from './EnemyDamageCalculator.js';

export type EnemyType = {
    name: string;
    health: number;
    max_health: number;
    celerity: number;
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
    attack(): [string, number] {
        const [skillName, damage] = this.EnemyDamageCalculator.calculateDamage();
        return [skillName, damage];
    }

    getName(): string {
        return this.enemyType.name;
    }

    isAlive(): boolean {
        return this.enemyType.health > 0;
    }

    getCelerity(): number {
        return this.enemyType.celerity;
    }

    heal(amount: number): void {
        this.enemyType.health = Math.min(this.enemyType.health + amount, this.enemyType.health);
    }

    takeDamage(amount: number): void {
        this.enemyType.health = Math.max(this.enemyType.health - amount, 0);
        console.log(`[Enemy] ${this.enemyType.name} takes ${amount} damage. Remaining health: ${this.enemyType.health}`);
    }

    getHealth(): number {
        return this.enemyType.health;
    }


}








