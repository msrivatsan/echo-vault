import Phaser from 'phaser';
import { WorldEntity } from './WorldEntity';
import { GameConfig } from '../config';

export class PressurePlate extends WorldEntity {
  isPressed: boolean = false;

  constructor(
    id: string,
    gridX: number,
    gridY: number,
    sprite: Phaser.GameObjects.Graphics
  ) {
    super(id, gridX, gridY, sprite);
    this.blocksMovement = false;
  }

  activate(): void {
    if (!this.isPressed) {
      this.isPressed = true;
      this.updateVisuals();
    }
  }

  deactivate(): void {
    if (this.isPressed) {
      this.isPressed = false;
      this.updateVisuals();
    }
  }

  private updateVisuals(): void {
    const graphics = this.sprite as Phaser.GameObjects.Graphics;
    graphics.clear();
    graphics.fillStyle(GameConfig.colors.plate, this.isPressed ? 0.8 : 0.4);
    graphics.fillRect(-8, -8, 16, 16);
    graphics.lineStyle(2, GameConfig.colors.plate, 1);
    graphics.strokeRect(-8, -8, 16, 16);
  }

  update(): void {
    // Plates don't need per-frame updates
  }
}
