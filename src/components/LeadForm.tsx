"use client";

import { useState, useRef, useEffect } from "react";

export default function LeadForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetch("/api/auth/user/me")
      .then(res => {
        if (res.ok) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    
    setStatus("loading");
    
    const formData = new FormData(formRef.current);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setStatus("success");
        
        const nama = formData.get("nama");
        const jenisPakaian = formData.get("jenisPakaian");
        const jumlahPesanan = formData.get("jumlahPesanan");
        const catatan = formData.get("catatan");
        
        const waMessage = `Halo JahitPakaian, saya ${nama}. Saya butuh jasa untuk ${jenisPakaian} sebanyak ${jumlahPesanan} pcs. Tambahan catatan: ${catatan || '-'}`;
        const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;
        
        formRef.current.reset();
        
        setTimeout(() => {
          window.open(waUrl, '_blank');
          setStatus("idle");
        }, 1500);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-[#fafafa] border border-gray-100 rounded-[2rem] p-8 md:p-12 max-w-2xl mx-auto shadow-xl shadow-gray-200/50 w-full relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#06371c] to-[#0a4d29]"></div>
      
      <div className="text-center mb-10">
        <span className="text-[#06371c] font-semibold tracking-wider uppercase text-xs mb-2 block">Konsultasi Gratis</span>
        <h3 className="font-serif text-3xl font-bold text-gray-900 mb-3">Mulai Wujudkan Pakaian Anda</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">Isi form di bawah ini, tim Master Tailor kami akan langsung menghubungi Anda via WhatsApp beserta estimasi harga.</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="nama">Nama Lengkap *</label>
            <input 
              type="text" 
              id="nama" 
              name="nama" 
              required 
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#06371c] focus:ring-1 focus:ring-[#06371c] transition-all"
              placeholder="Contoh: Budi Santoso"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="nomorWhatsApp">Nomor WhatsApp *</label>
            <input 
              type="tel" 
              id="nomorWhatsApp" 
              name="nomorWhatsApp" 
              required 
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#06371c] focus:ring-1 focus:ring-[#06371c] transition-all"
              placeholder="Contoh: 081234567890"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="jenisPakaian">Jenis Pakaian</label>
            <input 
              type="text" 
              id="jenisPakaian" 
              name="jenisPakaian"
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#06371c] focus:ring-1 focus:ring-[#06371c] transition-all"
              placeholder="Contoh: Kemeja, Gaun, Celana"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="jumlahPesanan">Jumlah (pcs)</label>
            <input 
              type="number" 
              id="jumlahPesanan" 
              name="jumlahPesanan"
              min="1"
              defaultValue="1"
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#06371c] focus:ring-1 focus:ring-[#06371c] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2" htmlFor="catatan">Catatan / Deskripsi Tambahan</label>
          <textarea 
            id="catatan" 
            name="catatan" 
            rows={3}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#06371c] focus:ring-1 focus:ring-[#06371c] transition-all resize-none"
            placeholder="Jelaskan kebutuhan alterasi atau konsep desain yang Anda inginkan..."
          />
        </div>

        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
          <label className="block text-gray-700 text-xs font-bold uppercase tracking-wider mb-2 cursor-pointer" htmlFor="file">Upload Referensi Desain / Foto (Opsional)</label>
          <input 
            type="file" 
            id="file" 
            name="file" 
            accept="image/*,.pdf"
            className="w-full text-gray-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-[#f3f7f4] file:text-[#06371c] hover:file:bg-[#e0ece5] cursor-pointer mt-2"
          />
        </div>

        {isLoggedIn === false ? (
          <a
            href="/auth/login?redirect=whatsapp"
            className="bg-[#06371c] hover:bg-[#0a4d29] text-white font-bold text-base py-4 rounded-xl transition-all mt-4 flex justify-center items-center gap-2 shadow-xl shadow-[#06371c]/20 text-center"
          >
            Login untuk Pesan via WA
          </a>
        ) : (
          <button 
            type="submit" 
            disabled={status === "loading" || status === "success" || isLoggedIn === null}
            className="bg-[#06371c] hover:bg-[#0a4d29] text-white font-bold text-base py-4 rounded-xl transition-all mt-4 flex justify-center items-center gap-2 disabled:opacity-50 shadow-xl shadow-[#06371c]/20"
          >
            {status === "loading" || isLoggedIn === null ? "Memproses..." : status === "success" ? "Berhasil Tersimpan!" : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Kirim & Lanjutkan ke WhatsApp
              </>
            )}
          </button>
        )}

        {status === "success" && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm text-center mt-2 font-medium">
            Data pesanan berhasil dikirim. Membuka WhatsApp secara otomatis...
          </div>
        )}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center mt-2 font-medium">
            Mohon maaf, terjadi kesalahan jaringan. Silakan coba lagi.
          </div>
        )}
      </form>
    </div>
  );
}
