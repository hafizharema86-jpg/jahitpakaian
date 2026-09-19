/**
 * Script untuk membuat akun admin dan user default.
 * 
 * Jalankan: npx tsx scripts/seed-users.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import crypto from "crypto";
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
  const { createPool } = require("mariadb");
  const connectionString = process.env.DATABASE_URL!.replace("mysql://", "mariadb://");
  const pool = createPool(connectionString);
  const adapter = new PrismaMariaDb(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("🔐 Membuat akun Admin dan User...\n");

  const passwordHash = await hashPassword("admin123");
  const userPasswordHash = await hashPassword("user123");

  // Admin
  const admin = await prisma.admin.upsert({
    where: { email: "admin@jahitpakaian.com" },
    update: { passwordHash, name: "Admin JahitPakaian" },
    create: { email: "admin@jahitpakaian.com", passwordHash, name: "Admin JahitPakaian" },
  });
  console.log("✅ Admin berhasil dibuat:");
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Password: admin123\n`);

  // User
  const user = await prisma.user.upsert({
    where: { email: "user@jahitpakaian.com" },
    update: { passwordHash: userPasswordHash, name: "User Dummy" },
    create: { email: "user@jahitpakaian.com", passwordHash: userPasswordHash, name: "User Dummy", phone: "081234567890" },
  });
  console.log("✅ User berhasil dibuat:");
  console.log(`   Email:    ${user.email}`);
  console.log(`   Password: user123\n`);

  console.log("⚠️  Segera ganti password default di production!\n");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
