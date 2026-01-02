# Quick Start Guide

## Prerequisites Check

Run this to see what you need:
```bash
./start-with-leann.sh
```

## First-Time Setup

### 1. Install Python Dependencies
```bash
pip3 install -r backend/requirements.txt
```

### 2. Install LEANN (Optional but Recommended)
```bash
cd backend/LEANN
uv tool install leann-core --with leann
cd ../..
```

**Note:** Without LEANN, the system works in fallback mode (mock linking).

### 3. Create Environment File
```bash
cp .env.local.example .env.local
```

## Running the App

### Option A: All-in-One (Recommended)
```bash
./start-with-leann.sh
```

### Option B: Separate Processes

Terminal 1 (Backend):
```bash
cd backend
python3 memory_api.py
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Verify Installation

### Test Backend
```bash
curl http://localhost:8000/
```

Should return:
```json
{
  "service": "Memory API",
  "status": "running",
  "total_memories": 0
}
```

### Test LEANN Integration
```bash
cd backend
./test_api.sh
```

## Troubleshooting

### "python: command not found"
Use `python3` instead of `python` on macOS/Linux.

### "LEANN not installed"
The system works without LEANN using fallback mode. To get semantic search:
```bash
cd backend/LEANN
uv tool install leann-core --with leann
```

### "Module not found: fastapi"
Install backend dependencies:
```bash
pip3 install -r backend/requirements.txt
```

### Backend won't start
Check logs:
```bash
tail -f backend/api.log
```

### Port 8000 already in use
Kill existing process:
```bash
lsof -ti:8000 | xargs kill -9
```

## What You'll See

- **With LEANN**: Memories linked by semantic similarity
- **Without LEANN**: Memories linked by tags (fallback mode)
- **Console**: Check browser console for connection status

## Next Steps

1. **Connect a knowledge source** - Click the grid icon
2. **View relationships** - Click a memory bubble
3. **Chat with memories** - Click the + icon
4. **Adjust visuals** - Click settings icon

See `LEANN_INTEGRATION.md` for architecture details.

## System Status Indicators

### Browser Console
Open DevTools (F12) to see:

**With LEANN:**
```
🟢 LEANN ACTIVE - Using semantic embeddings for relationships
📤 Sending 50 memories to LEANN...
✅ Memories indexed in LEANN
🔍 Computing semantic relationships...
✅ Semantic relationships computed for 50 memories
```

**Without LEANN (Fallback):**
```
🔴 LEANN UNAVAILABLE - Using mock tag-based linking
   To enable semantic search: cd backend/LEANN && uv tool install leann-core --with leann
⚙️  Fallback Mode: Linking by tags/categories (not semantic)
```

### UI Indicator
Top-right corner shows:
- 🟢 **LEANN Active** - Semantic search enabled
- 🟠 **Fallback Mode** - Tag-based linking only

### Backend Status
```bash
curl http://localhost:8000/
```

Returns:
- `"leann_available": true` - Full features
- `"leann_available": false` - Fallback mode
