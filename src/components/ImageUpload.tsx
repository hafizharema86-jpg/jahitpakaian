"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Upload Gambar" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Hanya file gambar yang diperbolehkan.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Gagal mengunggah gambar");
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengunggah.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 bg-white/80 hover:bg-white text-red-500 rounded-full p-1 shadow-sm backdrop-blur-sm transition-colors"
              title="Hapus gambar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ) : (
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        
        <div className="flex-1">
          <input 
            type="file" 
            accept="image/*"
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengunggah...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  Pilih File
                </>
              )}
            </button>
            <div className="flex-1 relative">
              <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                placeholder="Atau paste URL gambar..." 
                className="w-full text-sm border-gray-200 shadow-sm rounded-xl px-4 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#06371c]/20 focus:border-[#06371c] transition-all outline-none"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
          <p className="text-gray-400 text-xs mt-2">Maksimal ukuran file 5MB. Format JPG, PNG, atau WebP.</p>
        </div>
      </div>
    </div>
  );
}
