# Yehezkiel Haganta Portfolio Frontend

Frontend ini dibuat dengan **Vite, React, TypeScript, dan Tailwind CSS v4** untuk menampilkan portfolio publik dari backend PHP serta menyediakan Kiro AI melalui API terpisah. Pengelolaan konten berada di luar build ini.

## Menjalankan lokal

```powershell
cd yehezkiel-haganta
npm install
Copy-Item .env.example .env
npm run dev
```

Vite tersedia di `http://localhost:5173`. Pastikan endpoint publik backend PHP dapat dijangkau browser dan CORS backend mengizinkan origin tersebut. Untuk Kiro lokal, `KIRO_ALLOWED_ORIGINS` di project API harus memuat `http://localhost:5173`.

## Variabel frontend

Atur `VITE_API_BASE_URL` di `.env` ke base URL backend PHP, misalnya:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Jika variabel ini kosong, frontend memakai `http://localhost:8000`. Variabel berawalan `VITE_` masuk ke bundle browser; jangan simpan secret layanan di dalamnya.

`VITE_KIRO_API_URL` menentukan endpoint Kiro. Nilai default-nya adalah `https://yehezkiel-haganta.vercel.app/api/ask-kiel`.

## Perintah

```powershell
npm run dev       # server development Vite
npm run typecheck # pemeriksaan tipe TypeScript
npm run build     # hasil production pada dist/
npm run preview   # pratinjau build production
npm run lint      # ESLint
```

## Susunan kode

```text
src/
├── main.tsx                 # entry React
├── App.tsx                  # aplikasi publik dan provider tema
├── index.css                # Tailwind, tema, dan style dasar
├── types.ts                 # tipe data portfolio publik
├── api/backendApi.ts        # Axios client untuk endpoint publik PHP
├── context/ThemeContext.tsx # pengaturan tema
├── pages/Public.tsx         # halaman portfolio
└── components/              # section publik, Kiro, ikon, dan animasi
```

Halaman `/` menampilkan profil, About Me, proyek, pengalaman, skill, technical domains, Kiro, links, dan kontak. Konten dibaca melalui endpoint publik; fitur mengubah konten tidak ada di frontend ini.

## Layanan Kiro

`src/components/KiroAI.tsx` mengirim pertanyaan dan riwayat chat ke endpoint yang diatur lewat `VITE_KIRO_API_URL`. Origin frontend harus diizinkan oleh `KIRO_ALLOWED_ORIGINS` di project API yang melayani endpoint. Nilainya berupa origin saja, seperti `http://localhost:5173` atau `https://domain-frontend.example`, tanpa path atau garis miring di akhir.

## Deploy

Untuk hosting statis, gunakan root proyek `yehezkiel-haganta`, build command `npm run build`, dan output directory `dist`. Set `VITE_API_BASE_URL` ke URL backend PHP yang dapat dijangkau browser. Backend PHP dan layanan Kiro di-deploy terpisah. Pastikan masing-masing mengizinkan origin website melalui CORS, dan atur SPA fallback ke `index.html` untuk route frontend.
