import { LevelData } from './types';

// Dynamically import all level files
const levelModules = {
  level1: () => import('../levels/level1.json'),
  level2: () => import('../levels/level2.json'),
  level3: () => import('../levels/level3.json')
};

export class LevelLoader {
  private static loadedLevels: Map<string, LevelData> = new Map();

  static async loadLevel(levelId: string): Promise<LevelData> {
    // Return cached level if already loaded
    if (this.loadedLevels.has(levelId)) {
      return this.loadedLevels.get(levelId)!;
    }

    // Load from modules
    const moduleLoader = levelModules[levelId as keyof typeof levelModules];
    if (!moduleLoader) {
      throw new Error(`Level "${levelId}" not found`);
    }

    const module = await moduleLoader();
    const levelData = module.default as LevelData;

    // Validate level data
    this.validateLevel(levelData);

    // Cache the level
    this.loadedLevels.set(levelId, levelData);
    return levelData;
  }

  static getAllLevelIds(): string[] {
    return Object.keys(levelModules);
  }

  private static validateLevel(level: LevelData): void {
    if (!level.id || !level.name) {
      throw new Error('Level must have id and name');
    }
    if (!level.width || !level.height) {
      throw new Error('Level must have width and height');
    }
    if (!level.tilemap || level.tilemap.length !== level.height) {
      throw new Error(`Tilemap must have ${level.height} rows`);
    }
    if (!level.playerStart || !level.exitPos) {
      throw new Error('Level must have playerStart and exitPos');
    }

    // Validate tilemap dimensions
    for (const row of level.tilemap) {
      if (row.length !== level.width) {
        throw new Error(`Each tilemap row must be ${level.width} characters wide`);
      }
    }
  }
}
