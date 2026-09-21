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
    if (!existingAdmin) {
      // Create admin
      const passwordHash = await hashPassword("admin123");
      await prisma.admin.create({
        data: {
          email: "admin@jahitpakaian.com",
          passwordHash,
          name: "Admin JahitPakaian",
        },
      });
    }

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

    // Seed Services
    const existingServices = await prisma.service.count();
    if (existingServices === 0) {
      await prisma.service.createMany({
        data: [
          {
            title: "Penyesuaian & Alterasi",
            description: "Mengencangkan, memperpanjang, atau menyesuaikan ukuran pakaian jadi agar pas sempurna di tubuh Anda.",
            price: "Mulai Rp 35k",
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>',
            tags: "Potong Celana,Kecilkan Pinggang,Ubah Kerah",
            order: 1
          },
          {
            title: "Busana Pembuatan Baru",
            description: "Kemeja, gaun, atau setelan jas dibuat secara khusus berdasarkan pola, pilihan material, dan lekuk ukuran Anda.",
            price: "Mulai Rp 250k",
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 22 12 12 22 2 12 12 2"></polygon></svg>',
            tags: "Kemeja Custom,Gaun Malam,Setelan Jas",
            order: 2
          },
          {
            title: "Perbaikan & Resleting",
            description: "Penggantian resleting rusak, perbaikan sobekan kecil, pemasangan kancing, dan restorasi ringan lainnya.",
            price: "Mulai Rp 25k",
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
            tags: "Ganti Resleting,Jahit Robek,Tambah Kancing",
            order: 3
          }
        ]
      });
    }

    // Seed Portfolios
    const existingPortfolios = await prisma.portfolio.count();
    if (existingPortfolios === 0) {
      await prisma.portfolio.createMany({
        data: [
          {
            title: "Setelan Jas Formal Eksekutif",
            description: "Full-bespoke dari pengukuran hingga finishing — 7 hari kerja",
            category: "Pembuatan Custom",
            imageUrl: "https://i.ibb.co.com/m50F3Ybs/portfolio-suit.jpg",
            order: 1
          },
          {
            title: "Gaun Malam Resepsi",
            description: "Desain elegan",
            category: "Alterasi",
            imageUrl: "https://i.ibb.co.com/WvXy4zZf/portfolio-gown.jpg",
            order: 2
          },
          {
            title: "Kemeja Batik Modern",
            description: "Motif eksklusif",
            category: "Kustom",
            imageUrl: "https://i.ibb.co.com/gL8m6N3f/portfolio-batik.jpg",
            order: 3
          }
        ]
      });
    }

    // Seed Testimonials
    const existingTestimonials = await prisma.testimonial.count();
    if (existingTestimonials === 0) {
      await prisma.testimonial.createMany({
        data: [
          {
            name: "Sisca Melawati",
            role: "Custom Gaun Pengantin",
            content: "Pelayanannya sangat ramah dan sabar mendengarkan keinginan saya. Hasil gaun pengantin benar-benar sesuai mimpi, fitting pertama langsung pas! Jahitannya rapi luar biasa.",
            rating: 5,
            initials: "SM",
            order: 1
          },
          {
            name: "Doni Ramadhan",
            role: "Alterasi Jas Formal",
            content: "Alterasi jas mahal saya ditangani dengan sangat hati-hati. Hasilnya rapi seperti tidak pernah dibongkar. Highly recommended!",
            rating: 5,
            initials: "DR",
            order: 2
          },
          {
            name: "Almira Lestari",
            role: "Paket Seragam Acara",
            content: "Pengerjaan kilat 2 hari untuk seragam bridesmaid benar-benar menolong. Harga transparan dan kualitas tetap tinggi!",
            rating: 5,
            initials: "AL",
            order: 3
          }
        ]
      });
    }

    // Seed FAQs
    const existingFaqs = await prisma.fAQ.count();
    if (existingFaqs === 0) {
      await prisma.fAQ.createMany({
        data: [
          {
            question: "Berapa lama estimasi pengerjaan?",
            answer: "Tergantung jenis layanan. Alterasi ringan 1–3 hari, pembuatan baru 5–14 hari kerja. Layanan kilat tersedia 24 jam untuk kebutuhan mendesak.",
            order: 1
          },
          {
            question: "Apakah melayani order dari luar kota?",
            answer: "Tentu! Kami melayani seluruh Indonesia via pengiriman ekspedisi. Konsultasi dan pengukuran bisa dilakukan secara online melalui video call.",
            order: 2
          },
          {
            question: "Apakah bahan bisa dari pihak pelanggan?",
            answer: "Bisa. Anda dapat mengirimkan bahan sendiri, atau memilih dari koleksi material premium yang kami sediakan dengan harga transparan.",
            order: 3
          },
          {
            question: "Bagaimana cara klaim garansi jika tidak pas?",
            answer: "Hubungi kami via WhatsApp dalam 7 hari setelah menerima pakaian. Kami akan melakukan penyesuaian ulang gratis tanpa biaya tambahan.",
            order: 4
          }
        ]
      });
    }

    return NextResponse.json({
      message: "Seed berhasil (Admin, Layanan, Portofolio, Testimoni, FAQ)!",
      note: "Silakan cek kembali halaman beranda.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
