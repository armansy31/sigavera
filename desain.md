# Desain — Layanan Personal yang Jelas dan Tenang

## 1. Gagasan utama

Identitas yang dituju adalah penyedia jasa yang mudah diajak berbicara, teliti melihat kondisi rumah, dan terbuka soal biaya. Halaman harus terasa seperti seseorang yang menjelaskan pekerjaannya dengan baik. Bukti berasal dari profil, proses, foto nyata dan rincian layanan.

Nama tampilan pengembangan: **Konsultasi Hama**. Ini label deskriptif sementara; nama penyedia dan usaha final diambil dari konfigurasi. Jangan mengambil nama “HamaCare” atau nama akun sebagai identitas yang sudah disetujui.

## 2. Penggunaan gambar referensi

Referensi yang telah dilihat menampilkan hijau tua, area putih, hero fotografi besar dengan teks overlay, tombol hijau, panel kartu bertumpuk, badge, ulasan dan logo klien. Ambil ketegasan tipografi, kesan hijau yang tenang dan konteks kegiatan lapangan.

Komposisi baru: **hero teks pada latar krem + satu foto kegiatan terpisah**, informasi biaya dekat tombol, dua layanan berbentuk baris penjelasan, proses bernomor di bidang putih, dan profil penyedia sebagai bukti utama. Susunan ini juga harus tetap lengkap bila foto belum tersedia.

Jangan mereproduksi logo, kata-kata, foto, angka, testimoni, badge, layout kartu bertumpuk, atau tampilan screenshot referensi. Tidak memakai screenshot sebagai latar halaman. Jangan meniru adegan APD/fogging jika itu bukan kegiatan dan perlengkapan nyata penyedia.

## 3. Sistem visual

### Warna

Gunakan token semantic pada CSS; hindari warna acak di tiap komponen.

| Token | Nilai awal | Peran |
| --- | --- | --- |
| canvas | #F7F5EF | Latar hangat utama |
| surface | #FFFFFF | Formulir dan bagian konten |
| ink | #18251E | Teks utama |
| ink-muted | #4D5F53 | Penjelasan dan caption |
| forest | #174A33 | CTA, footer, judul aksen |
| forest-hover | #103A27 | Hover tombol utama |
| moss-soft | #E6EEDF | Latar informasi ringan |
| border | #D3DCCF | Pemisah dekoratif; bukan satu-satunya penanda field |
| control-border | #667B69 | Batas field pada latar terang |
| danger | #9F2929 | Pesan error dengan ikon/teks |
| focus | #735313 | Outline fokus pada latar terang |

Teks putih dipakai pada forest, bukan pada moss-soft. Jangan gunakan hijau terang sebagai teks kecil di putih. Kombinasi ini adalah titik awal; ukur kontras sesudah komponen jadi. Target teks biasa minimal 4,5:1; teks besar 3:1; batas kontrol/fokus penting 3:1 terhadap warna sekitar. Pada footer gelap, pakai outline fokus terang yang terlihat. [Rujukan WCAG](https://www.w3.org/WAI/WCAG22/quickref/#contrast-minimum).

### Tipografi dan ritme

- Satu keluarga utama: **Public Sans** bila berkas/lisensi tersedia, dengan fallback system-ui, sans-serif. Tidak perlu menambah font kedua. Simpan font lokal/keluaran build; tanpa request font pihak ketiga saat pengunjung membuka halaman.
- Body 16–18 px, line-height 1,6. Label 16 px; caption paling kecil 14 px.
- H1 sekitar 36–42 px di ponsel, 52–60 px di desktop; line-height 1,08–1,15. Batasi baris berdasarkan frasa Indonesia, bukan pemenggalan manual untuk satu ukuran layar.
- H2 28–36 px; heading memakai bobot 600–700. Hindari semua huruf kapital pada kalimat panjang.
- Lebar bacaan 60–68 karakter; kontainer utama maksimum 1160 px. Skala jarak 4, 8, 12, 16, 24, 32, 48, 64, 88 px.
- Radius tombol/input 8 px, panel 12–16 px. Tombol utama bukan pill penuh. Bayangan lembut hanya bila perlu menunjukkan lapisan.

### Foto dan ikon

Satu foto utama penyedia sedang memeriksa area, bukan sekadar menyemprot. Foto detail alat atau jejak hama dapat digunakan di profil jika jelas konteksnya. Gunakan izin pemilik foto dan orang yang terlihat. Hapus metadata lokasi sensitif. Jangan menunjukkan rumah pelanggan, wajah, nomor rumah, atau isi percakapan tanpa izin.

Foto hero rasio 4:5 atau 4:3, posisi subjek tidak terpotong di wajah/tangan, caption singkat menjelaskan aktivitas sebenarnya. Jangan mengubah stock photo menjadi bukti pekerjaan pribadi. Bila menggunakan stok berlisensi, caption sebagai ilustrasi; foto AI tidak boleh disebut kegiatan nyata.

Jika belum ada foto, gantikan area foto dengan panel hijau tua berisi “Konsultasi online · Penanganan sesuai lokasi” dan tiga baris fakta layanan. Hindari siluet orang, nomor pengalaman, atau janji yang dibuat-buat. Panel ini harus terlihat seperti keputusan desain yang selesai.

Ikon Lucide digunakan untuk fungsi nyata: arah tautan, menu, salin, status. Kategori hama memakai teks sederhana; tidak perlu mengarang ikon untuk semua serangga. Ikon dekoratif disembunyikan dari pembaca layar. Logo WhatsApp, bila dipakai, harus berasal dari aset resmi berizin; teks “WhatsApp” sudah cukup.

## 4. Susunan halaman beranda

| Bagian | Isi dan tata letak | Perilaku ponsel |
| --- | --- | --- |
| Header | Nama tampilan kiri; Layanan, Cara kerja, Biaya, FAQ; CTA “Mulai konsultasi” | Nama + tombol menu. CTA utama tetap ada di hero; menu memakai tombol aksesibel |
| Hero | Kicker “Konsultasi hama perseorangan”; H1; penjelasan; harga; dua CTA; foto/panel terpisah kanan | Satu kolom: teks, CTA, foto. Jangan mendorong harga jauh di bawah foto |
| Jenis masalah | Kalimat “Ada kecoa, tikus, atau hama lain?”; daftar cakupan yang sudah dikonfirmasi | Daftar ringkas membungkus; tanpa carousel |
| Dua layanan | Dua baris editorial dengan nomor 01/02, judul, cakupan, biaya dan tautan | Tiap layanan satu blok; bukan dua kartu sempit berdampingan |
| Cara kerja | Tiga langkah: ceritakan → sepakati layanan/biaya → konsultasi/kunjungan sesuai jadwal | Daftar vertikal bernomor |
| Profil penyedia | Nama asli, pendekatan kerja, kota basis; foto opsional | Teks dan foto berurutan; tidak menyisipkan badge tanpa bukti |
| Biaya & jangkauan | Harga konsultasi, isi layanan, penanganan terpisah; area fleksibel berdasarkan jarak dan permintaan | Harga mudah ditemukan; tanpa tabel lebar |
| FAQ | Lima–enam pertanyaan konkret; gunakan details/summary semantik | Bisa dibuka dengan keyboard; jawaban tidak dipotong |
| Penutup & footer | CTA; nama/kontak; jam layanan; tautan tentang, privasi dan syarat | Tautan cukup besar dan terpisah |

Gunakan warna latar untuk dua atau tiga perubahan suasana yang diperlukan, bukan setiap section menjadi kartu. Satu garis pemisah halus dan penomoran kecil dapat menjadi ciri visual konsisten. Jangan menambahkan section testimoni jika belum ada data asli.

### Copy awal yang bisa dipakai

**Hero**

Judul: “Ada hama di rumah? Ceritakan masalahnya.”

Penjelasan: “Saya membantu menilai masalah hama lewat konsultasi online. Jika perlu penanganan langsung, lokasi, langkah kerja, dan biayanya kita bicarakan terlebih dahulu.”

Baris biaya: “Konsultasi online Rp20.000–Rp25.000. Biaya penanganan langsung terpisah.” Rentang ini hanya boleh ditayangkan setelah pemilik mengonfirmasi rincian dan apa yang termasuk.

CTA utama: “Mulai konsultasi” → /pesan?layanan=online.

CTA kedua: “Ajukan kunjungan” → /pesan?layanan=kunjungan.

Catatan: “Ketersediaan dan jadwal dikonfirmasi melalui WhatsApp.”

**Dua layanan**

- Konsultasi online: “Ceritakan tanda hama yang Anda temukan. Saya bantu menilai kondisi awal dan membahas langkah berikutnya melalui WhatsApp.” Durasi dan format sesi diambil dari data bisnis yang sudah final.
- Penanganan langsung: “Ajukan pemeriksaan atau penanganan di lokasi. Kunjungan menyesuaikan jarak, kondisi, dan ketersediaan. Penawaran biaya disampaikan sebelum disepakati.”

**Contoh FAQ**

1. “Apakah bisa konsultasi saja?” — Bisa. Penanganan langsung dibicarakan terpisah sesuai kebutuhan dan persetujuan Anda.
2. “Apakah semua lokasi bisa dikunjungi?” — Kunjungan menyesuaikan jarak, permintaan dan ketersediaan. Kirim kecamatan/kota untuk dibicarakan lebih dahulu.
3. “Apakah biaya konsultasi termasuk kunjungan?” — Biaya penanganan langsung terpisah. Rincian penawaran dikonfirmasi melalui WhatsApp.
4. “Bisa kirim foto?” — Foto dapat dikirim langsung di percakapan WhatsApp. Situs ini tidak menerima unggahan.
5. “Apakah mengisi formulir langsung membuat jadwal?” — Formulir membantu menyusun pesan. Kirim pesan di WhatsApp, lalu sepakati jadwal dengan penyedia.
6. “Apakah hasilnya dijamin?” — Penilaian dan rencana penanganan bergantung kondisi. Jangan menjanjikan hasil atau garansi yang belum disepakati secara tertulis.

Hapus FAQ yang tidak sesuai kebijakan final. Hindari “solusi terbaik”, “teknologi mutakhir”, “terpercaya sejak…”, “24/7”, dan “bebas hama selamanya” tanpa bukti yang relevan.

## 5. Halaman formulir /pesan

Judul: “Ceritakan masalah hamanya”. Subteks: “Isi singkat, periksa pesan, lalu lanjutkan ke WhatsApp.”

Satu kolom, maksimum 640 px, label selalu terlihat. Kelompokkan layanan, kondisi, dan area. Radio native berlabel untuk dua layanan; jangan hanya memakai kartu yang bisa diklik. Detail field, batas panjang dan kondisi ada di brief implementasi.

Alur dua tahap pada halaman yang sama: **Isi detail → Tinjau pesan**. Preview berupa teks biasa dengan tombol “Ubah isian”, “Buka WhatsApp”, dan “Salin pesan”. Ringkasan tetap menampilkan pilihan layanan dan area. Pelanggan tidak wajib membuat akun atau memasukkan nomor telepon karena akan memulai chat sendiri.

Microcopy sebelum membuka WhatsApp: “Saat Anda menekan Buka WhatsApp, ringkasan ini dibawa ke layanan WhatsApp. Anda masih perlu menekan kirim di sana. Jadwal dan biaya dikonfirmasi melalui percakapan.”

Tidak ada layar “Booking berhasil” atau nomor pesanan fiktif. Jika pengguna kembali dari WhatsApp, tampilkan “Pesan belum dapat dikonfirmasi oleh situs ini. Pastikan Anda sudah menekan kirim di WhatsApp.”

## 6. Mobile, aksesibilitas, dan gerak

- Desain dari lebar 360 px; tetap reflow pada 320 CSS px. Padding 20 px di ponsel, 32 px di tablet, hingga 48 px di desktop. Pada layar 320 px, padding dapat turun ke 16 px.
- Hero desktop kira-kira 55:45; di bawah 900 px menjadi satu kolom. Tidak ada ukuran tinggi hero wajib 100vh.
- Target sentuh desain minimal 44 × 44 px dengan jarak cukup. Tautan inline tetap mengikuti struktur paragraf.
- Satu H1 per halaman, heading berurutan, landmark semantik, skip link, dan html lang=id. Tombol melakukan aksi; tautan berpindah halaman/lokasi.
- Jangan mengandalkan warna saja untuk error/status. Label, helper dan pesan error terhubung ke input. Fokus menuju ringkasan error atau judul preview sesuai aksi pengguna.
- Navigasi menu memakai aria-expanded dan aria-controls; Escape menutup dan fokus kembali ke tombol. Hindari modal jika panel biasa cukup.
- Bila header sticky, anchor memiliki scroll-margin dan fokus tidak tertutup. Sticky CTA bawah tidak dipakai secara default; jika ditambahkan, sediakan ruang bawah dan safe-area agar tidak menutup field/fokus.
- Hover/focus transition 120–180 ms. Hormati prefers-reduced-motion. Tanpa parallax, scroll hijacking, autoplay video, ticker, atau animasi angka.
- Hormati zoom, pembesaran font, orientasi, dan pengaturan gerak pengguna. Target WCAG 2.2 AA; hasil perlu diperiksa, bukan sekadar diberi badge. [Rujukan WCAG](https://www.w3.org/WAI/WCAG22/quickref/).

## 7. Rubrik anti-AI-slop sebelum diterima

| Pertanyaan | Harus terlihat pada hasil |
| --- | --- |
| Siapa orang yang menyediakan jasa? | Nama/profil nyata atau penanda belum terisi pada preview; tanpa tim fiktif |
| Apa yang dibayar? | Harga awal dan isi konsultasi; biaya kunjungan dinyatakan terpisah |
| Apa yang terjadi setelah klik? | CTA mengarah ke alur yang benar; WhatsApp dan langkah kirim dijelaskan |
| Apa yang membuatnya milik usaha ini? | Foto/pendekatan kerja/kota basis asli; penjelasan layanan yang konkret |
| Apakah tiap section membantu keputusan? | Setiap bagian menjawab pertanyaan pelanggan; hapus pengulangan slogan |
| Apakah tampilannya terasa utuh tanpa dekorasi? | Hirarki, ritme, dan layout kuat; tanpa bergantung blob, gradient atau kartu berulang |
| Apakah dapat dipakai dengan keterbatasan akses? | Keyboard, label, kontras, ukuran target, reflow, dan gerak telah diperiksa |

Jangan menambahkan dekorasi untuk menutupi data yang belum tersedia. Rapikan komposisi, pendekkan copy, dan gunakan fakta yang sudah dimiliki.
