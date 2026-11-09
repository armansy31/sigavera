import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { formatConsultationPriceRange, isValidIndonesianWhatsappNumber } from '@/lib/site-config';

export function SiteFooter() {
  const priceRange = formatConsultationPriceRange();
  const hasBaseCity = Boolean(siteConfig.baseCity.trim());
  const hasServiceHours = Boolean(siteConfig.serviceHours.trim());
  const hasValidWa = isValidIndonesianWhatsappNumber(siteConfig.whatsappNumber);

  return (
    <footer className="border-t border-[#0E2C1E] bg-gradient-to-b from-[#133A27] via-[#0E2C1E] to-[#081B13] text-white">
      <div className="container-editorial py-16 md:py-24">
        {/* Bagian penutup CTA */}
        <div className="border-b border-white/15 pb-14 md:flex md:items-end md:justify-between md:gap-8">
          <div className="max-w-prose">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A2E2B8]">
              Langkah Awal yang Tenang
            </p>
            <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              <span>Ceritakan masalah hamanya.</span>
              <span className="block mt-1 sm:mt-2">Saya&nbsp;bantu tentukan langkah awal.</span>
            </h2>
            <p className="mt-4 text-base font-normal text-white/80 sm:text-lg">
              Konsultasi online {priceRange}. Biaya penanganan langsung di lokasi terpisah dan dibicarakan sebelum tindakan disepakati.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3.5 md:mt-0 md:shrink-0">
            <Link
              href="/pesan?layanan=online"
              className="inline-flex min-h-[48px] items-center justify-center rounded-pill bg-white px-7 py-3 text-sm font-semibold text-forest shadow-sm transition-calm hover:bg-[#F7F5EF] focus-visible:outline-focus"
            >
              Mulai konsultasi
            </Link>
            <Link
              href="/pesan?layanan=kunjungan"
              className="inline-flex min-h-[48px] items-center justify-center rounded-pill border border-white/40 bg-transparent px-7 py-3 text-sm font-semibold text-white transition-calm hover:bg-white/10 focus-visible:outline-focus"
            >
              Ajukan kunjungan
            </Link>
          </div>
        </div>

        {/* Informasi penyedia dan navigasi bawah */}
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-2xl font-bold tracking-tight text-white">{siteConfig.businessName}</p>
            <p className="mt-3 text-sm font-normal leading-relaxed text-white/80">
              Layanan konsultasi hama dan penanganan langsung di lokasi. Setiap permintaan ditinjau secara personal agar langkah yang diambil sesuai dengan kondisi di tempat Anda.
            </p>
            <dl className="mt-5 space-y-2 text-sm text-white/80">
              <div className="flex flex-wrap gap-1.5">
                <dt className="font-semibold text-white">Kota basis:</dt>
                <dd>{hasBaseCity ? siteConfig.baseCity : 'Lombok Barat'}</dd>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <dt className="font-semibold text-white">Jam layanan:</dt>
                <dd>{hasServiceHours ? siteConfig.serviceHours : '08.00–20.00 WITA'}</dd>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <dt className="font-semibold text-white">Kontak WhatsApp:</dt>
                <dd>{hasValidWa ? `+${siteConfig.whatsappNumber}` : '+6281238933418'}</dd>
              </div>
            </dl>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A2E2B8]">
              Navigasi Halaman
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="inline-flex min-h-[36px] items-center text-sm font-normal text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/pesan"
                  className="inline-flex min-h-[36px] items-center text-sm font-normal text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  Formulir Pesan
                </Link>
              </li>
              <li>
                <Link
                  href="/tentang"
                  className="inline-flex min-h-[36px] items-center text-sm font-normal text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  Tentang Layanan
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A2E2B8]">
              Ketentuan & Privasi
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="inline-flex min-h-[36px] items-center text-sm font-[330] text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/syarat-layanan"
                  className="inline-flex min-h-[36px] items-center text-sm font-[330] text-white/80 underline-offset-4 hover:text-white hover:underline"
                >
                  Syarat Layanan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-6 font-mono text-xs text-white/60">
          <p>
            Jadwal, ketersediaan area, dan rincian biaya final selalu dikonfirmasi melalui percakapan WhatsApp sebelum layanan berjalan.
          </p>
        </div>
      </div>
    </footer>
  );
}

