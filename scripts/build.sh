#!/bin/bash

# AMNIL Research Claude - Build Script
# Builds both frontend and backend for production

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "═══════════════════════════════════════════════════════════════"
echo "🔨 Building Production Artifacts"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Build Frontend
echo "📦 Building Frontend..."
cd "$PROJECT_ROOT/frontend"
npm run build
echo "✅ Frontend build complete"
echo ""

# Build Backend
echo "🔧 Building Backend..."
cd "$PROJECT_ROOT/backend"
dotnet build --configuration Release
echo "✅ Backend build complete"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "✅ All builds complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Artifacts:"
echo "  Frontend: $PROJECT_ROOT/frontend/dist/"
echo "  Backend:  Ready for deployment"
echo ""
