import { chromium } from '@playwright/test';

async function getBaseUrl() {
  for (const port of [3000, 3001]) {
    try {
      const res = await fetch(`http://localhost:${port}`);
      if (res.ok) return `http://localhost:${port}`;
    } catch {
      // try next port
    }
  }
  return 'http://localhost:3000';
}

async function capture(prefix = 'phase2') {
  const baseUrl = await getBaseUrl();
  console.log(`Connecting to ${baseUrl}...`);
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  
  // Desktop 1440px
  const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageDesktop.goto(baseUrl, { waitUntil: 'networkidle' });
  await pageDesktop.waitForTimeout(600);
  await pageDesktop.screenshot({
    path: `C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/${prefix}-row1-desktop-1440.png`,
    fullPage: false,
  });
  await pageDesktop.screenshot({
    path: `C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/${prefix}-fullpage-desktop-1440.png`,
    fullPage: true,
  });

  // Mobile 390px
  const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await pageMobile.goto(baseUrl, { waitUntil: 'networkidle' });
  await pageMobile.waitForTimeout(600);
  await pageMobile.screenshot({
    path: `C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/${prefix}-row1-mobile-390.png`,
    fullPage: false,
  });
  await pageMobile.screenshot({
    path: `C:/Users/Armansyah Maulana/.gemini/antigravity/brain/3faed480-ccbe-43cf-82d7-b9d9ec6fbe35/scratch/${prefix}-fullpage-mobile-390.png`,
    fullPage: true,
  });

  await browser.close();
  console.log(`${prefix} screenshots captured successfully.`);
}

const prefix = process.argv[2] || 'phase2';
capture(prefix).catch((err) => {
  console.error(err);
  process.exit(1);
});
