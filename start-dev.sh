#!/bin/bash

# Change to script directory
cd "$(dirname "$0")"

echo "🚀 Starting HostelBot Project..."
echo ""

# Check and start PostgreSQL if not running
if ! pgrep -x "postgres" > /dev/null; then
    echo "⚠️  PostgreSQL is not running. Starting PostgreSQL..."
    
    # Try different methods to start PostgreSQL
    if command -v brew &> /dev/null; then
        brew services start postgresql@14
    else
        echo "❌ Could not start PostgreSQL automatically."
        echo "Please start PostgreSQL manually and run this script again."
        exit 1
    fi
    
    echo "⏳ Waiting for PostgreSQL to start..."
    sleep 3
else
    echo "✅ PostgreSQL is already running"
fi

# Test database connection and create database if it doesn't exist
echo "🔍 Testing database connection..."
if psql -U $USER -d postgres -lqt | cut -d \| -f 1 | grep -qw HostelBot; then
    echo "✅ Database 'HostelBot' exists"
else
    echo "📦 Creating database 'HostelBot'..."
    createdb -U $USER HostelBot
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "❌ Failed to create database"
        exit 1
    fi
fi

# Kill any existing servers
echo "🧹 Cleaning up existing processes..."
lsof -ti:5001 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null

echo ""
echo "🚀 Starting Backend and Frontend servers..."
echo ""

# Start the application
npm start

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
