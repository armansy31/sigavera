import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteConfigPath = path.resolve(__dirname, '../src/config/site.ts');
const content = fs.readFileSync(siteConfigPath, 'utf8');

const issues = [];

if (!content.includes("contentStatus: 'ready'") && process.env.NEXT_PUBLIC_CONTENT_STATUS !== 'ready') {
  issues.push("Status konfigurasi publik (contentStatus) masih 'draft'.");
}
if (content.includes('isBusinessNameFinal: false')) {
  issues.push('NAMA_USAHA: Nama usaha final belum dikonfirmasi (isBusinessNameFinal: false).');
}
if (/providerName:\s*['"]['"]/.test(content)) {
  issues.push('NAMA_PENYEDIA: Nama penyedia jasa masih kosong.');
}
const waEnv = process.env.NEXT_PUBLIC_WA_NUMBER || '';
if (!/^62[0-9]{8,13}$/.test(waEnv) && !/whatsappNumber:\s*['"]62[0-9]{8,13}['"]/.test(content)) {
  issues.push('WA_NUMBER: Nomor WhatsApp belum diisi dengan format internasional Indonesia (62...).');
}
if (content.includes('isWhatsappVerifiedByOwner: false')) {
  issues.push('WA_NUMBER: Kepemilikan nomor WhatsApp belum diverifikasi manual oleh pemilik.');
}
const siteUrlEnv = process.env.NEXT_PUBLIC_SITE_URL || '';
if (!siteUrlEnv.startsWith('https://') && !/siteUrl:\s*['"]https:\/\/[^'"]+['"]/.test(content)) {
  issues.push('SITE_URL: URL produksi HTTPS belum ditetapkan.');
}
if (/baseCity:\s*['"]['"]/.test(content)) {
  issues.push('KOTA_BASIS: Kota basis penyedia belum diisi.');
}
if (/serviceHours:\s*['"]['"]/.test(content)) {
  issues.push('JAM_LAYANAN: Jam operasional layanan belum diisi.');
}
if (content.includes('isFinalized: false') || /sessionDuration:\s*['"]['"]/.test(content)) {
  issues.push('HARGA_KONSULTASI: Rincian harga final dan durasi sesi belum difinalisasi.');
}
if (
  content.includes('paymentMethodAndTimingFinalized: false') ||
  content.includes('reschedulePolicyFinalized: false') ||
  content.includes('cancellationAndRefundFinalized: false') ||
  content.includes('conversationRetentionFinalized: false')
) {
  issues.push('KETENTUAN_LAYANAN: Kebijakan pembayaran, penjadwalan ulang, pembatalan/refund, atau retensi percakapan masih berstatus draf.');
}

if (issues.length > 0) {
  console.error('\n[BLOKIR RILIS PRODUKSI] Konfigurasi publik belum siap untuk dipublikasikan ke domain produksi:\n');
  for (const issue of issues) {
    console.error(`  - ${issue}`);
  }
  console.error(
    '\nCatatan: Pengembangan dan preview lokal tetap dapat dijalankan dengan `npm run dev` atau `npm run build`.\nIsi data wajib di `src/config/site.ts` sebelum menjalankan rilis produksi (`npm run build:release`).\n',
  );
  process.exit(1);
}

console.log('[SIAP RILIS] Seluruh konfigurasi publik wajib telah terisi.');

