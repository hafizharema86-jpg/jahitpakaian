"use client";

import { useEffect, useState } from "react";
import { getFaqs, saveFaq, deleteFaq } from "../actions";

export default function FaqsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const loadData = () => {
    setLoading(true);
    getFaqs().then(res => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveFaq(editing);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus FAQ ini?")) {
      await deleteFaq(id);
      loadData();
    }
  };

  if (loading && !editing) return <div className="p-8">Memuat...</div>;

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900">{editing.id ? "Edit FAQ" : "Tambah FAQ"}</h2>
          <p className="text-gray-500 mt-1 text-sm">{editing.id ? "Ubah pertanyaan atau jawaban yang sudah ada." : "Tambahkan pertanyaan yang sering diajukan pelanggan."}</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pertanyaan</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={editing.question || ""} onChange={e => setEditing({...editing, question: e.target.value})} required placeholder="Berapa lama proses pembuatan?" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Jawaban</label>
              <textarea rows={4} className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none resize-none" 
                value={editing.answer || ""} onChange={e => setEditing({...editing, answer: e.target.value})} required placeholder="Proses pembuatan memakan waktu..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Urutan Tampil</label>
              <input type="number" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={editing.order || 0} onChange={e => setEditing({...editing, order: parseInt(e.target.value)})} />
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
          <h2 className="text-2xl font-bold text-gray-900">Kelola FAQ</h2>
          <p className="text-gray-500 text-sm mt-1">Atur daftar pertanyaan yang sering diajukan beserta jawabannya.</p>
        </div>
        <button onClick={() => setEditing({ question: "", answer: "", order: 0 })} className="bg-[#06371c] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#06371c]/20 hover:shadow-[#06371c]/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Tambah FAQ
        </button>
      </div>
      
      <div className="p-8">
        <div className="space-y-4">
          {data.map(item => (
            <div key={item.id} className="group flex gap-4 items-start p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-[#06371c]/5 hover:border-[#06371c]/20 transition-all">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                    Urutan: {item.order}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(item)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Hapus">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
          {data.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Belum ada FAQ</h3>
              <p className="text-gray-500">Tambahkan pertanyaan yang sering diajukan oleh pelanggan Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
