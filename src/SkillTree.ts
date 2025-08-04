import { DamageCalculator } from "./PlayerDamageCalculator.js";
import { getNodeByName } from './NodeData.js';
import { v4 as uuidv4 } from 'uuid';

export type BaseNode = {
  id: string;
  name: string;
  tags: string[];
  type: "skill" | "support";
  description: string;
}

export type SkillNode = BaseNode & {
  baseDamage: Record<string, [number, number]>;
};

export type SupportNode = BaseNode & {
  childrenAmount: number;
  children: Array<SkillNode | SupportNode>;
};

export type Node = SkillNode | SupportNode;

//TODO: need a check to see if the skill tree is valid
//TODO: the level in the tree should give a buff effect to a support (like +5% increased modifier for each level in the tree , additive).
//      Probably add this into the SupportNode Type

export class SkillTree {
  root: Node
  leaves: Node[] = [];
  damageCalculator: DamageCalculator;

  constructor() {
    this.damageCalculator = new DamageCalculator(this);
    // Placeholder root node
    this.root = {
      id: "-1",
      name: 'ROOT',
      tags: [],
      type: 'support',
      childrenAmount: 0,
      children: [],
      description: 'Placeholder',
    };
    this.leaves = [];
  }

  randomSkill(): SkillNode | null {
    console.log('randomSkill called, leaves:', this.leaves.length, this.leaves.map(l => l.name));
    if (this.leaves.length === 0) {
      console.warn('No leaves available for skill selection!');
      return null;
    }
    const randomIndex = Math.floor(Math.random() * this.leaves.length);
    const selectedSkill = this.leaves[randomIndex] as SkillNode;
    console.log('Selected skill:', selectedSkill?.name, 'with baseDamage:', selectedSkill?.baseDamage);
    return selectedSkill;
  }

  setRoot(node: SkillNode | SupportNode): void {
    this.root = node;
  }

  // Add a child node to a parent node by id
  addChild(parentId: string, child: SkillNode | SupportNode): boolean {
    if (!this.root) return false;
    const parent = this.findNodeById(parentId, this.root);
    if (parent && 'children' in parent && parent.children.length < parent.childrenAmount) {
      parent.children.push(child);
      if (child.type === 'skill') {
        this.leaves.push(child);
      }
      return true;
    }
    return false;
  }

  // Find a node by id (DFS)
  findNodeById(id: string, node: SkillNode | SupportNode = this.root!): SkillNode | SupportNode | null {
    if (node.id === id) return node;
    if ('children' in node) {
      for (const child of node.children) {
        const found = this.findNodeById(id, child);
        if (found) return found;
      }
    }
    return null;
  }

  getSkillTree(): SkillTree {
    return this;
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

