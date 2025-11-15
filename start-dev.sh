#!/bin/bash

# HostelBot Development Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting HostelBot Development Environment..."
echo ""

# Start Backend
echo "📦 Starting Backend Server (Port 5001)..."
cd "$(dirname "$0")/backend"
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend Server (Port 3000)..."
cd "$(dirname "$0")/frontend"
BROWSER=none npm start &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers are starting..."
echo "   Backend:  http://localhost:5001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Handle graceful shutdown
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Wait for both processes
wait
