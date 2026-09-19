export const metadata = {
  title: "Kelola Landing Page - Admin",
};

export default function LandingPageAdmin() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Kelola Landing Page</h2>
      <p className="text-gray-600 mb-8">
        Halaman ini akan digunakan untuk mengubah konten di halaman beranda (Landing Page) seperti teks hero, layanan, dan portofolio.
      </p>
      
      <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
        <p className="text-gray-500 font-medium">Fitur dalam tahap pengembangan.</p>
      </div>
    </div>
  );
}
