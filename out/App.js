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
var DamageCalculator_1 = require("./DamageCalculator");
var App = /** @class */ (function () {
    function App() {
        this.skillTree = new SkillTree_1.SkillTree();
    }
    App.prototype.init = function () {
        console.log("Initializing application...");
        var support_LeftpawsFavor = this.createNodeInstanceByName("Leftpaw's Favor");
        var support_SplinteredFate = this.createNodeInstanceByName("Splintered Fate");
        var support_FireMastery = this.createNodeInstanceByName("Fire Mastery");
        var skill_Fireball = this.createNodeInstanceByName("Fireball");
        var skill_LavaBurst = this.createNodeInstanceByName("Lava Burst");
        this.skillTree.setRoot(support_LeftpawsFavor);
        this.skillTree.addChild(support_LeftpawsFavor.id, support_FireMastery);
        this.skillTree.addChild(support_FireMastery.id, support_SplinteredFate);
        this.skillTree.addChild(support_SplinteredFate.id, skill_LavaBurst);
        this.skillTree.addChild(support_SplinteredFate.id, skill_Fireball);
        var castSkill = this.rollSkill(this.skillTree.root.id);
        console.log("Rolled skill:", castSkill.name);
        var damageCalculator = new DamageCalculator_1.DamageCalculator(this.skillTree, castSkill);
    };
    // Receive a skill id and roll the skill in a random way. Return false if the node is a SkillNode 
    App.prototype.rollSkill = function (id) {
        var randomSkill = this.skillTree.leaves[Math.floor(Math.random() * this.skillTree.leaves.length)];
        return randomSkill;
    };
    App.prototype.getSkillTree = function () {
        return this.skillTree;
    };
    App.prototype.createNodeInstanceByName = function (name) {
        var template = (0, NodeData_1.getNodeByName)(name);
        if (!template)
            return null;
        return __assign(__assign({}, template), { id: (0, uuid_1.v4)() });
    };
    return App;
}());
exports.App = App;
//# sourceMappingURL=App.js.map