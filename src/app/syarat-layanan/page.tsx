import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { formatConsultationPriceRange, isValidIndonesianWhatsappNumber } from '@/lib/site-config';

export const metadata: Metadata = {
  title: siteConfig.businessName,
  description:
    'Ketentuan layanan konsultasi online dan penanganan hama langsung, biaya awal, kesepakatan jadwal, pembayaran, pembatalan, dan batas klaim layanan.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function SyaratLayananPage() {
  const priceRange = formatConsultationPriceRange();
  const hasValidWa = isValidIndonesianWhatsappNumber(siteConfig.whatsappNumber);

  return (
    <div className="bg-canvas py-12 md:py-20">
      <div className="container-editorial">
        <article className="mx-auto max-w-prose rounded-lg border border-hairline bg-white p-7 sm:p-10">
          <header className="border-b border-hairline pb-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
              Ketentuan layanan
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-ink sm:text-4xl">
              Syarat Layanan
            </h1>
            <p className="mt-2 text-sm text-ink-muted">
              Terakhir diperbarui: {siteConfig.legalLastUpdated}
            </p>
            {siteConfig.contentStatus === 'draft' && (
              <div
                data-testid="terms-draft-warning"
                className="mt-4 rounded-md border border-[#DFD8C9] bg-gradient-to-r from-[#F5F1E8] to-[#EAE3D4] p-3.5 text-xs leading-relaxed text-ink"
              >
                <strong>Penanda Draf:</strong> Ketentuan operasional resmi telah dicantumkan dan nomor WhatsApp resmi telah diverifikasi oleh pemilik. Status draf tetap dipertahankan karena domain HTTPS produksi belum ditetapkan sebelum publikasi.
              </div>
            )}
          </header>

          <div className="mt-8 space-y-8 text-base leading-relaxed text-ink">
            <section aria-labelledby="syarat-lingkup">
              <h2 id="syarat-lingkup" className="text-xl font-bold text-ink sm:text-2xl">
                1. Lingkup Penilaian Awal Konsultasi Online
              </h2>
              <p className="mt-2 text-ink-muted">
                Layanan konsultasi online bertujuan memberikan penilaian awal berdasarkan informasi, cerita kronologi, dan foto kondisi yang Anda sampaikan melalui WhatsApp. Penilaian jarak jauh memiliki keterbatasan dibanding pemeriksaan fisik langsung di lokasi dan tidak menggantikan inspeksi struktural bangunan secara menyeluruh.
              </p>
            </section>

            <section aria-labelledby="syarat-biaya-konsultasi">
              <h2 id="syarat-biaya-konsultasi" className="text-xl font-[340] text-ink sm:text-2xl">
                2. Biaya Awal dan Cakupan Sesi Konsultasi
              </h2>
              <p className="mt-2 text-ink/75">
                Kisaran biaya awal konsultasi online adalah <strong>{priceRange}</strong>. Sesi mencakup diskusi masalah hama yang dialami, identifikasi kemungkinan sumber gangguan, serta rekomendasi langkah awal.
              </p>
              <p className="mt-2 text-ink/75">
                Konsultasi online tidak memiliki batas durasi kaku berdasarkan menit atau jam; sesi berlangsung sampai masalah selesai dibahas dan langkah penanganan disepakati. Layanan konsultasi online ini terpisah dan berbeda dari pelaksanaan tindakan penanganan atau pembasmian hama secara fisik di lokasi.
              </p>
              <p className="mt-2 text-ink/75">
                Biaya konsultasi online <strong>tidak otomatis mencakup</strong> kunjungan ke lokasi atau tindakan penanganan fisik.
              </p>
              {!siteConfig.consultationPricing.isFinalized && (
                <p className="mt-3 rounded-md bg-surface-soft p-3 text-xs text-ink/60">
                  <em>[Penanda Draf: Harga pasti per sesi, batas durasi sesi konsultasi, dan ketentuan tindak lanjut chat masih menunggu konfirmasi final pemilik.]</em>
                </p>
              )}
            </section>

            <section aria-labelledby="syarat-kunjungan">
              <h2 id="syarat-kunjungan" className="text-xl font-[340] text-ink sm:text-2xl">
                3. Penawaran Biaya Kunjungan dan Tindakan Langsung
              </h2>
              <p className="mt-2 text-ink/75">
                Untuk pengajuan penanganan langsung di lokasi, biaya pemeriksaan lapangan, tindakan pengendalian, dan perjalanan dihitung secara terpisah berdasarkan jarak lokasi, jenis hama, dan kondisi tempat.
              </p>
              <p className="mt-2 text-ink/75">
                Rincian penawaran biaya akan diinformasikan melalui WhatsApp. Tindakan kunjungan hanya dilakukan setelah Anda menyetujui rincian langkah kerja dan biayanya secara eksplisit.
              </p>
            </section>

            <section aria-labelledby="syarat-jadwal">
              <h2 id="syarat-jadwal" className="text-xl font-[340] text-ink sm:text-2xl">
                4. Ketersediaan dan Konfirmasi Jadwal Manual
              </h2>
              <p className="mt-2 text-ink/75">
                Mengisi formulir di halaman <Link href="/pesan" className="font-bold text-primary underline underline-offset-4">/pesan</Link> atau membuka tautan WhatsApp tidak secara otomatis mengunci jadwal layanan. Seluruh ketersediaan area kunjungan dan jadwal waktu layanan dikonfirmasi secara manual melalui percakapan WhatsApp. Begitu rincian dan waktu disepakati bersama, booking langsung dijalankan.
              </p>
            </section>

            <section aria-labelledby="syarat-pembayaran">
              <h2 id="syarat-pembayaran" className="text-xl font-[340] text-ink sm:text-2xl">
                5. Cara dan Waktu Pembayaran
              </h2>
              <p className="mt-2 text-ink/75">
                Situs ini tidak menyediakan pemrosesan pembayaran otomatis (payment gateway). Pembayaran konsultasi dilakukan <strong>hanya setelah sesi konsultasi selesai</strong>—yaitu setelah permasalahan selesai dibahas dan langkah penanganan disepakati bersama. Metode pembayaran yang diterima meliputi <strong>Transfer Bank</strong>, <strong>QRIS</strong>, atau <strong>Tunai (CASH)</strong> melalui kesepakatan langsung di percakapan WhatsApp resmi penyedia. Tidak ada biaya tambahan atau persyaratan pembayaran di muka untuk konsultasi online.
              </p>
              {!siteConfig.termsStatus.paymentMethodAndTimingFinalized && (
                <p className="mt-3 rounded-md bg-surface-soft p-3 text-xs text-ink/60">
                  <em>[Penanda Draf: Ketentuan final mengenai pilihan metode pembayaran dan waktu jatuh tempo pembayaran untuk konsultasi maupun kunjungan belum ditetapkan pemilik.]</em>
                </p>
              )}
            </section>

            <section aria-labelledby="syarat-pembatalan">
              <h2 id="syarat-pembatalan" className="text-xl font-[340] text-ink sm:text-2xl">
                6. Penjadwalan Ulang, Pembatalan, dan Pengembalian Dana (Refund)
              </h2>
              <p className="mt-2 text-ink/75">
                <strong>Ketentuan Pembatalan Konsultasi:</strong> Pembatalan sebelum sesi konsultasi selesai tidak dikenakan biaya sama sekali (<strong>Rp0</strong>), termasuk apabila pembatalan dilakukan saat sesi percakapan sedang berlangsung. Apabila konsultasi telah selesai dibahas dan langkah penanganan disepakati, biaya konsultasi mengikuti tarif yang telah diinformasikan ({priceRange}).
              </p>
              <p className="mt-2 text-ink/75">
                Karena pembayaran konsultasi online dilakukan setelah sesi selesai, tidak ada mekanisme refund (pengembalian dana) rutin. Untuk penanganan langsung di lokasi, rincian biaya disepakati terlebih dahulu sebelum tindakan dimulai. Apabila ada kebutuhan penyesuaian jadwal karena kondisi mendesak atau cuaca, koordinasi dilakukan sedini mungkin melalui WhatsApp. Kebijakan ini tetap menghormati hak-hak konsumen serta pengecualian yang diwajibkan oleh peraturan perundang-undangan yang berlaku.
              </p>
              {(!siteConfig.termsStatus.reschedulePolicyFinalized ||
                !siteConfig.termsStatus.cancellationAndRefundFinalized) && (
                <p className="mt-3 rounded-md bg-surface-soft p-3 text-xs text-ink/60">
                  <em>[Penanda Draf: Batas waktu pemberitahuan penjadwalan ulang, syarat pembatalan kunjungan, dan ketentuan pengembalian dana (refund) belum diputuskan oleh pemilik dan wajib diselesaikan sebelum rilis publik.]</em>
                </p>
              )}
            </section>

            <section aria-labelledby="syarat-kewajiban">
              <h2 id="syarat-kewajiban" className="text-xl font-[340] text-ink sm:text-2xl">
                7. Informasi Kondisi Tempat dan Persetujuan Tindakan
              </h2>
              <p className="mt-2 text-ink/75">
                Pelanggan diharapkan memberikan informasi yang jujur dan relevan mengenai kondisi ruangan, riwayat penggunaan bahan kimia sebelumnya, serta keberadaan penghuni rentan, anak-anak, hewan peliharaan, atau area penyimpanan makanan sebelum tindakan langsung dilakukan di lokasi.
              </p>
            </section>

            <section aria-labelledby="syarat-batas-klaim">
              <h2 id="syarat-batas-klaim" className="text-xl font-[340] text-ink sm:text-2xl">
                8. Batas Klaim Hasil dan Keselamatan
              </h2>
              <p className="mt-2 text-ink/75">
                Keberhasilan pengendalian hama dipengaruhi oleh kondisi celah bangunan, kebersihan lingkungan sekitar, dan kebiasaan penghuni. Oleh karena itu:
              </p>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-ink/75">
                <li>Layanan ini tidak menjanjikan klaim mutlak bahwa lokasi akan bebas hama selamanya tanpa perawatan lingkungan.</li>
                <li>Layanan ini bukan layanan medis dan tidak memberikan saran kesehatan/pengobatan atas gigitan atau penyakit bawaan hama.</li>
                <li>Situs ini tidak memberikan instruksi pencampuran dosis pestisida mandiri dari asumsi.</li>
              </ul>
            </section>

            <section aria-labelledby="syarat-kontak">
              <h2 id="syarat-kontak" className="text-xl font-[340] text-ink sm:text-2xl">
                9. Kontak Pertanyaan dan Pengaduan Layanan
              </h2>
              <p className="mt-2 text-ink/75">
                Segala pertanyaan, klarifikasi biaya, atau keluhan terkait layanan dapat disampaikan langsung melalui kontak WhatsApp resmi penyedia:{' '}
                <strong>
                  {hasValidWa
                    ? `+${siteConfig.whatsappNumber}`
                    : '[Nomor WhatsApp Belum Dikonfigurasi pada Draf Ini]'}
                </strong>
                .
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}

