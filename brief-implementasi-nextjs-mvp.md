# Brief Implementasi Next.js MVP

## 1. Hasil yang dibangun

Website publik berbahasa Indonesia untuk penyedia konsultasi hama perseorangan. Pengunjung memahami biaya awal, memilih layanan, menyusun pesan yang relevan, dan melanjutkan percakapan melalui WhatsApp. Jadwal, harga final, pembayaran, serta kesepakatan tindakan tetap ditangani secara manual.

Indikator penerimaan MVP: pengunjung ponsel dapat menemukan harga dan perbedaan layanan, mengisi form, memperbaiki error, meninjau pesan, serta membuka/salin pesan tanpa kehilangan kendali atas apa yang dikirim. Situs tidak memiliki bukti pengiriman atau penerimaan pesan.

## 2. Arsitektur dan aliran data

~~~mermaid
flowchart TD
  A[Halaman publik Next.js] --> B[Form di browser]
  B --> C[Validasi dan pratinjau teks]
  C --> D{Aksi pelanggan}
  D --> E[Salin pesan]
  D --> F[Buka tautan wa.me]
  F --> G[Pelanggan menekan kirim di WhatsApp]
  G --> H[Kesepakatan layanan, jadwal dan biaya]
~~~

Tidak ada API booking, database atau penyimpanan draft persisten. Isian berada di memori halaman. Tautan wa.me membawa isi pesan ke WhatsApp; jelaskan perpindahan data sebelum pengguna mengaktifkannya. Konten halaman dan konfigurasi bersifat publik. Tidak ada data rahasia yang dibutuhkan di frontend.

Pilihan awal hosting: deployment Next.js standar dengan halaman publik diprerender dan konfigurasi header. Pilihan static export hanya jika hosting mengharuskannya; lihat [aturan engineering](rules/engineering.md). Kebijakan ini menjaga MVP sederhana tanpa memaksa mode deployment yang tidak dibutuhkan.

## 3. Teknologi

| Kebutuhan | Pilihan |
| --- | --- |
| Framework | Next.js App Router, versi stabil kompatibel saat implementasi |
| Bahasa | TypeScript strict |
| Styling | Tailwind CSS, token CSS terpusat menurut desain.md |
| Form | React Hook Form + Zod; kontrak schema menjadi sumber validasi |
| Komponen | HTML native terlebih dahulu; shadcn/ui hanya jika diperlukan |
| Ikon | Lucide React, seperlunya |
| Kontak | Tautan resmi WhatsApp click-to-chat; tidak perlu SDK/API token |
| Pemeriksaan | Tooling repo; alternatif Vitest untuk fungsi dan Playwright untuk alur |
| Pembayaran | Kesepakatan manual lewat percakapan; tidak ada checkout di situs |

Jangan menentukan nomor versi dari ingatan lalu mencampur dokumentasi versi lain. Catat versi yang benar-benar dipasang dan gunakan lockfile.

## 4. Sitemap dan isi halaman

| Route | Isi wajib | CTA / catatan |
| --- | --- | --- |
| / | Hero, cakupan hama, dua layanan, cara kerja, profil singkat, biaya/jangkauan, FAQ, footer | Konsultasi → /pesan?layanan=online; kunjungan → /pesan?layanan=kunjungan |
| /pesan | Form satu kolom, error summary, preview, pemberitahuan privasi, tautan WhatsApp dan fallback salin | Pilihan layanan dari query hanya jika valid |
| /tentang | Identitas penyedia, pendekatan kerja, kota basis dan area fleksibel, bukti asli jika ada | Kontak; jangan mengarang riwayat/sertifikasi |
| /kebijakan-privasi | Data form, tujuan, proses di browser, WhatsApp, log hosting, kontak dan kebijakan percakapan | Draf lengkap yang harus disesuaikan dengan operasional nyata |
| /syarat-layanan | Cakupan konsultasi, biaya awal/terpisah, kesepakatan jadwal, pembayaran, pembatalan/refund | Penanda ketentuan belum final menahan rilis |

Sediakan not-found/404 dengan tautan beranda dan kontak yang valid. Tidak perlu blog, halaman per jenis hama, halaman login, dashboard atau halaman “sukses booking”.

## 5. Struktur folder aplikasi

Pohon ini adalah target setelah aplikasi dibuat. Berkas paket dokumentasi tetap ada di root.

~~~text
.
├─ .agents/rules/                 # Pemuat aturan dari paket
├─ agent.md
├─ desain.md
├─ rules/
├─ prompt-master-antigravity.md
├─ brief-implementasi-nextjs-mvp.md
├─ public/
│  ├─ images/                     # Foto yang benar-benar berizin
│  └─ fonts/                      # Bila memakai font lokal berlisensi
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx               # lang=id, metadata dasar, header/footer
│  │  ├─ globals.css              # Token warna, tipografi, fokus
│  │  ├─ page.tsx
│  │  ├─ pesan/page.tsx
│  │  ├─ tentang/page.tsx
│  │  ├─ kebijakan-privasi/page.tsx
│  │  ├─ syarat-layanan/page.tsx
│  │  ├─ not-found.tsx
│  │  ├─ robots.ts
│  │  └─ sitemap.ts
│  ├─ components/
│  │  ├─ layout/                  # SiteHeader, MobileMenu, SiteFooter, SkipLink
│  │  ├─ home/                    # Hero, Services, Process, Provider, Pricing, FAQ
│  │  ├─ booking/                 # BookingForm, ErrorSummary, MessagePreview
│  │  └─ ui/                      # Field, Button/Link, primitive seperlunya
│  ├─ config/site.ts              # Semua fakta usaha publik + status kelengkapannya
│  ├─ content/                    # FAQ, copy dan ketentuan yang mudah diubah
│  ├─ lib/booking-schema.ts        # Schema + tipe/konstanta enum
│  ├─ lib/booking-message.ts       # Input tervalidasi → plain text
│  ├─ lib/whatsapp-url.ts          # Nomor bisnis + teks → URL / hasil gagal terstruktur
│  └─ lib/site-config.ts           # Validasi konfigurasi dan readiness rilis
├─ tests/                         # Perilaku fungsi dan alur penting
├─ scripts/                       # Cek konfigurasi rilis bila perlu
├─ next.config.ts                 # Sesuaikan ekstensi dengan versi repo
├─ package.json
├─ satu-lockfile
└─ README.md                      # Cara menjalankan aplikasi, data dan deploy
~~~

Paket memiliki README dokumentasi. Saat implementasi, pertahankan panduan ini misalnya sebagai README-paket.md lalu tulis README aplikasi yang merujuknya; jangan kehilangan instruksi pemasangan.

**Batas komponen:** Halaman, section konten, dan footer tidak memerlukan state klien. MobileMenu adalah Client Component kecil. BookingForm beserta preview adalah satu area interaktif. Gunakan Suspense bila memakai useSearchParams pada form yang berada di halaman statis; alternatifnya baca URL sekali setelah mount. Jangan membaca isian pelanggan lewat searchParams server.

## 6. Konfigurasi publik dan kesiapan rilis

Konfigurasi mencakup nama tampilan, nama penyedia, nomor WhatsApp, URL produksi, kota basis, jam layanan, kisaran harga, rincian konsultasi, ketentuan pembayaran/pembatalan, cakupan hama, foto dan bukti opsional. Gunakan angka rupiah sebagai nilai numerik; format dengan Intl.NumberFormat('id-ID') saat menampilkan, bukan hitung dari teks copy.

Gunakan status eksplisit, misalnya **contentStatus: 'draft' | 'ready'**. Status ready berarti pemilik telah memberi rincian final, bukan hasil tebakan agen. Preview draft dapat dibangun tanpa nomor/domain asli; blokir tautan kirim dan tampilkan pemberitahuan draf yang jelas.

Cek rilis harus memeriksa nilai wajib, format URL HTTPS, kepemilikan nomor yang telah dikonfirmasi pemilik, dan status ketentuan. Jangan menjadikan NODE_ENV=production satu-satunya pengunci karena build preview juga biasanya production. Sediakan perintah rilis khusus atau penanda mode publikasi yang eksplisit; deployment produksi wajib melewati cek tersebut. Semua flag di frontend tetap bukan rahasia/kontrol akses.

## 7. Kontrak formulir

Form merupakan satu halaman dengan dua tampilan, bukan wizard panjang. Semua batas panjang dihitung konsisten dengan schema dan atribut maxLength; dokumentasikan unit string JavaScript yang dipakai agar counter/error tidak berbeda.

| Field | Tipe dan pilihan | Wajib | Validasi dan bantuan |
| --- | --- | --- | --- |
| service | radio: online / kunjungan | Ya | Label “Konsultasi online” / “Penanganan langsung”; tidak ada default jika query tidak valid/kosong |
| name | teks nama panggilan | Tidak | Kosong boleh; jika terisi 1–60 karakter setelah trim; autocomplete=given-name |
| pest | select/radio: kecoa / tikus / lainnya / belum-tahu | Ya | “Lainnya” dan “Belum tahu jenisnya” selalu tersedia sebagai permintaan penilaian, bukan jaminan penanganan |
| propertyType | select: rumah / kos / tempat-usaha / lainnya | Tidak | Default kosong; dipakai sebagai konteks, bukan janji cakupan layanan |
| area | teks kecamatan/kota | Ya untuk kunjungan; opsional online | Kosong boleh untuk online; bila terisi 3–80 karakter; untuk kunjungan wajib 3–80; “Cukup kecamatan/kota, tanpa alamat lengkap” |
| problem | textarea | Ya | 20–400 karakter setelah trim; baris baru diperbolehkan; “Hama apa, terlihat di bagian mana, dan sejak kapan?” |
| privacyAcknowledged | checkbox pemahaman perpindahan data | Ya sebelum preview/link personal | Nilai harus true; tautan kebijakan privasi terpisah dari label agar mudah diaktifkan |

Nilai hama tambahan seperti semut/rayap hanya ditambahkan setelah pemilik memastikan keahlian/cakupan. Sinkronkan schema, label dan isi landing page saat mengubah enum. “Belum tahu” harus menjadi jalur yang mudah ditemukan, bukan error.

Tidak ada field nomor telepon, email, alamat lengkap, tanggal pasti, unggah foto, kode voucher, atau nomor pembayaran. Tidak ada biaya transportasi otomatis. Nomor pelanggan tersedia ketika ia mengirim percakapan sendiri di WhatsApp.

### Aturan normalisasi

Trim pinggir tiap teks; normalisasi baris baru untuk problem; tolak karakter kontrol yang tidak diperlukan. Pertahankan Unicode, apostrof dan tanda baca biasa. Jangan “membersihkan SQL” dengan menghapus kata SELECT, tanda petik atau titik koma. Error panjang tidak boleh menghapus isi pengguna.

Contoh helper/error:

- “Pilih jenis layanan terlebih dahulu.”
- “Untuk kunjungan, isi kecamatan dan kota Anda.”
- “Ceritakan sedikit lebih lengkap, minimal 20 karakter.”
- “Ringkas menjadi maksimal 400 karakter. Isian Anda belum dihapus.”
- “Baca pemberitahuan perpindahan data dan centang jika Anda memahaminya.”

### Keadaan formulir

| Keadaan | Tampilan dan aksi |
| --- | --- |
| Belum siap/hydration | Pesan singkat; form pribadi belum aktif; noscript menyediakan kontak generik |
| Mengisi | Field, helper, tombol “Tinjau pesan”; kontak belum dikonfigurasi dijelaskan |
| Error | Ringkasan error mendapat fokus; tiap error terhubung field; semua isian dipertahankan |
| Tinjau | Teks pesan final, pemberitahuan WhatsApp, “Ubah isian”, “Buka WhatsApp”, “Salin pesan” |
| Berhasil salin | Feedback aria-live “Pesan disalin”; tidak berarti terkirim |
| Salin gagal | Teks bisa dipilih lewat textarea read-only + petunjuk salin manual |
| URL terlalu panjang | Tautan personal nonaktif; sarankan ringkas atau salin pesan lalu buka chat generik |
| Kontak belum valid | Buka WhatsApp nonaktif; salin pesan tetap bisa; rilis ditahan |
| Kembali dari WhatsApp | Tidak membuat konfirmasi sukses; pelanggan diminta memastikan kirim di WhatsApp |

Ganti tampilan secara eksplisit; jangan menempatkan seluruh form dalam modal. Fokus ke judul preview setelah berhasil validasi, dan ke bagian edit ketika kembali. Setiap perubahan isian membatalkan snapshot preview lama. Tidak perlu spinner jaringan karena tidak ada request booking.

## 8. Pesan dan URL WhatsApp

Builder hanya menerima hasil schema yang valid. Gunakan label tampilan dari enum, bukan nilai mentah atau konten HTML. Hilangkan baris opsional yang kosong. Pesan contoh memakai data sintetis:

~~~text
Halo, saya ingin mengajukan layanan hama.

Layanan: Penanganan langsung
Nama panggilan: Budi
Jenis hama: Kecoa
Jenis tempat: Rumah
Area: Kecamatan Contoh, Kota Contoh
Kondisi: Kecoa terlihat di dapur sejak beberapa hari terakhir.

Mohon informasi langkah berikutnya, biaya dan ketersediaan.
Saya memahami bahwa jadwal dan biaya belum dikonfirmasi.
~~~

Tidak mencantumkan ID pesanan, status “disetujui”, diskon, total biaya kunjungan, hasil diagnosis atau timestamp pelacakan. Untuk online, area/jenis tempat hanya disertakan jika diisi. Pertanyaan foto cukup ada di petunjuk, bukan upload.

Gunakan URL dengan origin **https://wa.me/**, nomor usaha terkonfigurasi, dan parameter **text** yang diencode sekali menggunakan URLSearchParams. Ikuti [WhatsApp click-to-chat](https://faq.whatsapp.com/5913398998672934). Tidak memakai redirect melalui endpoint sendiri atau shortlink analitik.

Batas operasional proyek: panjang string URL hasil encoding maksimum **6.000 karakter**. Ini guardrail proyek, bukan klaim batas universal WhatsApp/browser. Jika terlampaui, jangan memotong pesan diam-diam; tampilkan fallback salin dan chat generik. Uji ponsel/desktop karena dukungan tautan bervariasi.

Tautan personal dibuat dari snapshot yang sudah ditinjau. Pada pratinjau lokal, verifikasi URL dengan intersepsi navigasi; jangan menekan kirim ke nomor nyata. Saat peluncuran, pemilik sendiri memeriksa bahwa nomor tersebut aktif dan miliknya.

## 9. Rancangan privasi dan syarat

**Kebijakan privasi** harus memiliki bagian: identitas/kontak penyedia; informasi yang dimasukkan; tujuan menyusun pesan; pemrosesan di browser tanpa database aplikasi; log akses hosting bila ada; teks pada tautan dan perpindahan ke WhatsApp; penanganan percakapan/foto oleh penyedia; retensi dan cara meminta penghapusan sesuai kemampuan nyata; tanggal pembaruan.

Jangan menulis “kami tidak mengumpulkan data apa pun” karena hosting dan percakapan bisa memproses data. Jangan menyatakan WhatsApp tidak menyimpan data atau menjanjikan penghapusan instan di semua pihak.

**Syarat layanan** harus memiliki bagian: lingkup penilaian awal online; apa yang termasuk dalam harga/durasi; konsultasi tidak otomatis mencakup kunjungan; penawaran biaya tindakan/perjalanan; ketersediaan/jadwal manual; cara dan waktu pembayaran; penjadwalan ulang; pembatalan/refund; kewajiban memberikan informasi yang relevan; persetujuan sebelum tindakan; batas klaim hasil dan kontak pengaduan.

Bagian yang belum diputuskan ditulis sebagai penanda draf yang jelas di lingkungan preview. Jangan memasang kebijakan refund atau garansi buatan untuk mengisi ruang. Kelengkapan rincian ini adalah syarat publikasi.

## 10. Tahap pengerjaan Antigravity

| Tahap | Hasil konkret | Selesai bila |
| --- | --- | --- |
| A. Fondasi | Audit repo, versi, konfigurasi draft, schema readiness, token, layout | Aplikasi dapat dijalankan tanpa data bisnis palsu |
| B. Halaman | Lima route dan 404; hero/proses/profil/FAQ; fallback tanpa foto | Alur CTA dan copy konsisten; ponsel dan desktop terbaca |
| C. Booking | Schema, state form, preview, builder pesan, URL, salin/fallback, noscript | Kedua layanan dan seluruh keadaan form berjalan |
| D. Mutu | Header, SEO, aksesibilitas, optimasi aset, tes fungsi/alur, build | Temuan terkait diperbaiki; hasil cek tercatat |
| E. Serah terima | README aplikasi, screenshot, daftar data bisnis/rilis | Preview dapat ditinjau dan kendala publikasi jelas |

Minta klarifikasi hanya jika keputusan benar-benar mengubah lingkup atau memerlukan data yang tidak bisa diwakili draft. Jangan menunggu foto/nama/nomor untuk menyelesaikan layout dan fungsi lokal.

## 11. Skenario penerimaan utama

1. Pengunjung membuka CTA online. Hanya layanan valid yang terpilih. Dengan keluhan valid dan checkbox, preview terbuka; area kosong boleh. URL hanya menuju nomor usaha yang ditentukan.
2. Pengunjung memilih kunjungan tanpa area. Error area diumumkan dan isian lain tetap ada. Setelah area valid, preview memuat area. Jadwal belum dianggap disepakati.
3. Query seperti layanan=https://contoh.invalid atau nilai lain tidak mengubah tujuan link; tidak ada pilihan layanan yang otomatis dipercaya.
4. Keluhan berisi tanda petik, &, #, emoji, baris baru, atau teks mirip script tetap plain text dan ter-encode sekali. Nilai melebihi batas ditolak dengan petunjuk.
5. Pengguna mengubah layanan/isian setelah preview. Pesan lama tidak dapat dibuka tanpa dibangun ulang dan ditinjau.
6. Checkbox belum dicentang. Form memberi penjelasan; tidak ada tautan personal yang dibentuk sebelum tahap tinjau yang valid.
7. Nomor WhatsApp kosong/salah atau URL melampaui guardrail. Tidak ada link rusak; salin/manual tetap tersedia. Nomor salah menahan publikasi.
8. Clipboard ditolak. Pengguna dapat memilih/salin teks secara manual tanpa kehilangan pesan.
9. Keyboard dan pembaca layar dasar dapat menjangkau semua kontrol, error dan preview. Menu mobile dapat ditutup dengan Escape. Pada 320 CSS px tidak ada scroll horizontal.
10. JavaScript dinonaktifkan/gagal. Isian tidak dapat jatuh ke URL melalui GET; kontak generik tetap ada jika terkonfigurasi.
11. Network/storage/log diperiksa dengan data sintetis. Tidak ada request yang membawa keluhan ke layanan lain sebelum klik WhatsApp; tidak ada PII di URL situs, log atau storage yang dibuat aplikasi.
12. Build produksi dan header diperiksa; sumber daya tidak terblokir CSP. Semua link halaman/anchor berjalan. Data bisnis wajib final sebelum deployment produksi.

## 12. Setelah MVP terbukti dibutuhkan

Pertimbangkan backend hanya jika ada kebutuhan nyata seperti pencatatan permintaan, kalender yang dikelola, pembayaran, atau dashboard. Buat rancangan data dan privasi tersendiri; terapkan validasi server, otorisasi, CSRF sesuai sesi, rate limit, query berparameter dan role database minimum dari rules/security.md sebelum menyimpan data pelanggan. Jangan menambahkan placeholder database dalam MVP sekarang.
