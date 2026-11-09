# Sigavera — MVP Konsultasi Online & Penanganan Hama Perseorangan

Website layanan konsultasi online dan penanganan hama perseorangan berbahasa Indonesia. Dirancang agar calon pelanggan memahami siapa penyedianya, perbedaan layanan konsultasi online dan kunjungan langsung, kisaran biaya awal, serta menyusun pesan terstruktur untuk dikirim melalui WhatsApp.

> **Catatan Dokumentasi Paket:** Panduan asli paket spesifikasi disimpan secara utuh di [README-paket.md](README-paket.md).

---

## 1. Arsitektur & Batas MVP

- **Tanpa Backend Pemesanan / Database:** Seluruh isian formulir diproses di memori halaman browser (`React state`). Tidak ada API endpoint pemesanan, Server Action pemesanan, database, login, unggah berkas, payment gateway, maupun penyimpanan `localStorage` / `sessionStorage` / cookie draf.
- **Alur WhatsApp Click-to-Chat:** Pengunjung memilih layanan → mengisi kondisi & area → meninjau pratinjau plain text → menyetujui pemahaman perpindahan data → membuka tautan `https://wa.me/<nomor>?text=<pesan>` atau menyalin teks pesan secara manual.
- **Kejujuran Status:** Situs hanya menyiapkan ringkasan pesan. Pengunjung tetap harus menekan tombol kirim di aplikasi WhatsApp. Situs tidak pernah mengklaim bahwa pesan telah terkirim, jadwal telah tersedia, atau pembayaran telah selesai.

---

## 2. Teknologi & Versi Utama

- **Runtime & Package Manager:** Node.js `v24.21.0`, `npm` `11.19.0` (satu lockfile: `package-lock.json`)
- **Framework:** Next.js App Router (`^15.2.0`), React (`^19.0.0`), TypeScript strict (`^5.7.3`)
- **Styling:** Tailwind CSS (`^3.4.17`) dengan token CSS terpusat di [`src/app/globals.css`](src/app/globals.css) sesuai [`desain.md`](desain.md)
- **Formulir & Validasi:** React Hook Form (`^7.54.2`) + Zod (`^3.24.2`)
- **Ikon:** Lucide React (`^0.475.0`) seperlunya
- **Pengujian:** Vitest + Testing Library (unit & integrasi komponen) dan Playwright + Axe-core (E2E, responsif, header, aksesibilitas)

---

## 3. Cara Menjalankan Secara Lokal

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server pengembangan lokal (http://localhost:3000)
npm run dev

# 3. Jalankan pemeriksaan kualitas kode
npm run typecheck
npm run lint
npm test

# 4. Buat build produksi lokal (mode pratinjau draf tetap diizinkan)
npm run build
npm run start

# 5. Periksa kesiapan rilis produksi (gagal bila data bisnis wajib belum lengkap)
npm run check:release
```

---

## 4. Struktur Proyek

```text
.
├── .agents/rules/                 # Pemuat aturan Antigravity (00-agent, 10-security, 20-engineering)
├── rules/                         # Dokumen aturan keamanan & engineering
├── scripts/
│   └── check-release.mjs          # Pemeriksaan kelengkapan data wajib sebelum rilis produksi
├── src/
│   ├── app/
│   │   ├── globals.css            # Token warna semantik, fokus aksesibel, reduced-motion
│   │   ├── layout.tsx             # Root layout (lang="id"), SkipLink, SiteHeader, SiteFooter
│   │   ├── page.tsx               # Beranda (/)
│   │   ├── pesan/page.tsx         # Halaman formulir 2 tahap (/pesan)
│   │   ├── tentang/page.tsx       # Profil & pendekatan kerja penyedia (/tentang)
│   │   ├── kebijakan-privasi/     # Kebijakan privasi jujur sesuai arsitektur (/kebijakan-privasi)
│   │   ├── syarat-layanan/        # Syarat layanan & penanda draf (/syarat-layanan)
│   │   ├── not-found.tsx          # Halaman 404
│   │   ├── robots.ts              # Aturan indeksasi mesin pencari
│   │   └── sitemap.ts             # Sitemap produksi
│   ├── components/
│   │   ├── layout/                # SkipLink, SiteHeader, MobileMenu, SiteFooter
│   │   ├── home/                  # Hero, Services, Process, Provider, Pricing, FAQ
│   │   └── booking/               # BookingForm, ErrorSummary, MessagePreview
│   ├── config/
│   │   └── site.ts                # Pusat konfigurasi data bisnis & status kesiapan rilis
│   ├── content/
│   │   └── home.ts                # Copy editorial beranda, langkah proses, dan item FAQ
│   └── lib/
│       ├── booking-schema.ts      # Skema Zod, batas panjang UTF-16, allowlist query layanan
│       ├── booking-message.ts     # Fungsi murni penyusun pesan plain text
│       ├── whatsapp-url.ts        # Builder URL wa.me + guardrail 6.000 karakter
│       └── site-config.ts         # Format mata uang & evaluator kesiapan rilis
├── tests/
│   ├── unit/                      # Tes fungsi murni (schema, message, URL, readiness)
│   ├── integration/               # Tes interaksi komponen BookingForm
│   └── e2e/                       # Tes Playwright (rute, header, responsif, axe, no-JS)
├── README-paket.md                # Dokumentasi asli paket spesifikasi
└── README.md                      # Dokumentasi aplikasi ini
```

---

## 5. Pengisian Data Bisnis & Daftar Wajib Sebelum Publikasi

Seluruh data publik usaha dikelola terpusat di [`src/config/site.ts`](src/config/site.ts). Secara bawaan, aplikasi berada pada mode `contentStatus: 'draft'` sehingga preview lokal dapat dijalankan dengan aman tanpa nomor telepon palsu.

Sebelum memublikasikan ke domain produksi (`npm run build:release`), pemilik **wajib** melengkapi item berikut di `src/config/site.ts`:

| Penanda | Field di `src/config/site.ts` | Status Saat Ini | Syarat Rilis Produksi |
| --- | --- | --- | --- |
| `NAMA_USAHA` | `businessName`, `isBusinessNameFinal` | `"Konsultasi Hama"` (`false`) | Tetapkan nama usaha final & ubah `isBusinessNameFinal: true` |
| `NAMA_PENYEDIA` | `providerName` | `""` (Kosong) | Isi nama asli penyedia jasa perseorangan |
| `WA_NUMBER` | `whatsappNumber`, `isWhatsappVerifiedByOwner` | `""` (`false`) | Format digit internasional Indonesia (`628...`, maks 15 digit) & konfirmasi kepemilikan (`true`) |
| `SITE_URL` | `siteUrl` | `""` (Kosong) | URL produksi berawalan `https://` |
| `KOTA_BASIS` | `baseCity` | `""` (Kosong) | Isi nama kota/area keberangkatan (tanpa alamat rumah lengkap) |
| `JAM_LAYANAN` | `serviceHours` | `""` (Kosong) | Isi jam operasional yang disepakati (jangan klaim 24 jam) |
| `HARGA_KONSULTASI` | `consultationPricing` | `Rp20.000–Rp25.000` (`isFinalized: false`) | Pastikan biaya, durasi sesi (`sessionDuration`), dan cakupan (`isFinalized: true`) |
| `KETENTUAN_LAYANAN` | `termsStatus` | Semua `false` | Tetapkan kebijakan pembayaran, penjadwalan ulang, pembatalan/refund, & retensi chat |
| `STATUS_KONTEN` | `contentStatus` | `'draft'` | Ubah menjadi `'ready'` setelah seluruh data di atas diverifikasi pemilik |

### Contoh Konfigurasi Kosong yang Aman (`.env.example`)

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WA_NUMBER=
NEXT_PUBLIC_CONTENT_STATUS=draft
```

---

## 6. Pemasangan Foto & Aset Berizin (Opsional)

1. Saat `heroPhoto` dan `providerPhoto` bernilai `null`, situs menampilkan panel ringkasan hijau tua editorial yang utuh sesuai [`desain.md`](desain.md).
2. Jika pemilik memiliki foto kegiatan asli yang berizin:
   - Hapus metadata EXIF/lokasi sensitif dan optimalkan ke format WebP/AVIF (target ukuran hero ponsel ≤ 220 KB).
   - Simpan di `public/images/` (jangan menaruh aset referensi pihak ketiga di `public/`).
   - Isi objek `heroPhoto` / `providerPhoto` di `src/config/site.ts` beserta `alt` deskriptif, `caption` aktivitas nyata, dan `licenseConfirmed: true`.

---

## 7. Hosting, Security Headers & Batas CSP

Konfigurasi [`next.config.ts`](next.config.ts) menerapkan header keamanan berikut pada seluruh rute:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: no-referrer`
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy`: baseline ketat untuk aset lokal (`default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`, `frame-ancestors 'none'`).
  - *Catatan Keterbatasan:* Mengikuti `rules/security.md`, kebijakan awal menyertakan `'unsafe-inline'` pada `script-src` dan `style-src` agar kompatibel dengan hidrasi halaman statis Next.js. Pencegahan XSS tetap mengandalkan interpolasi teks bawaan React dan larangan penggunaan `dangerouslySetInnerHTML`.
  - Apabila kelak di-deploy menggunakan mode `output: 'export'` pada hosting statis murni, salin konfigurasi header di atas ke konfigurasi platform hosting/CDN.
