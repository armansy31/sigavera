import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { formatConsultationPriceRange } from '@/lib/site-config';

export function Services() {
  const priceRange = formatConsultationPriceRange();

  return (
    <section
      id="layanan"
      aria-labelledby="services-heading"
      className="border-b border-hairline bg-canvas py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div id="biaya" className="container-editorial">
        {/* Signature Soft Moss Gradient Color-Block Section */}
        <div className="rounded-3xl border border-[#CAD8C5] bg-gradient-to-br from-[#E6EFE3] via-[#DEEBDA] to-[#D5E3D1] p-4 text-ink shadow-sm sm:p-8 md:p-12 lg:p-16">
          {/* Bagian 1: Cakupan Masalah Hama */}
          <div className="grid gap-8 md:grid-cols-12 md:items-start">
            <div className="md:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white/60 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-forest">
                Cakupan Masalah
              </div>
              <h2 className="mt-4 break-words font-heading text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl">
                Ada kecoa, tikus, atau hama lain di rumah?
              </h2>
              <p className="mt-3 font-sans text-base leading-relaxed text-ink-muted sm:text-lg">
                Setiap tempat memiliki celah dan sumber masalah berbeda. Anda cukup menceritakan tanda yang terlihat meski belum yakin jenis hamanya.
              </p>
            </div>
            <div className="md:col-span-7">
              <div className="grid gap-3 sm:grid-cols-2">
                {siteConfig.confirmedPests.map((pestItem) => (
                  <div
                    key={pestItem}
                    className="flex items-center rounded-2xl border border-[#BDCFB8] bg-white/95 px-4 py-3 sm:px-5 sm:py-3.5 shadow-xs transition-calm hover:border-forest/40 hover:bg-white"
                  >
                    <span className="mr-3 h-2 w-2 shrink-0 rounded-full bg-forest" aria-hidden="true" />
                    <p className="font-sans text-sm font-semibold leading-snug text-ink">{pestItem}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Garis Pembatas Halus di dalam Color Block */}
          <div className="my-10 border-t border-[#CAD8C5] md:my-14" />

          {/* Bagian 2: Pilihan Layanan & Biaya Transparan */}
          <div>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white/60 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-forest">
                Pilihan Layanan & Biaya
              </div>
              <h2
                id="services-heading"
                className="mt-4 break-words font-heading text-2xl font-extrabold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl"
              >
                Dua cara memulai, sesuai kebutuhan Anda
              </h2>
              <p className="mt-3 font-sans text-base leading-relaxed text-ink-muted sm:text-lg">
                Mulai dari diskusi awal jarak jauh, atau langsung ajukan pemeriksaan fisik di lokasi. Biaya selalu terbuka di awal tanpa tagihan tersembunyi.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:gap-8">
              {/* Kartu 01: Konsultasi Online */}
              <article className="flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#CAD8C5] bg-white p-5 sm:p-8 text-ink shadow-sm transition-calm">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-hairline pb-4">
                    <div>
                      <span className="inline-flex items-center rounded-md bg-forest/10 px-2.5 py-0.5 font-sans text-xs font-bold uppercase tracking-wider text-forest">
                        Jalur Jarak Jauh
                      </span>
                      <h3 className="mt-1 font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-ink">
                        Konsultasi Online
                      </h3>
                    </div>
                    <span className="font-heading text-lg sm:text-2xl font-extrabold text-forest whitespace-nowrap">
                      {priceRange}
                    </span>
                  </div>
                  <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-ink-muted">
                    Ceritakan keluhan dan kirimkan foto kondisi via WhatsApp. Saya bantu menganalisis kemungkinan sumber masalah dan rekomendasi penanganan awal.
                  </p>
                  <ul className="mt-6 space-y-3 font-sans text-sm text-ink-muted">
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-1.5 shrink-0 items-center justify-center" aria-hidden="true">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      </span>
                      <span className="leading-5">Identifikasi awal tanda hama tanpa survei lokasi.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-1.5 shrink-0 items-center justify-center" aria-hidden="true">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      </span>
                      <span className="leading-5">Durasi fleksibel hingga permasalahan tuntas dibahas.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-1.5 shrink-0 items-center justify-center" aria-hidden="true">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      </span>
                      <span className="leading-5">Pembayaran dilakukan hanya setelah sesi selesai (batal Rp0).</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 border-t border-hairline pt-6">
                  <Link
                    href="/pesan?layanan=online"
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 font-sans text-sm font-bold text-white shadow-sm transition-calm hover:bg-forest-hover focus-visible:outline-focus"
                  >
                    <span>Mulai Konsultasi Online</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              </article>

              {/* Kartu 02: Penanganan Langsung */}
              <article className="flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#CAD8C5] bg-white p-5 sm:p-8 text-ink shadow-sm transition-calm">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-hairline pb-4">
                    <div>
                      <span className="inline-flex items-center rounded-md bg-forest/10 px-2.5 py-0.5 font-sans text-xs font-bold uppercase tracking-wider text-forest">
                        Jalur Lokasi
                      </span>
                      <h3 className="mt-1 font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-ink">
                        Penanganan Langsung
                      </h3>
                    </div>
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted whitespace-nowrap">
                      Biaya Terpisah
                    </span>
                  </div>
                  <p className="mt-4 font-sans text-sm sm:text-base leading-relaxed text-ink-muted">
                    Pemeriksaan langsung celah bangunan dan tindakan pengendalian di lokasi untuk wilayah Lombok Barat dan sekitarnya.
                  </p>
                  <ul className="mt-6 space-y-3 font-sans text-sm text-ink-muted">
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-1.5 shrink-0 items-center justify-center" aria-hidden="true">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      </span>
                      <span className="leading-5">Cukup sebutkan kecamatan dan kota pada formulir awal.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-1.5 shrink-0 items-center justify-center" aria-hidden="true">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      </span>
                      <span className="leading-5">Penawaran biaya dihitung terbuka menurut jarak dan kondisi tempat.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex h-5 w-1.5 shrink-0 items-center justify-center" aria-hidden="true">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                      </span>
                      <span className="leading-5">Alamat lengkap baru diminta setelah jadwal disepakati bersama.</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 border-t border-hairline pt-6">
                  <Link
                    href="/pesan?layanan=kunjungan"
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-hairline bg-white px-6 py-3 font-sans text-sm font-bold text-ink shadow-sm transition-calm hover:bg-moss-soft/40 focus-visible:outline-focus"
                  >
                    <span>Ajukan Kunjungan Lokasi</span>
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
