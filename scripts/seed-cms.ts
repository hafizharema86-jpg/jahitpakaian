import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const { createPool } = require("mariadb");
  const connectionString = process.env.DATABASE_URL!.replace("mysql://", "mariadb://");
  const pool = createPool(connectionString);
  const adapter = new PrismaMariaDb(pool);
  const prisma = new PrismaClient({ adapter });

  console.log("Seeding CMS data...");

  // Seed SiteSettings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      websiteName: "JahitPakaian",
      heroTitle: "Jahit Pakaian Custom, Rapi & Berkualitas",
      heroSubtitle: "Jasa Jahit & Konveksi Profesional",
      heroDescription: "Melayani pembuatan pakaian custom, seragam kerja, seragam sekolah, hingga produksi konveksi untuk individu, komunitas, maupun perusahaan.",
      whatsappNumber: "6281234567890",
    }
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
          imageUrl: "/portfolio-suit.jpg",
          order: 1
        },
        {
          title: "Gaun Malam Resepsi",
          description: "",
          category: "Alterasi",
          imageUrl: "/portfolio-gown.jpg",
          order: 2
        },
        {
          title: "Kemeja Batik Modern",
          description: "",
          category: "Kustom",
          imageUrl: "/portfolio-batik.jpg",
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

  console.log("Seeding CMS data complete!");
  pool.end();
}

main().catch(console.error);
