import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { isValidProductionSiteUrl } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  const hasValidSiteUrl = isValidProductionSiteUrl(siteConfig.siteUrl);
  const isReady = siteConfig.contentStatus === 'ready' && hasValidSiteUrl;

  if (!isReady) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  const baseUrl = siteConfig.siteUrl.replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/tentang'],
      disallow: ['/pesan', '/kebijakan-privasi', '/syarat-layanan'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

