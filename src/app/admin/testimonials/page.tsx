"use client";

import { useEffect, useState } from "react";
import { getTestimonials, saveTestimonial, deleteTestimonial } from "../actions";

export default function TestimonialsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const loadData = () => {
    setLoading(true);
    getTestimonials().then(res => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveTestimonial(editing);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus testimoni ini?")) {
      await deleteTestimonial(id);
      loadData();
    }
  };

  if (loading && !editing) return <div className="p-8">Memuat...</div>;

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900">{editing.id ? "Edit Testimoni" : "Tambah Testimoni"}</h2>
          <p className="text-gray-500 mt-1 text-sm">{editing.id ? "Perbarui ulasan dari pelanggan." : "Tambahkan ulasan baru dari pelanggan Anda."}</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Pelanggan</label>
                <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={editing.name || ""} onChange={e => setEditing({...editing, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inisial <span className="text-gray-400 font-normal">(Maks 2 Huruf)</span></label>
                <input type="text" maxLength={2} className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={editing.initials || ""} onChange={e => setEditing({...editing, initials: e.target.value.toUpperCase()})} required placeholder="SM" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Layanan yang Dipesan / Peran</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={editing.role || ""} onChange={e => setEditing({...editing, role: e.target.value})} required placeholder="Custom Gaun Pengantin" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Isi Testimoni</label>
              <textarea rows={4} className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none resize-none" 
                value={editing.content || ""} onChange={e => setEditing({...editing, content: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating (1-5)</label>
                <input type="number" min="1" max="5" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={editing.rating || 5} onChange={e => setEditing({...editing, rating: parseInt(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Urutan Tampil</label>
                <input type="number" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={editing.order || 0} onChange={e => setEditing({...editing, order: parseInt(e.target.value)})} />
              </div>
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
          <h2 className="text-2xl font-bold text-gray-900">Kelola Testimoni</h2>
          <p className="text-gray-500 text-sm mt-1">Atur ulasan dan testimoni pelanggan yang ditampilkan di website.</p>
        </div>
        <button onClick={() => setEditing({ name: "", role: "", content: "", initials: "", rating: 5, order: 0 })} className="bg-[#06371c] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#06371c]/20 hover:shadow-[#06371c]/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Tambah Testimoni
        </button>
      </div>
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map(item => (
            <div key={item.id} className="relative group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-[#06371c]/5 transition-all hover:-translate-y-1 flex flex-col">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => setEditing(item)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Hapus">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              
              <div className="flex gap-1 text-amber-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-5 h-5 ${i < item.rating ? "fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-gray-600 text-sm italic mb-6 flex-1">&quot;{item.content}&quot;</p>
              
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06371c] to-[#0a4d29] shadow-md text-white flex items-center justify-center font-bold text-lg">
                  {item.initials}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-gray-500 text-sm">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada testimoni</h3>
              <p className="text-gray-500">Kumpulkan ulasan dari pelanggan dan tambahkan di sini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
