import { siteConfig, type SiteConfig } from '@/config/site';

const INDONESIAN_WA_REGEX = /^62[0-9]{8,13}$/;

export interface ReleaseReadinessReport {
  isReadyForRelease: boolean;
  isContactValid: boolean;
  missingRequirements: string[];
}

const currencyFormatter = new Intl.NumberFormat('id-ID');

/**
 * Format nilai rupiah numerik menggunakan Intl.NumberFormat('id-ID')
 */
export function formatRupiah(amount: number): string {
  return `Rp${currencyFormatter.format(amount)}`;
}

/**
 * Format rentang harga konsultasi dari nilai numerik konfigurasi
 */
export function formatConsultationPriceRange(
  pricing: SiteConfig['consultationPricing'] = siteConfig.consultationPricing,
): string {
  if (pricing.minRp === pricing.maxRp) {
    return formatRupiah(pricing.minRp);
  }
  return `${formatRupiah(pricing.minRp)}–${formatRupiah(pricing.maxRp)}`;
}

/**
 * Validasi bentuk nomor WhatsApp Indonesia: hanya digit, diawali 62, total 10-15 digit.
 */
export function isValidIndonesianWhatsappNumber(rawNumber: string): boolean {
  if (!rawNumber || typeof rawNumber !== 'string') {
    return false;
  }
  return INDONESIAN_WA_REGEX.test(rawNumber);
}

/**
 * Validasi apakah URL produksi valid dan menggunakan skema HTTPS.
 */
export function isValidProductionSiteUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return false;
  }
  try {
    const parsed = new URL(rawUrl);
    return (
      parsed.protocol === 'https:' &&
      Boolean(parsed.hostname) &&
      !parsed.hostname.includes('localhost') &&
      !parsed.hostname.endsWith('.invalid') &&
      !parsed.hostname.endsWith('.example')
    );
  } catch {
    return false;
  }
}

/**
 * Mengevaluasi kesiapan konfigurasi untuk publikasi produksi.
 * Preview lokal tetap berjalan saat status draft, tetapi rilis produksi ditahan jika ada syarat yang belum terpenuhi.
 */
export function evaluateReleaseReadiness(config: SiteConfig = siteConfig): ReleaseReadinessReport {
  const missing: string[] = [];
  const isContactValid = isValidIndonesianWhatsappNumber(config.whatsappNumber);

  if (config.contentStatus !== 'ready') {
    missing.push("Status konfigurasi masih 'draft' (contentStatus belum diatur ke 'ready').");
  }

  if (!config.isBusinessNameFinal || !config.businessName.trim()) {
    missing.push('Nama usaha final (NAMA_USAHA / isBusinessNameFinal) belum ditetapkan.');
  }

  if (!config.providerName.trim()) {
    missing.push('Nama asli penyedia jasa (NAMA_PENYEDIA) belum diisi.');
  }

  if (!isContactValid) {
    missing.push(
      'Nomor WhatsApp (WA_NUMBER) belum diisi atau tidak sesuai format internasional Indonesia (diawali 62, hanya digit, maks 15 digit).',
    );
  }

  if (!config.isWhatsappVerifiedByOwner) {
    missing.push('Kepemilikan dan keaktifan nomor WhatsApp belum dikonfirmasi manual oleh pemilik.');
  }

  if (!isValidProductionSiteUrl(config.siteUrl)) {
    missing.push('URL situs produksi (SITE_URL) wajib diisi dengan format HTTPS yang valid.');
  }

  if (!config.baseCity.trim()) {
    missing.push('Kota basis penyedia (KOTA_BASIS) belum diisi.');
  }

  if (!config.serviceHours.trim()) {
    missing.push('Jam layanan operasional (JAM_LAYANAN) belum disepakati.');
  }

  if (!config.consultationPricing.isFinalized || !config.consultationPricing.sessionDuration.trim()) {
    missing.push(
      'Rincian final harga konsultasi, durasi sesi, dan cakupan sesi (HARGA_KONSULTASI) belum difinalisasi pemilik.',
    );
  }

  if (
    !config.termsStatus.paymentMethodAndTimingFinalized ||
    !config.termsStatus.reschedulePolicyFinalized ||
    !config.termsStatus.cancellationAndRefundFinalized ||
    !config.termsStatus.conversationRetentionFinalized
  ) {
    missing.push(
      'Ketentuan pembayaran, penjadwalan ulang, pembatalan/refund, atau retensi percakapan (KETENTUAN_LAYANAN) masih berstatus draf.',
    );
  }

  if (config.heroPhoto && !config.heroPhoto.licenseConfirmed) {
    missing.push('Foto hero terpasang tetapi status izin/lisensi (licenseConfirmed) belum dikonfirmasi.');
  }

  if (config.providerPhoto && !config.providerPhoto.licenseConfirmed) {
    missing.push('Foto profil penyedia terpasang tetapi status izin/lisensi (licenseConfirmed) belum dikonfirmasi.');
  }

  return {
    isReadyForRelease: missing.length === 0,
    isContactValid,
    missingRequirements: missing,
  };
}

