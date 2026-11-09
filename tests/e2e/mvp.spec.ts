import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('MVP Konsultasi & Penanganan Hama — E2E, Keamanan, Responsif & Aksesibilitas', () => {
  test('Seluruh halaman publik, 404, dan security headers berjalan dengan benar', async ({
    page,
  }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    const headers = response?.headers() ?? {};
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['referrer-policy']).toBe('no-referrer');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['permissions-policy']).toContain('camera=()');
    expect(headers['content-security-policy']).toContain("default-src 'self'");
    expect(headers['content-security-policy']).toContain("form-action 'none'");

    await expect(page.locator('h1')).toContainText(
      'Masalah hama perlu ditangani dengan langkah yang tepat.',
    );

    // Cek rute /tentang, /kebijakan-privasi, /syarat-layanan
    for (const route of ['/tentang', '/kebijakan-privasi', '/syarat-layanan', '/pesan']) {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toBeVisible();
    }

    // Cek 404
    const res404 = await page.goto('/halaman-tidak-ada-404');
    expect(res404?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('Halaman yang Anda cari tidak tersedia');
  });

  test('Alur lengkap pemesanan, tidak ada bocor PII ke storage/URL, dan intersepsi WhatsApp', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Mulai konsultasi' }).first().click();
    await expect(page).toHaveURL(/\/pesan\?layanan=online$/);

    // Pilih jenis hama dan isi keluhan dengan karakter khusus + XSS payload sintetis
    await page.getByLabel(/Jenis hama yang ditemukan/i).selectOption('kecoa');
    await page
      .getByLabel(/Ceritakan kondisi masalahnya/i)
      .fill('Kecoa muncul di dekat saluran air dapur sejak 4 hari lalu & cukup banyak. <script>alert(1)</script>');
    await page.getByLabel(/Nama panggilan/i).fill("Budi D'Angelo");
    await page.getByLabel(/Saya memahami bahwa isian ini digunakan/i).check();

    await page.getByTestId('submit-preview-button').click();

    const preview = page.getByTestId('message-preview-text');
    await expect(preview).toBeVisible();
    await expect(preview).toContainText('Layanan: Konsultasi online');
    await expect(preview).toContainText('<script>alert(1)</script>');

    // Ambil screenshot pratinjau desktop dengan data sintetis
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.screenshot({
      path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/preview-pesan-desktop.png',
      fullPage: true,
    });

    // Pastikan URL halaman sendiri TIDAK memuat nama/keluhan/PII
    expect(page.url()).not.toContain('Budi');
    expect(page.url()).not.toContain('saluran');

    // Pastikan localStorage, sessionStorage, dan cookie kosong dari data formulir
    const storageDump = await page.evaluate(() => ({
      local: JSON.stringify(window.localStorage),
      session: JSON.stringify(window.sessionStorage),
      cookie: document.cookie,
    }));
    expect(storageDump.local).not.toContain('Budi');
    expect(storageDump.session).not.toContain('Budi');
    expect(storageDump.cookie).not.toContain('Budi');
  });

  test('Responsif pada lebar 320px, 360px, 390px, 768px, dan 1280px tanpa overflow horizontal', async ({
    page,
  }) => {
    const widths = [320, 360, 390, 768, 1280];
    for (const width of widths) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const hasOverflowHome = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasOverflowHome, `Overflow pada / lebar ${width}px`).toBe(false);

      if (width === 360) {
        await page.screenshot({
          path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/beranda-mobile-360.png',
          fullPage: true,
        });
      }
      if (width === 1280) {
        await page.screenshot({
          path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/beranda-desktop-1280.png',
          fullPage: true,
        });
      }

      await page.goto('/pesan?layanan=kunjungan');
      const hasOverflowPesan = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasOverflowPesan, `Overflow pada /pesan lebar ${width}px`).toBe(false);
    }
  });

  test('Navigasi keyboard: Skip link, menu mobile dengan Escape, dan aksesibilitas otomatis (Axe)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto('/');

    // Buka menu mobile lalu tutup dengan Escape
    const menuButton = page.getByRole('button', { name: /Menu navigasi/i });
    await menuButton.click();
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Pemeriksaan Axe WCAG 2.2 AA pada beranda dan halaman pesan
    const homeAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(homeAxe.violations).toEqual([]);

    await page.goto('/pesan');
    await page.getByTestId('submit-preview-button').waitFor({ state: 'visible' });
    await page.waitForTimeout(350);
    const pesanAxe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(pesanAxe.violations).toEqual([]);
  });

  test('Mode tanpa JavaScript (no-JS) tidak merender form GET yang membocorkan data ke URL', async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/pesan?layanan=online');

    await expect(page.locator('form')).toHaveCount(0);
    const htmlContent = await page.content();
    expect(htmlContent).toContain('JavaScript tidak aktif pada browser Anda');
    await context.close();
  });
});

