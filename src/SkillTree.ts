// src/SkillTree.ts

export type SkillNode = {
  id: string;
  name: string;
  tags: string[];
  baseDamage: [number, number];
  description?: string;
};

export type SupportNode = {
  id: string;
  name: string;
  tags: string[];
  children_amount: number;
  children: Array<SkillNode | SupportNode>;
  description?: string;
};

export class SkillTree {
  root: SkillNode | SupportNode | null;

  constructor() {
    // Placeholder root node
    this.root = {
      id: "-1",
      name: 'Root',
      tags: [],
      children_amount: 0,
      children: [],
      description: 'Root of the skill tree',
    };
  }

  setRoot(node: SkillNode | SupportNode): void {
    this.root = node;
  }

  // Add a child node to a parent node by id
  addChild(parentId: string, child: SkillNode | SupportNode): boolean {
    if (!this.root) return false;
    const parent = this.findNodeById(parentId, this.root);
    if (parent && 'children' in parent && parent.children.length < parent.children_amount) {
      parent.children.push(child);
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

  // Traverse the tree and apply a callback to each node
  traverse(callback: (node: SkillNode | SupportNode) => void, node: SkillNode | SupportNode | null = this.root): void {
    if (!node) return;
    callback(node);
    if ('children' in node) {
      for (const child of node.children) {
        this.traverse(callback, child);
      }
    }
  }
}

