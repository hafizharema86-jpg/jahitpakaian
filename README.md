<<<<<<< HEAD
# JahitPakaian.com - Landing Page & Lead Generation

Proyek ini adalah sistem landing page sekaligus aplikasi penangkap prospek (lead generation) untuk bisnis jasa jahit pakaian profesional. Dibangun dengan memprioritaskan performa tinggi, desain premium modern, dan pengalaman pengguna (UX) yang sangat responsif, demi memaksimalkan konversi pelanggan melalui WhatsApp.

## 🚀 Teknologi yang Digunakan

Proyek ini menggunakan _tech stack_ modern berikut:

- **Next.js** — Framework utama (App Router) yang handal untuk SSR dan API Routes.
- **TypeScript** — Digunakan di seluruh *codebase* untuk menjaga *type safety* dan meminimalisir *bug*.
- **Tailwind CSS** — Framework *styling* utama untuk menyusun desain responsif, *glassmorphism*, dan animasi yang cepat.
- **MySQL** — Basis data relasional yang kokoh untuk penyimpanan aman data prospek (lead) dan pesanan.
- **Prisma ORM** — Akses database yang sangat efisien dan _type-safe_ untuk berinteraksi dengan MySQL.
- **Vercel** — Platform *deployment* utama yang terintegrasi secara _native_ dengan Next.js.
- **WhatsApp API** — Digunakan sebagai jembatan komunikasi final dengan pelanggan melalui *pre-filled messages* dinamis.

## 🛠️ Persiapan & Instalasi (Development)

1. **Clone repository ini dan install dependensi:**
   ```bash
   npm install
   ```

2. **Konfigurasi Lingkungan (Environment Variables):**
   Pastikan Anda telah menyalin atau membuat file `.env` di akar folder (root) proyek, dan menyetel konfigurasi database:
   ```env
   DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```

3. **Sinkronisasi Database (Prisma):**
   Untuk membuat tabel di MySQL sesuai dengan model yang ada:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya.

## 📂 Struktur Penting
- `src/app/page.tsx`: Halaman pendaratan (Landing Page) utama.
- `src/app/api/leads/route.ts`: API Backend untuk menangkap dan menyimpan *form submission* termasuk fitur unggah (upload) file.
- `src/components/LeadForm.tsx`: Komponen reaktif Form Prospek sisi klien.
- `prisma/schema.prisma`: Skema dan arsitektur database.

## 🚀 Deployment (Vercel)
Untuk melakukan *deploy* aplikasi ini, kami sangat menyarankan [Vercel](https://vercel.com).
Jangan lupa untuk menyetel *Environment Variables* (`DATABASE_URL`) di *dashboard* proyek Vercel Anda sebelum melakukan _build_.

## 🔄 Alur Sistem
1. **Pengunjung** membuka `jahitpakaian.com`.
2. Pengunjung melihat **layanan & portfolio** yang tersedia.
3. Pengunjung mengklik tombol **Konsultasi/Pesan**.
4. Pengunjung **mengisi form** (Nama, WhatsApp, dsb) beserta unggah referensi jika ada.
5. Data dikirim ke **API Next.js**.
6. Sistem melakukan **validasi data** bawaan.
7. Sistem **menyimpan** data pengunjung ke database **MySQL** via Prisma.
8. Sistem **menampilkan pesan konfirmasi** berhasil kepada pengunjung.
9. Pelanggan otomatis **diarahkan ke WhatsApp** dengan format pesan yang sudah disiapkan berdasarkan isian form.
=======
# jahitpakaian
>>>>>>> 06b80bdc387c389abfd7be3cb451705e138db9fd
