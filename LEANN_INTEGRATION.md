# LEANN Integration Guide

LEANN (Low-storage Embedding-based Approximate Nearest Neighbor) is now integrated to provide **semantic search** for memory relationships instead of mock linking.

## What Changed

### Before (Mock)
- `relatedIds` manually linked by tags/categories
- No real semantic understanding
- Simple category-based clustering

### After (LEANN)
- `relatedIds` computed via embeddings
- True semantic similarity
- Content-based relationships

## Architecture

```
┌─────────────┐      HTTP      ┌──────────────┐
│   Frontend  │ ←────────────→ │  FastAPI     │
│  (Browser)  │   /search      │  Backend     │
│             │   /bulk-add    │              │
└─────────────┘                └──────┬───────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │    LEANN     │
                               │   (Python)   │
                               └──────────────┘
```

## Setup Instructions

### 1. Install LEANN

```bash
cd backend/LEANN
uv tool install leann-core --with leann
```

### 2. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Start Backend Service

```bash
cd backend
python memory_api.py
```

Server runs at: **http://localhost:8000**

### 4. Configure Frontend

Create `.env.local`:
```bash
VITE_MEMORY_API_URL=http://localhost:8000
```

### 5. Run Frontend

```bash
npm run dev
```

## How It Works

### Memory Addition Flow

1. User connects a knowledge source (e.g., "Space Facts")
2. Frontend calls `generateMemoriesWithEmbeddings()`
3. Memories batched and sent to backend via `/memory/bulk-add`
4. LEANN creates embeddings using `sentence-transformers/all-MiniLM-L6-v2`
5. Graph index built and stored in `memories.leann`

### Search Flow

1. User selects a memory to view
2. Frontend calls `/memory/search` with memory ID
3. LEANN searches semantic graph for similar memories
4. Returns top-k related memory IDs with similarity scores
5. `relatedIds` populated and visualized in BubbleGraph

## API Endpoints

### POST /memory/add
Add single memory to index
```json
{
  "id": "mem1",
  "text": "Machine learning uses neural networks",
  "title": "ML Basics",
  "tags": ["tech"]
}
```

### POST /memory/bulk-add
Add multiple memories (recommended)
```json
{
  "memories": [
    {"id": "mem1", "text": "...", "title": "..."},
    {"id": "mem2", "text": "...", "title": "..."}
  ]
}
```

### POST /memory/search
Find similar memories
```json
{
  "memory_id": "mem1",
  "k": 5
}
```

Response:
```json
{
  "related_ids": ["mem2", "mem5", "mem3"],
  "scores": [0.85, 0.72, 0.68]
}
```

### GET /memory/list
List all memory IDs

### DELETE /memory/clear
Clear all memories from index

## Fallback Mode

If LEANN service is unavailable, the system **automatically falls back** to mock linking:

```typescript
try {
  const memories = await generateMemoriesWithEmbeddings('space')
} catch (err) {
  console.warn('LEANN unavailable, using fallback')
  const memories = generateMemories('space') // Mock linking
}
```

## Performance

### Storage Efficiency
- **Traditional vector DB**: 60M chunks = 201GB
- **LEANN**: 60M chunks = 6GB (97% reduction)

### Current Dataset
- 50 memories per source
- ~200 words per memory
- Embedding model: `all-MiniLM-L6-v2` (384 dimensions)
- Index size: ~50KB (with 150 memories)

## Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Need 3.9+

# Reinstall dependencies
pip install -r backend/requirements.txt
```

### "LEANN service unavailable"
```bash
# Verify backend is running
curl http://localhost:8000/

# Check logs
cd backend && python memory_api.py
```

### CORS errors
Backend already configured for:
- http://localhost:5173 (Vite default)
- http://localhost:3000

Add more in `backend/memory_api.py`:
```python
allow_origins=["http://localhost:5173", "YOUR_URL_HERE"]
```

## Development

### Testing the Integration

```bash
# 1. Start backend
cd backend && python memory_api.py

# 2. Test health check
curl http://localhost:8000/

# 3. Add test memory
curl -X POST http://localhost:8000/memory/add \
  -H "Content-Type: application/json" \
  -d '{"id":"test1","text":"Neural networks process data in layers"}'

# 4. Search
curl -X POST http://localhost:8000/memory/search \
  -H "Content-Type: application/json" \
  -d '{"memory_id":"test1","k":5}'
```

### Monitoring

Check browser console for:
- `✅ LEANN service available` = Working
- `⚠️ LEANN service unavailable, using fallback` = Backend offline

## Next Steps

1. **GPU Acceleration**: Use LEANN with GPU for faster embedding
2. **Persistent Storage**: Save index between sessions
3. **Dynamic Updates**: Update index without full rebuild
4. **Custom Models**: Use domain-specific embedding models
5. **Multi-Index**: Separate indexes per knowledge source

## References

- LEANN GitHub: https://github.com/yichuan-w/LEANN
- Paper: https://arxiv.org/abs/2506.08276
- Backend API: `backend/memory_api.py`
- Frontend Service: `services/memory-service.ts`
- Integration Helper: `services/semantic-linking.ts`
