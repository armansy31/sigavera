import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';

const PORT = 3100;
const BASE_URL = `http://127.0.0.1:${PORT}`;

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status > 0) return;
    } catch {
      // server belum siap
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server tidak merespons dalam ${timeoutMs}ms`);
}

async function main() {
  console.log(`[VERIFY] Menjalankan server produksi Next.js di port ${PORT}...`);
  const server = spawn(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(PORT)],
    {
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production' },
    },
  );
  server.stdout?.on('data', (d) => process.stdout.write(`[SERVER] ${d}`));
  server.stderr?.on('data', (d) => process.stderr.write(`[SERVER ERR] ${d}`));

  try {
    await waitForServer(BASE_URL);
    console.log('[VERIFY] Server produksi aktif. Memeriksa rute dan security headers...');

    const routesToCheck = [
      { path: '/', expectedStatus: 200, mustContain: ['Masalah hama perlu ditangani dengan langkah yang tepat.', 'lang="id"'] },
      { path: '/pesan', expectedStatus: 200, mustContain: ['Ceritakan masalah hamanya', 'JavaScript tidak aktif pada browser Anda'] },
      { path: '/tentang', expectedStatus: 200, mustContain: ['Apa itu SIGAVERA?', 'Prinsip Layanan'] },
      { path: '/kebijakan-privasi', expectedStatus: 200, mustContain: ['Kebijakan Privasi', 'Perpindahan Data ke Layanan WhatsApp'] },
      { path: '/syarat-layanan', expectedStatus: 200, mustContain: ['Syarat Layanan', 'Penanda Draf'] },
      { path: '/robots.txt', expectedStatus: 200, mustContain: ['User-Agent: *', 'Disallow: /'] },
      { path: '/sitemap.xml', expectedStatus: 200, mustContain: ['<urlset'] },
      { path: '/rute-tidak-ditemukan-404', expectedStatus: 404, mustContain: ['Halaman yang Anda cari tidak tersedia'] },
    ];

    for (const route of routesToCheck) {
      const res = await fetch(`${BASE_URL}${route.path}`);
      assert.equal(
        res.status,
        route.expectedStatus,
        `Status HTTP untuk ${route.path} harus ${route.expectedStatus}, diterima ${res.status}`,
      );

      // Verifikasi Security Headers produksi
      assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
      assert.equal(res.headers.get('x-frame-options'), 'DENY');
      assert.equal(res.headers.get('permissions-policy'), 'camera=(), microphone=(), geolocation=()');
      assert.equal(res.headers.get('strict-transport-security'), 'max-age=31536000');

      const csp = res.headers.get('content-security-policy') || '';
      assert.ok(csp.includes("default-src 'self'"), 'CSP harus memuat default-src self');
      assert.ok(csp.includes("form-action 'none'"), 'CSP harus memuat form-action none');
      assert.ok(csp.includes("frame-ancestors 'none'"), 'CSP harus memuat frame-ancestors none');
      assert.ok(csp.includes("object-src 'none'"), 'CSP harus memuat object-src none');

      const body = await res.text();
      for (const snippet of route.mustContain) {
        assert.ok(
          body.includes(snippet),
          `Respons ${route.path} tidak memuat teks wajib: "${snippet}"`,
        );
      }

      // Pada halaman /pesan sebelum JS jalan (SSR/No-JS), pastikan tidak ada tag <form> yang bisa submit GET
      if (route.path === '/pesan') {
        assert.ok(
          !body.includes('<form'),
          'Halaman /pesan saat SSR/No-JS tidak boleh merender elemen <form> yang berisiko bocor lewat submit GET',
        );
      }

      console.log(`  ✓ ${route.path} [HTTP ${res.status}] — Konten & Security Headers valid`);
    }

    console.log('\n[VERIFY SUKSES] Seluruh rute produksi, proteksi No-JS, dan security headers terverifikasi.');
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error('[VERIFY GAGAL]', err);
  process.exit(1);
});

