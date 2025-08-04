import { Character, CharacterType } from './Character.js';

const GENERIC_MODS: Record<string, [number, number]> = {
    health: [0, 10],
    strength: [1, 2],
    dexterity: [1, 2],
    intelligence: [1, 2],
    celerity: [1, 2],
    addFire: [1, 5],
    addCold: [1, 5],
    addLightning: [1, 5],
    masteryBuff: [1, 5],
    blockChance: [1, 2],
    evadeChance: [1, 2],
};
export default GENERIC_MODS;
