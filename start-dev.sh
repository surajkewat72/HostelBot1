#!/bin/bash

cd "$(dirname "$0")"

echo "🚀 Starting HostelBot Project..."
echo ""

if ! pgrep -x "postgres" > /dev/null; then
    echo "⚠️  PostgreSQL is not running. Starting PostgreSQL..."
    
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

echo "🧹 Cleaning up existing processes..."
lsof -ti:5001 2>/dev/null | xargs kill -9 2>/dev/null
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null

echo ""
echo "🚀 Starting Backend and Frontend servers..."
echo ""

npm start

echo "🚀 Starting HostelBot Development Environment..."
echo ""

echo "📦 Starting Backend Server (Port 5001)..."
cd "$(dirname "$0")/backend"
npm run dev &
BACKEND_PID=$!

sleep 3

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

trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
