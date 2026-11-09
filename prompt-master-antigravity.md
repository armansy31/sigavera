# Prompt Master Google Antigravity

Salin hanya isi blok di bawah ke percakapan agen setelah paket berada di root workspace. Data bisnis yang belum ada tidak perlu ditebak. Agent harus menyelesaikan preview lokal dan melaporkan apa yang menahan publikasi.

## Prompt master

~~~text
Bangun MVP website jasa konsultasi online dan penanganan hama perseorangan dari paket dokumentasi di workspace ini. Kerjakan hingga aplikasi lokal berjalan dan pemeriksaan yang relevan selesai; jangan berhenti setelah merencanakan atau hanya membuat mockup.

Sebelum mengedit, periksa instruksi repo, status perubahan pengguna, struktur dan versi yang sudah ada. Baca secara utuh:
1. agent.md
2. desain.md
3. rules/security.md
4. rules/engineering.md
5. brief-implementasi-nextjs-mvp.md
6. README.md
Pastikan pemuat .agents/rules terbaca. Jangan menimpa AGENTS.md, aturan lama, atau berkas pengguna tanpa memahami isinya. Folder sources/ pada mirror ChatGPT hanya boleh dibaca.

KONTEKS BISNIS
- Penyedia perseorangan. Gunakan bahasa Indonesia natural, suara “saya” untuk penyedia dan “Anda” untuk pelanggan.
- Dua jalur layanan: konsultasi online dan permintaan penanganan langsung.
- Kisaran awal konsultasi Rp20.000–Rp25.000; rincian harga, durasi dan isi sesi harus dikonfirmasi pemilik sebelum rilis. Biaya penanganan/kunjungan terpisah dan disepakati kemudian.
- Jangkauan kunjungan fleksibel berdasarkan jarak, permintaan dan ketersediaan. Tidak menghitung ongkos transportasi atau menjanjikan semua area terlayani.
- Nama final, nama penyedia, nomor WhatsApp, kota basis, jam layanan, foto, bukti keahlian dan ketentuan final belum tersedia. Pusatkan sebagai konfigurasi draft. Jangan menebak dari akun atau membuat contoh menjadi data bisnis aktif.

DESAIN
- Ikuti desain.md: hijau tua, latar krem hangat, tipografi tegas, ritme ruang yang rapi, foto kegiatan autentik jika tersedia, teks hero pada bidang polos dengan foto/panel terpisah.
- Gambar referensi hanya inspirasi suasana, hierarki dan konteks kegiatan. Jangan menyalin logo, aset, komposisi persis, teks, ulasan, rating atau badge. Bila file referensi tidak tersedia di workspace, gunakan pengamatan tertulis dalam desain.md.
- Buat komposisi yang utuh tanpa foto jika aset asli belum ada. Jangan membuat foto AI menyamar sebagai dokumentasi pekerjaan.
- Hindari gradient dekoratif, blob, glassmorphism, kartu berulang, carousel ulasan, ikon dekoratif berlebihan, angka palsu, slogan generik dan animasi tanpa fungsi. Tiap section harus membantu pelanggan mengambil keputusan.
- Mobile-first; target aksesibilitas WCAG 2.2 AA, form satu kolom, keyboard dan fokus terlihat, label/error yang benar, kontras terukur, reflow dan reduced motion.

TEKNOLOGI DAN LINGKUP
- Next.js App Router + TypeScript strict + Tailwind CSS. React Hook Form dan Zod untuk form; shadcn/ui/Lucide hanya seperlunya. Ikuti versi repo; jika baru, pilih versi stabil kompatibel, catat versi, gunakan satu package manager dan lockfile.
- Bangun /, /pesan, /tentang, /kebijakan-privasi, /syarat-layanan dan 404. Server/static untuk konten; Client Component kecil untuk interaksi.
- Tidak ada database, API booking, Server Action booking, login, dashboard, unggah foto, payment gateway, chat widget atau analytics pihak ketiga di MVP.
- Gunakan struktur komponen dan kontrak field pada brief. Jangan meminta telepon, alamat lengkap atau data sensitif di form.

BOOKING WHATSAPP
- Pilih layanan → isi kondisi/area → validasi → tinjau plain text → buka WhatsApp atau salin pesan.
- Validasi enum dan batas panjang, area wajib pada kunjungan, checkbox pemahaman perpindahan data, dan konfigurasi nomor bisnis.
- Isian hanya dalam memori; jangan simpan ke browser storage/cookie, kirim ke backend, log atau analytics. Query situs sendiri hanya pilihan layanan yang di-allowlist.
- Tujuan tetap https://wa.me/ dengan nomor konfigurasi, data hanya di parameter text melalui URLSearchParams sekali. Tautan personal baru dibentuk setelah preview valid. Jangan prefetch atau membuka WhatsApp otomatis.
- Jelaskan bahwa tautan membawa teks ke WhatsApp dan pelanggan masih menekan kirim di sana. Tidak ada status “booking berhasil”, pesan terkirim, pembayaran selesai atau jadwal terkonfirmasi dari situs.
- Sediakan kembali edit, feedback salin, salin manual jika clipboard gagal, fallback URL terlalu panjang, serta kontak belum valid. Tangani no-JS tanpa submit GET yang membocorkan isian.

KEAMANAN
- Tampilkan input sebagai teks React; tidak memakai HTML mentah, eval, renderer Markdown input atau URL tujuan dari pengguna.
- Terapkan header produksi dan baseline CSP sesuai security.md; periksa pada hasil build/deployment yang digunakan. Jelaskan keterbatasan CSP, jangan mengklaim kebal serangan.
- Tidak memasang database sekarang. Jika nanti ditambahkan, seluruh input divalidasi ulang di server, query memakai parameter binding, identifier memakai mapping tetap, otorisasi diperiksa, dan kredensial/role database dibatasi. Filter kata SQL bukan pertahanan utama.
- Jangan membuat sertifikasi, testimoni, garansi, klaim medis, klaim pestisida aman mutlak atau saran dosis/campuran dari asumsi.

CARA MENGERJAKAN
1. Tulis rencana ringkas dan data bisnis yang kosong, lalu langsung kerjakan hal yang bisa diselesaikan dengan konfigurasi draft.
2. Bangun fondasi/token/config, halaman, form/pesan/URL, lalu mutu dan pemeriksaan. Gunakan keputusan rutin sendiri tanpa meminta konfirmasi per komponen.
3. Jalankan typecheck, lint, build produksi serta tes perilaku schema/pesan/URL dan alur form yang relevan. Periksa responsif 320–1280 px, keyboard, aksesibilitas dasar, no-JS, storage/network/log, dan header. Navigasi WhatsApp dalam tes harus diintersep; jangan mengirim pesan nyata.
4. Perbaiki temuan yang terkait pekerjaan. Jangan mematikan cek, membuang validasi atau menambah wildcard CSP untuk membuat hasil terlihat lulus.
5. Buat README aplikasi yang mempertahankan panduan paket, cara menjalankan, versi, konfigurasi, aset, cek dan deployment. Preview boleh draft; publikasi wajib melewati cek kelengkapan data bisnis dan ketentuan.

HASIL AKHIR
- Aplikasi lokal lengkap sesuai scope, beserta seluruh berkas implementasi dan lockfile.
- Ringkasan halaman dan alur yang selesai; daftar perintah/hasil cek yang benar-benar dijalankan dan keterbatasan yang belum teruji.
- Screenshot ponsel/desktop dengan data sintetis bila alat tersedia, serta lokasi preview.
- Daftar ringkas data bisnis yang masih harus diisi sebelum publikasi. Jangan menyebut siap produksi bila data wajib belum final.
- Jangan deploy ke domain/akun nyata, membayar layanan, atau mengirim pesan kepada orang lain tanpa instruksi eksplisit pemilik.

Mulai dengan memeriksa workspace dan membaca dokumen, lalu lanjutkan implementasi sampai hasil lokal dapat ditinjau.
~~~

## Jika ingin melanjutkan sesi yang terputus

~~~text
Lanjutkan implementasi MVP di workspace ini dari keadaan terakhir. Baca agent.md, desain.md, rules/security.md, rules/engineering.md dan brief-implementasi-nextjs-mvp.md; periksa perubahan yang sudah ada sebelum mengedit. Pertahankan keputusan dan pekerjaan yang sudah benar. Selesaikan bagian yang belum selesai, jalankan ulang pemeriksaan yang terdampak, lalu laporkan hasil nyata dan data bisnis yang masih menahan publikasi. Jangan mengulang scaffold atau mengganti desain tanpa alasan dari brief.
~~~

Prompt disediakan sebagai Markdown biasa yang ditempel ke chat, sehingga tidak bergantung pada mekanisme workflow/slash command tertentu. Aturan persisten dimuat melalui berkas di .agents/rules seperti dijelaskan di README.
