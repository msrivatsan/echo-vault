import Phaser from 'phaser';
import { SceneKeys } from '../config';
import { GameScene } from './GameScene';
import { Door } from '../entities/Door';

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
  private debugPanel!: Phaser.GameObjects.Container;
  private showDebug: boolean = false;
  private debugTexts: Phaser.GameObjects.Text[] = [];
  private hintsShown: boolean = false;
  private levelName: string = '';

  constructor() {
    super({ key: SceneKeys.UI });
  }

  init(data: { gameScene?: GameScene; levelName?: string }): void {
    if (data.gameScene) {
      this.gameScene = data.gameScene;
    }
    if (data.levelName) {
      this.levelName = data.levelName;
    }
  }

  create(): void {
    // Setup input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.enterKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    // Create UI elements
    this.createLevelNameDisplay();
    this.createPauseMenu();
    this.createDebugPanel();

    // Listen for events
    this.events.on('show-pause-menu', this.showPauseMenu, this);
    this.events.on('game-won', this.onGameWon, this);
    this.events.on('update-game-state', this.onGameStateUpdate, this);
    this.events.on('toggle-hints', this.toggleHints, this);
    this.events.on('toggle-debug', this.toggleDebug, this);
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

  private createLevelNameDisplay(): void {
    // Level name in top left
    this.add.text(10, 50, `Level: ${this.levelName}`, {
      fontSize: '18px',
      color: '#4a90e2',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    });

    // Controls hint
    this.add.text(10, 75, 'H: Hints | ~: Debug | ESC: Pause', {
      fontSize: '12px',
      color: '#999999',
      fontFamily: 'Courier New'
    });
  }

  private createDebugPanel(): void {
    const { width } = this.cameras.main;

    this.debugPanel = this.add.container(width - 300, 10);

    // Background
    const bg = this.add.rectangle(0, 0, 290, 400, 0x0f0f1e, 0.9);
    bg.setOrigin(0, 0);
    bg.setStrokeStyle(2, 0x4a90e2, 1);

    // Title
    const title = this.add.text(145, 10, 'DEBUG PANEL', {
      fontSize: '14px',
      color: '#4a90e2',
      fontFamily: 'Courier New',
      fontStyle: 'bold'
    }).setOrigin(0.5, 0);

    this.debugPanel.add([bg, title]);
    this.debugPanel.setVisible(false);
  }

  private updateDebugDisplay(): void {
    if (!this.showDebug || !this.gameScene) return;

    // Clear old texts
    this.debugTexts.forEach(t => t.destroy());
    this.debugTexts = [];

    const gameState = this.gameScene.getGameState();
    const entities = this.gameScene.getEntities();
    const player = this.gameScene.getPlayer();

    let yPos = 40;
    const lineHeight = 18;

    // Player position
    const playerText = this.add.text(
      -280,
      yPos,
      `Player: (${player.gridX}, ${player.gridY})`,
      {
        fontSize: '11px',
        color: '#ffd700',
        fontFamily: 'Courier New'
      }
    );
    this.debugTexts.push(playerText);
    yPos += lineHeight;

    // Active triggers
    const activeTriggerList = Array.from(gameState.activeTriggers).join(', ') || 'None';
    const triggersText = this.add.text(
      -280,
      yPos,
      `Active Triggers:`,
      {
        fontSize: '11px',
        color: '#4ae290',
        fontFamily: 'Courier New'
      }
    );
    this.debugTexts.push(triggersText);
    yPos += lineHeight;

    const triggersListText = this.add.text(
      -270,
      yPos,
      activeTriggerList,
      {
        fontSize: '10px',
        color: '#999999',
        fontFamily: 'Courier New'
      }
    );
    this.debugTexts.push(triggersListText);
    yPos += lineHeight + 5;

    // Door states
    const doorsText = this.add.text(
      -280,
      yPos,
      `Doors:`,
      {
        fontSize: '11px',
        color: '#fb5607',
        fontFamily: 'Courier New'
      }
    );
    this.debugTexts.push(doorsText);
    yPos += lineHeight;

    for (const [id, entity] of entities.entries()) {
      if (entity instanceof Door) {
        const doorStateText = this.add.text(
          -270,
          yPos,
          `${id}: ${entity.isOpen ? 'OPEN' : 'CLOSED'}`,
          {
            fontSize: '10px',
            color: entity.isOpen ? '#4ae290' : '#e24a4a',
            fontFamily: 'Courier New'
          }
        );
        this.debugTexts.push(doorStateText);
        yPos += lineHeight;
      }
    }

    // Add debug texts to panel
    this.debugTexts.forEach(text => this.debugPanel.add(text));
  }

  private toggleDebug(): void {
    this.showDebug = !this.showDebug;
    this.debugPanel.setVisible(this.showDebug);
    if (this.showDebug) {
      this.updateDebugDisplay();
    }
  }

  private toggleHints(): void {
    this.hintsShown = !this.hintsShown;
    if (this.hintsShown) {
      const { width, height } = this.cameras.main;

      // Create hints panel
      const hintContainer = this.add.container(0, 0);

      // Background overlay
      const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.5);
      overlay.setOrigin(0, 0);

      // Hint text
      const hintText = this.add.text(width / 2, height / 2, 'Solve the puzzle by activating pressure plates with the player.\nUse levers to control doors.\nStep on the exit gate to complete the level.', {
        fontSize: '20px',
        color: '#ffffff',
        fontFamily: 'Courier New',
        align: 'center'
      }).setOrigin(0.5);

      hintContainer.add([overlay, hintText]);

      // Wait for key press to close
      const closeHints = () => {
        this.input.keyboard!.off('keydown', closeHints);
        hintContainer.destroy();
        this.hintsShown = false;
      };

      this.input.keyboard!.on('keydown', closeHints);
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

  private onGameWon(): void {
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

  private onGameStateUpdate(): void {
    if (this.showDebug) {
      this.updateDebugDisplay();
    }
  }
}
