import Phaser from 'phaser';
import { SceneKeys, GameConfig } from '../config';

export class LevelSelectScene extends Phaser.Scene {
  private selectedLevel: number = 0;
  private totalLevels: number = 5; // Placeholder for now
  private levelButtons: Phaser.GameObjects.Container[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: SceneKeys.LevelSelect });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Title
    this.add.text(width / 2, 60, 'SELECT LEVEL', {
      fontSize: '48px',
      color: '#4a90e2',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Create level grid
    const startX = 150;
    const startY = 150;
    const cols = 5;
    const spacing = 120;

    for (let i = 0; i < this.totalLevels; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * spacing;
      const y = startY + row * spacing;

      const container = this.createLevelButton(x, y, i);
      this.levelButtons.push(container);
    }

    // Instructions
    this.add.text(width / 2, height - 80, 'Use ARROW KEYS to navigate', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 50, 'ENTER to select | ESC to go back', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Highlight first level
    this.updateSelection();
  }

  update(): void {
    const cols = 5;

    // Navigate grid
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left!)) {
      if (this.selectedLevel % cols > 0) {
        this.selectedLevel--;
        this.updateSelection();
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.right!)) {
      if (this.selectedLevel % cols < cols - 1 && this.selectedLevel < this.totalLevels - 1) {
        this.selectedLevel++;
        this.updateSelection();
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      if (this.selectedLevel >= cols) {
        this.selectedLevel -= cols;
        this.updateSelection();
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
      if (this.selectedLevel + cols < this.totalLevels) {
        this.selectedLevel += cols;
        this.updateSelection();
      }
    }

    // Select level
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.scene.start(SceneKeys.Game, { levelIndex: this.selectedLevel });
    }

    // Go back
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.scene.start(SceneKeys.Title);
    }
  }

  private createLevelButton(x: number, y: number, level: number): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);

    // Background box
    const bg = this.add.graphics();
    bg.fillStyle(GameConfig.colors.primary, 0.3);
    bg.fillRoundedRect(-40, -40, 80, 80, 8);
    bg.lineStyle(2, GameConfig.colors.primary, 1);
    bg.strokeRoundedRect(-40, -40, 80, 80, 8);

    // Level number
    const text = this.add.text(0, 0, (level + 1).toString(), {
      fontSize: '32px',
      color: '#ffffff',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    container.add([bg, text]);
    container.setData('bg', bg);
    container.setData('text', text);

    return container;
  }

  private updateSelection(): void {
    this.levelButtons.forEach((container, index) => {
      const bg = container.getData('bg') as Phaser.GameObjects.Graphics;
      const text = container.getData('text') as Phaser.GameObjects.Text;

      bg.clear();

      if (index === this.selectedLevel) {
        // Selected state
        bg.fillStyle(0x6ab0f2, 0.8);
        bg.fillRoundedRect(-40, -40, 80, 80, 8);
        bg.lineStyle(3, 0xffd700, 1);
        bg.strokeRoundedRect(-40, -40, 80, 80, 8);
        text.setColor('#ffd700');
        container.setScale(1.1);
      } else {
        // Normal state
        bg.fillStyle(GameConfig.colors.primary, 0.3);
        bg.fillRoundedRect(-40, -40, 80, 80, 8);
        bg.lineStyle(2, GameConfig.colors.primary, 1);
        bg.strokeRoundedRect(-40, -40, 80, 80, 8);
        text.setColor('#ffffff');
        container.setScale(1.0);
      }
    });
  }
}
