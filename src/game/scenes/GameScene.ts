import Phaser from 'phaser';
import { SceneKeys, GameConfig } from '../config';
import { LevelData, GameState } from '../types';
import { LevelLoader } from '../LevelLoader';
import { Player } from '../entities/Player';
import { Door } from '../entities/Door';
import { Lever } from '../entities/Lever';
import { PressurePlate } from '../entities/PressurePlate';
import { ExitGate } from '../entities/ExitGate';

export class GameScene extends Phaser.Scene {
  private currentLevel!: LevelData;
  private currentLevelId: string = 'level1';
  private player!: Player;
  private entities: Map<string, Door | Lever | PressurePlate | ExitGate> = new Map();
  private gameState!: GameState;
  private levelOffsetX: number = 0;
  private levelOffsetY: number = 0;
  private isWon: boolean = false;

  // Input
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private escKey!: Phaser.Input.Keyboard.Key;
  private rKey!: Phaser.Input.Keyboard.Key;
  private hKey!: Phaser.Input.Keyboard.Key;
  private tildaKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: SceneKeys.Game });
  }

  init(data: { levelId?: string }): void {
    if (data?.levelId) {
      this.currentLevelId = data.levelId;
    }
  }

  async create(): Promise<void> {
    try {
      // Load level
      this.currentLevel = await LevelLoader.loadLevel(this.currentLevelId);

      // Initialize game state
      this.initGameState();

      // Create level visuals
      this.createLevelVisuals();

      // Create entities
      this.createEntities();

      // Create player
      this.createPlayer();

      // Setup input
      this.setupInput();

      // Launch UI scene
      this.scene.launch(SceneKeys.UI, {
        gameScene: this,
        levelName: this.currentLevel.name
      });

      // Add instructions
      this.add.text(10, 10, 'WASD/Arrows: Move | R: Reset | ESC: Pause | H: Hints | ~: Debug', {
        fontSize: '12px',
        color: '#ffffff',
        fontFamily: 'Courier New',
        backgroundColor: '#000000',
        padding: { x: 8, y: 4 }
      });
    } catch (error) {
      console.error('Failed to load level:', error);
      this.scene.start(SceneKeys.Title);
    }
  }

  update(): void {
    if (this.isWon) return;

    this.handlePlayerMovement();

    // Reset level
    if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      this.scene.restart();
    }

    // Pause
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.scene.pause();
      this.scene.get(SceneKeys.UI).events.emit('show-pause-menu');
    }

    // Hint toggle (sent to UI)
    if (Phaser.Input.Keyboard.JustDown(this.hKey)) {
      this.scene.get(SceneKeys.UI).events.emit('toggle-hints');
    }

    // Debug panel toggle
    if (Phaser.Input.Keyboard.JustDown(this.tildaKey)) {
      this.scene.get(SceneKeys.UI).events.emit('toggle-debug');
    }
  }

  private initGameState(): void {
    this.gameState = {
      currentLevelId: this.currentLevelId,
      playerPos: { ...this.currentLevel.playerStart },
      entityStates: new Map(),
      isMoving: false,
      isGameOver: false,
      isGameWon: false,
      activeTriggers: new Set()
    };
  }

  private createLevelVisuals(): void {
    const { width, height } = this.currentLevel;
    const tileSize = GameConfig.tileSize * GameConfig.tileScale;

    // Calculate offsets to center the level
    const levelWidth = width * tileSize;
    const levelHeight = height * tileSize;
    this.levelOffsetX = (GameConfig.width - levelWidth) / 2;
    this.levelOffsetY = (GameConfig.height - levelHeight) / 2;

    // Draw floor and walls
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const worldX = this.levelOffsetX + x * tileSize + tileSize / 2;
        const worldY = this.levelOffsetY + y * tileSize + tileSize / 2;

        const tile = this.currentLevel.tilemap[y][x];

        if (tile === '#') {
          // Wall
          this.add.image(worldX, worldY, 'wall');
        } else {
          // Floor for all other tiles
          this.add.image(worldX, worldY, 'floor');
        }
      }
    }
  }

  private createEntities(): void {
    for (const placement of this.currentLevel.entities) {
      const worldX = this.levelOffsetX + placement.x * GameConfig.tileSize * GameConfig.tileScale + GameConfig.tileSize * GameConfig.tileScale / 2;
      const worldY = this.levelOffsetY + placement.y * GameConfig.tileSize * GameConfig.tileScale + GameConfig.tileSize * GameConfig.tileScale / 2;

      const graphics = this.add.graphics().setPosition(worldX, worldY);

      switch (placement.type) {
        case 'pressure-plate': {
          const plate = new PressurePlate(placement.id, placement.x, placement.y, graphics);
          this.entities.set(placement.id, plate);
          break;
        }
        case 'door': {
          const door = new Door(
            placement.id,
            placement.x,
            placement.y,
            graphics,
            placement.data?.triggeredBy || [],
            placement.data?.startState || 'closed'
          );
          this.entities.set(placement.id, door);
          break;
        }
        case 'lever': {
          const lever = new Lever(
            placement.id,
            placement.x,
            placement.y,
            graphics,
            placement.data?.startState || 'closed'
          );
          this.entities.set(placement.id, lever);
          break;
        }
        case 'exit-gate': {
          const exitGate = new ExitGate(placement.id, placement.x, placement.y, graphics);
          this.entities.set(placement.id, exitGate);
          break;
        }
      }
    }
  }

  private createPlayer(): void {
    const { playerStart } = this.currentLevel;
    const worldX = this.levelOffsetX + playerStart.x * GameConfig.tileSize * GameConfig.tileScale + GameConfig.tileSize * GameConfig.tileScale / 2;
    const worldY = this.levelOffsetY + playerStart.y * GameConfig.tileSize * GameConfig.tileScale + GameConfig.tileSize * GameConfig.tileScale / 2;

    const playerSprite = this.physics.add.sprite(worldX, worldY, 'player');
    this.player = new Player('player', playerStart.x, playerStart.y, playerSprite);
  }

  private setupInput(): void {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasdKeys = {
      W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    };
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.rKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.hKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.tildaKey = this.input.keyboard!.addKey('`');
  }

  private handlePlayerMovement(): void {
    if (this.player.isMoving) return;

    let moveX = 0;
    let moveY = 0;

    // Horizontal movement
    if (this.cursors.left?.isDown || this.wasdKeys.A.isDown) {
      moveX = -1;
    } else if (this.cursors.right?.isDown || this.wasdKeys.D.isDown) {
      moveX = 1;
    }

    // Vertical movement
    if (this.cursors.up?.isDown || this.wasdKeys.W.isDown) {
      moveY = -1;
    } else if (this.cursors.down?.isDown || this.wasdKeys.S.isDown) {
      moveY = 1;
    }

    // Only move if there's input
    if (moveX !== 0 || moveY !== 0) {
      this.attemptMove(moveX, moveY);
    }
  }

  private attemptMove(moveX: number, moveY: number): void {
    const newX = this.player.gridX + moveX;
    const newY = this.player.gridY + moveY;

    // Check bounds
    if (newX < 0 || newX >= this.currentLevel.width || newY < 0 || newY >= this.currentLevel.height) {
      return;
    }

    // Check wall collision
    const tile = this.currentLevel.tilemap[newY][newX];
    if (tile === '#') {
      return;
    }

    // Check entity collision (doors, etc)
    const blockedByEntity = this.checkEntityCollision(newX, newY);
    if (blockedByEntity) {
      return;
    }

    // Move player
    this.player.moveToGrid(newX, newY, this).then(() => {
      this.updateWorldState();
    });
  }

  private checkEntityCollision(gridX: number, gridY: number): boolean {
    for (const entity of this.entities.values()) {
      if (entity.gridX === gridX && entity.gridY === gridY && entity.blocksMovement) {
        return true;
      }
    }
    return false;
  }

  private updateWorldState(): void {
    // Update player position
    this.gameState.playerPos = { x: this.player.gridX, y: this.player.gridY };

    // Check plate collisions
    for (const entity of this.entities.values()) {
      if (entity instanceof PressurePlate) {
        if (entity.gridX === this.player.gridX && entity.gridY === this.player.gridY) {
          entity.activate();
          this.gameState.activeTriggers.add(entity.id);
        } else {
          entity.deactivate();
          this.gameState.activeTriggers.delete(entity.id);
        }
      }
    }

    // Update door states based on triggers
    this.updateDoors();

    // Check win condition
    this.checkWinCondition();

    // Update UI
    this.scene.get(SceneKeys.UI).events.emit('update-game-state', this.gameState);
  }

  private updateDoors(): void {
    for (const entity of this.entities.values()) {
      if (entity instanceof Door) {
        const triggersActive = entity.triggeredBy.some(triggerId => this.gameState.activeTriggers.has(triggerId));
        entity.setOpen(triggersActive);
      }
    }
  }

  private checkWinCondition(): void {
    const exitGate = Array.from(this.entities.values()).find(e => e instanceof ExitGate) as ExitGate | undefined;
    if (!exitGate) return;

    // Check if all doors are open or if exit gate is open
    const allDoorsOpen = Array.from(this.entities.values())
      .filter(e => e instanceof Door)
      .every(e => (e as Door).isOpen);

    if (allDoorsOpen) {
      exitGate.open();
    }

    // Check if player is on exit
    if (exitGate.isOpen && this.player.gridX === exitGate.gridX && this.player.gridY === exitGate.gridY) {
      this.isWon = true;
      this.scene.get(SceneKeys.UI).events.emit('game-won');
    }
  }

  public resetLevel(): void {
    this.scene.restart();
  }

  public exitToMenu(): void {
    this.scene.stop(SceneKeys.UI);
    this.scene.start(SceneKeys.Title);
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public getEntities(): Map<string, Door | Lever | PressurePlate | ExitGate> {
    return this.entities;
  }

  public getPlayer(): Player {
    return this.player;
  }

  public loadLevel(levelId: string): void {
    this.scene.stop(SceneKeys.UI);
    this.scene.start(SceneKeys.Game, { levelId });
  }
}
