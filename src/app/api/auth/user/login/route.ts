import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
    
    let role = "USER";
    let validUser = user;

    if (!user) {
      const admin = await prisma.admin.findUnique({
        where: { email: email.toLowerCase().trim() },
      });
      if (admin) {
        role = "ADMIN";
        validUser = admin as any;
      } else {
        return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
      }
    }

    const isValid = await verifyPassword(password, validUser!.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    await createSession({
      id: validUser!.id,
      email: validUser!.email,
      name: validUser!.name,
      role: role as "ADMIN" | "USER"
    });

    return NextResponse.json({
      success: true,
      role: role,
      user: {
        id: validUser!.id,
        email: validUser!.email,
        name: validUser!.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
