#!/bin/bash

# Change to script directory
cd "$(dirname "$0")"

echo "🚀 Starting HostelBot Project..."
echo ""

# Check and start MySQL if not running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "⚠️  MySQL is not running. Starting MySQL..."
    
    # Try different methods to start MySQL
    if command -v mysql.server &> /dev/null; then
        mysql.server start
    elif [ -f /usr/local/mysql/support-files/mysql.server ]; then
        sudo /usr/local/mysql/support-files/mysql.server start
    elif command -v brew &> /dev/null; then
        brew services start mysql
    else
        echo "❌ Could not start MySQL automatically."
        echo "Please start MySQL manually and run this script again."
        exit 1
    fi
    
    echo "⏳ Waiting for MySQL to start..."
    sleep 5
else
    echo "✅ MySQL is already running"
fi

# Test database connection
echo "🔍 Testing database connection..."
if mysql -u root -p'@suraj7654' -e "USE HostelBot;" 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed!"
    echo "Please check your MySQL credentials and database."
    exit 1
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
