import { SkillNode, SupportNode, SkillTree } from './SkillTree';
import { v4 as uuidv4 } from 'uuid';
import { getSkillByName, getSupportByName } from './NodeData';

export class App {
  private skillTree: SkillTree;

  constructor() {
    this.skillTree = new SkillTree();
  }

  init(): void {
    console.log("Initializing application...");

    const skill_Fireball: SkillNode = this.createSkillInstanceByName("Fireball")!;

    const skill_LavaBurst: SkillNode = this.createSkillInstanceByName("Lava Burst")!;

    const support_FireMastery: SupportNode = this.createSupportInstanceByName("Fire Mastery")!;

    const support_LuckyFang: SupportNode = this.createSupportInstanceByName("Lucky Fang")!;

    this.skillTree.setRoot(support_FireMastery);
    this.skillTree.addChild(support_FireMastery.id, skill_Fireball);
    this.skillTree.addChild(support_FireMastery.id, support_LuckyFang);
    this.skillTree.addChild(support_LuckyFang.id, skill_LavaBurst);

    let castSkill = this.roll(this.skillTree.root!.id);
    console.log("Rolled skill:", castSkill.name);
  }

  // Receive a skill id and roll the skill in a random way. Return false if the node is a SkillNode 
  roll(id: string): SkillNode {
    let currentNode = this.skillTree.findNodeById(id);
    if (currentNode && 'children' in currentNode) {
      let nextStep = this.randInt(0, currentNode.children.length - 1)
      return this.roll(currentNode.children[nextStep].id);

    } else if (currentNode && 'id' in currentNode) {
      return currentNode;

    } else {
      throw new Error("Node not found or is not a SkillNode");
    }
  }

  getSkillTree(): SkillTree {
    return this.skillTree;
  }

  randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createSkillInstanceByName(name: string): SkillNode | null {
    const template = getSkillByName(name);
    if (!template) return null;

    return {
      ...template,
      id: uuidv4(),  // unique ID
    };
  }

  createSupportInstanceByName(name: string): SupportNode | null {
    const template = getSupportByName(name);
    if (!template) return null;

    return {
      ...template,
      id: uuidv4(),  // unique ID
    };
  }
}
