import { Enemy, EnemyType } from "./Enemy.js";
import { Character, CharacterType } from "./Character.js";

export type CombatType = {
    enemy: Enemy
    character: Character
}

export class Combat {
    private enemy: Enemy;
    private character: Character;


    constructor(combat: CombatType) {
        this.enemy = combat.enemy;
        this.character = combat.character;
    }


    startCombat(): void {
        console.log(`[Combat] Starting combat between ${this.character.getName()} and ${this.enemy.getName()}.`);

        let isPlayerTurn = this.character.getCelerity() >= this.enemy.getCelerity();

        while (this.character.isAlive() && this.enemy.isAlive()) {
            if (isPlayerTurn) {
                const [skillName, damage] = this.character.attack(); // Assume returns [string, number]
                console.log(`${this.character.getName()} uses ${skillName}, dealing ${damage} damage.`);
                this.enemy.takeDamage(damage);
            } else {
                const [skillName, damage] = this.enemy.attack();
                console.log(`[Enemy] ${this.enemy.getName()} uses ${skillName}, dealing ${damage} damage.`);
                this.character.takeDamage(damage);
            }

            // Print health after each turn
            console.log(`-- ${this.character.getName()} HP: ${this.character.getHealth()} | ${this.enemy.getName()} HP: ${this.enemy.getHealth()}`);

            isPlayerTurn = !isPlayerTurn; // Alternate turns
        }

        // Combat ends
        if (!this.character.isAlive()) {
            console.log(`${this.character.getName()} has been defeated.`);
        } else {
            console.log(`${this.enemy.getName()} has been defeated!`);
        }
    }


}
