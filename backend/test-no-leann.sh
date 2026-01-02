#!/bin/bash

echo "Testing backend without LEANN..."
pkill -f "memory_api.py" 2>/dev/null
sleep 1

python3 memory_api.py &
PID=$!
sleep 3

echo ""
echo "Testing API:"
curl -s http://localhost:8000/ | python3 -m json.tool

echo ""
echo "Stopping backend..."
kill $PID 2>/dev/null

echo ""
echo "✅ Backend works without LEANN (fallback mode)"
