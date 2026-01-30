import Phaser from 'phaser';
import { WorldEntity } from './WorldEntity';
import { GameConfig } from '../config';

export class ExitGate extends WorldEntity {
  isOpen: boolean = false;

  constructor(
    id: string,
    gridX: number,
    gridY: number,
    sprite: Phaser.GameObjects.Graphics
  ) {
    super(id, gridX, gridY, sprite);
    this.blocksMovement = false;
    this.updateVisuals();
  }

  open(): void {
    if (!this.isOpen) {
      this.isOpen = true;
      this.updateVisuals();
    }
  }

  private updateVisuals(): void {
    const graphics = this.sprite as Phaser.GameObjects.Graphics;
    graphics.clear();

    graphics.fillStyle(GameConfig.colors.exit, this.isOpen ? 1 : 0.3);
    graphics.fillRect(-8, -8, 16, 16);
    graphics.lineStyle(3, GameConfig.colors.exit, 1);
    graphics.strokeRect(-8, -8, 16, 16);

    if (this.isOpen) {
      // Draw opening indicator (star)
      const cx = 0;
      const cy = 0;
      const r = 8;
      graphics.lineStyle(2, GameConfig.colors.exit, 1);
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        graphics.lineBetween(
          cx + Math.cos(angle) * r,
          cy + Math.sin(angle) * r,
          cx + Math.cos(angle + Math.PI / 2) * r,
          cy + Math.sin(angle + Math.PI / 2) * r
        );
      }
    }
  }

  update(): void {
    // Exit gates don't need per-frame updates
  }
}
