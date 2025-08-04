# TreeCast 🌳⚔️

A skill tree building combat game where you create custom skill trees and battle enemies using your unique builds.

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js)

### One-Command Setup & Run

```bash
npm run install-and-run
```

That's it! This single command will:
1. Install all dependencies
2. Build the project
3. Start the development server with hot reloading

The game will be available at: **http://localhost:3000**

## Alternative Commands

If you prefer to run steps separately:

```bash
# Install dependencies
npm install

# Build and start development server
npm run dev

# Or build once and start production server
npm run setup
```

## How to Play

1. **Build Your Tree**: Click on available nodes (cyan/teal circles) to add them to your skill tree
2. **Choose Support Nodes**: Support nodes (cyan) can have multiple children and help structure your tree
3. **Add Skill Nodes**: Skill nodes (red) are the actual abilities you'll use in combat
4. **Complete Your Tree**: Fill all support node slots with either more support nodes or skill nodes
5. **Enter Combat**: Once your tree is complete, click "Start Combat" to battle enemies

## Game Features

- **Dynamic Skill Trees**: Build unique tree structures with branching paths
- **Multiple Skill Types**: Fire, Cold, Lightning, Physical, and Arcane damage skills
- **Support Nodes**: Create complex builds with nodes that modify and enhance your skills
- **Real-time Combat**: Battle enemies using your custom skill combinations
- **Visual Tree Builder**: Interactive SVG-based tree visualization

## Development

- **Language**: TypeScript
- **Frontend**: React with custom SVG rendering
- **Backend**: Express.js server
- **Build System**: Webpack + TypeScript compiler
- **Hot Reload**: Automatic recompilation on file changes

## Project Structure

```
TreeCast/
├── src/
│   ├── SkillTreeBuilder.tsx    # Main tree building interface
│   ├── SkillTree.ts           # Core tree data structures
│   ├── NodeData.ts            # Available skills and support nodes
│   ├── Combat.ts              # Combat system logic
│   ├── Character.ts           # Player character logic
│   ├── Enemy.ts               # Enemy AI and behavior
│   └── WebServer.ts           # Express server setup
├── public/
│   ├── index.html             # Main HTML page
│   └── bundle.js              # Compiled JavaScript (auto-generated)
└── package.json               # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test locally: `npm run dev`
5. Commit and push: `git commit -m "Add feature" && git push`
6. Open a Pull Request

## Troubleshooting

**Port 3000 already in use?**
```bash
# Kill any process using port 3000
npx kill-port 3000
npm run dev
```

**Dependencies not installing?**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Build errors?**
```bash
# Clean build and restart
rm -rf out public/bundle.js
npm run dev
```

---

**Have fun building your skill trees and conquering enemies! 🎮**
