import { DamageCalculator } from "./PlayerDamageCalculator.js";
export class SkillTree {
    constructor() {
        this.leaves = [];
        this.damageCalculator = new DamageCalculator(this);
        // Placeholder root node
        this.root = {
            id: "-1",
            name: 'ROOT',
            tags: [],
            type: 'support',
            children_amount: 0,
            children: [],
            description: 'Placeholder',
        };
        this.leaves = [];
    }
    setRoot(node) {
        this.root = node;
    }
    // Add a child node to a parent node by id
    addChild(parentId, child) {
        if (!this.root)
            return false;
        const parent = this.findNodeById(parentId, this.root);
        if (parent && 'children' in parent && parent.children.length < parent.children_amount) {
            parent.children.push(child);
            if (child.type === 'skill') {
                this.leaves.push(child);
            }
            return true;
        }
        return false;
    }
    // Find a node by id (DFS)
    findNodeById(id, node = this.root) {
        if (node.id === id)
            return node;
        if ('children' in node) {
            for (const child of node.children) {
                const found = this.findNodeById(id, child);
                if (found)
                    return found;
            }
        }
        return null;
    }
    // Traverse the tree and apply a callback to each node
    traverse(callback, node = this.root) {
        if (!node)
            return;
        callback(node);
        if ('children' in node) {
            for (const child of node.children) {
                this.traverse(callback, child);
            }
        }
    }
    getSkillTree() {
        return this;
    }
}
//# sourceMappingURL=SkillTree.js.map