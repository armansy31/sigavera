import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { HERO_COPY } from '@/content/home';
import { formatConsultationPriceRange } from '@/lib/site-config';

export function Hero() {
  const priceRange = formatConsultationPriceRange();
  const photo = siteConfig.heroPhoto;

  return (
    <section
      id="beranda"
      aria-labelledby="hero-heading"
      className="border-b border-hairline bg-canvas py-14 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="container-editorial">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Kolom Teks Utama (~58% pada desktop) */}
          <div className="lg:col-span-7">
            {/* Pill Eyebrow Badge khas Callme Yoghurt */}
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-4 py-1.5 font-sans text-xs font-semibold text-forest">
              <span>{HERO_COPY.kicker}</span>
              {siteConfig.baseCity && (
                <>
                  <span className="text-forest/30">·</span>
                  <span>{siteConfig.baseCity}</span>
                </>
              )}
            </div>

            {/* Headline H1 Tegas & Berbobot Tinggi */}
            <h1
              id="hero-heading"
              className="mt-6 break-words font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-[3.75rem] lg:leading-[1.08]"
            >
              {HERO_COPY.title}
            </h1>

            {/* Deskripsi Singkat & Tenang (1-2 kalimat) */}
            <p className="mt-5 max-w-[50ch] font-sans text-base leading-relaxed text-ink-muted sm:text-lg">
              {HERO_COPY.description}
            </p>

            {/* Kartu Transparansi Tarif Bersih */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 rounded-2xl border border-hairline bg-white/90 p-4 sm:p-5 sm:gap-6 shadow-xs">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                  Tarif Konsultasi Online
                </p>
                <p className="mt-1 font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-forest whitespace-nowrap">
                  {priceRange}
                </p>
              </div>
              <p className="font-sans text-xs leading-relaxed text-ink-muted sm:max-w-[32ch] sm:text-right">
                Bayar hanya setelah sesi tuntas dibahas. Pembatalan sebelum selesai bebas biaya (Rp0).
              </p>
            </div>

            {/* Dua Tombol CTA Pill Signatur (Pill Buttons) */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/pesan?layanan=online"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 font-sans text-sm font-bold text-white shadow-sm transition-calm hover:bg-forest-hover focus-visible:outline-focus sm:min-h-[50px] sm:px-8 sm:py-3.5 sm:text-base"
              >
                <span>{HERO_COPY.ctaOnline}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Link>
              <Link
                href="#layanan"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-hairline bg-white px-6 py-3 font-sans text-sm font-bold text-ink shadow-xs transition-calm hover:bg-moss-soft/40 focus-visible:outline-focus sm:min-h-[50px] sm:px-8 sm:py-3.5 sm:text-base"
              >
                {HERO_COPY.ctaVisit}
              </Link>
            </div>

            <p className="mt-4 font-mono text-xs tracking-wider text-ink-muted">
              {HERO_COPY.note}
            </p>
          </div>

          {/* Kolom Visual Kanan (~42% pada desktop) — Foto Petugas Berbingkai Luas */}
          <div className="lg:col-span-5">
            {photo && (
              <figure className="relative overflow-hidden rounded-3xl border border-hairline bg-white shadow-md">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  priority
                  className="aspect-square w-full object-cover"
                />
              </figure>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
