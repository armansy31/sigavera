import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { MobileMenu, type NavItem } from '@/components/layout/MobileMenu';

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Layanan & Biaya', href: '/#layanan' },
  { label: 'Cara kerja', href: '/#cara-kerja' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Tentang', href: '/tentang' },
];

export function SiteHeader() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-hairline bg-[#F7F5EF]/95 backdrop-blur-md">
        <div className="container-editorial relative flex min-h-[56px] items-center justify-between gap-4 py-2.5">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group inline-flex min-h-[44px] flex-col justify-center transition-calm"
            >
              <span className="font-heading text-2xl font-extrabold tracking-tight text-forest transition-colors">
                {siteConfig.businessName}
              </span>
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.8px] text-ink-muted">
                Konsultasi & Penanganan Hama{siteConfig.baseCity ? ` · ${siteConfig.baseCity}` : ''}
              </span>
            </Link>
          </div>

          <nav aria-label="Navigasi utama" className="hidden md:flex md:items-center md:gap-1 lg:gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[38px] items-center rounded-md px-3.5 py-1.5 font-sans text-sm font-medium text-ink transition-calm hover:bg-moss-soft/60 hover:text-forest"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex md:items-center md:gap-2.5">
            <Link
              href="/pesan?layanan=kunjungan"
              className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-hairline bg-white px-4 py-1.5 font-sans text-sm font-semibold text-ink transition-calm hover:bg-moss-soft/40 focus-visible:outline-focus"
            >
              Ajukan kunjungan
            </Link>
            <Link
              href="/pesan?layanan=online"
              className="inline-flex min-h-[40px] items-center justify-center rounded-md bg-forest px-5 py-1.5 font-sans text-sm font-semibold text-white shadow-xs transition-calm hover:bg-forest-hover focus-visible:outline-focus"
            >
              Mulai konsultasi
            </Link>
          </div>

          <MobileMenu items={NAV_ITEMS} />
        </div>
      </header>

      {/* Marquee Strip (signature Figma token with SIGAVERA Forest Gradient) */}
      <div
        role="region"
        aria-label="Informasi layanan singkat"
        className="flex h-[36px] w-full items-center justify-center overflow-hidden border-b border-[#0E2E1F] bg-gradient-to-r from-[#103524] via-[#174A33] to-[#103524] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.8px] text-white/95 select-none"
      >
        <span className="truncate text-center">
          Konsultasi Hama Online · Lombok Barat & Sekitarnya · Respon Percakapan Langsung · Bebas Biaya di Muka
        </span>
      </div>
    </>
  );
}

