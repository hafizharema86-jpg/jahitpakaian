import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex");
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      return NextResponse.json({ message: "Admin sudah ada. Seed tidak diperlukan." });
    }

    // Create admin
    const passwordHash = await hashPassword("admin123");
    const admin = await prisma.admin.create({
      data: {
        email: "admin@jahitpakaian.com",
        passwordHash,
        name: "Admin JahitPakaian",
      },
    });

    // Create default site settings
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        websiteName: "jahitpakaian.com",
        heroTitle: "Jahit Pakaian Custom, Rapi & Berkualitas",
        heroSubtitle: "Jasa Jahit & Konveksi Profesional",
        heroDescription: "Melayani pembuatan pakaian custom, seragam kerja, seragam sekolah, hingga produksi konveksi. Dikerjakan oleh penjahit berpengalaman dengan hasil rapi dan berkualitas.",
        whatsappNumber: "6281234567890",
        heroCtaText: "Pesan via WA",
        heroCtaLink: "https://wa.me/6281234567890",
      },
    });

    return NextResponse.json({
      message: "Seed berhasil!",
      admin: { email: admin.email, name: admin.name },
      note: "Login: admin@jahitpakaian.com / admin123",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
