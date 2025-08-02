"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DamageCalculator = void 0;
// Order of calculations idea:
// 1. Roll the base damage 
// 2. Sum up all multipliers and apply them to the base damage
// 3. Apply critical chance and multiplier
// 4. Round the final damage value
var DamageCalculator = /** @class */ (function () {
    function DamageCalculator(skillTree, skill) {
        var _this = this;
        this.damage = 0;
        this.damageMultiplier = 1;
        this.criticalChance = 0;
        this.criticalMultiplier = 1.5;
        this.effects = {
            "Fire Mastery": function () { if (_this.skill.tags.includes('fire'))
                _this.damageMultiplier += 0.2; },
            "Leftpaw's Favor": function () { return _this.damage = Math.max(_this.damage, _this.rollDamage()); },
            "Splintered Fate": function () { return _this.criticalChance += 0.1; },
        };
        this.skillTree = skillTree;
        this.skill = skill;
        this.damage = this.rollDamage();
        this.calculateDamage();
    }
    // finds and returns all support nodes that affect the skill node
    DamageCalculator.prototype.findPathToSkillNode = function (root, targetId, path) {
        if (path === void 0) { path = []; }
        // Add current node to path
        var newPath = __spreadArray(__spreadArray([], path, true), [root], false);
        if (root.id === targetId) {
            return path;
        }
        if ('children' in root) {
            for (var _i = 0, _a = root.children; _i < _a.length; _i++) {
                var child = _a[_i];
                var result = this.findPathToSkillNode(child, targetId, newPath);
                if (result)
                    return result;
            }
        }
        return null; // not found
    };
    DamageCalculator.prototype.calculateDamage = function () {
        var orderOfCalculation = this.findPathToSkillNode(this.skillTree.root, this.skill.id);
        if (!orderOfCalculation) {
            console.error("No path found to the skill node, cannot calculate damage.");
            return;
        }
        // Apply effects from root to leaf
        console.log("Initial damage:", this.damage);
        for (var _i = 0, orderOfCalculation_1 = orderOfCalculation; _i < orderOfCalculation_1.length; _i++) {
            var node = orderOfCalculation_1[_i];
            var effectFn = this.effects[node.name];
            if (effectFn) {
                effectFn();
                console.log("Applied effect from ".concat(node.name));
            }
        }
        //Initial rolled damage
        console.log("Damage before modifiers:", this.damage);
        //Apply damage multiplier
        this.damage *= this.damageMultiplier;
        console.log("Damage after multipliers:", this.damage);
        // Apply critical chance
        if (Math.random() < this.criticalChance) {
            this.damage *= this.criticalMultiplier;
            console.log("Critical hit! Damage multiplied by", this.criticalMultiplier);
        }
        this.damage = Math.round(this.damage);
        console.log("Final damage:", this.damage);
    };
    DamageCalculator.prototype.rollDamage = function () {
        var damage = this.randInt(this.skill.baseDamage[0], this.skill.baseDamage[1]);
        return damage;
    };
    DamageCalculator.prototype.randInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return DamageCalculator;
}());
exports.DamageCalculator = DamageCalculator;
//# sourceMappingURL=DamageCalculator.js.map