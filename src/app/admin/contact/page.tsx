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
        <h2 className="text-2xl font-bold text-gray-900">Kelola Informasi Kontak</h2>
        <p className="text-gray-500 mt-1 text-sm">Sesuaikan informasi kontak yang ditampilkan kepada pelanggan.</p>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={data.whatsappNumber || ""} onChange={e => setData({...data, whatsappNumber: e.target.value})} placeholder="Contoh: 628123456789" required />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={data.email || ""} onChange={e => setData({...data, email: e.target.value})} placeholder="email@contoh.com" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Operasional</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={data.operationalHours || ""} onChange={e => setData({...data, operationalHours: e.target.value})} placeholder="Senin - Sabtu: 09.00 - 17.00" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Lengkap</label>
              <textarea rows={3} className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none resize-none" 
                value={data.address || ""} onChange={e => setData({...data, address: e.target.value})} placeholder="Jl. Contoh Alamat No. 123..." />
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
