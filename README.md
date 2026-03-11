# Second Brain - Personal Voice Assistant Chrome Extension

A Chrome extension that captures, structures, and retrieves your knowledge through voice. Record conversations, meetings, and ideas, then use AI to organize them into searchable notes and interact with your personal knowledge base.

## Features

- **Voice Recording** - Record conversations with a single click, with two modes:
  - *Passive Listen* - Capture meetings, lectures, or any conversation around you
  - *Active Talk* - Speak directly to the AI assistant
- **Real-time Transcription** - Live speech-to-text using Web Speech API (free) or premium services (Deepgram, Whisper)
- **AI-Powered Structuring** - Automatically extracts key topics, action items, decisions, people, and ideas from your recordings
- **Knowledge Base Search** - Full-text and tag-based search across all your structured notes
- **Conversational AI Chat** - Ask questions about your captured knowledge ("What did I discuss with Sarah last week?")
- **Voice Output** - Text-to-speech responses using browser TTS or ElevenLabs
- **Privacy-First** - Local-only storage mode keeps everything on your device
- **Cloud Sync** - Optional backend server for cross-device access
- **Context Menu Capture** - Right-click any selected text to save it to your knowledge base
- **Side Panel** - Persistent knowledge browser in Chrome's side panel

## Quick Start (Extension Only - No Backend Required)

### 1. Install the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `extension/` folder from this repository

### 2. Generate Icons

1. Open `extension/icons/generate-icons.html` in Chrome
2. Right-click each canvas and save as the corresponding PNG file (icon16.png, icon32.png, etc.)
3. Reload the extension

### 3. Configure

1. Click the Second Brain icon in your Chrome toolbar
2. Click the gear icon to open Settings
3. Add your AI API key (Anthropic Claude or OpenAI)
4. Choose your transcription engine (Web Speech API works for free)
5. Set storage mode to "Local Only" (default)

### 4. Start Using

1. Click the microphone button to start recording
2. Speak or have a conversation
3. Click again to stop recording
4. Click "Save & Structure" to process with AI
5. View structured notes in the Notes tab
6. Ask questions in the Chat tab

## Architecture

```
extension/                 # Chrome Extension (Manifest V3)
  manifest.json            # Extension configuration
  popup/                   # Main popup UI
    popup.html             # Popup markup
    popup.js               # Popup controller
  sidepanel/               # Chrome side panel
    sidepanel.html
    sidepanel.js
  background/              # Service worker
    service-worker.js      # Background tasks, context menus
  content/                 # Content scripts
    content.js             # Floating recording indicator
  lib/                     # Shared modules
    storage.js             # Chrome storage abstraction
    audio.js               # Microphone capture & visualization
    transcription.js       # Speech-to-text (Web Speech, Deepgram, Whisper)
    ai-engine.js           # Note structuring & chat (Claude/OpenAI)
    tts.js                 # Text-to-speech output
  styles/                  # CSS
    popup.css
    sidepanel.css
    content.css
  icons/                   # Extension icons

server/                    # Backend API (optional, for cloud sync)
  src/
    index.js               # Express server entry point
    routes/
      auth.js              # User registration & login
      sessions.js          # Recording session CRUD
      notes.js             # Structured notes CRUD
      chat.js              # AI chat with knowledge context
      search.js            # Full-text & semantic search
    services/
      database.js          # PostgreSQL connection pool
    middleware/
      auth.js              # JWT authentication
  migrations/
    001_initial_schema.sql  # Database schema
    run.js                  # Migration runner
```

## Backend Setup (Optional - For Cloud Sync)

### Prerequisites

- Node.js 18+
- PostgreSQL 15+ (with pgvector extension for semantic search)

### Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and secrets

# Create database
createdb second_brain

# Run migrations
npm run migrate

# Start server
npm run dev
```

Then in the extension settings, set Storage Mode to "Cloud Sync" and enter your server URL (e.g., `http://localhost:3000`).

## Tech Stack

### Extension (Frontend)
- Chrome Extension Manifest V3
- Vanilla JavaScript (no framework dependency)
- Web Speech API / MediaRecorder API
- Chrome Storage API

### Backend
- Node.js + Express
- PostgreSQL with pgvector
- JWT authentication
- Full-text search with `tsvector`

### AI Services (configurable)
- **Structuring & Chat**: Anthropic Claude or OpenAI GPT-4
- **Transcription**: Web Speech API (free), Deepgram, or Whisper
- **Voice Output**: Browser SpeechSynthesis (free) or ElevenLabs

## Data Schema

Each note is structured with:

| Field | Description |
|-------|-------------|
| `title` | Auto-generated descriptive title |
| `summary` | 2-3 sentence overview |
| `keyTopics` | Main subjects discussed |
| `actionItems` | Specific to-dos extracted |
| `decisions` | Decisions that were made |
| `questions` | Unanswered questions |
| `people` | People mentioned |
| `ideas` | Interesting ideas captured |
| `tags` | Auto-generated categories |
| `sentiment` | positive / neutral / negative |
| `importance` | high / medium / low |
| `followUps` | Items needing follow-up |

## Privacy & Security

- **Local-only mode** keeps all data in Chrome's local storage, nothing leaves your device
- API keys are stored locally and never sent to our servers
- Cloud sync mode uses JWT authentication and encrypted connections
- Audio recordings are processed and discarded (not stored) unless you opt in

## License

MIT
