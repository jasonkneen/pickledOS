# System Status Visibility

## What You'll See Now

### 1. UI Status Indicator (Top-Right)
- **🟢 LEANN Active** = Semantic search working
- **🟠 Fallback Mode** = Tag-based linking only
- **Gray dot pulsing** = Checking status

### 2. Browser Console (F12)

#### Without LEANN (Current State):
```
🔴 LEANN UNAVAILABLE - Using mock tag-based linking
   To enable semantic search: cd backend/LEANN && uv tool install leann-core --with leann
⚙️  Fallback Mode: Linking by tags/categories (not semantic)
```

#### With LEANN (After Install):
```
🟢 LEANN ACTIVE - Using semantic embeddings for relationships
📤 Sending 50 memories to LEANN...
✅ Memories indexed in LEANN
🔍 Computing semantic relationships...
✅ Semantic relationships computed for 50 memories
```

### 3. Backend API Status
```bash
curl http://localhost:8000/
```

Response shows:
```json
{
  "service": "Memory API",
  "status": "running",
  "leann_available": false,   // ← Key indicator
  "total_memories": 0
}
```

**Note**: `total_memories: 0` is correct - backend stores embeddings, frontend stores memory metadata.

## Why Memories Show Without LEANN

The system has **two modes**:

### Mode 1: LEANN Active
1. Frontend generates memories
2. Sends to backend → `/bulk-add`
3. LEANN creates embeddings
4. Backend returns semantic similarity IDs
5. Graph shows **content-based relationships**

### Mode 2: Fallback (Current)
1. Frontend generates memories
2. Backend check fails (LEANN unavailable)
3. Frontend uses **local tag-based linking**
4. Graph shows **category-based relationships**
5. No backend storage needed

**Both modes display memories** - only the linking algorithm differs.

## Current State Explanation

```
Backend: running (total_memories: 0, leann_available: false)
Frontend: showing memories with fallback linking
UI: 🟠 Fallback Mode
Console: 🔴 LEANN UNAVAILABLE
```

This is **correct behavior**:
- ✅ Backend is alive (no crashes)
- ✅ Frontend works without backend
- ✅ Memories linked by tags (History, Science, Culinary)
- ✅ System gracefully degrades

## To Enable Full LEANN

1. **Install LEANN:**
   ```bash
   cd backend/LEANN
   uv tool install leann-core --with leann
   ```

2. **Restart backend:**
   ```bash
   pkill -f memory_api
   python3 backend/memory_api.py
   ```

3. **Check status:**
   ```bash
   curl http://localhost:8000/
   # Should show: "leann_available": true
   ```

4. **Reload frontend** - Status changes to:
   - UI: 🟢 LEANN Active
   - Console: 🟢 LEANN ACTIVE - Using semantic embeddings...
   - Backend: Stores embeddings for 50+ memories

## Status Check Commands

```bash
# Backend health
curl http://localhost:8000/ | jq .leann_available

# LEANN installed?
command -v leann && echo "✅ Installed" || echo "❌ Not installed"

# Backend running?
lsof -i :8000 && echo "✅ Running" || echo "❌ Not running"

# Frontend status (check browser console)
# Look for: 🟢 or 🔴 at the start of logs
```

## Files to Monitor

- **Backend logs**: `backend/api.log` (created by start-with-leann.sh)
- **Browser console**: DevTools → Console tab
- **UI indicator**: Top-right corner of app
