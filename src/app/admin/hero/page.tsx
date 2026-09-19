"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, updateSiteSettings } from "../actions";

export default function SettingsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getSiteSettings().then(res => {
      setData(res || {
        websiteName: "",
        heroTitle: "",
        heroSubtitle: "",
        heroDescription: "",
        heroImage: "",
        heroCtaText: "",
        heroCtaLink: "",
        whatsappNumber: "",
        email: "",
        address: "",
        operationalHours: ""
      });
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await updateSiteSettings(data);
      setMessage("Pengaturan berhasil disimpan!");
    } catch (err) {
      setMessage("Gagal menyimpan pengaturan.");
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8">Memuat...</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-900">Kelola Hero Section</h2>
        <p className="text-gray-500 mt-1 text-sm">Sesuaikan tampilan awal landing page Anda.</p>
      </div>
      
      <div className="p-8">
        {message && (
          <div className={`p-4 mb-8 rounded-xl flex items-center gap-3 ${message.includes("berhasil") ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-red-50 text-red-800 border border-red-100"}`}>
            {message.includes("berhasil") ? (
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Website</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={data.websiteName || ""} onChange={e => setData({...data, websiteName: e.target.value})} required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Utama</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={data.heroTitle || ""} onChange={e => setData({...data, heroTitle: e.target.value})} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
              <textarea rows={4} className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none resize-none" 
                value={data.heroDescription || ""} onChange={e => setData({...data, heroDescription: e.target.value})} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Hero (URL)</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={data.heroImage || ""} onChange={e => setData({...data, heroImage: e.target.value})} placeholder="https://..." />
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <h3 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
              Tombol / CTA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Teks Tombol</label>
                <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={data.heroCtaText || ""} onChange={e => setData({...data, heroCtaText: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Link Tujuan</label>
                <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={data.heroCtaLink || ""} onChange={e => setData({...data, heroCtaLink: e.target.value})} required />
              </div>
            </div>
          </div>

          <div className="pt-8 flex items-center justify-end">
            <button type="submit" disabled={saving} className="bg-gradient-to-r from-[#06371c] to-[#0a4d29] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[#06371c]/20 hover:shadow-[#06371c]/40 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center gap-2">
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
