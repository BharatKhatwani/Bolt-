# 🔥 Bolt Clone — AI-Powered Web Builder

> An AI-powered full-stack web development assistant that converts natural language prompts into fully functional, live-previewed web applications — running entirely in the browser.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Environment Setup](#4-environment-setup)
5. [Development Workflow](#5-development-workflow)
6. [Application Workflow](#6-application-workflow)
7. [API Reference](#7-api-reference)
8. [Key Modules Explained](#8-key-modules-explained)
9. [Deployment](#9-deployment)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Project Overview

Bolt Clone is a monorepo project consisting of:

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React + TypeScript (Vite) | UI, WebContainer, live preview |
| **Backend** | Node.js + Express + TypeScript | REST API, Gemini AI integration |
| **AI Model** | Google Gemini 2.5 Flash | Code generation |
| **Browser Runtime** | WebContainer API | In-browser Node.js execution |

**How it works in one sentence:** User types a prompt → Gemini AI generates structured XML code → frontend parses it into files → WebContainer runs the project live in the browser.

---

## 2. Tech Stack

### Backend
- `express` — HTTP server
- `@google/genai` — Google Gemini AI SDK
- `cors` — Cross-origin requests
- `dotenv` — Environment variable management
- `typescript` — Type safety

### Frontend
- `react` + `react-dom` — UI framework
- `react-router-dom` — Client-side routing
- `axios` — HTTP client
- `@webcontainer/api` — In-browser Node.js runtime
- `jszip` — ZIP file generation for download
- `lucide-react` — Icon library
- `tailwindcss` — Utility-first styling
- `crypto-js` — File hashing for change detection

---

## 3. Project Structure

```
Bolt-/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Express app entry point
│   │   ├── prompt.ts             # System prompt for Gemini AI
│   │   ├── constants.ts          # Shared constants (WORK_DIR, etc.)
│   │   ├── stripindents.ts       # Template literal utility
│   │   ├── routes/
│   │   │   ├── chat.ts           # POST /chat — AI code generation
│   │   │   └── template.ts       # POST /template — project scaffolding
│   │   ├── servers/
│   │   │   └── ai.ts             # Google Gemini API wrapper
│   │   ├── defaults/             # Default project templates
│   │   └── types/
│   │       └── index.ts          # Backend type definitions
│   ├── .env                      # Environment variables (not committed)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx              # React app entry point
│   │   ├── App.tsx               # Router setup (/ and /builder routes)
│   │   ├── steps.ts              # XML parser → Step[]
│   │   ├── config.ts             # VITE_BACKEND_URL config
│   │   ├── Page/
│   │   │   ├── Home.tsx          # Landing page with prompt input
│   │   │   └── Builder.tsx       # Main builder workspace
│   │   ├── components/
│   │   │   ├── StepsList.tsx     # Build steps progress tracker
│   │   │   ├── FileExplorer.tsx  # Virtual file tree browser
│   │   │   ├── CodeEditor.tsx    # Syntax-highlighted code viewer
│   │   │   ├── PreviewFrame.tsx  # Live preview (WebContainer iframe)
│   │   │   ├── TabView.tsx       # Code / Preview tab switcher
│   │   │   ├── Navbar.tsx        # Top navigation
│   │   │   ├── feature.tsx       # Features section (Home)
│   │   │   ├── work.tsx          # How it works section (Home)
│   │   │   ├── Accordian.tsx     # FAQ section (Home)
│   │   │   └── fotter.tsx        # Footer (Home)
│   │   ├── hook/
│   │   │   └── useWebContainer.tsx  # Custom hook — boots WebContainer
│   │   ├── types/
│   │   │   └── index.ts          # Step, FileItem, Project interfaces
│   │   └── lib/
│   │       └── utils.ts          # Shared utility functions
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
└── PROJECT_DOCS.md               # This file
```

---

## 4. Environment Setup

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | v18+ (v22 recommended) |
| npm | v9+ |
| Google Gemini API Key | [Get one here](https://aistudio.google.com/app/apikey) |

### Backend `.env`

Create `backend/.env`:

```env
GOOGLE_GEMINI_KEY=your_gemini_api_key_here
PORT=3002
```

### Frontend `.env`

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3002
```

> For production, set `VITE_BACKEND_URL` to your deployed backend URL (e.g., Railway).

---

## 5. Development Workflow

### First-Time Setup

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run start
# ✅ Server running on port 3002
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# ✅ VITE ready at http://localhost:3003
```

### Build for Production

```bash
# Backend
cd backend
npm run build    # Compiles TypeScript → dist/

# Frontend
cd frontend
npm run build    # Bundles React → dist/
```

---

## 6. Application Workflow

### End-to-End User Journey

```
1. USER visits http://localhost:3003
         │
         ▼
2. HOME PAGE — types a prompt e.g.:
   "Build a to-do list app with React"
         │
         ▼
3. Frontend → POST /template { prompt }
   Backend returns: { prompts[], uiPrompts[] }
   → Initial steps appear immediately in UI
         │
         ▼
4. Frontend → POST /chat { messages: [...prompts, userPrompt] }
   Backend prepends System Prompt → calls Gemini AI
   Gemini returns: XML with <boltArtifact> containing all files
         │
         ▼
5. Frontend: parseXml(response) → Step[]
   Steps processed → FileItem[] tree built
         │
         ▼
6. WebContainer.mount(fileTree)
   → npm install (cached by package.json hash)
   → npm run dev (Vite starts inside browser)
         │
         ▼
7. WebContainer emits "server-ready" event → URL available
   Preview iframe.src = url
   → USER sees running app live in browser!
         │
         ▼
8. USER can:
   ├── Browse files in File Explorer
   ├── View code in Code Editor
   ├── Send follow-up prompts (multi-turn chat maintained)
   └── Download project as ZIP
```

### Follow-Up Prompt Workflow

```
User types follow-up → appended to llmMessages history
       │
       ▼
POST /chat { messages: [...history, newMessage] }
       │
       ▼
Gemini receives full context → returns updated/new files
       │
       ▼
New Steps parsed → Files updated in FileItem tree
       │
       ▼
Changed files written to WebContainer incrementally
Dev server restarts → Preview auto-updates
```

---

## 7. API Reference

### `POST /template`

Determines project type from prompt and returns scaffold data.

**Request:**
```json
{
  "prompt": "Build a to-do list app with React"
}
```

**Response:**
```json
{
  "prompts": ["...base context prompts..."],
  "uiPrompts": ["<boltArtifact>...initial file steps...</boltArtifact>"]
}
```

---

### `POST /chat`

Sends conversation history to Gemini AI and returns generated code.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "...context prompt..." },
    { "role": "user", "content": "Build a to-do list app with React" }
  ]
}
```

**Response:**
```json
{
  "response": "<boltArtifact id='todo-app' title='To-Do List App'>...</boltArtifact>"
}
```

**Error Responses:**

| Status | Meaning |
|---|---|
| `400` | Messages array is empty or missing |
| `500` | Gemini API call failed |

---

## 8. Key Modules Explained

### `prompt.ts` — The Brain

The system prompt is the most critical piece of the project. It instructs the AI to:
- Act as "Bolt", a senior software developer
- Format all responses as `<boltArtifact>` XML
- Always output complete, production-ready code
- Respect WebContainer constraints (no native binaries, prefer Vite)

### `steps.ts` — XML Parser

Converts AI XML output into typed `Step[]`:
```
<boltAction type="file" filePath="src/App.tsx"> → CreateFile step
<boltAction type="shell">npm install</boltAction> → RunScript step
```

### `useWebContainer.tsx` — Browser Node.js

Boots a full Node.js runtime inside the browser. Only one instance is ever created per session (singleton pattern via React state).

### `PreviewFrame.tsx` — Live Preview Engine

Manages the complete preview lifecycle:
1. Hash `package.json` → skip `npm install` if unchanged
2. Spawn `npm run dev` → wait for `server-ready` event
3. Detect file changes via SHA-256 hash → write only changed files
4. Kill old dev process → restart Vite for hot reload

---

## 9. Deployment

### Backend — Railway

1. Push backend to GitHub
2. Create new Railway project → Deploy from GitHub
3. Set environment variables in Railway dashboard:
   - `GOOGLE_GEMINI_KEY`
   - `PORT` (Railway sets this automatically)
4. Railway auto-runs `npm run start` from `package.json`

### Frontend — Vercel

1. Push frontend to GitHub
2. Create new Vercel project → Import from GitHub
3. Set environment variable:
   - `VITE_BACKEND_URL` = `https://your-backend.railway.app`
4. Vercel auto-detects Vite and runs `npm run build`

---

## 10. Troubleshooting

### `lib.es2020.full.d.ts not found` (Backend)

TypeScript lib files corrupted. Fix:
```bash
cd backend
cmd /c "rd /s /q node_modules && npm install"
```

### `spawn UNKNOWN` / `Error: Cannot find module vite` (Frontend)

esbuild native binary corrupted (usually by OneDrive). Fix:
```bash
cd frontend
cmd /c "rd /s /q node_modules && npm install"
```

### OneDrive Interference (General)

If your project is in an OneDrive folder, OneDrive file locking will corrupt `node_modules`. Solutions:

**Option A — Move project out of OneDrive:**
```
C:\Projects\bolt_clone\   ← recommended
```

**Option B — Exclude node_modules from sync:**
Run in Admin PowerShell:
```powershell
attrib +P "frontend\node_modules" /S /D
attrib +P "backend\node_modules" /S /D
```
Then delete and reinstall `node_modules`.

### WebContainer doesn't start (COOP/COEP Headers)

WebContainer API requires these HTTP headers on your frontend server:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
Add to your `vite.config.ts`:
```ts
server: {
  headers: {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
  }
}
```

---

*Documentation generated for Bolt Clone — AI Web Builder Project*
