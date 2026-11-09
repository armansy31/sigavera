import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { isValidIndonesianWhatsappNumber } from '@/lib/site-config';

export const metadata: Metadata = {
  title: siteConfig.businessName,
  description:
    'Penjelasan mengenai informasi yang Anda isi pada formulir, pemrosesan di browser, perpindahan teks ke WhatsApp, dan cara menghubungi penyedia.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function KebijakanPrivasiPage() {
  const hasProviderName = Boolean(siteConfig.providerName.trim());
  const hasValidWa = isValidIndonesianWhatsappNumber(siteConfig.whatsappNumber);

  return (
    <div className="bg-canvas py-12 md:py-20">
      <div className="container-editorial">
        <article className="mx-auto max-w-prose rounded-lg border border-hairline bg-white p-7 sm:p-10">
          <header className="border-b border-hairline pb-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
              Dokumen privasi
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
              Kebijakan Privasi
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Terakhir diperbarui: {siteConfig.legalLastUpdated}
            </p>
            {siteConfig.contentStatus === 'draft' && (
              <div className="mt-4 rounded-md border border-[#DFD8C9] bg-gradient-to-r from-[#F5F1E8] to-[#EAE3D4] p-3.5 text-xs leading-relaxed text-ink">
                <strong>Penanda Draf:</strong> Data identitas penyedia dan nomor WhatsApp resmi telah diverifikasi oleh pemilik. Status draf tetap aktif karena domain HTTPS produksi belum terpasang sebelum publikasi.
              </div>
            )}
          </header>

          <div className="mt-8 space-y-8 text-base leading-relaxed text-ink">
            <section aria-labelledby="privasi-identitas">
              <h2 id="privasi-identitas" className="text-xl font-bold text-ink sm:text-2xl">
                1. Identitas dan Kontak Penyedia
              </h2>
              <p className="mt-2 text-ink-muted">
                Layanan <strong>{siteConfig.businessName}</strong> dikelola langsung oleh praktisi{' '}
                <strong>
                  {hasProviderName
                    ? siteConfig.providerName
                    : '[Nama Penyedia Belum Diisi — Menunggu Konfigurasi Final]'}
                </strong>
                . Untuk pertanyaan mengenai privasi atau percakapan layanan, Anda dapat menghubungi melalui nomor WhatsApp resmi layanan:{' '}
                <strong>
                  {hasValidWa
                    ? `+${siteConfig.whatsappNumber}`
                    : '[Nomor WhatsApp Belum Dikonfigurasi]'}
                </strong>
                .
              </p>
            </section>

            <section aria-labelledby="privasi-data">
              <h2 id="privasi-data" className="text-xl font-[340] text-ink sm:text-2xl">
                2. Informasi yang Anda Masukkan di Formulir
              </h2>
              <p className="mt-2 text-ink/75">
                Saat menggunakan halaman formulir <Link href="/pesan" className="font-bold text-primary underline underline-offset-4">/pesan</Link>, Anda dapat memasukkan informasi berikut:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink/75">
                <li>Pilihan jenis layanan (Konsultasi online atau Penanganan langsung).</li>
                <li>Nama panggilan (opsional).</li>
                <li>Jenis hama dan jenis tempat (opsional).</li>
                <li>Nama kecamatan dan kota (wajib untuk pengajuan kunjungan; tanpa alamat rumah lengkap).</li>
                <li>Deskripsi singkat mengenai kondisi masalah hama yang Anda alami.</li>
              </ul>
              <p className="mt-2 text-ink/75">
                Formulir situs ini <strong>tidak meminta</strong> nomor telepon, alamat rumah rinci, titik koordinat lokasi, nomor identitas (KTP), informasi kesehatan, maupun nomor rekening/pembayaran.
              </p>
            </section>

            <section aria-labelledby="privasi-tujuan">
              <h2 id="privasi-tujuan" className="text-xl font-[340] text-ink sm:text-2xl">
                3. Tujuan dan Pemrosesan di Browser
              </h2>
              <p className="mt-2 text-ink/75">
                Seluruh isian formulir diproses langsung di memori halaman browser perangkat Anda semata-mata untuk membantu menyusun draf teks pesan yang rapi.
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink/75">
                <li>
                  <strong>Tidak ada database aplikasi:</strong> Situs ini tidak memiliki server pemesanan, database penyimpanan formulir, akun pengguna, atau analitik pelacak pihak ketiga.
                </li>
                <li>
                  <strong>Tidak ada penyimpanan browser persisten:</strong> Aplikasi ini tidak menyimpan draf keluhan Anda ke dalam <code>localStorage</code>, <code>sessionStorage</code>, <code>IndexedDB</code>, maupun cookie browser. Jika Anda memuat ulang (refresh) atau menutup halaman, isian pada formulir akan hilang dari memori halaman.
                </li>
              </ul>
            </section>

            <section aria-labelledby="privasi-hosting">
              <h2 id="privasi-hosting" className="text-xl font-[340] text-ink sm:text-2xl">
                4. Log Akses Infrastruktur Hosting
              </h2>
              <p className="mt-2 text-ink/75">
                Meskipun aplikasi tidak menyimpan isian formulir Anda, server penyedia layanan hosting yang menyajikan halaman situs ini secara teknis tetap dapat mencatat log akses standar (seperti alamat IP, waktu kunjungan, jenis browser/perangkat, dan path halaman yang diminta) untuk keperluan keamanan dan keandalan infrastruktur. Isian keluhan Anda tidak dimasukkan ke dalam URL situs ini sehingga tidak tercatat pada log path halaman hosting.
              </p>
            </section>

            <section aria-labelledby="privasi-whatsapp">
              <h2 id="privasi-whatsapp" className="text-xl font-[340] text-ink sm:text-2xl">
                5. Perpindahan Data ke Layanan WhatsApp
              </h2>
              <p className="mt-2 text-ink/75">
                Apabila Anda mencentang pernyataan pemahaman perpindahan data, meninjau pesan, lalu menekan tombol <strong>Buka WhatsApp</strong>:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink/75">
                <li>
                  Teks ringkasan pesan akan disertakan sebagai parameter pada tautan resmi <code>https://wa.me/</code> menuju aplikasi atau situs WhatsApp.
                </li>
                <li>
                  Tautan tersebut dapat tercatat di riwayat peramban (browser history) perangkat Anda dan diproses oleh pihak WhatsApp (Meta) sesuai kebijakan privasi dan ketentuan layanan WhatsApp sendiri.
                </li>
                <li>
                  Ketika Anda menekan tombol kirim di WhatsApp, nomor telepon WhatsApp Anda, profil WhatsApp Anda, isi pesan, serta foto kondisi yang Anda kirimkan secara manual di ruang chat akan diterima oleh saya sebagai penyedia jasa untuk menindaklanjuti permintaan layanan Anda.
                </li>
              </ul>
            </section>

            <section aria-labelledby="privasi-retensi">
              <h2 id="privasi-retensi" className="text-xl font-[340] text-ink sm:text-2xl">
                6. Penanganan Percakapan, Foto, dan Retensi Terkait Masalah Hama
              </h2>
              <p className="mt-2 text-ink/75">
                Pesan, foto kondisi, dan catatan percakapan yang Anda kirimkan melalui WhatsApp disimpan dan digunakan semata-mata sebatas kebutuhan penanganan masalah hama Anda. Saya tidak membagikan foto rumah atau percakapan pribadi Anda untuk materi promosi publik tanpa izin tertulis yang jelas dari Anda.
              </p>
              <p className="mt-2 text-ink/75">
                Anda dapat menghubungi saya melalui nomor WhatsApp layanan kapan saja untuk meminta penghapusan riwayat percakapan atau foto yang tersimpan pada perangkat kerja saya. Penghapusan di sisi saya tidak secara otomatis menghapus salinan pesan pada perangkat Anda atau sistem milik WhatsApp.
              </p>
              {!siteConfig.termsStatus.conversationRetentionFinalized && (
                <p className="mt-3 rounded-md bg-surface-soft p-3 text-xs text-ink/60">
                  <em>[Penanda Draf Operasional: Kebijakan rincian masa simpan arsip percakapan internal penyedia belum difinalisasi oleh pemilik dan wajib dilengkapi sebelum publikasi.]</em>
                </p>
              )}
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}

