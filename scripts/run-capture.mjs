import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const PORT = 3002;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status > 0) return;
    } catch (e) {
      console.log('fetch probe error:', e.message);
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server tidak merespons dalam ${timeoutMs}ms`);
}

async function capture() {
  console.log(`[CAPTURE] Spawning Next.js server on port ${PORT}...`);
  const server = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(PORT)],
    {
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production' },
    },
  );

  server.stdout.on('data', (d) => process.stdout.write(d));
  server.stderr.on('data', (d) => process.stderr.write(d));

  try {
    await waitForServer(BASE_URL);
    console.log(`[CAPTURE] Server active at ${BASE_URL}. Launching Chromium...`);

    const browser = await chromium.launch({ headless: true, channel: 'msedge' });

    // 1. Desktop 1440px Viewport
    console.log('[CAPTURE] Taking Desktop 1440px screenshots...');
    const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageDesktop.goto(BASE_URL, { waitUntil: 'networkidle' });
    await pageDesktop.waitForTimeout(800);
    await pageDesktop.screenshot({
      path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/phase2-row1-desktop-1440.png',
      fullPage: false,
    });
    await pageDesktop.screenshot({
      path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/phase2-fullpage-desktop-1440.png',
      fullPage: true,
    });

    // 2. Mobile 390px Viewport
    console.log('[CAPTURE] Taking Mobile 390px screenshots...');
    const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await pageMobile.goto(BASE_URL, { waitUntil: 'networkidle' });
    await pageMobile.waitForTimeout(800);
    await pageMobile.screenshot({
      path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/phase2-row1-mobile-390.png',
      fullPage: false,
    });
    await pageMobile.screenshot({
      path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/phase2-fullpage-mobile-390.png',
      fullPage: true,
    });

    // 3. Pesan page (Desktop & Mobile)
    console.log('[CAPTURE] Taking Pesan page screenshots...');
    const pagePesanDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pagePesanDesktop.goto(`${BASE_URL}/pesan`, { waitUntil: 'networkidle' });
    await pagePesanDesktop.waitForTimeout(600);
    await pagePesanDesktop.screenshot({
      path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/pesan-desktop-1440.png',
      fullPage: true,
    });

    const radioBox = await pagePesanDesktop.locator('input[value="online"]').boundingBox();
    const badgeBox = await pagePesanDesktop.locator('text=Jalur Jarak Jauh').boundingBox();
    console.log('[MEASURE] Radio box:', radioBox);
    console.log('[MEASURE] Badge box:', badgeBox);
    if (radioBox && badgeBox) {
      const radioCenterY = radioBox.y + radioBox.height / 2;
      const badgeCenterY = badgeBox.y + badgeBox.height / 2;
      console.log(`[MEASURE] Radio Center Y: ${radioCenterY}, Badge Center Y: ${badgeCenterY}, Diff: ${radioCenterY - badgeCenterY}`);
    }

    const radioGroup = pagePesanDesktop.locator('[role="radiogroup"]');
    if (await radioGroup.count() > 0) {
      await radioGroup.screenshot({
        path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/radio-alignment-check.png',
      });
    }

    const pagePesanMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await pagePesanMobile.goto(`${BASE_URL}/pesan`, { waitUntil: 'networkidle' });
    await pagePesanMobile.waitForTimeout(600);
    await pagePesanMobile.screenshot({
      path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/pesan-mobile-390.png',
      fullPage: true,
    });

    // 4. Tentang page (Desktop & Mobile)
    console.log('[CAPTURE] Taking Tentang page screenshots...');
    const pageTentangDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await pageTentangDesktop.goto(`${BASE_URL}/tentang`, { waitUntil: 'networkidle' });
    await pageTentangDesktop.waitForTimeout(600);
    await pageTentangDesktop.screenshot({
      path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/tentang-desktop-1440.png',
      fullPage: true,
    });

    const pageTentangMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await pageTentangMobile.goto(`${BASE_URL}/tentang`, { waitUntil: 'networkidle' });
    await pageTentangMobile.waitForTimeout(600);
    await pageTentangMobile.screenshot({
      path: 'C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/tentang-mobile-390.png',
      fullPage: true,
    });

    await browser.close();
    console.log('[CAPTURE] All screenshots captured successfully!');
  } finally {
    server.kill();
  }
}

capture().catch((err) => {
  console.error('[CAPTURE ERROR]:', err);
  process.exit(1);
});
