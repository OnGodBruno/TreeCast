import { SkillTree, Node, SkillNode } from './SkillTree.js';
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
        max_health: number
        resistances: Record<string, number>;
    };
    skillTree: SkillTree;
    inventory: Item[];
};

export class Character {
    private character: CharacterType;
    private skillTree: SkillTree;

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
                max_health: 130,
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

        // Placeholder skill tree for testing
        this.skillTree = this.testExampleSkillTree();
    }
    
    private testExampleSkillTree(): SkillTree {
        const skillTree = new SkillTree();
        const support_LeftpawsFavor: Node = skillTree.createNodeInstanceByName("Leftpaw's Favor")!;
        const support_SplinteredFate: Node = skillTree.createNodeInstanceByName("Splintered Fate")!;
        const support_FireMastery: Node = skillTree.createNodeInstanceByName("Fire Mastery")!;
        const skill_Fireball: Node = skillTree.createNodeInstanceByName("Fireball")!;
        const skill_LavaBurst: Node = skillTree.createNodeInstanceByName("Lava Burst")!;
    
        skillTree.setRoot(support_LeftpawsFavor);
        skillTree.addChild(support_LeftpawsFavor.id, support_FireMastery);
        skillTree.addChild(support_FireMastery.id, support_SplinteredFate);
        skillTree.addChild(support_SplinteredFate.id, skill_LavaBurst);
        skillTree.addChild(support_SplinteredFate.id, skill_Fireball);

        return skillTree;
    }

    attack(): [string, number] {
        const randomSkill = this.skillTree.randomSkill();
        const [name, damage] = this.skillTree.damageCalculator.calculateDamage(randomSkill as SkillNode);

        return [name, damage];
    }

    getSkillTree(): SkillTree {
        return this.character.skillTree;
    }

    importCharacterData(data: CharacterType): void {
        this.character = data;
    }

    getName(): string {
        return this.character.name;
    }

    getCelerity(): number {
        return this.character.stats.celerity;
    }

    isAlive(): boolean {
        return this.character.stats.health > 0;
    }

    heal(amount: number): void {
        this.character.stats.health = Math.min(this.character.stats.max_health, this.character.stats.health + amount);
    }

    getHealth(): number {
        return this.character.stats.health;
    }

    takeDamage(amount: number): void {
        this.character.stats.health = Math.max(this.character.stats.health - amount, 0);
        console.log(`[Enemy] ${this.character.name} takes ${amount} damage. Remaining health: ${this.character.stats.health}`);
    }

}

