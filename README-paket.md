# Paket Antigravity — Konsultasi & Penanganan Hama Perseorangan

Versi 1.0 · 5 November 2026 · Bahasa Indonesia

Paket ini adalah spesifikasi siap implementasi, bukan aplikasi yang sudah dibangun. Tujuannya: membantu calon pelanggan memahami layanan personal, melihat biaya awal, dan menyusun permintaan melalui WhatsApp. MVP memakai Next.js tanpa API pemesanan, database, akun pelanggan, atau pembayaran otomatis.

## Mulai dalam empat langkah

1. Salin seluruh isi folder ini ke root proyek website yang akan dibuka di Google Antigravity. Sertakan folder tersembunyi **.agents**. Untuk proyek baru, folder ini dapat langsung menjadi root proyek; biarkan berkas dokumentasinya tetap ada ketika aplikasi dibuat.
2. Buka folder tersebut sebagai workspace Antigravity. Periksa bagian Customizations → Rules untuk memastikan tiga aturan paket terbaca. Bila proyek sudah memiliki aturan, gabungkan secara sadar; jangan menimpa instruksi yang sudah ada.
3. Baca tabel data bisnis di bawah. Data yang belum diketahui boleh tetap berupa penanda untuk pengembangan lokal. Isi data wajib sebelum situs dipublikasikan.
4. Buka [prompt-master-antigravity.md](prompt-master-antigravity.md), salin isi blok **Prompt master**, lalu tempel ke percakapan agen. Agen diminta membangun MVP hingga pemeriksaan selesai, bukan berhenti setelah membuat rencana.

**agent.md tidak otomatis dimuat karena namanya.** Paket menyediakan tiga berkas pemuat dengan aktivasi always_on di **.agents/rules/**. Masing-masing menyertakan satu dokumen sumber: agent.md, rules/security.md, dan rules/engineering.md. Mekanisme lokasi, frontmatter, dan include mengikuti [dokumentasi resmi Rules Antigravity](https://antigravity.google/docs/rules/) yang diperiksa pada tanggal paket. Buka root paket/proyek; membuka folder induknya saja dapat membuat aturan di subfolder tidak ditemukan.

Jika versi Antigravity yang digunakan belum mendukung format pemuat ini, tambahkan ketiga dokumen sumber sebagai aturan Workspace melalui Customizations → Rules, aktifkan Always On, dan lampirkan desain.md serta brief implementasi ke prompt. Hindari memuat versi ganda yang isinya berbeda.

## Isi paket

| Berkas | Kegunaan |
| --- | --- |
| [desain.md](desain.md) | Arah visual, token desain, layout, copy awal, aset, mobile, aksesibilitas, penilaian anti-AI-slop |
| [agent.md](agent.md) | Tujuan, batas lingkup, fakta bisnis, cara kerja agen, kriteria selesai |
| [rules/security.md](rules/security.md) | Keamanan input dan WhatsApp, privasi, header, serta ketentuan backend/database mendatang |
| [rules/engineering.md](rules/engineering.md) | Struktur kode, dependensi, aksesibilitas, kualitas dan pemeriksaan implementasi |
| [prompt-master-antigravity.md](prompt-master-antigravity.md) | Prompt siap tempel untuk menjalankan pembangunan MVP |
| [brief-implementasi-nextjs-mvp.md](brief-implementasi-nextjs-mvp.md) | Arsitektur, halaman/komponen, kontrak formulir, alur WhatsApp, tahap pengerjaan dan penerimaan |
| [.agents/rules/00-agent.md](.agents/rules/00-agent.md) | Pemuat instruksi proyek |
| [.agents/rules/10-security.md](.agents/rules/10-security.md) | Pemuat aturan keamanan |
| [.agents/rules/20-engineering.md](.agents/rules/20-engineering.md) | Pemuat aturan engineering |

Folder **sources/** dan AGENTS.md milik proyek ChatGPT berada di luar paket ini dan merupakan referensi hanya baca. Paket tidak memerlukan perubahan pada berkas sinkronisasi tersebut.

## Fakta dan keputusan awal

| Topik | Keputusan |
| --- | --- |
| Bentuk bisnis | Penyedia jasa perseorangan; gunakan suara “saya” |
| Layanan | Konsultasi online dan permintaan penanganan langsung |
| Harga konsultasi | Kisaran awal Rp20.000–Rp25.000 dari konteks pemilik; finalisasi rincian sebelum rilis |
| Harga kunjungan | Penawaran tersendiri setelah menilai masalah dan lokasi; bukan biaya tetap |
| Area kunjungan | Fleksibel berdasarkan jarak dan permintaan; ketersediaan dikonfirmasi lewat WhatsApp |
| Pemesanan | Isi formulir → tinjau pesan → buka WhatsApp → pelanggan mengirim → penyedia mengonfirmasi |
| Data pada situs | Isian hanya di memori halaman; tidak disimpan di database, localStorage, cookie, atau layanan formulir |
| Pihak lain | Hosting tetap dapat mencatat log akses; WhatsApp menerima teks yang dibawa dalam tautan |
| Cakupan hama | Tampilkan hanya jenis yang benar-benar ditangani pemilik; default contoh kategori harus ditinjau |

## Data bisnis yang perlu diisi

Simpan data publik terpusat di **src/config/site.ts** saat implementasi. Daftar berikut adalah nama penanda dokumentasi, bukan nilai environment yang wajib digunakan.

| Penanda | Nilai awal / tindakan | Sebelum publikasi |
| --- | --- | --- |
| NAMA_USAHA | Nama tampilan sementara “Konsultasi Hama” | Wajib diputuskan |
| NAMA_PENYEDIA | Belum diketahui; jangan menebak dari akun | Wajib diisi untuk identitas personal |
| WA_NUMBER | Belum diisi; format internasional digit saja, diawali 62 | Wajib; nonaktifkan tautan kirim jika kosong/tidak valid |
| SITE_URL | Belum diisi | Wajib untuk canonical, sitemap dan metadata produksi |
| KOTA_BASIS | Belum diisi | Wajib menjelaskan titik awal kunjungan; hindari alamat rumah lengkap |
| JAM_LAYANAN | Belum diisi | Wajib disepakati; jangan mengklaim tersedia 24 jam |
| HARGA_KONSULTASI | Rentang Rp20.000–Rp25.000 | Wajib pastikan apa yang termasuk, durasi/media dan biaya final |
| KETENTUAN_LAYANAN | Draf isi menurut brief | Wajib tentukan pembayaran, penjadwalan ulang, pembatalan dan refund |
| FOTO_PENYEDIA / FOTO_KEGIATAN | Belum tersedia | Pakai foto berizin; mode tanpa foto tetap layak dipublikasikan |
| BUKTI_KEAHLIAN | Belum tersedia | Opsional; tampilkan hanya jika ada bukti dan izin |
| TESTIMONI | Belum tersedia | Opsional; sembunyikan section bila belum ada izin dan sumber asli |

Pengembangan lokal harus tetap dapat berjalan ketika data bisnis kosong. Jangan membuat nomor telepon contoh menjadi tautan aktif. Konfigurasi rilis harus gagal bila kontak, URL, atau ketentuan wajib belum diisi; beri laporan daftar data yang kurang.

## Pemakaian referensi gambar

Gambar yang disebut sebagai **/mnt/data/image.png** berhasil dilihat melalui lampiran percakapan asal. Ciri yang diamati: hijau tua/putih, judul tegas, fotografi kegiatan, CTA hijau, kartu putih bertumpuk, logo klien dan ulasan. Paket mengadopsi suasana tenang, hierarki kuat, dan fotografi kontekstual. Komposisi baru dijelaskan di desain.md.

Logo PestQuell, teks, foto, badge, testimoni, rating, ilustrasi, dan susunan persis pada referensi tidak disertakan sebagai aset. Berkas gambar asli juga tidak dikemas ulang. Paket tetap dapat dipakai tanpa gambar tersebut karena pengamatan desain sudah ditulis. Jika pemilik ingin menyimpan referensi untuk agen, letakkan salinan yang berhak digunakan di folder **reference/**, bukan di public/ atau hasil situs.

## Sumber teknis

Rujukan resmi disertakan dekat aturan yang membutuhkannya. Keputusan visual, batas isian, dan kriteria penerimaan merupakan keputusan proyek. Status keamanan dan kepatuhan aksesibilitas baru dapat dinilai setelah implementasi serta pemeriksaan hasil; dokumentasi ini bukan jaminan kebal serangan.

