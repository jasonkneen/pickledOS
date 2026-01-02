"""
Memory API - FastAPI wrapper for LEANN
Provides semantic search for memory visualization system
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os

# Try to import LEANN (use globally installed version)
LEANN_AVAILABLE = False
try:
    # Try global install first (recommended)
    from leann import LeannBuilder, LeannSearcher
    LEANN_AVAILABLE = True
    print("✅ LEANN loaded successfully (global install)")
except ImportError:
    try:
        # Fallback: try local source
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'LEANN', 'packages'))
        from leann import LeannBuilder, LeannSearcher
        LEANN_AVAILABLE = True
        print("✅ LEANN loaded successfully (local source)")
    except ImportError as e:
        print(f"⚠️  LEANN not available: {e}")
        print("   Backend will run in fallback mode (no semantic search)")
        print("   To enable LEANN: uv tool install leann-core --with leann")
        LeannBuilder = None
        LeannSearcher = None

app = FastAPI(title="Memory API", version="0.1.0")

# CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Index path
INDEX_PATH = "memories.leann"

# In-memory store for ID->text mapping (LEANN stores text, we need IDs)
memory_store: dict[str, str] = {}

class Memory(BaseModel):
    id: str
    text: str
    title: Optional[str] = None
    tags: List[str] = []

class SearchRequest(BaseModel):
    memory_id: str
    k: int = 5

class SearchResponse(BaseModel):
    related_ids: List[str]
    scores: List[float]

class BulkAddRequest(BaseModel):
    memories: List[Memory]

@app.get("/")
def root():
    return {
        "service": "Memory API",
        "status": "running",
        "leann_available": LEANN_AVAILABLE,
        "total_memories": len(memory_store)
    }

@app.post("/memory/add")
def add_memory(memory: Memory):
    """Add a single memory to the index"""
    if not LEANN_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="LEANN not available - semantic search disabled. Install with: cd backend/LEANN && uv tool install leann-core --with leann"
        )

    try:
        # Store in memory map
        memory_store[memory.id] = memory.text

        # Rebuild index with all memories
        builder = LeannBuilder(
            embedding_model="sentence-transformers/all-MiniLM-L6-v2",
            backend_name="hnsw"
        )

        for mem_id, text in memory_store.items():
            builder.add_text(text, metadata={"id": mem_id})

        builder.build_index(INDEX_PATH)

        return {
            "ok": True,
            "memory_id": memory.id,
            "total_memories": len(memory_store)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/memory/bulk-add")
def bulk_add_memories(request: BulkAddRequest):
    """Add multiple memories at once (more efficient)"""
    if not LEANN_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="LEANN not available - semantic search disabled. Install with: cd backend/LEANN && uv tool install leann-core --with leann"
        )

    try:
        # Update memory store
        for memory in request.memories:
            memory_store[memory.id] = memory.text

        # Build index once with all memories
        builder = LeannBuilder(
            embedding_model="sentence-transformers/all-MiniLM-L6-v2",
            backend_name="hnsw"
        )

        for mem_id, text in memory_store.items():
            builder.add_text(text, metadata={"id": mem_id})

        builder.build_index(INDEX_PATH)

        return {
            "ok": True,
            "added": len(request.memories),
            "total_memories": len(memory_store)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/memory/search")
def search_memories(request: SearchRequest) -> SearchResponse:
    """Find memories similar to the given memory ID"""
    if not LEANN_AVAILABLE:
        raise HTTPException(
            status_code=503,
            detail="LEANN not available - semantic search disabled"
        )

    try:
        if request.memory_id not in memory_store:
            raise HTTPException(status_code=404, detail=f"Memory {request.memory_id} not found")

        if not os.path.exists(INDEX_PATH):
            return SearchResponse(related_ids=[], scores=[])

        # Get the query text
        query_text = memory_store[request.memory_id]

        # Search
        searcher = LeannSearcher(INDEX_PATH)
        results = searcher.search(query_text, top_k=request.k + 1)  # +1 to exclude self

        # Extract IDs and scores (skip the first result which is the query itself)
        related_ids = []
        scores = []

        for result in results[1:]:  # Skip first (self)
            # Extract ID from text (we need to match text back to ID)
            for mem_id, text in memory_store.items():
                if text == result.text:
                    related_ids.append(mem_id)
                    scores.append(float(result.score))
                    break

        return SearchResponse(
            related_ids=related_ids[:request.k],
            scores=scores[:request.k]
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory/list")
def list_memories():
    """List all memory IDs"""
    return {
        "memory_ids": list(memory_store.keys()),
        "total": len(memory_store)
    }

@app.delete("/memory/clear")
def clear_all():
    """Clear all memories"""
    memory_store.clear()
    if os.path.exists(INDEX_PATH):
        os.remove(INDEX_PATH)
    return {"ok": True, "message": "All memories cleared"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
