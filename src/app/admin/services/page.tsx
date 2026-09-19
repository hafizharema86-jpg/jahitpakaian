"use client";

import { useEffect, useState } from "react";
import { getServices, saveService, deleteService } from "../actions";

export default function ServicesPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);

  const loadData = () => {
    setLoading(true);
    getServices().then(res => {
      setData(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveService(editing);
    setEditing(null);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Yakin ingin menghapus layanan ini?")) {
      await deleteService(id);
      loadData();
    }
  };

  if (loading && !editing) return <div className="p-8">Memuat...</div>;

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
        <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900">{editing.id ? "Edit Layanan" : "Tambah Layanan"}</h2>
          <p className="text-gray-500 mt-1 text-sm">{editing.id ? "Perbarui informasi layanan yang sudah ada." : "Tambahkan layanan baru untuk pelanggan Anda."}</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Layanan</label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={editing.title || ""} onChange={e => setEditing({...editing, title: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Singkat</label>
              <textarea rows={3} className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none resize-none" 
                value={editing.description || ""} onChange={e => setEditing({...editing, description: e.target.value})} required />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Harga (Teks)</label>
                <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={editing.price || ""} onChange={e => setEditing({...editing, price: e.target.value})} required placeholder="Mulai Rp 35k" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Urutan Tampil</label>
                <input type="number" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                  value={editing.order || 0} onChange={e => setEditing({...editing, order: parseInt(e.target.value)})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags <span className="text-gray-400 font-normal">(Pisahkan dengan koma)</span></label>
              <input type="text" className="w-full border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none" 
                value={editing.tags || ""} onChange={e => setEditing({...editing, tags: e.target.value})} placeholder="Potong Celana, Kecilkan Pinggang" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Icon <span className="text-gray-400 font-normal">(Kode SVG HTML)</span></label>
              <textarea rows={3} className="w-full text-xs font-mono border-gray-200 shadow-sm rounded-xl px-4 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none resize-none" 
                value={editing.icon || ""} onChange={e => setEditing({...editing, icon: e.target.value})} placeholder="<svg>...</svg>" />
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
          <h2 className="text-2xl font-bold text-gray-900">Kelola Layanan</h2>
          <p className="text-gray-500 text-sm mt-1">Daftar layanan jahitan yang Anda tawarkan ke pelanggan.</p>
        </div>
        <button onClick={() => setEditing({ title: "", description: "", price: "", tags: "", order: 0, icon: "" })} className="bg-[#06371c] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-[#06371c]/20 hover:shadow-[#06371c]/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Tambah Layanan
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
              <th className="py-4 px-8">Layanan</th>
              <th className="py-4 px-8">Harga</th>
              <th className="py-4 px-8">Tags</th>
              <th className="py-4 px-8">Urutan</th>
              <th className="py-4 px-8 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="py-4 px-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#06371c]/5 flex items-center justify-center text-[#06371c]" dangerouslySetInnerHTML={{__html: item.icon || '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"></path></svg>'}} />
                    <div>
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[250px]">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-8">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {item.price}
                  </span>
                </td>
                <td className="py-4 px-8">
                  <div className="flex flex-wrap gap-1">
                    {item.tags?.split(',').slice(0, 2).map((t: string, i: number) => (
                      <span key={i} className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">{t.trim()}</span>
                    ))}
                    {item.tags?.split(',').length > 2 && <span className="inline-block px-2.5 py-1 bg-gray-50 text-gray-400 rounded-md text-xs font-medium">+{item.tags.split(',').length - 2}</span>}
                  </div>
                </td>
                <td className="py-4 px-8">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                    {item.order}
                  </div>
                </td>
                <td className="py-4 px-8 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4 text-gray-400">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Belum ada layanan</h3>
                  <p className="text-gray-500">Mulai tambahkan layanan pertama Anda dengan menekan tombol di atas.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
