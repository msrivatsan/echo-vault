// Level and entity types for the Echo Vault world engine

export interface LevelData {
  id: string;
  name: string;
  width: number;
  height: number;
  tilemap: string[]; // Array of rows, each row is a string of tile characters
  playerStart: { x: number; y: number };
  exitPos: { x: number; y: number };
  entities: EntityPlacement[];
}

export type TileType = '.' | '#' | 'E' | 'P' | 'L' | 'D'; // floor, wall, exit, plate, lever, door

export interface EntityPlacement {
  type: 'pressure-plate' | 'door' | 'lever' | 'exit-gate';
  x: number;
  y: number;
  id: string;
  data?: {
    triggeredBy?: string[]; // IDs of triggers that control this door
    startState?: 'open' | 'closed'; // For doors and levers
    hint?: string;
  };
}

export interface EntityState {
  id: string;
  type: 'pressure-plate' | 'door' | 'lever' | 'exit-gate';
  position: { x: number; y: number };
  active: boolean; // pressure plate is occupied, lever is on, door is open
}

export interface GameState {
  currentLevelId: string;
  playerPos: { x: number; y: number };
  entityStates: Map<string, EntityState>;
  isMoving: boolean;
  isGameOver: boolean;
  isGameWon: boolean;
  activeTriggers: Set<string>;
}

export interface WorldEntity {
  id: string;
  type: 'player' | 'pressure-plate' | 'door' | 'lever' | 'exit-gate';
  gridX: number;
  gridY: number;
  sprite: Phaser.Physics.Arcade.Sprite | Phaser.GameObjects.Graphics;
  isActive: boolean;
  blocksMovement: boolean;
}
