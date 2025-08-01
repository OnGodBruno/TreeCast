"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var SkillTree_1 = require("./SkillTree");
var uuid_1 = require("uuid");
var NodeData_1 = require("./NodeData");
var App = /** @class */ (function () {
    function App() {
        this.skillTree = new SkillTree_1.SkillTree();
    }
    App.prototype.init = function () {
        console.log("Initializing application...");
        var skill_Fireball = this.createSkillInstanceByName("Fireball");
        var skill_LavaBurst = this.createSkillInstanceByName("Lava Burst");
        var support_FireMastery = this.createSupportInstanceByName("Fire Mastery");
        var support_LuckyFang = this.createSupportInstanceByName("Lucky Fang");
        this.skillTree.setRoot(support_FireMastery);
        this.skillTree.addChild(support_FireMastery.id, skill_Fireball);
        this.skillTree.addChild(support_FireMastery.id, support_LuckyFang);
        this.skillTree.addChild(support_LuckyFang.id, skill_LavaBurst);
        var castSkill = this.roll(this.skillTree.root.id);
        console.log("Rolled skill:", castSkill.name);
    };
    // Receive a skill id and roll the skill in a random way. Return false if the node is a SkillNode 
    App.prototype.roll = function (id) {
        var currentNode = this.skillTree.findNodeById(id);
        if (currentNode && 'children' in currentNode) {
            var nextStep = this.randInt(0, currentNode.children.length - 1);
            return this.roll(currentNode.children[nextStep].id);
        }
        else if (currentNode && 'id' in currentNode) {
            return currentNode;
        }
        else {
            throw new Error("Node not found or is not a SkillNode");
        }
    };
    App.prototype.getSkillTree = function () {
        return this.skillTree;
    };
    App.prototype.randInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    App.prototype.createSkillInstanceByName = function (name) {
        var template = (0, NodeData_1.getSkillByName)(name);
        if (!template)
            return null;
        return __assign(__assign({}, template), { id: (0, uuid_1.v4)() });
    };
    App.prototype.createSupportInstanceByName = function (name) {
        var template = (0, NodeData_1.getSupportByName)(name);
        if (!template)
            return null;
        return __assign(__assign({}, template), { id: (0, uuid_1.v4)() });
    };
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map