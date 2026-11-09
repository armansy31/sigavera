# Aturan Engineering

## 1. Keputusan arsitektur

Bangun Next.js App Router + TypeScript strict + Tailwind CSS. Konten publik dibuat statis/prerender selama tidak membutuhkan request pengguna. Gunakan deployment Next.js standar sebagai pilihan awal; tidak perlu output: export hanya karena tidak ada database. Tidak ada kode backend booking pada MVP.

Jika pemilik memilih hosting static-only, gunakan static export dengan sadar: header diatur oleh hosting, default image optimizer tidak tersedia, dan Server Action/fitur request dinamis tidak digunakan. Catat keputusan dan cara menyajikan route langsung. [Batas static export Next.js](https://nextjs.org/docs/app/guides/static-exports).

## 2. Struktur dan batas komponen

- Ikuti pohon folder dalam brief. Pisahkan konfigurasi publik, schema input, builder pesan, dan komponen form.
- Server Component/static menjadi default. Batasi use client untuk form, menu mobile, dan feedback salin. Jangan menjadikan seluruh layout Client Component.
- Gunakan komponen kecil dengan tanggung jawab jelas. Jangan membuat sistem plugin, repository/database layer, generic form builder, atau abstractions bertingkat untuk fitur yang belum dibutuhkan.
- Data usaha hanya berasal dari src/config/site.ts; label form dari konstanta typed; token visual dari CSS. Hindari nomor WhatsApp/harga yang tersebar di banyak file.
- Builder pesan dan URL adalah fungsi murni yang menerima data tervalidasi. Komponen hanya mengelola interaksi dan presentasi.
- Tipe infer dari schema bila sesuai; tidak memakai any untuk melewati kesalahan. Tangani optional/null dan error dengan jelas.
- Jangan mengakses window, navigator atau storage saat render server. Clipboard hanya dipanggil dari aksi pengguna di browser; sediakan fallback.

## 3. Dependensi dan konfigurasi

Gunakan React Hook Form + Zod untuk form. shadcn/ui opsional untuk primitive yang memang diperlukan dan harus ditata menurut desain proyek; jangan memasukkan demo dashboard atau seluruh katalog komponen. Ikon Lucide React diimpor per kebutuhan. Hindari animation library, carousel, date-picker dan state manager global pada MVP.

Periksa versi repo sebelum menggunakan API. Untuk proyek baru, pilih versi stabil kompatibel saat implementasi, tulis versinya dalam README implementasi, dan simpan satu lockfile. Gunakan satu package manager. Jangan mencampur panduan konfigurasi Tailwind versi berbeda atau mengandalkan perintah lint framework yang sudah tidak tersedia; buat script lint eksplisit sesuai tooling terpasang.

Sediakan script dengan tujuan berikut: dev, build, start (deployment Next standar), lint, typecheck, test. Build rilis juga harus memvalidasi konfigurasi publik wajib. Preview lokal boleh memakai mode belum dikonfigurasi dengan CTA kirim nonaktif; mode ini tidak boleh lolos rilis produksi.

## 4. Formulir dan navigasi

1. Kontrak field, nilai enum, batas input dan status ada di brief; jangan mengubahnya diam-diam.
2. Semua kontrol memiliki label. Radio dikelompokkan dalam fieldset/legend. Error terhubung melalui aria-describedby dan aria-invalid. Error summary berisi tautan menuju field bermasalah.
3. Validasi pada submit; setelah error, pembaruan dapat terjadi pada blur/perubahan. Jangan menampilkan error sebelum pengguna berinteraksi.
4. Saat preview dibuka, fokus pindah ke judul preview. Saat mengedit, isian dipertahankan dan fokus dikembalikan ke bagian relevan. Jika isian berubah, hasil preview lama harus dibatalkan/dibangun ulang.
5. Tombol bukan submit memakai type=button. Tidak menggunakan placeholder sebagai pengganti label. Status salin memakai aria-live=polite tanpa pengumuman berulang.
6. Hindari data form dalam URL situs, penyimpanan browser dan log. Cegah submit GET bawaan ketika JavaScript tidak tersedia sesuai aturan keamanan.
7. Halaman /pesan mendukung link langsung dan query layanan yang aman. Refresh, kembali dari WhatsApp, atau klik CTA berulang tidak boleh mengklaim pemesanan selesai.

## 5. Aksesibilitas

Target desain dan pemeriksaan adalah WCAG 2.2 AA. Gunakan HTML native sebelum membuat widget sendiri; navigasi, tautan, details/summary dan radio native cukup untuk MVP. Periksa keyboard, fokus terlihat/tidak tertutup, label/nama kontrol, kontras, pembaca layar dasar, reflow, zoom dan reduced motion. Lulus alat otomatis saja tidak membuktikan seluruh aksesibilitas. [Panduan WCAG](https://www.w3.org/WAI/WCAG22/quickref/).

Ikuti ukuran dan ritme di desain.md. Gambar bermakna memiliki alt deskriptif; dekorasi alt kosong. Header/foto tidak boleh membuat urutan baca berbeda dari urutan visual. Tambahkan skip link ke main. Judul dokumen unik membantu navigasi antarrute.

## 6. Performa dan SEO

- Ukuran gambar ditentukan agar layout tidak meloncat. Aset lokal dioptimalkan ke WebP/AVIF bila sesuai; jangan mengirim gambar referensi atau gambar besar mentah sebagai hero. Gambar di bawah fold lazy-load.
- Pilih prioritas pemuatan foto hero hanya jika ia kandidat LCP; jangan menandai semua foto sebagai prioritas. Gunakan API gambar yang cocok dengan versi Next.js dan mode hosting.
- CSS responsif mengikuti konten, tidak menambahkan breakpoint untuk satu perangkat saja. Hilangkan overflow horizontal; teks panjang/URL terbungkus.
- Judul/deskripsi unik, lang=id, canonical dari SITE_URL yang benar, sitemap dan robots untuk produksi; preview noindex. /pesan dan kebijakan dapat noindex sesuai strategi, tetapi tetap dapat diakses dari navigasi.
- Open Graph memakai aset berizin dan nama usaha aktual. Jangan menyalin metadata referensi atau membuat Review/AggregateRating schema tanpa data sah. Structured data opsional; jangan mengarang alamat atau areaServed luas.
- Anggaran awal: gambar hero ponsel sekitar ≤220 KB, tanpa video otomatis, tanpa library animasi besar. Ini target optimasi, bukan alasan merusak kualitas foto atau aksesibilitas.
- Pada preview produksi representatif, target LCP ≤2,5 detik, CLS ≤0,1 dan INP ≤200 ms bila dapat diukur dengan data memadai. Catat perangkat/kondisi. Skor Lighthouse lokal dan simulasi interaksi bukan bukti metrik lapangan. [Definisi Core Web Vitals](https://web.dev/articles/vitals).

## 7. Pemeriksaan yang harus dilakukan saat implementasi

Paket dokumentasi ini belum berisi aplikasi atau suite tes. Saat aplikasi dibuat, jalankan pemeriksaan yang terkait perilaku nyata berikut. Jangan menulis tes yang hanya menyalin markup atau snapshot besar tanpa tujuan.

| Pemeriksaan | Bukti yang diminta |
| --- | --- |
| Typecheck, lint, build | Perintah aktual, exit status, versi utama; perbaiki kegagalan terkait perubahan |
| Fungsi murni | Schema, builder pesan dan URL: batas field, area bersyarat, enum tak dikenal, karakter khusus, nomor kosong |
| Alur form | Online dan kunjungan; error dan fokus; preview/edit; acknowledgement; salin/fallback; URL panjang |
| Integrasi UI | Satu tes alur lengkap dengan navigasi WhatsApp diintersep; tidak benar-benar mengirim pesan |
| Responsif | Lebar 320/360/390/768/1280 px; orientasi dan zoom hingga 400%/reflow setara 320 CSS px |
| Aksesibilitas | Alat otomatis + tab/shift-tab/enter/space/Escape + pembaca layar dasar; catat temuan |
| Keamanan | PII tidak di storage/log/URL sendiri; payload XSS jadi teks; origin WA tetap; header produksi diperiksa |
| JavaScript mati/gagal | Tidak ada form data yang tersubmit sebagai GET; tautan kontak generik/noscript aman |
| Halaman publik | Semua CTA/rute/footer; link langsung /pesan; FAQ, menu, 404; tidak ada tautan # tanpa tujuan |
| Isi bisnis | Nomor WA milik penyedia, harga/ketentuan final, lisensi foto, placeholder dan klaim palsu tidak lolos rilis |

Vitest untuk fungsi dan Playwright untuk alur browser dapat dipilih jika repo belum memiliki test runner. Gunakan alat yang sudah ada bila memadai. Jalankan cek pada build produksi karena perilaku CSP, hydration dan routing dapat berbeda dari development. Jangan mengklaim cek manual atau browser tertentu sudah dilakukan jika aksesnya tidak tersedia.

## 8. Dokumentasi dan serah terima

README aplikasi hasil implementasi harus memuat cara menjalankan, versi/package manager, struktur, pengisian data usaha, pemasangan aset berizin, hosting/header, pemeriksaan, serta batas WhatsApp. Sertakan contoh konfigurasi kosong yang aman dan daftar data wajib publikasi.

Laporan akhir singkat berisi halaman/fitur yang selesai, perintah dan hasil pemeriksaan, screenshot ponsel/desktop dengan data sintetis bila tersedia, kendala nyata, dan data bisnis yang masih kosong. Jangan menyebut “siap produksi” ketika kontak atau ketentuan belum final.

Publikasi merupakan langkah tersendiri setelah konfigurasi final dan ada instruksi pemilik. Jangan menghapus berkas pengguna, menimpa konfigurasi yang tidak dipahami, atau menaruh hasil kerja di sources/.
