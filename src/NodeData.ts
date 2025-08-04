import type { SkillNode, SupportNode, Node } from './SkillTree.js';

export const skillNodeData: SkillNode[] = [
  {
    id: "fireball",
    name: "Fireball",
    tags: ["skill", "fire", "elemental", "spell", "projectile"],
    type: "skill",
    description: "A powerful fire-based attack that launches a ball of flame at the enemy",
    baseDamage: { "fire": [80, 120] },
  },
  {
    id: "lavaBurst",
    name: "Lava Burst",
    tags: ["skill", "fire", "elemental", "spell", "area"],
    type: "skill",
    description: "A devastating area-of-effect fire attack that erupts from the ground, dealing damage to all enemies in the vicinity",
    baseDamage: { "fire": [60, 80] },
  },
  {
    id: "frostBolt",
    name: "Frost Bolt",
    tags: ["skill", "cold", "elemental", "spell", "projectile"],
    type: "skill",
    description: "Fires a freezing projectile that deals cold damage and slows enemies",
    baseDamage: { "cold": [70, 110] },
  },
  {
    id: "iceShards",
    name: "Ice Shards",
    tags: ["skill", "cold", "elemental", "spell", "projectile"],
    type: "skill",
    description: "Launches multiple ice projectiles in a spread pattern",
    baseDamage: { "cold": [45, 65] },
  },
  {
    id: "lightningBolt",
    name: "Lightning Bolt",
    tags: ["skill", "lightning", "elemental", "spell", "instant"],
    type: "skill",
    description: "A quick electrical attack that strikes instantly",
    baseDamage: { "lightning": [85, 115] },
  },
  {
    id: "chainLightning",
    name: "Chain Lightning",
    tags: ["skill", "lightning", "elemental", "spell", "chaining"],
    type: "skill",
    description: "Lightning that jumps between enemies, dealing reduced damage to each subsequent target",
    baseDamage: { "lightning": [50, 75] },
  },
  {
    id: "earthSpike",
    name: "Earth Spike",
    tags: ["skill", "physical", "earth", "spell", "piercing"],
    type: "skill",
    description: "Causes jagged earth to erupt beneath the target",
    baseDamage: { "physical": [90, 130] },
  },
  {
    id: "windSlash",
    name: "Wind Slash",
    tags: ["skill", "physical", "air", "spell", "cutting"],
    type: "skill",
    description: "A sharp gust of wind that cuts through armor",
    baseDamage: { "physical": [75, 105] },
  },
  {
    id: "shadowStrike",
    name: "Shadow Strike",
    tags: ["skill", "physical", "shadow", "spell", "stealth"],
    type: "skill",
    description: "A shadowy attack that strikes from unexpected angles",
    baseDamage: { "physical": [80, 100] },
  },
  {
    id: "arcaneOrb",
    name: "Arcane Orb",
    tags: ["skill", "arcane", "spell", "projectile", "pure"],
    type: "skill",
    description: "A sphere of pure magical energy that ignores most resistances",
    baseDamage: { "arcane": [65, 95] },
  }
];

export const supportNodeData: SupportNode[] = [
  {
    id: "fireMastery",
    name: "Fire Mastery",
    tags: ["support", "fire"],
    type: "support",
    childrenAmount: 1,
    children: [],
    description: "Increases the damage of fire-based skills by 20%",
  },
  {
    id: "splinteredFate",
    name: "Splintered Fate",
    tags: ["support", "critical"],
    type: "support",
    childrenAmount: 2,
    children: [],
    description: "+20% to critical strike chance",
  },
  {
    id: "leftpawsFavor",
    name: "Leftpaw's Favor",
    tags: ["support"],
    type: "support",
    childrenAmount: 1,
    children: [],
    description: "Your damage is Lucky (rolls twice and takes the better outcome)",
  },

  {
    id: "elementalFocus",
    name: "Elemental Focus",
    tags: ["support", "elemental"],
    type: "support",
    childrenAmount: 3,
    children: [],
    description: "Increases all elemental damage by 15%",
  },
  {
    id: "criticalMastery",
    name: "Critical Mastery",
    tags: ["support", "critical"],
    type: "support",
    childrenAmount: 1,
    children: [],
    description: "Critical strikes deal 50% more damage",
  },
];

export const nodeData: Node[] = [
  ...skillNodeData,
  ...supportNodeData,
];

export function getNodeByName(name: string): SkillNode | SupportNode | undefined {
  const lowerName = name.toLowerCase();
  return nodeData.find(node => node.name.toLowerCase() === lowerName);
}
