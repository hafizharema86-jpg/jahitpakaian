import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    
    const nama = data.get("nama") as string;
    const nomorWhatsApp = data.get("nomorWhatsApp") as string;
    const jenisPakaian = data.get("jenisPakaian") as string;
    const jumlahPesanan = parseInt((data.get("jumlahPesanan") as string) || "1", 10);
    const catatan = data.get("catatan") as string;

    if (!nama || !nomorWhatsApp) {
      return NextResponse.json(
        { error: "Nama dan nomor WhatsApp wajib diisi" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        nama,
        nomorWhatsApp,
        jenisPakaian,
        jumlahPesanan,
        catatan,
        referensiDesain: null,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
