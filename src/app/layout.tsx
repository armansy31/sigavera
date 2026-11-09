import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/config/site';
import { isValidProductionSiteUrl } from '@/lib/site-config';
import { SkipLink } from '@/components/layout/SkipLink';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

const hasValidSiteUrl = isValidProductionSiteUrl(siteConfig.siteUrl);
const isProductionReady = siteConfig.contentStatus === 'ready' && hasValidSiteUrl;

export const metadata: Metadata = {
  metadataBase: hasValidSiteUrl ? new URL(siteConfig.siteUrl) : undefined,
  title: {
    default: siteConfig.businessName,
    template: siteConfig.businessName,
  },
  description:
    'Layanan konsultasi hama dan penanganan langsung di lokasi. Ceritakan tanda masalah hama di tempat Anda, tinjau langkah awal, dan bicarakan jadwal serta biaya lewat WhatsApp.',
  robots: isProductionReady
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    title: siteConfig.businessName,
    description:
      'Ceritakan masalah hama di rumah atau tempat usaha Anda. Konsultasi online terarah dan pengajuan kunjungan sesuai kesepakatan.',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-canvas font-sans text-ink antialiased">
        <SkipLink />
        <SiteHeader />
        <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

