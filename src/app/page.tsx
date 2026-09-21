import { prisma } from "@/lib/prisma";
import HomeClient from "@/components/HomeClient";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "JahitPakaian - Jasa Jahit Custom & Alterasi",
  description: "Melayani pembuatan pakaian custom, seragam kerja, seragam sekolah, hingga produksi konveksi.",
};

export default async function Page() {
  const [settings, services, portfolios, testimonials, faqs] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.service.findMany({ orderBy: { order: 'asc' } }),
    prisma.portfolio.findMany({ orderBy: { order: 'asc' } }),
    prisma.testimonial.findMany({ orderBy: { order: 'asc' } }),
    prisma.fAQ.findMany({ orderBy: { order: 'asc' } })
  ]);

  return (
    <HomeClient
      settings={settings || {
        websiteName: "JahitPakaian.com",
        heroTitle: "Jahit Pakaian Custom, Rapi & Berkualitas",
        heroSubtitle: "Jasa Jahit & Konveksi Profesional",
        heroDescription: "Melayani pembuatan pakaian custom...",
        heroImage: "",
        heroCtaText: "Pesan via WA",
        heroCtaLink: "https://wa.me/6281234567890",
        whatsappNumber: "6281234567890",
      }}
      services={services || []}
      portfolios={portfolios || []}
      testimonials={testimonials || []}
      faqs={faqs || []}
    />
  );
}
