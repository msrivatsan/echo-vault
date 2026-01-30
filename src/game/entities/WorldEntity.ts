import Phaser from 'phaser';

export abstract class WorldEntity {
  id: string;
  gridX: number;
  gridY: number;
  sprite: Phaser.Physics.Arcade.Sprite | Phaser.GameObjects.Graphics;
  isActive: boolean = true;
  blocksMovement: boolean = false;

  constructor(
    id: string,
    gridX: number,
    gridY: number,
    sprite: Phaser.Physics.Arcade.Sprite | Phaser.GameObjects.Graphics
  ) {
    this.id = id;
    this.gridX = gridX;
    this.gridY = gridY;
    this.sprite = sprite;
  }

  abstract update(): void;

  destroy(): void {
    this.sprite.destroy();
  }
}
