#!/bin/bash

# AMNIL Research Claude - Project Setup Script
# This script bootstraps the entire monorepo

set -e  # Exit on error

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 AMNIL Research Claude - Project Setup"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting."; exit 1; }
command -v dotnet >/dev/null 2>&1 || { echo "❌ .NET CLI is required but not installed. Aborting."; exit 1; }

echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"
echo "✅ .NET $(dotnet --version)"
echo ""

# Setup Frontend
echo "═══════════════════════════════════════════════════════════════"
echo "📦 Setting up Frontend..."
echo "═══════════════════════════════════════════════════════════════"
cd "$PROJECT_ROOT/frontend"

if [ ! -f "package.json" ]; then
    echo "Initializing Vite + React project..."
    npm create vite@latest . -- --template react-ts
fi

echo "Installing frontend dependencies..."
npm install

echo ""

# Setup Backend
echo "═══════════════════════════════════════════════════════════════"
echo "🔧 Setting up Backend..."
echo "═══════════════════════════════════════════════════════════════"
cd "$PROJECT_ROOT/backend"

if [ ! -f "MyApp.sln" ]; then
    echo "⚠️  Backend solution file not found."
    echo "You need to initialize the .NET ABP project."
    echo ""
    echo "To initialize ABP project, run:"
    echo "  cd backend"
    echo "  abp new MyApp -d ef -u angular"
    echo "  or follow: https://abp.io/get-started"
else
    echo "Restoring .NET dependencies..."
    dotnet restore
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Setup Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Configure your database connection in backend appsettings.json"
echo "  2. Run migrations: cd backend && dotnet run --project src/MyApp.DbMigrator"
echo "  3. Start development: ./scripts/dev.sh"
echo ""
echo "For more info, see docs/architecture.md"
