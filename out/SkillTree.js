import { DamageCalculator } from "./PlayerDamageCalculator.js";
import { getNodeByName } from './NodeData.js';
import { v4 as uuidv4 } from 'uuid';
//TODO: need a check to see if the skill tree is valid
//TODO: the level in the tree should give a buff effect to a support (like +5% increased modifier for each level in the tree , additive).
//      Probably add this into the SupportNode Type
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
            childrenAmount: 0,
            children: [],
            description: 'Placeholder',
        };
        this.leaves = [];
    }
    randomSkill() {
        console.log('randomSkill called, leaves:', this.leaves.length, this.leaves.map(l => l.name));
        if (this.leaves.length === 0) {
            console.warn('No leaves available for skill selection!');
            return null;
        }
        const randomIndex = Math.floor(Math.random() * this.leaves.length);
        const selectedSkill = this.leaves[randomIndex];
        console.log('Selected skill:', selectedSkill === null || selectedSkill === void 0 ? void 0 : selectedSkill.name, 'with baseDamage:', selectedSkill === null || selectedSkill === void 0 ? void 0 : selectedSkill.baseDamage);
        return selectedSkill;
    }
    setRoot(node) {
        this.root = node;
    }
    // Add a child node to a parent node by id
    addChild(parentId, child) {
        if (!this.root)
            return false;
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
    getSkillTree() {
        return this;
    }
    // Creates a new node instance based on the name from NodeData
    // Append uuid to enable multiple instances of the same node
    createNodeInstanceByName(name) {
        const template = getNodeByName(name);
        if (!template)
            return null;
        return Object.assign(Object.assign({}, template), { id: uuidv4() });
    }
}
//# sourceMappingURL=SkillTree.js.map