import Phaser from 'phaser';
import { SceneKeys } from '../config';

export class TitleScene extends Phaser.Scene {
  private selectedOption: number = 0;
  private menuOptions: string[] = ['Start Game', 'Level Select'];
  private optionTexts: Phaser.GameObjects.Text[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private enterKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: SceneKeys.Title });
  }

  create(): void {
    const { width, height } = this.cameras.main;

    // Title
    this.add.text(width / 2, 100, 'ECHO VAULT', {
      fontSize: '64px',
      color: '#4a90e2',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(width / 2, 170, 'A Puzzle Game', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Menu options
    const startY = 300;
    const spacing = 80;

    this.menuOptions.forEach((option, index) => {
      const y = startY + index * spacing;

      // Button background
      const bg = this.add.image(width / 2, y, 'ui-button').setOrigin(0.5);
      bg.setData('index', index);

      // Button text
      const text = this.add.text(width / 2, y, option, {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);

      this.optionTexts.push(text);
    });

    // Instructions
    this.add.text(width / 2, height - 80, 'Use ARROW KEYS to navigate', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 50, 'Press ENTER to select', {
      fontSize: '16px',
      color: '#888888',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Highlight first option
    this.updateSelection();
  }

  update(): void {
    // Navigate menu
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
      this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
      this.updateSelection();
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.down!)) {
      this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
      this.updateSelection();
    }

    // Select option
    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.selectOption();
    }
  }

  private updateSelection(): void {
    this.optionTexts.forEach((text, index) => {
      if (index === this.selectedOption) {
        text.setScale(1.1);
        text.setColor('#ffd700');
      } else {
        text.setScale(1.0);
        text.setColor('#ffffff');
      }
    });
  }

  private selectOption(): void {
    switch (this.selectedOption) {
      case 0: // Start Game
        this.scene.start(SceneKeys.Game, { levelId: 'level1' });
        break;
      case 1: // Level Select
        this.scene.start(SceneKeys.LevelSelect);
        break;
    }
  }
}
