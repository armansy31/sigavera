# Aturan Keamanan

Aturan ini berlaku ketika membangun atau mengubah website. Poin “MVP” wajib untuk lingkup sekarang. Poin “Saat backend/database ditambahkan” menjadi syarat sebelum fitur lanjutan dirilis, bukan alasan memasang infrastruktur tersebut sekarang.

## 1. Batas data dan permukaan layanan — MVP

- Tidak membuat endpoint booking, Server Action, database, autentikasi, upload, atau integrasi pengiriman otomatis. Next.js boleh dirender/prerender dan disajikan oleh hosting; “tanpa backend booking” tidak berarti hosting tidak memiliki server/log.
- Simpan draft formulir hanya di state/memori komponen. Tidak memakai localStorage, sessionStorage, IndexedDB, cookie draft, service worker cache isian, hidden tracking, session replay, atau layanan formulir pihak ketiga.
- Tidak menaruh nama, area, keluhan, isi pesan atau checkbox pada URL situs sendiri. Query string situs hanya boleh memuat pilihan layanan yang telah di-allowlist.
- Jangan mencatat isian ke console, log error, telemetry, screenshot otomatis, fixture publik atau analitik. Gunakan data sintetis untuk pemeriksaan.
- Jangan meminta alamat lengkap, koordinat, KTP, nomor rekening, riwayat kesehatan, nomor pelanggan, atau nomor telepon pada formulir MVP. Alamat rinci untuk kunjungan dibahas secara pribadi setelah diperlukan.
- Foto dikirim manual oleh pelanggan di WhatsApp. Situs tidak menerima atau memindai berkas.
- Nomor WhatsApp usaha bersifat publik. Tidak perlu token API WhatsApp untuk tautan click-to-chat. Semua NEXT_PUBLIC_* dan kode klien harus dianggap terlihat oleh pengunjung; jangan taruh rahasia di sana.

## 2. Validasi input — MVP

Gunakan satu schema Zod untuk kontrak sesuai brief. Validasi sebelum preview dan sebelum membangun URL. Atribut HTML seperti maxLength memberi bantuan tambahan, bukan batas keamanan yang bisa dipercaya oleh server di masa depan.

1. Semua isian harus berupa tipe yang diharapkan. Layanan, jenis hama dan jenis tempat memakai daftar nilai yang ditentukan aplikasi. Jangan menganggap query string atau nilai radio selalu valid.
2. Trim spasi pinggir. Ubah CRLF/CR menjadi LF untuk teks multi-baris. Tolak NUL serta karakter kontrol yang tidak diperlukan; baris baru hanya boleh di deskripsi. Jangan menghapus tanda petik, kata SQL atau karakter Unicode sebagai “filter hack”. Nama Indonesia dan nama seperti D'Angelo tetap dapat diterima.
3. Terapkan batas per field dan relasi: area wajib untuk kunjungan; nilai kosong yang opsional dihilangkan dari pesan. Jangan memotong diam-diam teks yang melebihi batas; tampilkan error dan pertahankan isian.
4. Batasi hasil pesan/URL sesuai brief. Jangan memasukkan JSON mentah, markup, objek arbitrary, atau seluruh state formulir ke URL.
5. Jika query layanan tidak dikenal, tampilkan pilihan tanpa preselect. Jangan membaca URL tujuan, nomor WhatsApp, callback atau redirect dari input pengguna.

Validasi memastikan data sesuai kebutuhan produk. Pencegahan XSS memerlukan penanganan output yang tepat, dan pencegahan SQL injection memerlukan query berparameter. [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html).

## 3. Output dan XSS — MVP

- Tampilkan input dengan interpolasi teks React atau value textarea. Tidak menggunakan dangerouslySetInnerHTML, innerHTML, document.write, eval, new Function, atau renderer Markdown/HTML untuk isian.
- Preview pesan adalah plain text dengan pembungkusan baris. Teks seperti <img src=x onerror=alert(1)> harus muncul sebagai teks, tanpa menjalankan kode.
- URL WhatsApp memakai origin/path milik aplikasi, dan data hanya masuk parameter text melalui URLSearchParams. Jangan membangun HTML dari string atau menerima skema javascript:, data:, maupun origin arbitrary.
- Metadata SEO berasal dari konfigurasi publik yang dipercaya, bukan field pengguna. JSON-LD opsional dan hanya dari konfigurasi tervalidasi; bila memakai serialisasi inline, escape karakter “<” menjadi urutan literal \u003c pada JSON yang ditanam dan periksa hasil HTML. Hilangkan JSON-LD bila fakta belum cukup.
- CSP merupakan lapisan tambahan. Penanganan output tetap wajib. [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html).

## 4. Tautan WhatsApp dan kejujuran status — MVP

Nomor tujuan berasal dari konfigurasi penyedia, format internasional digit saja tanpa +, spasi, atau tanda baca. Untuk layanan Indonesia gunakan pemeriksaan bentuk awal 62 diikuti digit, total maksimum 15 digit. Pemeriksaan bentuk tidak membuktikan nomor aktif atau milik penyedia; pemilik harus memverifikasinya secara manual sebelum publikasi.

Gunakan pola berikut setelah seluruh input dan konfigurasi lulus validasi:

~~~ts
const url = new URL('https://wa.me/' + validatedBusinessNumber);
url.searchParams.set('text', plainTextMessage);
const href = url.toString();
~~~

URLSearchParams menangani encoding; jangan encodeURIComponent lagi pada nilai yang sama. Pesan berisi “&”, “#”, emoji, tanda petik dan baris baru harus kembali menjadi teks yang sama saat parameter di-decode. Pola nomor dan pesan ini mengikuti [WhatsApp click-to-chat](https://faq.whatsapp.com/5913398998672934).

- Baru buat tautan berisi isian ketika pengguna sudah melihat preview dan menyetujui pemberitahuan privasi. Jangan melakukan fetch, prefetch, preconnect, request image atau redirect otomatis ke WhatsApp saat pengguna mengetik/berkunjung.
- Pakai anchor biasa yang diaktifkan pengguna. Jika membuka tab baru, gunakan rel=noopener noreferrer dan referrerPolicy=no-referrer serta jelaskan tab baru pada label aksesibel. Jangan melakukan window.open setelah proses asynchronous yang rawan diblokir browser.
- Beri pilihan salin pesan, termasuk textarea read-only dengan petunjuk salin manual bila Clipboard API ditolak. Jangan mengirim pesan lewat otomatisasi browser.
- Status situs hanya “siap dibuka/disalin”. Tidak mengklaim “terkirim”, “terbayar”, “jadwal tersedia”, atau “booking berhasil”.
- Isian di tautan dapat diproses oleh WhatsApp dan dapat muncul di riwayat browser/layanan tujuan. Jelaskan ini sebelum aksi; jangan menjanjikan bahwa data sama sekali tidak meninggalkan perangkat atau langsung dihapus dari WhatsApp.
- Jika nomor kosong/tidak valid, jangan membuat href aktif. Tampilkan pesan konfigurasi kontak belum tersedia pada preview lokal; blokir rilis produksi sampai benar.

## 5. Formulir tanpa kebocoran saat JavaScript gagal — MVP

Form berisi data pribadi tidak boleh jatuh ke submit GET bawaan yang menaruh isian di URL. Render formulir interaktif setelah client siap; sebelum itu tampilkan pesan pemuatan dan noscript yang menawarkan tautan WhatsApp generik tanpa isian. Submit normal ditangani di klien, dengan form-action 'none' sebagai pengaman tambahan pada CSP produksi. Jangan menambahkan endpoint sekadar untuk fallback.

Tautan generik tidak perlu membawa data pribadi dan baru dibuka atas klik. Ketika data WhatsApp belum tersedia, noscript berisi pemberitahuan layanan kontak belum dikonfigurasi.

## 6. Transport, header dan deployment — MVP

Wajib HTTPS di produksi. Tetapkan header di lapisan yang benar-benar menyajikan halaman: konfigurasi Next.js untuk deployment standar, atau konfigurasi hosting/CDN untuk hasil static export. Pastikan header hadir pada respons produksi, bukan hanya tertulis di kode. [Next.js headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers).

Header awal:

| Header | Nilai / aturan |
| --- | --- |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | no-referrer |
| X-Frame-Options | DENY |
| Permissions-Policy | camera=(), microphone=(), geolocation=() |
| Strict-Transport-Security | max-age=31536000 setelah HTTPS produksi dipastikan; includeSubDomains/preload hanya jika seluruh cakupan siap |
| Content-Security-Policy | Kebijakan dasar di bawah, dibatasi untuk aset lokal dan build yang digunakan |

Kebijakan CSP awal untuk produksi, dengan font dan gambar lokal serta tanpa script pihak ketiga:

~~~text
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
object-src 'none';
base-uri 'self';
form-action 'none';
frame-ancestors 'none';
upgrade-insecure-requests;
~~~

Ini baseline kompatibilitas, **bukan strict CSP**. Izin unsafe-inline membatasi perlindungan terhadap script inline berbahaya; tetap wajib memakai teks React dan menghindari sink HTML. Evaluasi pelanggaran dengan build produksi sebelum menegakkan kebijakan. Jangan menambahkan unsafe-eval di produksi atau wildcard origin untuk menyelesaikan error.

Jika ingin memperketat script-src, rancang hash untuk script hasil build atau nonce per respons sesuai mode rendering. Nonce per request membutuhkan rendering dinamis; jangan membuat nonce tetap untuk halaman statis. Periksa dukungan versi sebelum memakai fitur eksperimental. [Panduan CSP Next.js](https://nextjs.org/docs/app/guides/content-security-policy).

Hindari external embeds, widget chat, map embed, pelacak atau font CDN pada MVP. Jangan memasukkan domain tambahan ke CSP tanpa kebutuhan produk dan alasan tertulis. Perbedaan kebutuhan development seperti hot reload harus dipisahkan dari kebijakan produksi.

## 7. Dependensi dan rahasia — MVP

- Gunakan paket stabil seperlunya, periksa pemilik/sumber paket dan kompatibilitasnya, serta simpan lockfile. Hindari skrip instalasi dari URL tak dikenal.
- Abaikan .env.local dan kredensial melalui .gitignore. .env.example hanya berisi nama variabel dan contoh kosong yang aman.
- Jangan membaca atau mencetak rahasia untuk debugging. Jangan menonaktifkan pemeriksaan TLS, lint, tipe, aturan keamanan, atau build agar hasil terlihat lulus.
- Tinjau advisori dependensi saat implementasi/rilis. Tangani kerentanan yang relevan terhadap jalur yang digunakan; laporkan kendala beserta versi dan dampaknya. Jangan menjalankan upgrade mayor otomatis tanpa menilai kompatibilitas.
- Preview deployment tidak boleh terindeks; batasi akses jika berisi data bisnis yang belum siap. Jangan menyalin data pelanggan nyata ke preview.

## 8. Privasi dan konten layanan — MVP

Halaman privasi menyebut penyedia/kontak aktual, jenis isian, tujuan penyusunan pesan, tidak adanya penyimpanan isian oleh aplikasi, potensi log akses hosting, perpindahan data lewat tautan WhatsApp, dan cara menghubungi penyedia mengenai percakapan. Retensi percakapan dan penghapusan harus mengikuti kebijakan operasional yang benar-benar dapat dilakukan; jangan mengarang batas waktu.

Checkbox formulir berarti pelanggan memahami perpindahan data untuk layanan ini. Jangan gabungkan dengan persetujuan pemasaran. Jangan menyebutnya bukti kepatuhan hukum menyeluruh atau menyimpan “catatan consent” palsu padahal tidak ada database.

Syarat layanan harus menjelaskan lingkup konsultasi, kesepakatan sebelum tindakan, biaya tambahan, pembayaran, penjadwalan ulang, pembatalan dan refund berdasarkan keputusan nyata pemilik. Detail yang belum diputuskan ditandai pada draf dan menahan rilis. Hindari janji hasil, klaim medis, klaim pestisida aman mutlak, dan panduan campuran/dosis dari AI.

## 9. Saat backend/database ditambahkan: SQL injection

MVP tidak memiliki koneksi atau eksekusi SQL. Jangan memasang database sebagai “pencegahan SQL injection”. Ketika database ditambahkan:

1. Semua nilai dari klien, layanan lain, dan data tersimpan harus masuk query sebagai parameter terikat. Dilarang menyisipkan nilai melalui concatenation atau template string SQL.
2. ORM tidak otomatis melindungi raw query. Gunakan API parameter yang didukung; larang raw/unsafe query dari isian. Escaping manual dan blacklist kata SQL bukan pengganti parameter binding.
3. Nama tabel, kolom dan arah sort dipilih dari mapping tetap milik aplikasi. Placeholder nilai tidak dapat dipakai sebagai identifier.
4. Kredensial berada di server. Role aplikasi hanya memperoleh izin yang diperlukan, bukan superuser, pemilik skema, atau akun migrasi. Terapkan otorisasi per operasi dan pemilik data.

Dasar aturan: [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet).

Contoh pola PostgreSQL/node-postgres untuk tahap mendatang, bukan kode yang perlu dipasang dalam MVP:

~~~ts
// input berasal dari validasi server, dengan otorisasi sesuai operasi.
await pool.query(
  'INSERT INTO booking_requests (service_type, area, problem) VALUES ($1, $2, $3)',
  [input.service, input.area, input.problem],
);
~~~

Pola parameter terpisah didukung [dokumentasi node-postgres](https://node-postgres.com/features/queries). Review juga query di stored procedure, job, pencarian, dan laporan. Migrasi serta backup tidak boleh dijalankan dengan kredensial yang terlihat oleh browser.

## 10. Saat backend/database ditambahkan: batas server

- Validasi ulang semua input di server; batasi ukuran body, tipe konten dan waktu proses; tolak field tak dikenal. Harga/status/jadwal final berasal dari aturan server, bukan nilai yang dikirim klien.
- Autentikasi dan otorisasi adalah pemeriksaan terpisah. Gunakan kontrol akses per objek; pelanggan tidak boleh mengakses data orang lain dengan mengganti ID. Admin memakai akses minimum dan autentikasi yang sesuai.
- Untuk operasi yang mengubah keadaan dengan autentikasi berbasis cookie, gunakan proteksi CSRF framework/token dan pemeriksaan origin sesuai arsitektur. Cookie sesi memakai Secure, HttpOnly, dan kebijakan SameSite yang tepat; SameSite atau CORS saja tidak cukup untuk semua keadaan. Jangan mengubah data melalui GET. [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
- Endpoint publik tanpa login tetap perlu pembatasan laju, ukuran permintaan, pencegahan spam, error generik dan pemantauan tanpa data sensitif. CORS bukan autentikasi dan bukan mitigasi SQL injection.
- Jika memakai Supabase kelak, gunakan kebijakan RLS yang diuji untuk setiap akses yang dipaparkan; service role tetap di server. Jangan mengandalkan ID yang sulit ditebak. [Dokumentasi RLS Supabase](https://supabase.com/docs/guides/database/postgres/row-level-security).
- Tetapkan retensi/penghapusan, backup dan uji pemulihan sebelum menyimpan data pelanggan. Jika menambah upload, buat penilaian terpisah untuk tipe/ukuran, penyimpanan privat, pemindaian dan kontrol akses.

## 11. Bukti penerimaan keamanan

Periksa build produksi dan laporkan: input berbahaya tetap teks; nomor/origin tujuan tetap; tidak ada PII di URL situs/log/storage; consent dan preview mendahului tautan personal; no-JS tidak membocorkan field; header aktif; fallback clipboard bekerja; tidak ada database/secret di bundle. Sertakan hasil dan keterbatasan secara jujur. Pemeriksaan bukan alasan mengirim pesan kepada nomor nyata tanpa instruksi pemilik.
