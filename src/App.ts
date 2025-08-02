import { Node, SkillNode, SupportNode, SkillTree } from './SkillTree.js';
import { v4 as uuidv4 } from 'uuid';
import { getNodeByName } from './NodeData.js';
import { DamageCalculator } from './DamageCalculator.js';
import { Item } from './Item.js';

export class App {
  private skillTree: SkillTree;

  constructor() {
    this.skillTree = new SkillTree();
  }

  init(): void {
    console.log("Initializing application...");
    
    this.testMakeSkillTree();
    
    console.log("\n##############################################\n");
    this.testSkillCasting();
    console.log("\n##############################################\n");
    this.testSkillCasting();
    console.log("\n##############################################\n");
  }

  testSkillCasting(): void {
    let castSkill = this.rollSkill(this.skillTree.root.id);
    console.log("Rolled skill:", castSkill.name);

    const damage = this.skillTree.damageCalculator.calculateDamage(castSkill as SkillNode);
    console.log(`Calculated damage for ${castSkill.name}:`, damage);

  }

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

  testGenerateItem(): void {
    const randomWeapon = new Item({
      name: "Emnite Relic",
      slot: "weapon"
    });

    console.log(randomWeapon);
  }

  // Receive a skill id and roll the skill in a random way. Return false if the node is a SkillNode 
  rollSkill(id: string): Node {
    const randomSkill = this.skillTree.leaves[Math.floor(Math.random() * this.skillTree.leaves.length)];
    return randomSkill;
  }

  getSkillTree(): SkillTree {
    return this.skillTree;
  }


  createNodeInstanceByName(name: string): Node | null {
    const template = getNodeByName(name);
    if (!template) return null;

    return {
      ...template,
      id: uuidv4(),  // unique ID
    };
  }
}
