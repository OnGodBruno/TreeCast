import { Enemy } from './Enemy';

export type EnemySkill = {
    id: string;
    name: string;
    tags: string[];
    baseDamage: Record<string, [number, number]>;
};

export const EnemySkills: EnemySkill[] = [
    {
        id: "0",
        name: "Basic Attack",
        tags: ['attack', 'physical'],
        baseDamage: {
            "physical": [5, 10],
        }
    },
    {
        id: "1",
        name: "Blazing Claw",
        tags: ['attack', 'fire'],
        baseDamage: {
            "fire": [15, 20],
        }
    },
    {
        id: "2",
        name: "Lightning Bolt",
        tags: ['spell', 'lightning'],
        baseDamage: {
            "fire": [10, 15],
        }
    },
    {
        id: "3",
        name: "Glacial Spike",
        tags: ['spell', 'cold'],
        baseDamage: {
            "cold": [10, 15],
        }
    },
    {
        id: "4",
        name: "Elemental Aggregate",
        tags: ['spell', 'lightning', 'fire', 'cold'],
        baseDamage: {
            "fire": [10, 20],
            "cold": [10, 20],
            "lightning": [10, 20],
        }
    },

];