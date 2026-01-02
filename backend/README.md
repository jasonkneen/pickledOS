# Memory API Backend

FastAPI service providing semantic search for the memory visualization system using LEANN.

## Setup

1. Install LEANN globally:
```bash
cd LEANN
uv tool install leann-core --with leann
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the API server:
```bash
python3 memory_api.py
```

Server runs at: http://localhost:8000

## API Endpoints

- `POST /memory/add` - Add single memory
- `POST /memory/bulk-add` - Add multiple memories
- `POST /memory/search` - Find similar memories
- `GET /memory/list` - List all memory IDs
- `DELETE /memory/clear` - Clear all memories
- `GET /` - Server status

## Usage Example

```bash
# Add memories
curl -X POST http://localhost:8000/memory/bulk-add \
  -H "Content-Type: application/json" \
  -d '{
    "memories": [
      {"id": "mem1", "text": "Machine learning uses neural networks"},
      {"id": "mem2", "text": "Deep learning is a subset of ML"}
    ]
  }'

# Search for similar memories
curl -X POST http://localhost:8000/memory/search \
  -H "Content-Type: application/json" \
  -d '{"memory_id": "mem1", "k": 5}'
```
