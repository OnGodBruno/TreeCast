import { SkillTree } from './SkillTree.js';
import { Item } from './Item.js';

export type CharacterType = {
    name: string;
    xp: number;
    stats: {
        strength: number;
        dexterity: number;
        intelligence: number;
        celerity: number;
        health: number;
        resistances: Record<string, number>;
    };
    skillTree: SkillTree;
    inventory: Item[];
};

export class Character {
    private character: CharacterType;

    constructor(name: string) {
        this.character = {
            name: name,
            xp: 1,
            stats: {
                strength: 5,
                dexterity: 5,
                intelligence: 5,
                celerity: 5,
                health: 130,
                resistances: {
                    "fire": 0,
                    "cold": 0,
                    "lightning": 0,
                    "physical": 0,
                },
            },
            skillTree: new SkillTree(),
            inventory: [],
        };
    }

    importCharacterData(data: CharacterType): void {
        this.character = data;
    }


}

