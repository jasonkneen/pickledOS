#!/bin/bash

echo "🥒 Starting Memory Visualization with LEANN Backend"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ python3 not found. Please install Python 3.9+"
    exit 1
fi
echo "✅ Python found: $(python3 --version)"

# Check if LEANN is installed
if ! command -v leann &> /dev/null; then
    echo "⚠️  LEANN not installed globally"
    echo "   Install with: cd backend/LEANN && uv tool install leann-core --with leann"
    echo "   (Backend will still work with fallback mode)"
fi

# Check Python dependencies
if ! python3 -c "import fastapi" &> /dev/null; then
    echo "❌ Backend dependencies not installed"
    echo "   Run: pip3 install -r backend/requirements.txt"
    exit 1
fi
echo "✅ Backend dependencies OK"

echo ""

# Check if backend is already running
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend already running at http://localhost:8000"
else
    echo "🚀 Starting backend..."
    /usr/local/bin/python3.12 backend/memory_api.py > backend/api.log 2>&1 &
    BACKEND_PID=$!
    echo "   Backend PID: $BACKEND_PID"
    echo "   Logs: backend/api.log"
    sleep 3
    
    # Verify backend started
    if curl -s http://localhost:8000/ > /dev/null 2>&1; then
        echo "✅ Backend started successfully"
    else
        echo "❌ Backend failed to start. Check backend/api.log"
        exit 1
    fi
fi

echo "🎨 Starting frontend..."
npm run dev

# Cleanup on exit
trap "echo 'Stopping backend...'; kill $BACKEND_PID 2>/dev/null" EXIT
