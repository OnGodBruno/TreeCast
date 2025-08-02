import { SkillTree } from './SkillTree.js';
import { Item } from './Item.js';

export type CharacterType = {
    name: string;
    level: number;
    stats: {
        strength: number;
        dexterity: number;
        intelligence: number;
        celerity: number;
        health: number;
    };
    skillTree: SkillTree;
    inventory: Item[];
};

export class Character {
    private character: CharacterType;

    constructor(name: string) {
        this.character = {
            name: name,
            level: 1,
            stats: {
                strength: 5,
                dexterity: 5,
                intelligence: 5,
                celerity: 5,
                health: 60,
            },
            skillTree: new SkillTree(),
            inventory: [],
        };
    }

    importCharacterData(data: CharacterType): void {
        this.character = data;
    }
}

