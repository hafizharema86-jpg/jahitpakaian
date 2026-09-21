import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Generate unique filename
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    
    // Upload to Vercel Blob
    const blob = await put(originalName, file, {
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file: " + error.message }, { status: 500 });
  }
}
