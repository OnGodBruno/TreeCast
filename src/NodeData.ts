import type { SkillNode, SupportNode } from './SkillTree';

export const skillsData: SkillNode[] = [
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

export const supportsData: SupportNode[] = [
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

export function getSkillByName(name: string): SkillNode | undefined {
  const lowerName = name.toLowerCase();
  return skillsData.find(skill => skill.name.toLowerCase() === lowerName);
}

export function getSupportByName(name: string): SupportNode | undefined {
  const lowerName = name.toLowerCase();
  return supportsData.find(support => support.name.toLowerCase() === lowerName);
}
