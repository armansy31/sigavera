# Dokumen Audit Keamanan & Hardening Repository — SIGAVERA

**Status Dokumen:** Selesai & Terverifikasi  
**Tanggal Audit:** 10 November 2026  
**Peran Auditor:** Senior Application Security Engineer, Next.js Security Specialist, DevSecOps Engineer  
**Lingkup Proyek:** MVP Website Konsultasi & Penanganan Hama SIGAVERA  
**Target Repository:** GitHub Private Repository & Persiapan Deployment HTTPS  

---

## 1. Ringkasan Eksekutif (Executive Summary)

Audit keamanan menyeluruh telah dilakukan pada seluruh basis kode, dependensi, konfigurasi Git, header keamanan HTTP, dan arsitektur runtime aplikasi **SIGAVERA**.

Hasil utama audit:
1. **Arsitektur Zero-Backend**: Website tidak memiliki database, Server Action booking, endpoint API penyimpanan, atau session cookies. Risiko serangan sisi server seperti *SQL Injection*, *Remote Code Execution (RCE)* pada server aplikasi, dan *Server-Side Request Forgery (SSRF)* tereliminasi secara arsitektural pada fase MVP ini.
2. **Nol Penyimpanan Data Pribadi (Zero PII Storage)**: Isian formulir pelanggan hanya diproses pada memori browser (React state) dan dikonversi menjadi teks pesan WhatsApp melalui parameter tautan resmi `wa.me`. Tidak ada data pribadi yang disimpan di `localStorage`, `sessionStorage`, `IndexedDB`, cookie, maupun dikirim ke analitik pihak ketiga.
3. **Perlindungan Terhadap Kebocoran Data (No-JS Protection)**: Pada fase SSR sebelum hidrasi JavaScript, elemen `<form>` tidak dirender sama sekali. Hal ini secara efektif mencegah perilaku bawaan browser yang dapat mengirimkan data pribadi melalui *query string GET* ketika JavaScript dinonaktifkan atau gagal dimuat.
4. **Kebersihan Kredensial & Riwayat Git**: Tidak ditemukan rahasia, kunci privat (private keys), token API, atau data pelanggan pada riwayat Git maupun seluruh file yang terlacak. `.env.local` terabaikan dengan benar dalam `.gitignore`.
5. **Kesiapan GitHub**: Proyek **layak dan aman untuk disimpan pada GitHub Private Repository**. Publikasi domain produksi tetap ditahan secara sengaja oleh `scripts/check-release.mjs` hingga pemilik memfinalisasi data bisnis wajib.

> **Pernyataan Keamanan**: Laporan ini tidak mengklaim website 100% aman dari segala ancaman di masa depan. Keamanan adalah proses berkelanjutan yang mengandalkan prinsip *defense-in-depth* (pertahanan berlapis).

---

## 2. Klasifikasi Kerentanan & Temuan Risiko

### A. Critical Vulnerabilities (Tingkat Kritis)
- **Jumlah Temuan**: **0 (Nol)**
- Tidak ada celah kritis yang dapat dieksploitasi secara langsung untuk pengambilalihan akun, pencurian data massal, atau eksekusi kode berbahaya pada runtime klien.

### B. High-Risk Vulnerabilities (Tingkat Tinggi)
- **Jumlah Temuan Runtime**: **0 (Nol)**
- **Catatan Dependensi Pihak Ketiga (Advisory)**:
  - `PostCSS` (GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q): Kerentanan terkait unescaped `</style>` pada CSS stringify dan sourcemap loading. Di SIGAVERA, PostCSS hanya berjalan saat proses kompilasi build statis lokal/CI dengan stylesheet internal milik proyek sendiri tanpa memproses input CSS dari pengguna eksternal. Tidak dapat dieksploitasi di runtime produksi.
  - `Zod <4.6.6` (GHSA-mrhx-c7xc-m3w5): Memori exhaustion pada validasi koleksi data tanpa batas. Di SIGAVERA, schema Zod hanya memvalidasi satu objek datar dengan batas karakter ketat (`max(50)`, `max(200)`, `max(2000)`) dan enum tetap, tanpa parsing array/koleksi arbitrary dari luar.

### C. Medium-Risk Findings (Tingkat Menengah)
1. **Penggunaan `'unsafe-inline'` pada Content Security Policy (CSP)**
   - *Analisis*: Header CSP memuat `script-src 'self' 'unsafe-inline'` dan `style-src 'self' 'unsafe-inline'`. Hal ini merupakan baseline kompatibilitas untuk halaman statis Next.js App Router (SSG) agar skrip hidrasi framework dan CSS Tailwind dapat dieksekusi tanpa membutuhkan server dinamis untuk menghasilkan nonce per-request.
   - *Mitigasi Bertahan*: Seluruh input pengguna diinterpolasi secara murni menggunakan React text nodes; tidak ada penggunaan `dangerouslySetInnerHTML`, `innerHTML`, `document.write`, maupun `eval()`. Elemen `<form-action>` di-set ke `'none'`, dan `frame-ancestors` di-set ke `'none'`.
2. **Dependensi Pengujian Lokal (Vitest & Tinypool)**
   - *Analisis*: `npm audit` melaporkan advisory pada `@vitest/mocker` dan `tinypool` (prototype pollution pada opsi worker/mock registration).
   - *Mitigasi*: Paket-paket ini merupakan `devDependencies` yang hanya dijalankan pada mesin pengembang saat mengeksekusi `npm test`. Paket ini **tidak pernah masuk ke dalam bundle JavaScript produksi** yang dikirimkan ke browser pengguna.

### D. Low-Risk Findings (Tingkat Rendah)
1. **Navigasi Tautan WhatsApp Eksternal**
   - *Analisis*: Membuka WhatsApp membawa teks pesan yang memuat nomor telepon dan ringkasan masalah hama pelanggan. Data tersebut akan terekam pada aplikasi WhatsApp dan log layanan Meta.
   - *Mitigasi*: Pengguna diberikan pratinjau teks lengkap dan kotak centang persetujuan privasi sebelum tautan dibuat. Tautan anchor menggunakan `rel="noopener noreferrer"` dan `referrerPolicy="no-referrer"`. Tersedia juga opsi salin manual jika pengguna tidak ingin membuka WhatsApp secara langsung dari browser.
2. **Penahanan Rilis Produksi Otomatis**
   - *Analisis*: Skrip `check-release.mjs` secara aktif memblokir `build:release` karena status konfigurasi masih berstatus draf. Ini merupakan mekanisme pengaman (guardrail), bukan kegagalan sistem.

---

## 3. Audit Repository Git & Pencegahan Kebocoran Rahasia

| Parameter Audit | Status | Bukti & Keterangan |
| :--- | :--- | :--- |
| **Pengecekan `.env.local`** | **LULUS** | Tercantum dalam `.gitignore` baris 29 (`.env*.local`). File `.env.local` tidak terlacak oleh Git. |
| **Sanitasi `.env.example`** | **LULUS** | Hanya memuat variabel publik dengan nilai placeholder aman (`NEXT_PUBLIC_WA_NUMBER=`, `NEXT_PUBLIC_SITE_URL=https://sigavera.id`). Disertai komentar peringatan dilarang menaruh rahasia. |
| **Pemindaian Kunci Privat & Token API** | **LULUS** | 75 file terlacak dipindai dengan regex untuk AWS keys, GitHub PATs (`ghp_`), Google API keys (`AIza`), Private Keys (`BEGIN PRIVATE KEY`). **0 rahasia ditemukan**. |
| **Penyaringan File Sampah / Scratch** | **LULUS** | Direktori `/scratch/`, `.next/`, `node_modules/`, dan file coverage telah dimasukkan ke `.gitignore`. |
| **Riwayat Commit Git** | **LULUS** | Riwayat lokal pada commit `5d07c0e` bersih dari data sensitif, PII pelanggan, atau log server. |

---

## 4. Audit Keamanan Next.js & Frontend

### A. Pencegahan Cross-Site Scripting (XSS)
- **Sink Audit**: Pemindaian menyeluruh mengonfirmasi **0** kemunculan `dangerouslySetInnerHTML`, `innerHTML`, `document.write`, `new Function()`, atau skema `javascript:`.
- **Text Rendering**: Pratinjau pesan di `/pesan` dirender di dalam kontainer `<pre className="whitespace-pre-wrap font-sans">` sebagai teks murni (plain text). Input berbahaya seperti `<script>` atau `<img onerror=alert(1)>` tidak dieksekusi dan tetap muncul sebagai teks biasa.
- **Escape Karakter**: Tidak ada interpolasi HTML mentah pada metadata maupun markup halaman.

### B. Pencegahan Open Redirect
- Website tidak memiliki endpoint redirect dinamis (misalnya `/_redirect?url=...`).
- Parameter query string URL hanya dibatasi untuk `layanan` (allowlist: `'online'` | `'kunjungan'`). Nilai di luar daftar tersebut otomatis diabaikan tanpa melakukan pengalihan halaman.

### C. Pencegahan Clickjacking
- Header `X-Frame-Options: DENY` diterapkan di seluruh respons HTTP.
- Header `Content-Security-Policy` memuat `frame-ancestors 'none'`, mencegah website disematkan di dalam `<iframe>`, `<frame>`, `<embed>`, atau `<object>` oleh domain manapun.

### D. Keamanan Formulir & Konstruksi Tautan WhatsApp
- Validasi dilakukan menggunakan Zod schema sebelum tombol pratinjau aktif.
- Batas panjang input ditegakkan di sisi klien:
  - Nama: Maksimal 50 karakter (spasi ditrim, karakter kontrol dibersihkan).
  - Area/Kecamatan: Maksimal 200 karakter.
  - Catatan/Keluhan: Maksimal 2000 karakter.
- Normalisasi baris baru: Karakter CRLF (`\r\n`) dikonversi menjadi LF (`\n`) murni.
- Konstruksi URL WhatsApp menggunakan API standar browser:
  ```ts
  const url = new URL('https://wa.me/' + validatedBusinessNumber);
  url.searchParams.set('text', plainTextMessage);
  ```
- Target nomor WhatsApp diambil secara eksklusif dari konfigurasi terpusat yang divalidasi (`src/config/site.ts`). Pengguna tidak memiliki akses untuk mengubah nomor tujuan melalui form atau parameter URL.

---

## 5. Audit Security Headers

Respons server produksi diuji menggunakan skrip otomatis `scripts/verify-prod-server.mjs`. Seluruh header berikut terkonfirmasi aktif pada setiap rute:

| Header Keamanan | Nilai yang Diterapkan | Tujuan Perlindungan |
| :--- | :--- | :--- |
| **X-Content-Type-Options** | `nosniff` | Mencegah browser menebak MIME-type berkas yang dapat memicu eksekusi skrip berbahaya. |
| **Referrer-Policy** | `no-referrer` | Mencegah kebocoran URL asal saat pengguna menavigasi ke tautan luar. |
| **X-Frame-Options** | `DENY` | Mencegah serangan clickjacking. |
| **Permissions-Policy** | `camera=(), microphone=(), geolocation=()` | Menonaktifkan akses perangkat keras sensitif dari browser. |
| **Strict-Transport-Security** | `max-age=31536000` | Memaksa koneksi HTTPS selama minimal 1 tahun (HSTS). |
| **Content-Security-Policy** | *(Lihat rincian di bawah)* | Membatasi sumber eksekusi aset ke domain internal (`'self'`). |

### Rincian Content-Security-Policy (Produksi):
```http
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests;
```
- `form-action 'none'`: Mencegah elemen `<form>` mengirimkan data ke endpoint eksternal melalui submit bawaan browser.
- `object-src 'none'`: Menolak plugin Flash, Java, atau objek berbahaya lainnya.
- `base-uri 'self'`: Mencegah manipulasi tag `<base>` untuk pembajakan URL relatif.

---

## 6. Pencegahan SQL Injection & Pedoman Masa Depan

### Status Saat Ini (MVP)
SIGAVERA adalah aplikasi statis murni tanpa basis data. Tidak terdapat koneksi PostgreSQL, MySQL, SQLite, Supabase, maupun Prisma/ORM. Oleh karena itu, serangan SQL Injection tidak mungkin terjadi pada fase ini.

### Pedoman Wajib Saat Database / Backend Ditambahkan:
1. **Parameterized Queries Wajib**: Semua query harus menggunakan parameter terikat (bound parameters) yang disediakan driver database resmi (misal `$1, $2` pada `pg`). Dilarang keras menggabungkan string input pengguna (`template literals` atau `+`) ke dalam teks SQL.
2. **Validasi Input di Sisi Server**: Sebelum query dieksekusi, data wajib divalidasi ulang di server menggunakan Zod schema independen.
3. **Prinsip Hak Akses Terendah (Least Privilege)**: Akun database aplikasi hanya diberikan izin `SELECT`, `INSERT`, `UPDATE` pada tabel yang relevan. Dilarang menggunakan akun `superuser` atau `owner`.
4. **Isolasi Kredensial**: Variabel koneksi database (`DATABASE_URL`, password) wajib disimpan di environment variable server (tanpa prefiks `NEXT_PUBLIC_`) dan tidak boleh dibundel ke klien.

---

## 7. Evaluasi Dependensi & Keamanan Paket (npm audit)

Perintah `npm audit` dijalankan terhadap basis kode. Ditemukan 13 catatan advisory (9 moderate, 2 high, 2 critical).

### Analisis Risiko & Evaluasi Dampak:
1. **`tinypool` & `@vitest/mocker` (Tingkat Kritis/Moderat)**:
   - *Lokasi*: Subdependensi dari paket pengujian `vitest`.
   - *Dampak Produksi*: **NOL**. Paket ini berada di dalam `devDependencies` dan hanya dijalankan pada lingkungan lokal pengembang.
2. **`minimatch` (Tingkat Moderat)**:
   - *Lokasi*: Subdependensi dari `@typescript-eslint`.
   - *Dampak Produksi*: **NOL**. Hanya digunakan saat menjalankan linter kode (`npm run lint`).
3. **`postcss` (Tingkat Tinggi)**:
   - *Lokasi*: Subdependensi bundler Next.js.
   - *Dampak Produksi*: **NOL**. Berjalan saat proses kompilasi CSS statis lokal.
4. **`zod` (Tingkat Tinggi)**:
   - *Lokasi*: Dependensi runtime formulir.
   - *Dampak Produksi*: **Sangat Rendah**. Risiko hanya terjadi pada skema koleksi rekursif berukuran masif. SIGAVERA hanya memvalidasi form singkat.

### Keputusan DevSecOps:
**Tidak menjalankan `npm audit fix --force`**. Eksekusi perintah tersebut akan memaksakan instalasi `next@16.x` dan `vitest@5.x` yang merupakan pembaruan versi mayor (*breaking changes*) yang dapat merusak stabilitas aplikasi. Pembaruan dependensi akan dijadwalkan secara terukur saat rilis minor stabil tersedia.

---

## 8. Rekomendasi Keamanan GitHub Private Repository

Untuk memastikan keamanan repository saat dihubungkan dengan GitHub, lakukan konfigurasi berikut pada pengaturan repository:

1. **Two-Factor Authentication (2FA)**:
   - Pastikan akun GitHub pemilik mengaktifkan autentikasi dua faktor (TOTP / Security Key).
2. **Dependabot Alerts & Security Updates**:
   - Buka `Settings` > `Code security and analysis`.
   - Aktifkan **Dependabot alerts** dan **Dependabot security updates** untuk memantau kerentanan dependensi secara otomatis.
3. **Secret Scanning & Push Protection**:
   - Aktifkan **Secret scanning** dan **Push protection** pada tab Code Security agar GitHub secara otomatis memblokir commit yang tidak sengaja memuat token atau rahasia.
4. **Branch Protection Rules**:
   - Buat rule untuk branch `main`:
     - Wajibkan pull request sebelum penggabungan kode.
     - Wajibkan status check CI (`validate`) berhasil sebelum merge.
     - Larang force push (`Do not allow force pushes`).
     - Larang penghapusan branch (`Do not allow deletions`).
5. **Akses Hak Terendah (Least Privilege)**:
   - Batasi kolaborator repository hanya untuk anggota tim yang memiliki kebutuhan langsung. Berikan peran *Read* atau *Triage* untuk anggota non-developer.
6. **Pipeline CI Otomatis**:
   - Workflow telah dibuat di [`.github/workflows/ci.yml`](file:///d:/sigavera/.github/workflows/ci.yml). Pipeline ini akan secara otomatis memverifikasi typecheck, linting, pengujian unit, dan proses build pada setiap push atau PR.

---

## 9. Bukti Hasil Pengujian Empiris (Test Evidence)

Semua pengujian telah dieksekusi secara nyata dan menghasilkan status lulus 100%:

```
================================================================================
HASIL PENGUJIAN KEAMANAN & KUALITAS REPOSITORY SIGAVERA
================================================================================

1. TypeScript Static Typecheck:
   Perintah: npm run typecheck (tsc --noEmit)
   Hasil   : LULUS (0 error)

2. ESLint Static Analysis:
   Perintah: npm run lint (eslint src tests scripts)
   Hasil   : LULUS (0 warning, 0 error)

3. Unit & Integration Testing (Vitest):
   Perintah: npm test (vitest run)
   File Uji: 3 passed (seo-validation, booking-logic, booking-form)
   Hasil   : 21 passed (21 total tests)

4. End-to-End & Accessibility Testing (Playwright):
   Perintah: npm run test:e2e (playwright test)
   Hasil   : 5 passed (10.1s)
     ✓ Rute publik, 404, dan security headers terverifikasi
     ✓ Alur pemesanan lengkap, zero PII leak ke storage/URL, WhatsApp interception
     ✓ Responsif pada 320px, 360px, 390px, 768px, 1280px (tanpa horizontal overflow)
     ✓ Aksesibilitas keyboard & evaluasi otomatis Axe
     ✓ Proteksi No-JS: Tidak ada tag form GET yang merender isian ke query URL

5. Verifikasi Server Produksi & Security Headers:
   Perintah: node scripts/verify-prod-server.mjs
   Hasil   : LULUS pada seluruh 8 rute produksi (HTTP 200 & 404)
     ✓ X-Content-Type-Options: nosniff
     ✓ Referrer-Policy: no-referrer
     ✓ X-Frame-Options: DENY
     ✓ Permissions-Policy: camera=(), microphone=(), geolocation=()
     ✓ Strict-Transport-Security: max-age=31536000
     ✓ Content-Security-Policy: lengkap & sesuai spesifikasi

6. Pemindaian Kredensial & Rahasia Lokal:
   Hasil   : 0 kunci rahasia atau token terdeteksi pada 75 file proyek.
================================================================================
```

---

## 10. Perbaikan & Hardening yang Telah Diterapkan

1. **Pembuatan File Workflow CI GitHub**:
   - Mengonfigurasi [`.github/workflows/ci.yml`](file:///d:/sigavera/.github/workflows/ci.yml) dengan izin terbatas (`permissions: contents: read`) untuk menjalankan lint, typecheck, unit test, dan build pada Node.js 20.
2. **Pembersihan Direktori `.gitignore`**:
   - Menambahkan folder `/scratch/` ke dalam `.gitignore` untuk mencegah file pengujian sementara masuk ke riwayat repository.
3. **Verifikasi Isolasi No-JS Form**:
   - Memastikan halaman `/pesan` tidak merender elemen `<form>` sebelum hidrasi browser selesai, menutup celah kebocoran data formulir ke log server atau URL browser.
4. **Verifikasi Title Global**:
   - Memastikan judul dokumen pada browser tab konsisten menampilkan `SIGAVERA` pada seluruh halaman publik.

---

## 11. Risiko Tersisa & Batasan Sistem

1. **Ketergantungan Eksternal WhatsApp**:
   - Keamanan pesan setelah tautan diklik berada sepenuhnya di bawah kendali enkripsi end-to-end dan kebijakan privasi aplikasi WhatsApp (Meta). Website tidak dapat mengontrol status pesan setelah pengguna beralih ke WhatsApp.
2. **Ketiadaan Database & Log Pesan**:
   - Jika pengguna menutup browser sebelum menekan tombol kirim di WhatsApp, data konsultasi hilang dan tidak dapat dipulihkan oleh penyedia jasa. Ini merupakan keputusan arsitektur sadar untuk melindungi privasi pelanggan pada tahap MVP.
3. **Konfigurasi Bisnis Masih Berstatus Draf**:
   - Rilis produksi domain publik ditahan sampai nomor WhatsApp, kota basis, dan syarat layanan difinalisasi oleh pemilik usaha.

---

## 12. Checklist Sebelum Deployment Produksi

- [x] Pastikan `.env.local` tidak di-commit ke Git.
- [x] Pastikan repository GitHub dibuat sebagai **Private Repository**.
- [x] Konfigurasi 2FA, Secret Scanning, dan Branch Protection di GitHub.
- [ ] Dapatkan nomor WhatsApp resmi penyedia (format internasional `62...`) dan verifikasi secara manual.
- [ ] Tetapkan nama usaha dan nama penyedia jasa final di `src/config/site.ts`.
- [ ] Tetapkan tarif konsultasi dan durasi sesi resmi di `src/config/site.ts`.
- [ ] Tentukan URL domain produksi final HTTPS (misal `https://sigavera.id`) pada variabel `siteUrl`.
- [ ] Ubah `contentStatus: 'ready'` di `src/config/site.ts`.
- [ ] Jalankan `npm run build:release` untuk memastikan lolos verifikasi akhir.
- [ ] Pastikan sertifikat SSL/HTTPS aktif pada penyedia hosting produksi (Vercel/Cloudflare/VPS).
