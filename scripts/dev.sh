#!/bin/bash

# AMNIL Research Claude - Development Server
# Starts both frontend and backend servers in parallel

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 Starting Development Environment"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to start frontend
start_frontend() {
    echo -e "${BLUE}📱 Starting Frontend (Vite)...${NC}"
    cd "$PROJECT_ROOT/frontend"
    npm run dev
}

# Function to start backend
start_backend() {
    echo -e "${BLUE}🔧 Starting Backend (.NET)...${NC}"
    cd "$PROJECT_ROOT/backend/src/MyApp.HttpApi.Host"
    dotnet run
}

# Start both servers in parallel
echo -e "${GREEN}Starting both servers...${NC}"
echo "Frontend will be available at: http://localhost:5173"
echo "Backend will be available at: https://localhost:44300"
echo "API Docs will be at: https://localhost:44300/swagger"
echo ""

# Start backend in background
start_backend &
BACKEND_PID=$!

# Start frontend in foreground
start_frontend

# Clean up on exit
trap "kill $BACKEND_PID" EXIT
