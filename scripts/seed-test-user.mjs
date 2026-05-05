#!/usr/bin/env node
/**
 * Seed a test shop user into the SQLite database.
 * Idempotent — safe to run multiple times.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

const TEST_EMAIL = "test@grabthebeans.com";
const TEST_PASSWORD = "testpass123";

async function main() {
  const existing = await prisma.shop.findUnique({ where: { email: TEST_EMAIL } });
  if (existing) {
    console.log("✓ Test shop already exists");
    console.log("  Email:", TEST_EMAIL);
    console.log("  Password:", TEST_PASSWORD);
    return;
  }

  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);
  const shop = await prisma.shop.create({
    data: {
      name: "Test Coffee Shop",
      email: TEST_EMAIL,
      passwordHash,
      address: "123 Test Street, Testville",
      beansBalance: 100,
      lat: 48.1351,
      lng: 11.582,
    },
  });

  console.log("✓ Created test shop");
  console.log("  Name:", shop.name);
  console.log("  Email:", TEST_EMAIL);
  console.log("  Password:", TEST_PASSWORD);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
