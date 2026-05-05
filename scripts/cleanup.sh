#!/usr/bin/env bash
set -euo pipefail

# cleanup.sh — Reset build artifacts and optionally nuke the local database.
# Usage: ./scripts/cleanup.sh [--db]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_DIR}"

echo "==> Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache
echo "✓ Removed .next/ and caches"

if [[ "${1:-}" == "--db" ]]; then
  echo "==> Resetting local SQLite database..."
  rm -f dev.db
  rm -rf prisma/migrations
  echo "✓ Removed dev.db and migrations"
  echo "Run 'npm run migrate' to recreate the database."
fi

echo "==> Done."
