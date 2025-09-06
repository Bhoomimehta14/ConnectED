# WebStorm Setup Guide for Canteen Queue System

## Getting Started with WebStorm

### 1. Opening Your Project
1. Open WebStorm
2. Click **File → Open**
3. Navigate to `C:\Users\bhoom\Desktop\hackathon`
4. Click **OK**

### 2. WebStorm Interface Overview

#### Key Areas:
- **Project Panel (Left)**: Shows all your files and folders
- **Editor (Center)**: Where you write code
- **Terminal (Bottom)**: Run commands here
- **Run/Debug (Top Right)**: Green play button to run your app
- **Version Control (Bottom)**: Git integration

### 3. Essential Shortcuts You'll Use

```
Ctrl + Shift + F10  → Run current file
Ctrl + S           → Save file
Ctrl + /           → Comment/uncomment line
Ctrl + Space       → Auto-complete suggestions
Ctrl + Click       → Go to definition
Alt + Enter        → Quick fix suggestions
Shift + F6         → Rename variable everywhere
Ctrl + Alt + L     → Format code
```

### 4. Setting Up Terminal

1. Click **Terminal** tab at bottom (or Alt + F12)
2. This opens command prompt in your project folder
3. You'll run npm commands here

## Project Structure We'll Create

```
hackathon/
├── backend/                 # Server code
│   ├── server.js           # Main server file
│   ├── routes/             # API endpoints
│   │   ├── queue.js        # Queue management APIs
│   │   └── orders.js       # Order APIs
│   ├── models/             # Database models
│   ├── controllers/        # Business logic
│   └── config/             # Configuration files
│
├── frontend/               # React app
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── components/    # UI components
│   │   └── services/      # API calls
│   └── public/
│
└── docs/                   # Your documentation
    ├── smart_queue_system.md
    └── canteen_rush_management_system.md
```

## Quick Start Commands

### In WebStorm Terminal:

```bash
# 1. Initialize the backend
cd backend
npm init -y
npm install express cors socket.io

# 2. Create React frontend (in new terminal tab)
npx create-react-app frontend
cd frontend
npm install axios socket.io-client

# 3. Run backend server
cd backend
node server.js

# 4. Run React app (in another terminal)
cd frontend
npm start
```

## WebStorm Features to Use

### 1. **Live Templates** (Code Snippets)
- Type `rfc` + Tab → Creates React functional component
- Type `exp` + Tab → Creates Express route
- Settings → Editor → Live Templates to see all

### 2. **Built-in HTTP Client**
- Create `.http` files to test your APIs
- Click green arrow to send requests
- No need for Postman!

### 3. **Database Tools**
- View → Tool Windows → Database
- Connect to your database
- Run queries directly in WebStorm

### 4. **NPM Scripts Panel**
- Right sidebar → npm
- Double-click scripts to run them
- No need to type commands

### 5. **Debugging**
- Click line numbers to set breakpoints
- Right-click file → Debug
- Step through code line by line

## Your First Task in WebStorm

1. **Create Backend Server**:
   - Right-click `backend` folder
   - New → JavaScript File
   - Name it `server.js`
   - WebStorm will help with auto-complete

2. **Install Dependencies**:
   - Open Terminal (Alt + F12)
   - Type commands
   - WebStorm shows package.json updates

3. **Run Your Code**:
   - Open `server.js`
   - Click green arrow in editor
   - Or use Terminal: `node server.js`

4. **Create React Components**:
   - Navigate to `frontend/src`
   - Right-click → New → JavaScript File
   - WebStorm provides React snippets

## Common WebStorm Settings to Enable

1. **File → Settings** (Ctrl + Alt + S)
2. **Enable these**:
   - Editor → Code Style → JavaScript → Use semicolons
   - Languages → JavaScript → Set to React JSX
   - Tools → Actions on Save → Format code
   - Version Control → Git → Enable Git integration

## Tips for Beginners

1. **Red underlines** = Errors (hover to see why)
2. **Yellow highlights** = Warnings (can be ignored)
3. **Light bulb icon** = Quick fixes available (Alt + Enter)
4. **Grey text** = Unused code
5. **Ctrl + Click** anything to see where it's defined
6. **Right-click** anything for options

## Getting Help in WebStorm

- **F1** on any element → Documentation
- **Help → Find Action** (Ctrl + Shift + A) → Search any feature
- **Help → Tip of the Day** → Learn new features
- **Bottom right corner** → Shows current file type/encoding

Ready to start coding! Create the server.js file first, and WebStorm will guide you with suggestions.