# 🚀 TreeCast - Quick Setup Guide

## For New Users (Clone & Run)

### Method 1: One Command (Recommended)
```bash
git clone https://github.com/OnGodBruno/TreeCast.git
cd TreeCast
npm run install-and-run
```

### Method 2: Double-Click (Windows)
1. Clone or download the repository
2. Double-click `start.bat`
3. Wait for setup to complete
4. Game opens automatically at http://localhost:3000

### Method 3: Shell Script (macOS/Linux)
```bash
git clone https://github.com/OnGodBruno/TreeCast.git
cd TreeCast
./start.sh
```

## What Happens During Setup

1. **Dependencies Install**: All required packages are downloaded (~50MB)
2. **TypeScript Compilation**: Source code is compiled to JavaScript
3. **Webpack Bundling**: Frontend code is bundled for the browser
4. **Server Start**: Development server starts with hot reloading
5. **Auto-Open**: Game is available at http://localhost:3000

## Requirements

- **Node.js 16+** (Download from [nodejs.org](https://nodejs.org/))
- **5 minutes** for initial setup
- **100MB** disk space for dependencies

## Troubleshooting

**"Node.js not found"**
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt

**"Port 3000 in use"**
```bash
npx kill-port 3000
npm run dev
```

**"Permission denied" (macOS/Linux)**
```bash
chmod +x start.sh
./start.sh
```

## Development Commands

```bash
npm run dev          # Start with hot reloading
npm run build        # Build once
npm start           # Start production server
npm install         # Install dependencies only
```

---

**Ready to build skill trees and battle enemies! 🌳⚔️**
