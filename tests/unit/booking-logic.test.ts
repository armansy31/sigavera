import { describe, expect, it } from 'vitest';
import {
  bookingSchema,
  FIELD_LIMITS,
  parseAllowedServiceQuery,
} from '@/lib/booking-schema';
import { buildBookingMessage } from '@/lib/booking-message';
import { buildGenericWhatsappUrl, buildWhatsappUrl } from '@/lib/whatsapp-url';
import {
  evaluateReleaseReadiness,
  formatConsultationPriceRange,
  formatRupiah,
  isValidIndonesianWhatsappNumber,
  isValidProductionSiteUrl,
} from '@/lib/site-config';
import { siteConfig } from '@/config/site';

describe('bookingSchema validation and normalization', () => {
  it('accepts valid kunjungan input and normalizes whitespace/newlines', () => {
    const result = bookingSchema.safeParse({
      service: 'kunjungan',
      name: "  D'Angelo Putra  ",
      pest: 'kecoa',
      propertyType: 'rumah',
      area: '  Kecamatan Contoh, Kota Contoh  ',
      problem: '  Kecoa terlihat di dapur\r\nsejak beberapa hari terakhir.  ',
      privacyAcknowledged: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("D'Angelo Putra");
      expect(result.data.area).toBe('Kecamatan Contoh, Kota Contoh');
      expect(result.data.problem).toBe('Kecoa terlihat di dapur\nsejak beberapa hari terakhir.');
    }
  });

  it('accepts valid online input without optional name, propertyType, or area', () => {
    const result = bookingSchema.safeParse({
      service: 'online',
      name: '',
      pest: 'belum-tahu',
      propertyType: '',
      area: '',
      problem: 'Ada suara langkah dan kotoran hitam kecil di atas plafon kamar tidur sejak minggu lalu.',
      privacyAcknowledged: true,
    });

    expect(result.success).toBe(true);
  });

  it('requires area when service is kunjungan', () => {
    const result = bookingSchema.safeParse({
      service: 'kunjungan',
      name: 'Budi',
      pest: 'tikus',
      propertyType: 'rumah',
      area: '   ',
      problem: 'Tikus sering masuk lewat area belakang dapur setiap malam hari.',
      privacyAcknowledged: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const areaIssue = result.error.issues.find((i) => i.path.includes('area'));
      expect(areaIssue?.message).toBe('Untuk kunjungan, isi kecamatan dan kota Anda.');
    }
  });

  it('enforces minimum and maximum length boundaries without silent truncation', () => {
    const tooShortProblem = bookingSchema.safeParse({
      service: 'online',
      name: '',
      pest: 'kecoa',
      propertyType: '',
      area: '',
      problem: 'Terlalu pendek',
      privacyAcknowledged: true,
    });
    expect(tooShortProblem.success).toBe(false);

    const tooLongProblem = bookingSchema.safeParse({
      service: 'online',
      name: '',
      pest: 'kecoa',
      propertyType: '',
      area: '',
      problem: 'A'.repeat(FIELD_LIMITS.PROBLEM_MAX + 1),
      privacyAcknowledged: true,
    });
    expect(tooLongProblem.success).toBe(false);
    if (!tooLongProblem.success) {
      expect(tooLongProblem.error.issues[0]?.message).toContain('Ringkas menjadi maksimal 400 karakter');
    }
  });

  it('rejects unknown enum values and control characters', () => {
    const invalidEnum = bookingSchema.safeParse({
      service: 'https://evil.invalid',
      name: 'Budi',
      pest: 'naga',
      propertyType: 'istana',
      area: 'Kota Contoh',
      problem: 'Masalah hama yang cukup panjang untuk memenuhi syarat minimal karakter.',
      privacyAcknowledged: true,
    });
    expect(invalidEnum.success).toBe(false);

    const controlCharInput = bookingSchema.safeParse({
      service: 'online',
      name: 'Budi\u0000',
      pest: 'kecoa',
      propertyType: '',
      area: '',
      problem: 'Masalah hama yang cukup panjang untuk memenuhi syarat minimal karakter.',
      privacyAcknowledged: true,
    });
    expect(controlCharInput.success).toBe(false);
  });

  it('preserves special characters, SQL keywords, and XSS-like strings as plain text', () => {
    const payload = `<img src=x onerror=alert(1)> & # 🪳 SELECT * FROM users WHERE name = 'O''Connor';`;
    const result = bookingSchema.safeParse({
      service: 'online',
      name: "O'Connor",
      pest: 'lainnya',
      propertyType: 'tempat-usaha',
      area: '',
      problem: payload,
      privacyAcknowledged: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.problem).toBe(payload);
    }
  });

  it('validates query service parameter against strict allowlist', () => {
    expect(parseAllowedServiceQuery('online')).toBe('online');
    expect(parseAllowedServiceQuery('kunjungan')).toBe('kunjungan');
    expect(parseAllowedServiceQuery('https://contoh.invalid')).toBeUndefined();
    expect(parseAllowedServiceQuery('ONLINE')).toBeUndefined();
    expect(parseAllowedServiceQuery(null)).toBeUndefined();
    expect(parseAllowedServiceQuery(['online'])).toBeUndefined();
  });
});

describe('buildBookingMessage and buildWhatsappUrl', () => {
  it('builds exact contract message matching brief example', () => {
    const parsed = bookingSchema.parse({
      service: 'kunjungan',
      name: 'Budi',
      pest: 'kecoa',
      propertyType: 'rumah',
      area: 'Kecamatan Contoh, Kota Contoh',
      problem: 'Kecoa terlihat di dapur sejak beberapa hari terakhir.',
      privacyAcknowledged: true,
    });

    const msg = buildBookingMessage(parsed);
    expect(msg).toBe(
      [
        'Halo, saya ingin mengajukan layanan hama.',
        '',
        'Layanan: Penanganan langsung',
        'Nama panggilan: Budi',
        'Jenis hama: Kecoa',
        'Jenis tempat: Rumah',
        'Area: Kecamatan Contoh, Kota Contoh',
        'Kondisi: Kecoa terlihat di dapur sejak beberapa hari terakhir.',
        '',
        'Mohon informasi langkah berikutnya, biaya dan ketersediaan.',
        'Saya memahami bahwa jadwal dan biaya belum dikonfirmasi.',
      ].join('\n'),
    );
  });

  it('omits empty optional fields from message', () => {
    const parsed = bookingSchema.parse({
      service: 'online',
      name: '',
      pest: 'belum-tahu',
      propertyType: '',
      area: '',
      problem: 'Terdengar suara di plafon setiap tengah malam selama tiga hari.',
      privacyAcknowledged: true,
    });

    const msg = buildBookingMessage(parsed);
    expect(msg).not.toContain('Nama panggilan:');
    expect(msg).not.toContain('Jenis tempat:');
    expect(msg).not.toContain('Area:');
    expect(msg).toContain('Layanan: Konsultasi online');
    expect(msg).toContain('Jenis hama: Belum tahu jenisnya');
  });

  it('encodes WhatsApp URL once via URLSearchParams and decodes back identically', () => {
    const specialMessage =
      'Halo & selamat pagi #1!\nKondisi: <script>alert("xss")</script> \'kutip\' 🪳🐭';
    const res = buildWhatsappUrl(specialMessage, '6281234567890');

    expect(res.ok).toBe(true);
    if (res.ok) {
      const parsedUrl = new URL(res.href);
      expect(parsedUrl.origin).toBe('https://wa.me');
      expect(parsedUrl.pathname).toBe('/6281234567890');
      expect(parsedUrl.searchParams.get('text')).toBe(specialMessage);
    }
  });

  it('blocks URL generation when business number is empty or invalid', () => {
    expect(buildWhatsappUrl('Halo pesan tes', '').ok).toBe(false);
    expect(buildWhatsappUrl('Halo pesan tes', '+6281234567890').ok).toBe(false);
    expect(buildWhatsappUrl('Halo pesan tes', '081234567890').ok).toBe(false);
    expect(buildGenericWhatsappUrl('')).toBeNull();
    expect(buildGenericWhatsappUrl('6281234567890')).toBe('https://wa.me/6281234567890');
  });

  it('enforces the 6,000-character URL guardrail without silent truncation', () => {
    const hugeMessage = 'Kondisi hama '.repeat(600);
    const res = buildWhatsappUrl(hugeMessage, '6281234567890', 6000);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reason).toBe('URL_TOO_LONG');
    }
  });
});

describe('site configuration and release readiness', () => {
  it('formats rupiah currency and consultation range accurately', () => {
    expect(formatRupiah(20000)).toBe('Rp20.000');
    expect(formatConsultationPriceRange()).toBe('Rp25.000–Rp30.000');
    expect(formatConsultationPriceRange({ ...siteConfig.consultationPricing, minRp: 20000, maxRp: 25000 })).toBe(
      'Rp20.000–Rp25.000',
    );
  });

  it('validates Indonesian WhatsApp numbers and HTTPS production URLs', () => {
    expect(isValidIndonesianWhatsappNumber('6281234567890')).toBe(true);
    expect(isValidIndonesianWhatsappNumber('081234567890')).toBe(false);
    expect(isValidProductionSiteUrl('https://sigavera.id')).toBe(true);
    expect(isValidProductionSiteUrl('http://sigavera.id')).toBe(false);
    expect(isValidProductionSiteUrl('https://localhost:3000')).toBe(false);
  });

  it('reports draft config as not ready for release with clear missing requirements', () => {
    const report = evaluateReleaseReadiness(siteConfig);
    expect(report.isReadyForRelease).toBe(false);
    expect(report.missingRequirements.length).toBeGreaterThan(0);
  });
});

