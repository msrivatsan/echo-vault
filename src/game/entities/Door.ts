import Phaser from 'phaser';
import { WorldEntity } from './WorldEntity';
import { GameConfig } from '../config';

export class Door extends WorldEntity {
  isOpen: boolean = false;
  triggeredBy: string[] = []; // IDs of entities that can trigger this door

  constructor(
    id: string,
    gridX: number,
    gridY: number,
    sprite: Phaser.GameObjects.Graphics,
    triggeredBy: string[] = [],
    startState: 'open' | 'closed' = 'closed'
  ) {
    super(id, gridX, gridY, sprite);
    this.triggeredBy = triggeredBy;
    this.isOpen = startState === 'open';
    this.blocksMovement = !this.isOpen;
    this.updateVisuals();
  }

  setOpen(open: boolean): void {
    if (this.isOpen !== open) {
      this.isOpen = open;
      this.blocksMovement = !open;
      this.updateVisuals();
    }
  }

  private updateVisuals(): void {
    const graphics = this.sprite as Phaser.GameObjects.Graphics;
    graphics.clear();

    if (this.isOpen) {
      // Draw open door (frame)
      graphics.lineStyle(2, GameConfig.colors.door, 0.5);
      graphics.strokeRect(-8, -8, 16, 16);
    } else {
      // Draw closed door (solid)
      graphics.fillStyle(GameConfig.colors.door, 1);
      graphics.fillRect(-8, -8, 16, 16);
      graphics.lineStyle(2, GameConfig.colors.secondary, 1);
      graphics.strokeRect(-8, -8, 16, 16);
    }
  }

  update(): void {
    // Doors don't need per-frame updates
  }
}
