import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export const metadata = {
  title: "Admin Dashboard - JahitPakaian",
};

export default async function AdminDashboard() {
  const session = await getSession();

  const [servicesCount, portfoliosCount, testimonialsCount, faqsCount, leadsCount, recentLeads] = await Promise.all([
    prisma.service.count(),
    prisma.portfolio.count(),
    prisma.testimonial.count(),
    prisma.fAQ.count(),
    prisma.lead.count(),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  const stats = [
    {
      label: "Total Prospek Masuk",
      value: leadsCount,
      icon: (
        <svg className="w-5 h-5 text-[#ff5a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      ),
      bg: "bg-[#ffe8e8]"
    },
    {
      label: "Layanan Tersedia",
      value: servicesCount,
      icon: (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
      ),
      bg: "bg-blue-50"
    },
    {
      label: "Karya Portofolio",
      value: portfoliosCount,
      icon: (
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      ),
      bg: "bg-emerald-50"
    },
    {
      label: "Ulasan Pelanggan",
      value: testimonialsCount,
      icon: (
        <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      ),
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-10 max-w-6xl mx-auto w-full">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Ringkasan Sistem</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau aktivitas prospek pelanggan dan jumlah konten situs web Anda.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-black text-gray-800 leading-none mb-1">{stat.value}</div>
              <div className="text-xs font-semibold text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Prospek Terbaru Masuk</h2>
            <p className="text-xs text-gray-500 mt-1">Daftar pelanggan yang baru saja menghubungi melalui landing page.</p>
          </div>
          <div className="bg-[#ffe8e8] text-[#ff5a5f] text-xs px-3 py-1 rounded-full font-semibold">
            {leadsCount} Total
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-gray-400 font-semibold border-b border-gray-100">
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Pelanggan</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Nomor WA</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Pesanan</th>
                <th className="py-4 px-6 font-semibold uppercase tracking-wider">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img src={`https://ui-avatars.com/api/?name=${lead.nama}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-semibold text-gray-800 text-sm">{lead.nama}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <a href={`https://wa.me/${lead.nomorWhatsApp}`} target="_blank" rel="noreferrer" className="hover:text-[#ff5a5f] hover:underline flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        {lead.nomorWhatsApp}
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-semibold text-gray-700">{lead.jenisPakaian}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{lead.jumlahPesanan} pcs</div>
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-gray-500">
                      {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true, locale: id })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 text-sm">
                    Belum ada prospek/pesanan baru.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
