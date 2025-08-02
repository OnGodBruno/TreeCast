import { Character, CharacterType } from './Character.js';
import { randInt } from './Random.js';
import GENERIC_MODS from './ItemMods.js';

type ItemType = {
    name: string;
    slot: "weapon" | "armor" | "boots" | "gloves" | "helmet";
};

export class Item {
    private item: ItemType;
    private name: string;
    private slot: "weapon" | "armor" | "boots" | "gloves" | "helmet";
    private modifiers: Record<string, number>;

    constructor(item: ItemType) {
        this.item = item;
        this.name = item.name;
        this.slot = item.slot;
        this.modifiers = {};
        this.generateItemMods();
    }

    generateItemMods(): void{
        const modifierCount = randInt(2, 4);
        const modifiers: Record<string, number> = {};

        for (let i = 0; i < modifierCount; i++) {
            const [stat, value] = this.getRandomStatModifier();
            if (!modifiers[stat]) {
                modifiers[stat] = value;
            }
        }
        this.modifiers = modifiers;
    }

    getRandomStatModifier(): [string, number] {
        const statKeys = Object.keys(GENERIC_MODS) as Array<string>;
        const randStat = statKeys[randInt(0, statKeys.length - 1)];
        const [min, max] = GENERIC_MODS[randStat];

        // TODO: Add something here like "multiply by character level / area level"  
        const value = randInt(min, max);
        return [randStat, value];
    }

}
