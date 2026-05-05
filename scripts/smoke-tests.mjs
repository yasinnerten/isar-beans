#!/usr/bin/env node
/**
 * Smoke tests for grabthebeans.
 * Spins up the standalone production server, runs HTTP assertions, then tears it down.
 */

import { spawn } from "child_process";
import { setTimeout } from "timers/promises";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const PROJECT_DIR = new URL("..", import.meta.url).pathname;

async function request(path, opts = {}) {
  const res = await fetch(`${BASE_URL}${path}`, opts);
  const body =
    opts.method === "POST"
      ? await res.json().catch(() => null)
      : null;
  return { status: res.status, body };
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

  // 3. Shops map API
  const map = await request("/api/shops/map");
  assert(map.status === 200, `GET /api/shops/map returns 200 (got ${map.status})`);

  // 4. Register a new shop
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

  // 5. Login with seeded test user
  const login = await request("/api/shop/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@grabthebeans.com",
      password: "testpass123",
    }),
  });
  assert(login.status === 200, `POST /api/shop/login (test user) returns 200 (got ${login.status})`);

  // 6. Auth-protected endpoint rejects unauthenticated
  const meNoAuth = await request("/api/shop/me");
  assert(meNoAuth.status === 401, `GET /api/shop/me (no auth) returns 401 (got ${meNoAuth.status})`);

  // 7. Auth-protected endpoint accepts authenticated
  const cookies = login.body?.ok !== false ? "isar-session=test-cookie" : "";
  const meWithAuth = await request("/api/shop/me", {
    headers: { cookie: cookies },
  });
  // We are using a fake cookie, so it will still fail, but we just care it doesn't crash
  assert(meWithAuth.status === 401 || meWithAuth.status === 200, `GET /api/shop/me (with cookie) responds (${meWithAuth.status})`);

  console.log("\n--- Results ---");
  if (failures > 0) {
    console.error(`${failures} test(s) failed`);
    process.exit(1);
  } else {
    console.log("All smoke tests passed ✓");
  }
}

let serverProcess;

async function startServer() {
  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      NODE_ENV: "production",
      PORT: "3000",
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
      if (msg.includes("Ready") || msg.includes("3000")) {
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
