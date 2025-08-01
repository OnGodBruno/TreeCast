"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportsData = exports.skillsData = void 0;
exports.getSkillByName = getSkillByName;
exports.getSupportByName = getSupportByName;
exports.skillsData = [
    {
        id: "0",
        name: "Fireball",
        tags: ["skill", "fire", "elemental", "spell", "projectile"],
        description: "A powerful fire-based attack that launches a ball of flame at the enemy",
        baseDamage: [80, 120],
    },
    {
        id: "1",
        name: "Lava Burst",
        tags: ["skill", "fire", "elemental", "spell", "area"],
        description: "A devastating area-of-effect fire attack that erupts from the ground, dealing damage to all enemies in the vicinity",
        baseDamage: [60, 80],
    },
];
exports.supportsData = [
    {
        id: "0",
        name: "Fire Mastery",
        tags: ["support", "fire"],
        children_amount: 2,
        children: [],
        description: "Increases the damage of fire-based skills by 20%",
    },
    {
        id: "1",
        name: "Lucky Fang",
        tags: ["support", "critical"],
        children_amount: 1,
        children: [],
        description: "Increases your critical strike chance by 10%",
    },
];
function getSkillByName(name) {
    var lowerName = name.toLowerCase();
    return exports.skillsData.find(function (skill) { return skill.name.toLowerCase() === lowerName; });
}
function getSupportByName(name) {
    var lowerName = name.toLowerCase();
    return exports.supportsData.find(function (support) { return support.name.toLowerCase() === lowerName; });
}
//# sourceMappingURL=NodeData.js.map