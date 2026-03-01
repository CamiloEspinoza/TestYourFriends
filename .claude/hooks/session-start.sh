#!/bin/bash
set -euo pipefail

# Only run in remote (web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$PROJECT_DIR"

# Install all workspace dependencies from root
echo "Installing workspace dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
cd "$PROJECT_DIR/backend"
npx prisma generate

echo "Session start hook completed successfully."
