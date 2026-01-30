import Phaser from 'phaser';
import { SceneKeys, GameConfig } from '../config';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKeys.Boot });
  }

  preload(): void {
    // Display loading text
    const { width, height } = this.cameras.main;
    const loadingText = this.add.text(
      width / 2,
      height / 2,
      'Generating Assets...',
      {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Courier New'
      }
    ).setOrigin(0.5);

    // Create procedural graphics
    this.createProceduralAssets();

    loadingText.setText('Ready!');
  }

  create(): void {
    // Move to title screen
    this.scene.start(SceneKeys.Title);
  }

  private createProceduralAssets(): void {
    const tileSize = GameConfig.tileSize;

    // Create player sprite (golden square with border)
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(GameConfig.colors.player, 1);
    playerGraphics.fillRect(2, 2, tileSize - 4, tileSize - 4);
    playerGraphics.lineStyle(2, 0xffa500, 1);
    playerGraphics.strokeRect(2, 2, tileSize - 4, tileSize - 4);
    playerGraphics.generateTexture('player', tileSize, tileSize);
    playerGraphics.destroy();

    // Create wall tile (dark blue brick pattern)
    const wallGraphics = this.add.graphics();
    wallGraphics.fillStyle(GameConfig.colors.wall, 1);
    wallGraphics.fillRect(0, 0, tileSize, tileSize);
    wallGraphics.lineStyle(1, 0x0a1929, 1);
    // Brick pattern
    for (let i = 0; i < tileSize; i += 8) {
      wallGraphics.lineBetween(0, i, tileSize, i);
    }
    for (let i = 0; i < tileSize; i += 16) {
      wallGraphics.lineBetween(i, 0, i, tileSize);
    }
    wallGraphics.generateTexture('wall', tileSize, tileSize);
    wallGraphics.destroy();

    // Create floor tile (lighter blue with grid)
    const floorGraphics = this.add.graphics();
    floorGraphics.fillStyle(GameConfig.colors.floor, 1);
    floorGraphics.fillRect(0, 0, tileSize, tileSize);
    floorGraphics.lineStyle(1, 0x0a2a5a, 0.3);
    floorGraphics.strokeRect(0, 0, tileSize, tileSize);
    floorGraphics.generateTexture('floor', tileSize, tileSize);
    floorGraphics.destroy();

    // Create button/interactable (cyan circle)
    const buttonGraphics = this.add.graphics();
    buttonGraphics.fillStyle(GameConfig.colors.primary, 1);
    buttonGraphics.fillCircle(tileSize / 2, tileSize / 2, tileSize / 3);
    buttonGraphics.lineStyle(2, 0x2a6ec2, 1);
    buttonGraphics.strokeCircle(tileSize / 2, tileSize / 2, tileSize / 3);
    buttonGraphics.generateTexture('button', tileSize, tileSize);
    buttonGraphics.destroy();

    // Create goal tile (green star)
    const goalGraphics = this.add.graphics();
    goalGraphics.fillStyle(GameConfig.colors.success, 1);
    const centerX = tileSize / 2;
    const centerY = tileSize / 2;
    const outerRadius = tileSize / 3;
    const innerRadius = tileSize / 6;
    const points = 5;

    goalGraphics.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      if (i === 0) {
        goalGraphics.moveTo(x, y);
      } else {
        goalGraphics.lineTo(x, y);
      }
    }
    goalGraphics.closePath();
    goalGraphics.fillPath();
    goalGraphics.generateTexture('goal', tileSize, tileSize);
    goalGraphics.destroy();

    // Create UI button background
    const buttonBgGraphics = this.add.graphics();
    buttonBgGraphics.fillStyle(GameConfig.colors.primary, 1);
    buttonBgGraphics.fillRoundedRect(0, 0, 200, 50, 8);
    buttonBgGraphics.lineStyle(2, 0x6ab0f2, 1);
    buttonBgGraphics.strokeRoundedRect(0, 0, 200, 50, 8);
    buttonBgGraphics.generateTexture('ui-button', 200, 50);
    buttonBgGraphics.destroy();

    // Create UI button background (selected)
    const buttonSelectedGraphics = this.add.graphics();
    buttonSelectedGraphics.fillStyle(0x6ab0f2, 1);
    buttonSelectedGraphics.fillRoundedRect(0, 0, 200, 50, 8);
    buttonSelectedGraphics.lineStyle(3, GameConfig.colors.text, 1);
    buttonSelectedGraphics.strokeRoundedRect(0, 0, 200, 50, 8);
    buttonSelectedGraphics.generateTexture('ui-button-selected', 200, 50);
    buttonSelectedGraphics.destroy();

    // Create panel background
    const panelGraphics = this.add.graphics();
    panelGraphics.fillStyle(0x0f0f1e, 0.9);
    panelGraphics.fillRoundedRect(0, 0, 400, 300, 12);
    panelGraphics.lineStyle(3, GameConfig.colors.primary, 1);
    panelGraphics.strokeRoundedRect(0, 0, 400, 300, 12);
    panelGraphics.generateTexture('ui-panel', 400, 300);
    panelGraphics.destroy();
  }
}
