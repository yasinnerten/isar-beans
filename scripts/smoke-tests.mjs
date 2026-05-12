#!/usr/bin/env node
/**
 * Smoke tests for grabthebeans.
 * Spins up the standalone production server, runs HTTP assertions, then tears it down.
 */

import { spawn } from "child_process";
import { setTimeout } from "timers/promises";
import { execSync } from "child_process";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3002";
const PROJECT_DIR = new URL("..", import.meta.url).pathname;

async function request(path, opts = {}) {
  const res = await fetch(`${BASE_URL}${path}`, opts);
  const contentType = res.headers.get("content-type") || "";
  let body = null;
  if (contentType.includes("application/json")) {
    body = await res.json().catch(() => null);
  }
  return { status: res.status, body, headers: res.headers };
}

let failures = 0;
function assert(ok, message) {
  if (!ok) {
    console.error("✗", message);
    failures++;
  } else {
    console.log("✓", message);
  }
}

async function runTests() {
  console.log("\n--- Smoke Tests ---\n");

  // 1. Homepage
  const home = await request("/");
  assert(home.status === 200, `GET / returns 200 (got ${home.status})`);

  // 2. Public static file
  const logo = await request("/grabthebeans-logo.png");
  assert(logo.status === 200, `GET /grabthebeans-logo.png returns 200 (got ${logo.status})`);

  // 3. _next/static chunk (critical for CSS/JS)
  const html = await (await fetch(`${BASE_URL}/`)).text();
  const chunkMatch = html.match(/_next\/static\/chunks\/[^"\']+/);
  if (chunkMatch) {
    const chunkPath = "/" + chunkMatch[0];
    const chunk = await request(chunkPath);
    assert(chunk.status === 200, `GET ${chunkPath} returns 200 (got ${chunk.status})`);
  } else {
    assert(false, "Could not find _next/static chunk in HTML to test");
  }

  // 4. Shops map API
  const map = await request("/api/shops/map");
  assert(map.status === 200, `GET /api/shops/map returns 200 (got ${map.status})`);

  // 5. Register a new shop
  const randomEmail = `smoke-${Date.now()}@example.com`;
  const register = await request("/api/shop/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Smoke Test Shop",
      email: randomEmail,
      password: "smoke123",
    }),
  });
  assert(register.status === 200, `POST /api/shop/register returns 200 (got ${register.status})`);

  // 6. Login with seeded test user — capture real cookie
  const login = await request("/api/shop/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@grabthebeans.com",
      password: "testpass123",
    }),
  });
  assert(login.status === 200, `POST /api/shop/login (test user) returns 200 (got ${login.status})`);

  // 7. Auth-protected endpoint rejects unauthenticated
  const meNoAuth = await request("/api/shop/me");
  assert(meNoAuth.status === 401, `GET /api/shop/me (no auth) returns 401 (got ${meNoAuth.status})`);

  // 8. Auth-protected endpoint accepts real cookie
  const setCookie = login.headers.get("set-cookie");
  if (setCookie) {
    const meWithAuth = await request("/api/shop/me", {
      headers: { cookie: setCookie },
    });
    assert(meWithAuth.status === 200, `GET /api/shop/me (real cookie) returns 200 (got ${meWithAuth.status})`);
  } else {
    assert(false, "Login did not set a cookie");
  }

  console.log("\n--- Results ---");
  if (failures > 0) {
    console.error(`${failures} test(s) failed`);
    process.exit(1);
  } else {
    console.log("All smoke tests passed ✓");
  }
}

let serverProcess;

async function copyStaticFiles() {
  try {
    execSync(`mkdir -p "${PROJECT_DIR}/.next/standalone/.next/static"`);
    execSync(`cp -r "${PROJECT_DIR}/.next/static/"* "${PROJECT_DIR}/.next/standalone/.next/static/" 2>/dev/null || true`);
    execSync(`cp -r "${PROJECT_DIR}/public" "${PROJECT_DIR}/.next/standalone/public" 2>/dev/null || true`);
  } catch {
    // ignore
  }
}

async function startServer() {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      NODE_ENV: "production",
      PORT: "3002",
      DATABASE_URL:
        process.env.DATABASE_URL || `file:${PROJECT_DIR}/dev.db`,
    };

    serverProcess = spawn("node", [".next/standalone/server.js"], {
      cwd: PROJECT_DIR,
      env,
      stdio: "pipe",
    });

    let resolved = false;
    const resolveOnce = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    serverProcess.stdout.on("data", (d) => {
      const msg = d.toString();
      if (msg.includes("Ready") || msg.includes("3002")) {
        resolveOnce();
      }
    });

    serverProcess.stderr.on("data", (d) => {
      // suppress expected stderr during tests
    });

    serverProcess.on("error", reject);

    // Fallback: resolve after 6s
    setTimeout(6000).then(resolveOnce);
  });
}

async function main() {
  console.log("Preparing standalone server for smoke tests...");
  await copyStaticFiles();
  console.log("Starting standalone server for smoke tests...");
  await startServer();
  await setTimeout(2000); // warm-up

  try {
    await runTests();
  } finally {
    console.log("\nStopping test server...");
    serverProcess.kill("SIGTERM");
    await setTimeout(1000);
    if (!serverProcess.killed) {
      serverProcess.kill("SIGKILL");
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
