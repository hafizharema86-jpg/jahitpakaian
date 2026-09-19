/**
 * Script untuk membuat akun admin pertama.
 * 
 * Jalankan: npx tsx scripts/seed-admin.ts
 * 
 * Default credentials:
 *   Email:    admin@jahitpakaian.com
 *   Password: admin123
 */

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

// Load .env
import { config } from "dotenv";
config();

function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

async function main() {
  const prisma = new PrismaClient();

  const email = "admin@jahitpakaian.com";
  const password = "admin123";
  const name = "Admin JahitPakaian";

  console.log("🔐 Membuat akun admin...\n");

  const passwordHash = await hashPassword(password);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });

  console.log("✅ Admin berhasil dibuat!\n");
  console.log(`   ID:       ${admin.id}`);
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Name:     ${admin.name}`);
  console.log(`   Password: ${password}`);
  console.log("\n⚠️  Segera ganti password default di production!\n");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
