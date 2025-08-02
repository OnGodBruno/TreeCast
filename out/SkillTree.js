"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillTree = void 0;
var SkillTree = /** @class */ (function () {
    function SkillTree() {
        this.leaves = [];
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
    SkillTree.prototype.setRoot = function (node) {
        this.root = node;
    };
    // Add a child node to a parent node by id
    SkillTree.prototype.addChild = function (parentId, child) {
        if (!this.root)
            return false;
        var parent = this.findNodeById(parentId, this.root);
        if (parent && 'children' in parent && parent.children.length < parent.children_amount) {
            parent.children.push(child);
            if (child.type === 'skill') {
                this.leaves.push(child);
            }
            return true;
        }
        return false;
    };
    // Find a node by id (DFS)
    SkillTree.prototype.findNodeById = function (id, node) {
        if (node === void 0) { node = this.root; }
        if (node.id === id)
            return node;
        if ('children' in node) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var found = this.findNodeById(id, child);
                if (found)
                    return found;
            }
        }
        return null;
    };
    // Traverse the tree and apply a callback to each node
    SkillTree.prototype.traverse = function (callback, node) {
        if (node === void 0) { node = this.root; }
        if (!node)
            return;
        callback(node);
        if ('children' in node) {
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.traverse(callback, child);
            }
        }
    };
    return SkillTree;
}());
exports.SkillTree = SkillTree;
//# sourceMappingURL=SkillTree.js.map