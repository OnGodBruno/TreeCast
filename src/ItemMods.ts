import { Character, CharacterType } from './Character.js';

const GENERIC_MODS: Record<string, [number, number]> = {
    health: [0, 10],
    strength: [1, 2],
    dexterity: [1, 2],
    intelligence: [1, 2],
    celerity: [1, 2],
    add_fire: [1, 5],
    add_cold: [1, 5],
    add_lightning: [1, 5],
    mastery_buff: [1, 5],
    block_chance: [1, 2],
    evade_chance: [1, 2],
};
export default GENERIC_MODS;
