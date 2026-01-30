import Phaser from 'phaser';
import { GameSettings } from './game/config';
import { BootScene } from './game/scenes/BootScene';
import { TitleScene } from './game/scenes/TitleScene';
import { LevelSelectScene } from './game/scenes/LevelSelectScene';
import { GameScene } from './game/scenes/GameScene';
import { UIScene } from './game/scenes/UIScene';

const config: Phaser.Types.Core.GameConfig = {
  ...GameSettings,
  scene: [
    BootScene,
    TitleScene,
    LevelSelectScene,
    GameScene,
    UIScene
  ]
};

const game = new Phaser.Game(config);

// Export for debugging
(window as any).game = game;
