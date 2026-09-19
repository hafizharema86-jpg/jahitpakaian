"use client";

import { useEffect, useState } from "react";
import { getPortfolios, savePortfolio, deletePortfolio } from "../actions";

export default function PortfoliosPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const loadData = () => {
    setLoading(true);
    getPortfolios().then(res => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await savePortfolio(editing);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus portofolio ini?")) {
      await deletePortfolio(id);
      loadData();
    }
  };

  if (loading && !editing) return <div className="p-8">Memuat...</div>;

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900">{editing.id ? "Edit Portofolio" : "Tambah Portofolio"}</h2>
          <p className="text-gray-500 mt-1 text-sm">{editing.id ? "Perbarui hasil karya portofolio Anda." : "Tambahkan hasil karya terbaru ke portofolio."}</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Portofolio</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={editing.title || ""} onChange={e => setEditing({...editing, title: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat <span className="text-gray-400 font-normal">(Opsional)</span></label>
              <textarea rows={3} className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none resize-none" 
                value={editing.description || ""} onChange={e => setEditing({...editing, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={editing.category || ""} onChange={e => setEditing({...editing, category: e.target.value})} required placeholder="Pembuatan Custom" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Urutan Tampil</label>
                <input type="number" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={editing.order || 0} onChange={e => setEditing({...editing, order: parseInt(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">URL Gambar</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={editing.imageUrl || ""} onChange={e => setEditing({...editing, imageUrl: e.target.value})} placeholder="/portfolio-suit.jpg" required />
            </div>
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
              <button type="submit" className="bg-[#06371c] text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-[#06371c]/20 hover:shadow-[#06371c]/40 hover:-translate-y-0.5 transition-all">Simpan</button>
              <button type="button" onClick={() => setEditing(null)} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors">Batal</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-8 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kelola Portofolio</h2>
          <p className="text-gray-500 text-sm mt-1">Koleksi hasil jahitan dan karya terbaik Anda.</p>
        </div>
        <button onClick={() => setEditing({ title: "", description: "", category: "", imageUrl: "", order: 0 })} className="bg-[#06371c] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#06371c]/20 hover:shadow-[#06371c]/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Tambah Portofolio
        </button>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map(item => (
            <div key={item.id} className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:shadow-[#06371c]/5 transition-all hover:-translate-y-1 flex flex-col">
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-700 shadow-sm">
                  #{item.order}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-2">
                  <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">{item.category}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{item.description || "Tidak ada deskripsi"}</p>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                  <button onClick={() => setEditing(item)} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada portofolio</h3>
              <p className="text-gray-500">Mulai tambahkan karya pertama Anda dengan menekan tombol di atas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
