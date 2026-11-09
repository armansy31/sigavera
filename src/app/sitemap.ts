import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { isValidProductionSiteUrl } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isValidProductionSiteUrl(siteConfig.siteUrl)) {
    return [];
  }

  const baseUrl = siteConfig.siteUrl.replace(/\/$/, '');

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date('2026-11-05'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date('2026-11-05'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}

