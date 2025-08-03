import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { App } from './App.js';
import { Character } from './Character.js';
import { Enemy } from './Enemy.js';
import { Combat } from './Combat.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class WebServer {
    private app: express.Application;
    private port: number;
    private gameApp: App;
    private currentCombat: Combat | null = null;
    private combatUpdates: any[] = [];
    private combatState: any = {};

    constructor(port: number = 3000) {
        this.app = express();
        this.port = port;
        this.gameApp = new App();
        this.setupMiddleware();
        this.setupRoutes();
    }

    private setupMiddleware(): void {
        this.app.use(express.json());
        this.app.use(express.static(path.join(__dirname, '../public')));
    }

    private setupRoutes(): void {
        // Serve the main page
        this.app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });

        // API endpoints
        this.app.post('/api/combat/start', (req: Request, res: Response) => {
            try {
                // Create new combat instance
                const enemy = this.gameApp.testMakeEnemy();
                const character = new Character("Timofee");
                
                this.currentCombat = new Combat({
                    enemy: enemy,
                    character: character
                });

                // Initialize combat state
                this.combatState = {
                    character: {
                        name: character.getName(),
                        health: character.getHealth(),
                        maxHealth: (character as any).character.stats.max_health,
                        celerity: character.getCelerity(),
                        status: 'Ready'
                    },
                    enemy: {
                        name: enemy.getName(),
                        health: enemy.getHealth(),
                        maxHealth: (enemy as any).enemyType.max_health,
                        celerity: enemy.getCelerity(),
                        status: 'Ready'
                    },
                    isPlayerTurn: character.getCelerity() >= enemy.getCelerity(),
                    combatEnded: false,
                    winner: null,
                    turnIndicator: character.getCelerity() >= enemy.getCelerity() ? 
                        `${character.getName()}'s Turn` : `${enemy.getName()}'s Turn`
                };

                this.combatUpdates = [];
                
                // Start the combat simulation
                this.startCombatSimulation();

                res.json({ 
                    success: true, 
                    state: this.combatState 
                });
            } catch (error) {
                res.json({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'Unknown error' 
                });
            }
        });

        this.app.get('/api/combat/status', (req: Request, res: Response) => {
            res.json({
                state: this.combatState,
                updates: this.combatUpdates.splice(0) // Return and clear updates
            });
        });

        this.app.post('/api/combat/reset', (req: Request, res: Response) => {
            this.currentCombat = null;
            this.combatUpdates = [];
            this.combatState = {};
            res.json({ success: true });
        });
    }

    private async startCombatSimulation(): Promise<void> {
        if (!this.currentCombat) return;

        const character = (this.currentCombat as any).character;
        const enemy = (this.currentCombat as any).enemy;
        let isPlayerTurn = this.combatState.isPlayerTurn;

        // Simulate combat with delays for visualization
        const simulateTurn = async () => {
            if (!character.isAlive() || !enemy.isAlive()) {
                // Combat ended
                this.combatState.combatEnded = true;
                if (!character.isAlive()) {
                    this.combatState.winner = enemy.getName();
                    this.combatUpdates.push({
                        type: 'system',
                        message: `${character.getName()} has been defeated.`
                    });
                } else {
                    this.combatState.winner = character.getName();
                    this.combatUpdates.push({
                        type: 'system',
                        message: `${enemy.getName()} has been defeated!`
                    });
                }
                return;
            }

            if (isPlayerTurn) {
                const [skillName, damage] = character.attack();
                enemy.takeDamage(damage);
                
                this.combatUpdates.push({
                    type: 'action',
                    attacker: character.getName(),
                    skill: skillName,
                    damage: damage
                });

                this.combatState.enemy.health = enemy.getHealth();
                this.combatState.enemy.status = enemy.isAlive() ? 'Fighting' : 'Defeated';
                this.combatState.turnIndicator = `${enemy.getName()}'s Turn`;
            } else {
                const [skillName, damage] = enemy.attack();
                character.takeDamage(damage);
                
                this.combatUpdates.push({
                    type: 'action',
                    attacker: enemy.getName(),
                    skill: skillName,
                    damage: damage
                });

                this.combatState.character.health = character.getHealth();
                this.combatState.character.status = character.isAlive() ? 'Fighting' : 'Defeated';
                this.combatState.turnIndicator = `${character.getName()}'s Turn`;
            }

            isPlayerTurn = !isPlayerTurn;

            // Continue combat after a delay
            if (character.isAlive() && enemy.isAlive()) {
                setTimeout(simulateTurn, 2000); // 2 second delay between turns
            } else {
                // Combat ended
                this.combatState.combatEnded = true;
                if (!character.isAlive()) {
                    this.combatState.winner = enemy.getName();
                } else {
                    this.combatState.winner = character.getName();
                }
            }
        };

        // Start the first turn after a short delay
        setTimeout(simulateTurn, 1000);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`🌳 TreeCast server running at http://localhost:${this.port}`);
            console.log(`Open your browser and navigate to the URL above to see the combat visualization!`);
        });
    }
}
