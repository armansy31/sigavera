import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { Process } from '@/components/home/Process';
import { Services } from '@/components/home/Services';
import { FAQ } from '@/components/home/FAQ';
import { siteConfig } from '@/config/site';
import { isValidProductionSiteUrl } from '@/lib/site-config';

const hasValidSiteUrl = isValidProductionSiteUrl(siteConfig.siteUrl);

export const metadata: Metadata = {
  alternates: hasValidSiteUrl ? { canonical: '/' } : undefined,
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Process />
      <Services />
      <FAQ />
    </>
  );
}
