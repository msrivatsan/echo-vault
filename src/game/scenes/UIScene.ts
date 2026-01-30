import Phaser from 'phaser';
import { SceneKeys } from '../config';
import { GameScene } from './GameScene';

export class UIScene extends Phaser.Scene {
  private pauseMenu!: Phaser.GameObjects.Container;
  private isPaused: boolean = false;
  private selectedOption: number = 0;
  private menuOptions: string[] = ['Resume', 'Reset Level', 'Exit to Menu'];
  private optionTexts: Phaser.GameObjects.Text[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private enterKey!: Phaser.Input.Keyboard.Key;
  private escKey!: Phaser.Input.Keyboard.Key;
  private gameScene!: GameScene;

  constructor() {
    super({ key: SceneKeys.UI });
  }

  init(data: { gameScene?: GameScene }): void {
    if (data.gameScene) {
      this.gameScene = data.gameScene;
    }
  }

  create(): void {
    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Create pause menu (hidden initially)
    this.createPauseMenu();

    // Listen for pause events
    this.events.on('show-pause-menu', this.showPauseMenu, this);
  }

  update(): void {
    if (!this.isPaused) return;

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

    // Resume with ESC
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      this.resumeGame();
    }
  }

  private createPauseMenu(): void {
    const { width, height } = this.cameras.main;

    this.pauseMenu = this.add.container(0, 0);

    // Semi-transparent background
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
    overlay.setOrigin(0, 0);

    // Menu panel
    const panel = this.add.image(width / 2, height / 2, 'ui-panel');

    // Title
    const title = this.add.text(width / 2, height / 2 - 100, 'PAUSED', {
      fontSize: '48px',
      color: '#4a90e2',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Menu options
    const startY = height / 2;
    const spacing = 60;

    this.menuOptions.forEach((option, index) => {
      const y = startY + (index - 1) * spacing;

      const text = this.add.text(width / 2, y, option, {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Courier New'
      }).setOrigin(0.5);

      this.optionTexts.push(text);
    });

    // Add all to container
    this.pauseMenu.add([overlay, panel, title, ...this.optionTexts]);
    this.pauseMenu.setVisible(false);
  }

  private showPauseMenu(): void {
    this.isPaused = true;
    this.pauseMenu.setVisible(true);
    this.selectedOption = 0;
    this.updateSelection();
  }

  private hidePauseMenu(): void {
    this.isPaused = false;
    this.pauseMenu.setVisible(false);
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
      case 0: // Resume
        this.resumeGame();
        break;
      case 1: // Reset Level
        this.hidePauseMenu();
        this.gameScene.resetLevel();
        break;
      case 2: // Exit to Menu
        this.hidePauseMenu();
        this.gameScene.exitToMenu();
        break;
    }
  }

  private resumeGame(): void {
    this.hidePauseMenu();
    this.scene.resume(SceneKeys.Game);
  }

  public showWinScreen(): void {
    const { width, height } = this.cameras.main;

    // Create win screen
    const winContainer = this.add.container(0, 0);

    // Semi-transparent background
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);
    overlay.setOrigin(0, 0);

    // Win panel
    const panel = this.add.image(width / 2, height / 2, 'ui-panel');

    // Title
    const title = this.add.text(width / 2, height / 2 - 80, 'LEVEL COMPLETE!', {
      fontSize: '42px',
      color: '#4ae290',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Instructions
    const instruction = this.add.text(width / 2, height / 2 + 40, 'Press ENTER to continue', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Courier New'
    }).setOrigin(0.5);

    winContainer.add([overlay, panel, title, instruction]);

    // Wait for enter key
    const enterListener = () => {
      this.input.keyboard!.off('keydown-ENTER', enterListener);
      winContainer.destroy();
      this.gameScene.exitToMenu();
    };

    this.input.keyboard!.on('keydown-ENTER', enterListener);
  }
}
