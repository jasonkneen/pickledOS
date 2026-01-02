#!/bin/bash

echo "Testing Memory API..."
echo ""

# Health check
echo "1. Health Check"
curl -s http://localhost:8000/ | jq .

echo -e "\n2. Adding test memories"
curl -s -X POST http://localhost:8000/memory/bulk-add \
  -H "Content-Type: application/json" \
  -d '{
    "memories": [
      {"id": "test1", "text": "Machine learning uses neural networks to process data"},
      {"id": "test2", "text": "Deep learning is a subset of machine learning with multiple layers"},
      {"id": "test3", "text": "Neural networks are inspired by biological neurons"}
    ]
  }' | jq .

echo -e "\n3. Searching for similar memories"
curl -s -X POST http://localhost:8000/memory/search \
  -H "Content-Type: application/json" \
  -d '{"memory_id": "test1", "k": 5}' | jq .

echo -e "\n4. Listing all memories"
curl -s http://localhost:8000/memory/list | jq .

echo -e "\nTest complete!"
