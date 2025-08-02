"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeData = void 0;
exports.getNodeByName = getNodeByName;
exports.nodeData = [
    {
        id: "0",
        name: "Fireball",
        tags: ["skill", "fire", "elemental", "spell", "projectile"],
        type: "skill",
        description: "A powerful fire-based attack that launches a ball of flame at the enemy",
        baseDamage: [80, 120],
    },
    {
        id: "1",
        name: "Lava Burst",
        tags: ["skill", "fire", "elemental", "spell", "area"],
        type: "skill",
        description: "A devastating area-of-effect fire attack that erupts from the ground, dealing damage to all enemies in the vicinity",
        baseDamage: [60, 80],
    },
    {
        id: "2",
        name: "Fire Mastery",
        tags: ["support", "fire"],
        type: "support",
        children_amount: 1,
        children: [],
        description: "Increases the damage of fire-based skills by 20%",
    },
    {
        id: "3",
        name: "Splintered Fate",
        tags: ["support", "critical"],
        type: "support",
        children_amount: 2,
        children: [],
        description: "+10% to critical strike chance",
    },
    {
        id: "3",
        name: "Leftpaw's Favor",
        tags: ["support"],
        type: "support",
        children_amount: 1,
        children: [],
        description: "Your damage is Lucky (rolls twice and takes the better outcome)",
    },
];
function getNodeByName(name) {
    var lowerName = name.toLowerCase();
    return exports.nodeData.find(function (node) { return node.name.toLowerCase() === lowerName; });
}
//# sourceMappingURL=NodeData.js.map