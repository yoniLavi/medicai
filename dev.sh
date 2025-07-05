#!/bin/bash

# Development script to run both backend and frontend

echo "🚀 Starting MedicAI Full-Stack Development Environment"
echo "=================================================="

# Function to cleanup background processes
cleanup() {
    echo "Stopping servers..."
    kill %1 %2 2>/dev/null
    exit
}

# Set up cleanup on script exit
trap cleanup EXIT

# Start backend
echo "📡 Starting FastAPI backend on port 8000..."
uv run uvicorn server:app --host 0.0.0.0 --port 8000 --reload &

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "🌐 Starting React frontend on port 8080..."
cd frontend && npm run dev &

# Wait for both services to start
sleep 3

echo ""
echo "✅ Services started successfully!"
echo "📱 Frontend: http://localhost:8080"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
