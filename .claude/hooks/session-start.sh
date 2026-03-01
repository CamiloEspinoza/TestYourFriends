#!/bin/bash
set -euo pipefail

# Only run in remote (web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd "$PROJECT_DIR/frontend"
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd "$PROJECT_DIR/backend"
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Session start hook completed successfully."
