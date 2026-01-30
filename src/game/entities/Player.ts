import Phaser from 'phaser';
import { WorldEntity } from './WorldEntity';
import { GameConfig } from '../config';

export class Player extends WorldEntity {
  isMoving: boolean = false;
  private tween: Phaser.Tweens.Tween | null = null;

  constructor(
    id: string,
    gridX: number,
    gridY: number,
    sprite: Phaser.Physics.Arcade.Sprite
  ) {
    super(id, gridX, gridY, sprite);
    this.blocksMovement = true;
    this.setGridPosition(gridX, gridY);
  }

  setGridPosition(gridX: number, gridY: number): void {
    this.gridX = gridX;
    this.gridY = gridY;
    const pixelX = gridX * GameConfig.tileSize * GameConfig.tileScale;
    const pixelY = gridY * GameConfig.tileSize * GameConfig.tileScale;
    this.sprite.setPosition(pixelX, pixelY);
  }

  moveToGrid(gridX: number, gridY: number, scene: Phaser.Scene): Promise<void> {
    return new Promise((resolve) => {
      if (this.tween) {
        this.tween.stop();
      }

      this.isMoving = true;
      this.gridX = gridX;
      this.gridY = gridY;

      const endX = gridX * GameConfig.tileSize * GameConfig.tileScale;
      const endY = gridY * GameConfig.tileSize * GameConfig.tileScale;

      this.tween = scene.tweens.add({
        targets: this.sprite,
        x: endX,
        y: endY,
        duration: GameConfig.tweenDuration,
        ease: 'Linear',
        onComplete: () => {
          this.isMoving = false;
          this.tween = null;
          resolve();
        }
      });
    });
  }

  update(): void {
    // Player updates handled by movement system
  }

  destroy(): void {
    if (this.tween) {
      this.tween.stop();
    }
    super.destroy();
  }
}
