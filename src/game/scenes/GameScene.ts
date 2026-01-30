import Phaser from 'phaser';
import { SceneKeys, GameConfig } from '../config';

interface LevelData {
  width: number;
  height: number;
  tiles: number[][];
  playerStart: { x: number; y: number };
}

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private escKey!: Phaser.Input.Keyboard.Key;
  private rKey!: Phaser.Input.Keyboard.Key;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private currentLevel!: LevelData;

  constructor() {
    super({ key: SceneKeys.Game });
  }

  init(_data: { levelIndex?: number }): void {
    // levelIndex will be used for loading different levels in future
    // For now, we just load the test level
  }

  create(): void {
    // Load test level
    this.currentLevel = this.getTestLevel();

    // Create level
    this.createLevel();

    // Create player
    this.createPlayer();

    // Setup input
    this.setupInput();

    // Launch UI scene
    this.scene.launch(SceneKeys.UI, { gameScene: this });

    // Add instructions
    this.add.text(10, 10, 'WASD/Arrows: Move | ESC: Pause | R: Reset', {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    });
  }

  update(): void {
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
  }

  private createLevel(): void {
    const { tiles, width, height } = this.currentLevel;
    const tileSize = GameConfig.tileSize;

    // Calculate camera bounds
    const levelWidth = width * tileSize;
    const levelHeight = height * tileSize;

    // Center the level on screen
    const offsetX = (GameConfig.width - levelWidth) / 2;
    const offsetY = (GameConfig.height - levelHeight) / 2;

    // Create walls group
    this.walls = this.physics.add.staticGroup();

    // Build level from tile data
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = tiles[y][x];
        const worldX = offsetX + x * tileSize + tileSize / 2;
        const worldY = offsetY + y * tileSize + tileSize / 2;

        switch (tile) {
          case 0: // Floor
            this.add.image(worldX, worldY, 'floor');
            break;
          case 1: // Wall
            const wall = this.add.image(worldX, worldY, 'wall');
            this.walls.add(wall);
            break;
          case 2: // Goal
            this.add.image(worldX, worldY, 'floor');
            this.add.image(worldX, worldY, 'goal');
            break;
        }
      }
    }
  }

  private createPlayer(): void {
    const { playerStart } = this.currentLevel;
    const tileSize = GameConfig.tileSize;

    // Calculate player position
    const levelWidth = this.currentLevel.width * tileSize;
    const levelHeight = this.currentLevel.height * tileSize;
    const offsetX = (GameConfig.width - levelWidth) / 2;
    const offsetY = (GameConfig.height - levelHeight) / 2;

    const playerX = offsetX + playerStart.x * tileSize + tileSize / 2;
    const playerY = offsetY + playerStart.y * tileSize + tileSize / 2;

    // Create player sprite
    this.player = this.physics.add.sprite(playerX, playerY, 'player');
    this.player.setCollideWorldBounds(true);

    // Add collision with walls
    this.physics.add.collider(this.player, this.walls);
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
  }

  private handlePlayerMovement(): void {
    const speed = GameConfig.playerSpeed;
    let velocityX = 0;
    let velocityY = 0;

    // Horizontal movement
    if (this.cursors.left?.isDown || this.wasdKeys.A.isDown) {
      velocityX = -speed;
    } else if (this.cursors.right?.isDown || this.wasdKeys.D.isDown) {
      velocityX = speed;
    }

    // Vertical movement
    if (this.cursors.up?.isDown || this.wasdKeys.W.isDown) {
      velocityY = -speed;
    } else if (this.cursors.down?.isDown || this.wasdKeys.S.isDown) {
      velocityY = speed;
    }

    this.player.setVelocity(velocityX, velocityY);
  }

  private getTestLevel(): LevelData {
    // Test room: a simple box with walls around the perimeter
    // 0 = floor, 1 = wall, 2 = goal
    return {
      width: 15,
      height: 12,
      tiles: [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
      ],
      playerStart: { x: 2, y: 2 }
    };
  }

  public resetLevel(): void {
    this.scene.restart();
  }

  public exitToMenu(): void {
    this.scene.stop(SceneKeys.UI);
    this.scene.start(SceneKeys.Title);
  }
}
