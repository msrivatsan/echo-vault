# Echo Vault

A browser-based puzzle game built with Phaser 3, TypeScript, and Vite.

## Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation & Running

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The game will automatically open in your default browser at `http://localhost:3000`

## How to Play

### Controls
- **Arrow Keys** or **WASD**: Move the player
- **ENTER**: Select menu options
- **ESC**: Pause game / Go back
- **R**: Reset current level

### Game Flow
1. **Title Screen**: Navigate between "Start Game" and "Level Select"
2. **Level Select**: Choose from available levels using arrow keys
3. **Gameplay**: Move your character (golden square) through the level
4. **Pause Menu**: Press ESC to pause and access options
5. **Win**: Reach the goal (green star) to complete the level

## Project Structure

```
echo-vault/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite bundler configuration
└── src/
    ├── main.ts             # Game bootstrap
    └── game/
        ├── config.ts       # Game configuration and constants
        └── scenes/
            ├── BootScene.ts        # Asset generation
            ├── TitleScene.ts       # Title screen
            ├── LevelSelectScene.ts # Level selection
            ├── GameScene.ts        # Main gameplay
            └── UIScene.ts          # UI overlays and pause menu
```

## Architecture

### Scenes
- **BootScene**: Generates all procedural graphics (player, walls, floors, UI elements)
- **TitleScene**: Main menu with keyboard navigation
- **LevelSelectScene**: Grid-based level selector
- **GameScene**: Core gameplay with player movement and collision detection
- **UIScene**: Manages pause menu and overlays

### Asset Generation
All graphics are generated procedurally using Phaser's Graphics API:
- **Player**: Golden square with border
- **Walls**: Dark blue bricks with pattern
- **Floor**: Light blue tiles with grid
- **Goal**: Green star
- **UI Elements**: Buttons and panels with rounded corners

### Game Configuration
Key settings are defined in `src/game/config.ts`:
- Canvas size: 800x600
- Tile size: 32x32 pixels
- Player speed: 160 pixels/second
- Color palette for consistent theming

## Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Features Implemented

✅ Vite + TypeScript + Phaser 3 setup
✅ Fully keyboard-controlled
✅ Title screen with navigation
✅ Level select screen
✅ Pause menu system
✅ Player movement with collision
✅ Level reset functionality
✅ Procedurally generated assets
✅ Clean scene architecture
✅ Test room with player movement

## Next Steps (Not Yet Implemented)

The following features are ready for implementation:

- **Puzzle Mechanics**: Define the core puzzle gameplay loop
- **Level Definitions**: Create JSON-based level data files
- **Game Systems**: Implement puzzle-specific components and systems
- **Multiple Levels**: Add varied puzzle challenges
- **Win Condition**: Complete goal detection and level progression
- **Sound Effects**: Add audio feedback (currently has placeholder calls)

## Technical Details

- **Framework**: Phaser 3.80.1
- **Language**: TypeScript 5.3.3
- **Build Tool**: Vite 5.0.11
- **Physics**: Arcade Physics (no gravity)
- **Rendering**: WebGL/Canvas (AUTO mode)

## License

MIT
