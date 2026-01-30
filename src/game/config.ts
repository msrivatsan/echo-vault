import Phaser from 'phaser';

export const GameConfig = {
  width: 800,
  height: 600,
  tileSize: 16,
  tileScale: 4,
  playerSpeed: 160,
  tweenDuration: 150, // ms per tile movement
  colors: {
    primary: 0x4a90e2,
    secondary: 0xe24a4a,
    success: 0x4ae290,
    background: 0x1a1a2e,
    wall: 0x16213e,
    floor: 0x0f3460,
    player: 0xffd700,
    plate: 0x9d4edd,
    lever: 0xffb703,
    door: 0xfb5607,
    exit: 0x06ffa5,
    text: 0xffffff
  }
};

export const SceneKeys = {
  Boot: 'BootScene',
  Title: 'TitleScene',
  LevelSelect: 'LevelSelectScene',
  Game: 'GameScene',
  UI: 'UIScene'
};

export const GameSettings: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameConfig.width,
  height: GameConfig.height,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
