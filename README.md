# Yehezkiel Haganta Portfolio Frontend

Frontend ini menggunakan **Vite, React, TypeScript, Tailwind CSS v4**, dan React Router. Halaman publik dan dashboard admin tetap memakai backend PHP di `../backend`. Kiro memakai API Next.js yang di-host secara terpisah.

## Menjalankan lokal

```powershell
cd yehezkiel-haganta
npm install
Copy-Item .env.example .env
npm run dev
```

Vite tersedia di `http://localhost:5173`. Pastikan PHP API berjalan dan CORS backend PHP mengizinkan origin tersebut. Untuk Kiro lokal, `KIRO_ALLOWED_ORIGINS` di project Next.js juga harus memuat `http://localhost:5173`.

## Variabel frontend

Atur `VITE_API_BASE_URL` di `.env` ke base URL backend PHP, misalnya:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Jika variabel ini kosong, frontend memakai `http://localhost:8000`. Variabel berawalan `VITE_` masuk ke bundle browser; jangan simpan password, token layanan, atau secret di dalamnya.

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
├── App.tsx                  # provider dan route
├── index.css                # Tailwind, tema, dan style dasar
├── types.ts                 # tipe data portfolio dan form
├── api/backendApi.ts        # Axios client PHP
├── context/                 # sesi login dan tema
├── pages/                   # public, login, dashboard, logout
└── components/              # section publik, Kiro, dan editor admin
```

`/` menampilkan profil, About Me, proyek, pengalaman, skill, technical domains, Kiro, links, dan kontak. `/login` dan `/dashboard` menyediakan editor konten; perubahan data tetap divalidasi oleh backend PHP. Token admin disimpan di `localStorage`, lalu dikirim bersama request admin.

## Layanan Kiro

`src/components/KiroAI.tsx` mengirim pertanyaan dan riwayat chat ke endpoint yang diatur lewat `VITE_KIRO_API_URL`. Origin frontend harus diizinkan oleh `KIRO_ALLOWED_ORIGINS` di project Next.js yang melayani endpoint. Nilainya berupa origin saja, seperti `http://localhost:5173` atau `https://domain-frontend.example`, tanpa path atau garis miring di akhir. Komponen mencatat payload request dan sumber RAG di console browser untuk debugging, sehingga teks pesan yang dikirim terlihat melalui Developer Tools.

## Deploy

Untuk hosting statis, gunakan root proyek `yehezkiel-haganta`, build command `npm run build`, dan output directory `dist`. Set `VITE_API_BASE_URL` ke URL backend PHP yang dapat dijangkau browser. Backend PHP dan layanan Kiro di-deploy terpisah. Pastikan masing-masing mengizinkan origin website melalui CORS, dan atur SPA fallback ke `index.html` untuk route frontend.
