# Syalala Digital Menu

Aplikasi website digital menu restoran **Syalala** dibangun menggunakan Next.js 16 App Router, TypeScript, Tailwind CSS, dan Supabase.

## ✨ Fitur Utama
- **Customer Pages**: Home page, daftar menu, detail menu dengan fitur pencarian dan filter kategori, serta info promo.
- **Admin Dashboard**: Proteksi dengan Supabase Auth, CRUD Menu, Kategori, Promo, dan manajemen konten Home page.
- **Image Storage**: Upload foto menu dan banner menggunakan Supabase Storage.
- **Mobile First**: UI didesain khusus agar nyaman dibuka lewat HP saat pelanggan scan QR Code di meja.

## 🛠 Tech Stack
- Framework: [Next.js 16 (App Router)](https://nextjs.org/)
- Bahasa: [TypeScript](https://www.typescriptlang.org/)
- Styling: [Tailwind CSS v4](https://tailwindcss.com/)
- Ikon: [Lucide React](https://lucide.dev/)
- Backend & DB: [Supabase](https://supabase.com/)

## 🚀 Cara Setup Lokal

1. **Clone & Install**
   ```bash
   git clone https://github.com/ahmadusmannnn2/syalala-digital-menu.git
   cd syalala-digital-menu
   npm install
   ```

2. **Setup Supabase Project**
   - Buat project baru di [Supabase](https://database.new).
   - Masuk ke SQL Editor di dashboard Supabase.
   - Copy dan paste isi file berurutan untuk membuat tabel dan data awal:
     1. `supabase/migrations/001_schema.sql` (Tabel & RLS Policies)
     2. `supabase/seed.sql` (Data Awal / Dummy data)
     3. `supabase/storage.sql` (Aturan bucket storage)

3. **Setup Environment Variables**
   - Copy `.env.example` menjadi `.env.local`
   ```bash
   cp .env.example .env.local
   ```
   - Isi kredensial Supabase dari *Project Settings -> API*:
     - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Project API Keys (anon/public)
     - `SUPABASE_SERVICE_ROLE_KEY` = Project API Keys (service_role)

4. **Buat Akun Admin**
   - Masuk ke dashboard Supabase -> Authentication -> Users.
   - Tambahkan user baru (Add user -> Create new user) dengan email dan password. User ini akan digunakan untuk login di `/admin/login`.

5. **Jalankan Aplikasi**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser.

## 🌐 Cara Deploy ke Vercel

1. Push kode ke repositori GitHub.
2. Buat project baru di [Vercel](https://vercel.com/) dan import repo GitHub.
3. Tambahkan **Environment Variables** di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

## 📝 Catatan Penting
- Jangan pernah membagikan `SUPABASE_SERVICE_ROLE_KEY` ke sisi klien (browser). Hanya gunakan di Server Actions / API Routes.
- `next.config.ts` sudah dikonfigurasi untuk mengizinkan domain `*.supabase.co` untuk memuat gambar dari Supabase Storage.
