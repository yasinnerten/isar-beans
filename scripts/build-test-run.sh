#!/usr/bin/env bash
set -euo pipefail

# build-test-run.sh — Build, test, commit/push, then start production + Tailscale tunnel.

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
echo "==> Resetting any existing Tailscale serve/funnel..."
tailscale funnel reset 2>/dev/null || true
tailscale serve reset 2>/dev/null || true

echo "==> Starting production server..."
echo "    Local:   http://localhost:3000"
echo ""

# Start server in background so we can setup funnel
NODE_ENV=production PORT=3000 node .next/standalone/server.js &
SERVER_PID=$!

# Give the server a few seconds to start
sleep 4

echo "==> Setting up Tailscale tunnel..."
TAILSCALE_HOST=$(tailscale status --json 2>/dev/null | python3 -c 'import sys,json; print(json.load(sys.stdin)["Self"]["DNSName"].rstrip("."))' 2>/dev/null || echo "unknown")

if tailscale funnel --bg 3000 2>/dev/null; then
  echo "✓ Tailscale funnel active (internet-facing)"
  echo "    Public:  https://${TAILSCALE_HOST}"
else
  echo "⚠ Tailscale funnel failed, falling back to tailscale serve (tailnet-only)..."
  tailscale serve --bg 3000 2>/dev/null || true
  echo "✓ Tailscale serve active (tailnet-only)"
  echo "    Tailnet: https://${TAILSCALE_HOST}"
fi

echo ""
echo "========================================"
echo " App is LIVE!"
echo "========================================"
echo " Local:   http://localhost:3000"
echo " Tunnel:  https://${TAILSCALE_HOST}"
echo ""
echo " Test user credentials:"
echo "   Email:    test@grabthebeans.com"
echo "   Password: testpass123"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the server and tunnel."

# Wait for the server to exit
wait $SERVER_PID
