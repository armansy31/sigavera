import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { siteConfig } from '@/config/site';

describe('Technical SEO & Sitemap/Robots Validation', () => {
  it('returns empty sitemap in draft mode without dummy domains', () => {
    const draftSitemap = sitemap();
    expect(draftSitemap).toEqual([]);
  });

  it('generates exact production sitemap when valid siteUrl is provided', () => {
    const originalUrl = siteConfig.siteUrl;
    siteConfig.siteUrl = 'https://sigavera.id';

    const prodSitemap = sitemap();
    expect(prodSitemap).toHaveLength(2);
    expect(prodSitemap[0]?.url).toBe('https://sigavera.id/');
    expect(prodSitemap[1]?.url).toBe('https://sigavera.id/tentang');

    siteConfig.siteUrl = originalUrl;
  });

  it('disallows root in draft robots and allows only public routes in production robots', () => {
    const originalStatus = siteConfig.contentStatus;
    const originalUrl = siteConfig.siteUrl;

    siteConfig.contentStatus = 'draft';
    siteConfig.siteUrl = '';
    const draftRobots = robots();
    expect(draftRobots.rules).toEqual({
      userAgent: '*',
      disallow: '/',
    });

    siteConfig.contentStatus = 'ready';
    siteConfig.siteUrl = 'https://sigavera.id';
    const prodRobots = robots();
    expect(prodRobots.sitemap).toBe('https://sigavera.id/sitemap.xml');
    expect(prodRobots.rules).toEqual({
      userAgent: '*',
      allow: ['/', '/tentang'],
      disallow: ['/pesan', '/kebijakan-privasi', '/syarat-layanan'],
    });

    siteConfig.contentStatus = originalStatus;
    siteConfig.siteUrl = originalUrl;
  });
});

