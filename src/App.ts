import { Node, SkillNode, SupportNode, SkillTree } from './SkillTree.js';
import { v4 as uuidv4 } from 'uuid';
import { DamageCalculator } from './PlayerDamageCalculator.js';
import { Item } from './Item.js';
import { EnemyType, Enemy } from './Enemy.js';
import { Character } from './Character.js';
import { Combat } from './Combat.js';

export class App {
  private skillTree: SkillTree;

  constructor() {
    this.skillTree = new SkillTree();
  }

  init(): void {
    this.testCombat();
  }

  testCombat(): void {
    const fireElemental = this.testMakeEnemy();
    const character = new Character("Timofee");

    const combat = new Combat({
      enemy: fireElemental,
      character: character,
    });

    combat.startCombat();
  }


  //Creates an enemy
  testMakeEnemy(): Enemy {
    const fireElementalType: EnemyType = {
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
  testSkillCasting(): void {
    let castSkill = this.rollSkill(this.skillTree.root.id);
    const damage = this.skillTree.damageCalculator.calculateDamage(castSkill as SkillNode);
    console.log(`Damage for ${castSkill.name}:`, damage);
  }

  // Generates a random item and shows its modifiers
  testGenerateItem(): void {
    const randomWeapon = new Item({
      name: "Emnite Relic",
      slot: "weapon"
    });

    console.log(randomWeapon);
  }

  // Choose a random SkillNode from the skill tree 
  rollSkill(id: string): Node {
    const randomSkill = this.skillTree.leaves[Math.floor(Math.random() * this.skillTree.leaves.length)];
    return randomSkill;
  }

  getSkillTree(): SkillTree {
    return this.skillTree;
  }

}
