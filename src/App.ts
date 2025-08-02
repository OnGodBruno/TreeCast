import { Node, SkillNode, SupportNode, SkillTree } from './SkillTree.js';
import { v4 as uuidv4 } from 'uuid';
import { getNodeByName } from './NodeData.js';
import { DamageCalculator } from './PlayerDamageCalculator.js';
import { Item } from './Item.js';
import { EnemyType, Enemy } from './Enemy.js';

export class App {
  private skillTree: SkillTree;

  constructor() {
    this.skillTree = new SkillTree();
  }

  init(): void {
    this.testMakeEnemy();
  }

  //Creates an enemy and tests its attack
  testMakeEnemy(): void {
    const fireElementalType: EnemyType = {
      name: "Fire Elemental",
      health: 1000,
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
    fireElemental.attack();

  }

  // Chooses a random skill from the skill tree and calculates its damage
  testSkillCasting(): void {
    let castSkill = this.rollSkill(this.skillTree.root.id);
    const damage = this.skillTree.damageCalculator.calculateDamage(castSkill as SkillNode);
    console.log(`Damage for ${castSkill.name}:`, damage);
  }

  // Creates a skill tree 
  testMakeSkillTree(): void {
    const support_LeftpawsFavor: Node = this.createNodeInstanceByName("Leftpaw's Favor")!;
    const support_SplinteredFate: Node = this.createNodeInstanceByName("Splintered Fate")!;
    const support_FireMastery: Node = this.createNodeInstanceByName("Fire Mastery")!;
    const skill_Fireball: Node = this.createNodeInstanceByName("Fireball")!;
    const skill_LavaBurst: Node = this.createNodeInstanceByName("Lava Burst")!;

    this.skillTree.setRoot(support_LeftpawsFavor);
    this.skillTree.addChild(support_LeftpawsFavor.id, support_FireMastery);
    this.skillTree.addChild(support_FireMastery.id, support_SplinteredFate);
    this.skillTree.addChild(support_SplinteredFate.id, skill_LavaBurst);
    this.skillTree.addChild(support_SplinteredFate.id, skill_Fireball);
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

  // Creates a new node instance based on the name from NodeData
  // Append uuid to enable multiple instances of the same node
  createNodeInstanceByName(name: string): Node | null {
    const template = getNodeByName(name);
    if (!template) return null;

    return {
      ...template,
      id: uuidv4(),  // unique ID
    };
  }
}
