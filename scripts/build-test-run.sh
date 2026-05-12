#!/usr/bin/env bash
set -euo pipefail

# build-test-run.sh — Build, test, commit/push, then start the production server.
# The app is exposed via an external Cloudflare tunnel (do not edit tunnel config here).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_DIR}"

export DATABASE_URL="file:${PROJECT_DIR}/dev.db"

echo "========================================"
echo " grabthebeans — build, test & run"
echo "========================================"
echo ""

echo "==> Installing dependencies..."
npm ci 2>/dev/null || npm install

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Building Next.js..."
npm run build

echo "==> Copying public assets into standalone output..."
cp -r "${PROJECT_DIR}/public" "${PROJECT_DIR}/.next/standalone/public" 2>/dev/null || true
echo "==> Copying static chunks into standalone output..."
mkdir -p "${PROJECT_DIR}/.next/standalone/.next/static"
cp -r "${PROJECT_DIR}/.next/static/"* "${PROJECT_DIR}/.next/standalone/.next/static/" 2>/dev/null || true

echo "==> Seeding test user..."
node scripts/seed-test-user.mjs

echo "==> Running smoke tests..."
node scripts/smoke-tests.mjs || {
  echo ""
  echo "========================================"
  echo " Smoke tests FAILED — aborting."
  echo "========================================"
  exit 1
}

echo ""
echo "========================================"
echo " All tests passed ✓"
echo "========================================"
echo ""

# Commit & push if there are changes
echo "==> Checking for changes to commit..."
if ! git diff --quiet || ! git diff --cached --quiet; then
  git add -A
  git commit -m "chore: build scripts, tests, branding updates and production setup"
  echo "==> Pushing to origin..."
  git push origin main
else
  echo "==> No changes to commit."
fi

echo ""
echo "==> Starting production server..."
echo "    Local:   http://localhost:3002"
echo "    Public:  https://isar-beans.yasinnerten.com"
echo ""

# Start server in the foreground (Cloudflare tunnel handles public ingress)
NODE_ENV=production PORT=3002 node .next/standalone/server.js

echo ""
echo " Server stopped."

# Note: If you need the server to persist after closing this terminal,
# run it via a process manager (e.g., pm2, systemd) instead of this script.
