import Phaser from 'phaser';
import { WorldEntity } from './WorldEntity';
import { GameConfig } from '../config';

export class Lever extends WorldEntity {
  isActive: boolean = false;

  constructor(
    id: string,
    gridX: number,
    gridY: number,
    sprite: Phaser.GameObjects.Graphics,
    startState: 'open' | 'closed' = 'closed'
  ) {
    super(id, gridX, gridY, sprite);
    this.isActive = startState === 'open';
    this.blocksMovement = false;
    this.updateVisuals();
  }

  toggle(): void {
    this.isActive = !this.isActive;
    this.updateVisuals();
  }

  setState(active: boolean): void {
    if (this.isActive !== active) {
      this.isActive = active;
      this.updateVisuals();
    }
  }

  private updateVisuals(): void {
    const graphics = this.sprite as Phaser.GameObjects.Graphics;
    graphics.clear();

    graphics.fillStyle(GameConfig.colors.lever, 1);
    graphics.lineStyle(2, GameConfig.colors.lever, 1);

    if (this.isActive) {
      // Lever pointing up
      graphics.fillTriangle(0, -10, -6, 6, 6, 6);
      graphics.strokeTriangle(0, -10, -6, 6, 6, 6);
    } else {
      // Lever pointing down
      graphics.fillTriangle(0, 10, -6, -6, 6, -6);
      graphics.strokeTriangle(0, 10, -6, -6, 6, -6);
    }
  }

  update(): void {
    // Levers don't need per-frame updates
  }
}
