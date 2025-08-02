import { SkillTree } from './SkillTree.js';
import { v4 as uuidv4 } from 'uuid';
import { getNodeByName } from './NodeData.js';
import { Item } from './Item.js';
import { Enemy } from './Enemy.js';
export class App {
    constructor() {
        this.skillTree = new SkillTree();
    }
    init() {
        this.testMakeEnemy();
    }
    //Creates an enemy and tests its attack
    testMakeEnemy() {
        const fireElementalType = {
            name: "Fire Elemental",
            health: 1000,
            resistances: {
                fire: 0.2,
                cold: 0.1,
                lightning: 0.15,
                physical: 0.05,
            },
            skillSet: [
                { id: "0", chance: 0.5, },
                { id: "1", chance: 0.4, },
                { id: "4", chance: 0.1, },
            ],
        };
        const fireElemental = new Enemy(fireElementalType);
        fireElemental.attack();
    }
    // Chooses a random skill from the skill tree and calculates its damage
    testSkillCasting() {
        let castSkill = this.rollSkill(this.skillTree.root.id);
        const damage = this.skillTree.damageCalculator.calculateDamage(castSkill);
        console.log(`Damage for ${castSkill.name}:`, damage);
    }
    // Creates a skill tree 
    testMakeSkillTree() {
        const support_LeftpawsFavor = this.createNodeInstanceByName("Leftpaw's Favor");
        const support_SplinteredFate = this.createNodeInstanceByName("Splintered Fate");
        const support_FireMastery = this.createNodeInstanceByName("Fire Mastery");
        const skill_Fireball = this.createNodeInstanceByName("Fireball");
        const skill_LavaBurst = this.createNodeInstanceByName("Lava Burst");
        this.skillTree.setRoot(support_LeftpawsFavor);
        this.skillTree.addChild(support_LeftpawsFavor.id, support_FireMastery);
        this.skillTree.addChild(support_FireMastery.id, support_SplinteredFate);
        this.skillTree.addChild(support_SplinteredFate.id, skill_LavaBurst);
        this.skillTree.addChild(support_SplinteredFate.id, skill_Fireball);
    }
    // Generates a random item and shows its modifiers
    testGenerateItem() {
        const randomWeapon = new Item({
            name: "Emnite Relic",
            slot: "weapon"
        });
        console.log(randomWeapon);
    }
    // Choose a random SkillNode from the skill tree 
    rollSkill(id) {
        const randomSkill = this.skillTree.leaves[Math.floor(Math.random() * this.skillTree.leaves.length)];
        return randomSkill;
    }
    getSkillTree() {
        return this.skillTree;
    }
    // Creates a new node instance based on the name from NodeData
    // Append uuid to enable multiple instances of the same node
    createNodeInstanceByName(name) {
        const template = getNodeByName(name);
        if (!template)
            return null;
        return Object.assign(Object.assign({}, template), { id: uuidv4() });
    }
}
//# sourceMappingURL=App.js.map