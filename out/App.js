import { SkillTree } from './SkillTree.js';
import { v4 as uuidv4 } from 'uuid';
import { getNodeByName } from './NodeData.js';
import { Item } from './Item.js';
export class App {
    constructor() {
        this.skillTree = new SkillTree();
    }
    init() {
        console.log("Initializing application...");
        this.testMakeSkillTree();
        console.log("\n##############################################\n");
        this.testSkillCasting();
        console.log("\n##############################################\n");
        this.testSkillCasting();
        console.log("\n##############################################\n");
    }
    testSkillCasting() {
        let castSkill = this.rollSkill(this.skillTree.root.id);
        console.log("Rolled skill:", castSkill.name);
        const damage = this.skillTree.damageCalculator.calculateDamage(castSkill);
        console.log(`Calculated damage for ${castSkill.name}:`, damage);
    }
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
    testGenerateItem() {
        const randomWeapon = new Item({
            name: "Emnite Relic",
            slot: "weapon"
        });
        console.log(randomWeapon);
    }
    // Receive a skill id and roll the skill in a random way. Return false if the node is a SkillNode 
    rollSkill(id) {
        const randomSkill = this.skillTree.leaves[Math.floor(Math.random() * this.skillTree.leaves.length)];
        return randomSkill;
    }
    getSkillTree() {
        return this.skillTree;
    }
    createNodeInstanceByName(name) {
        const template = getNodeByName(name);
        if (!template)
            return null;
        return Object.assign(Object.assign({}, template), { id: uuidv4() });
    }
}
//# sourceMappingURL=App.js.map