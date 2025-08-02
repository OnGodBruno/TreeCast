import { SkillTree } from './SkillTree.js';
import { Item } from './Item.js';
import { Enemy } from './Enemy.js';
import { Character } from './Character.js';
import { Combat } from './Combat.js';
export class App {
    constructor() {
        this.skillTree = new SkillTree();
    }
    init() {
        this.testCombat();
    }
    testCombat() {
        const fireElemental = this.testMakeEnemy();
        const character = new Character("Timofee");
        const combat = new Combat({
            enemy: fireElemental,
            character: character,
        });
        combat.startCombat();
    }
    //Creates an enemy
    testMakeEnemy() {
        const fireElementalType = {
            name: "Fire Elemental",
            health: 1000,
            max_health: 1000,
            celerity: 4,
            resistances: {
                fire: 0.2,
                cold: 0.1,
                lightning: 0.15,
                physical: 0.05,
            },
            skillSet: [
                { id: "0", chance: 0.5, },
                { id: "1", chance: 0.4, },
                { id: "4", chance: 0.1, },
            ],
        };
        const fireElemental = new Enemy(fireElementalType);
        return fireElemental;
    }
    // Chooses a random skill from the skill tree and calculates its damage
    testSkillCasting() {
        let castSkill = this.rollSkill(this.skillTree.root.id);
        const damage = this.skillTree.damageCalculator.calculateDamage(castSkill);
        console.log(`Damage for ${castSkill.name}:`, damage);
    }
    // Generates a random item and shows its modifiers
    testGenerateItem() {
        const randomWeapon = new Item({
            name: "Emnite Relic",
            slot: "weapon"
        });
        console.log(randomWeapon);
    }
    // Choose a random SkillNode from the skill tree 
    rollSkill(id) {
        const randomSkill = this.skillTree.leaves[Math.floor(Math.random() * this.skillTree.leaves.length)];
        return randomSkill;
    }
    getSkillTree() {
        return this.skillTree;
    }
}
//# sourceMappingURL=App.js.map