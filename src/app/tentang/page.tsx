import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { formatConsultationPriceRange, isValidProductionSiteUrl } from '@/lib/site-config';

const hasValidSiteUrl = isValidProductionSiteUrl(siteConfig.siteUrl);

export const metadata: Metadata = {
  title: siteConfig.businessName,
  description:
    'Layanan konsultasi dan penanganan hama perseorangan SIGAVERA. Identitas layanan, transparansi biaya, ketelitian pemeriksaan, dan prinsip komunikasi responsif.',
  alternates: hasValidSiteUrl ? { canonical: '/tentang' } : undefined,
};

export default function TentangPage() {
  const priceRange = formatConsultationPriceRange();

  return (
    <div className="bg-canvas py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="container-editorial max-w-5xl">
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 items-stretch">
          
          {/* Card 01: Apa itu SIGAVERA? */}
          <section
            aria-labelledby="tentang-sigavera-heading"
            className="flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-hairline bg-white p-6 sm:p-8 lg:p-10 shadow-xs"
          >
            <div>
              <span className="inline-flex items-center rounded-md bg-forest/10 px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-wider text-forest">
                Tentang Layanan
              </span>
              <h1
                id="tentang-sigavera-heading"
                className="mt-4 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink"
              >
                Apa itu SIGAVERA?
              </h1>
              <p className="mt-3 font-sans text-base font-semibold leading-relaxed text-forest sm:text-lg">
                Layanan konsultasi dan penanganan hama perseorangan untuk rumah dan tempat usaha.
              </p>
              <div className="mt-4 space-y-3 font-sans text-sm sm:text-base leading-relaxed text-ink-muted">
                <p>
                  SIGAVERA membantu Anda menemukan sumber dan jalur masuk gangguan hama secara terarah, tanpa keterikatan sistem kontrak berkala yang rumit.
                </p>
                <p>
                  Penanganan dilakukan secara cermat berdasarkan pemeriksaan kondisi nyata di bangunan Anda agar langkah yang diambil tepat sasaran dan aman bagi penghuni.
                </p>
              </div>

              {/* Logo Emblem di posisi tengah */}
              <div className="my-6 flex justify-center">
                <Image
                  src="/images/logo-pest-control.webp"
                  alt="Logo Pest Control Penanganan Hama SIGAVERA"
                  width={160}
                  height={160}
                  className="h-28 w-28 sm:h-36 sm:w-36 rounded-full object-contain"
                />
              </div>
            </div>

            <div className="mt-8 border-t border-hairline pt-6">
              <Link
                href="/pesan?layanan=online"
                className="inline-flex min-h-[44px] items-center gap-2 font-sans text-sm font-bold text-forest transition-calm hover:text-forest-hover focus-visible:outline-focus"
              >
                <span>Mulai Konsultasi Online</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </section>

          {/* Card 02: Prinsip Layanan */}
          <section
            aria-labelledby="prinsip-heading"
            className="flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-[#CAD8C5] bg-gradient-to-br from-[#EFF6EC] via-[#E8F2E6] to-[#DEEADA] p-6 sm:p-8 lg:p-10 shadow-xs"
          >
            <div>
              <span className="inline-flex items-center rounded-md bg-forest/15 px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-wider text-forest">
                Komitmen Pelayanan
              </span>
              <h2
                id="prinsip-heading"
                className="mt-4 font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink"
              >
                Prinsip Layanan
              </h2>
              <p className="mt-2 font-sans text-xs sm:text-sm text-ink-muted">
                Nilai dasar yang menjadi pegangan dalam setiap konsultasi dan penanganan.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="rounded-xl border border-forest/15 bg-white/70 p-4 sm:p-5 backdrop-blur-xs">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-ink">
                    Transparansi Biaya
                  </h3>
                  <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-ink-muted">
                    Tarif konsultasi online jelas di awal ({priceRange}). Biaya penanganan langsung selalu dibicarakan dan disepakati sebelum tindakan dimulai—tanpa tagihan tersembunyi.
                  </p>
                </div>

                <div className="rounded-xl border border-forest/15 bg-white/70 p-4 sm:p-5 backdrop-blur-xs">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-ink">
                    Ketelitian
                  </h3>
                  <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-ink-muted">
                    Pemeriksaan berfokus pada akar masalah: celah masuk, sarang, dan kondisi riil bangunan tanpa melebih-lebihkan atau memberikan janji instan yang tidak realistis.
                  </p>
                </div>

                <div className="rounded-xl border border-forest/15 bg-white/70 p-4 sm:p-5 backdrop-blur-xs">
                  <h3 className="font-heading text-base sm:text-lg font-bold text-ink">
                    Komunikasi Responsif
                  </h3>
                  <p className="mt-1 font-sans text-xs sm:text-sm leading-relaxed text-ink-muted">
                    Konsultasi satu pintu langsung via WhatsApp tanpa bot otomatis agar Anda memahami alasan teknis di balik setiap langkah penanganan.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-forest/15 pt-6">
              <Link
                href="/pesan?layanan=kunjungan"
                className="inline-flex min-h-[44px] items-center gap-2 font-sans text-sm font-bold text-forest transition-calm hover:text-forest-hover focus-visible:outline-focus"
              >
                <span>Ajukan Penanganan Lokasi</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
