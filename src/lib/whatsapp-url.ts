import { siteConfig } from '@/config/site';
import { FIELD_LIMITS } from '@/lib/booking-schema';
import { isValidIndonesianWhatsappNumber } from '@/lib/site-config';

export type WhatsappUrlResult =
  | {
      ok: true;
      href: string;
      length: number;
    }
  | {
      ok: false;
      reason: 'INVALID_CONTACT' | 'EMPTY_MESSAGE' | 'URL_TOO_LONG';
      message: string;
      length?: number;
      maxLength?: number;
    };

/**
 * Membangun tautan WhatsApp click-to-chat (`https://wa.me/<nomor>?text=<pesan>`)
 * dengan encoding satu kali melalui URLSearchParams dan guardrail panjang maksimum 6.000 karakter.
 */
export function buildWhatsappUrl(
  plainTextMessage: string,
  businessNumber: string = siteConfig.whatsappNumber,
  maxUrlLength: number = FIELD_LIMITS.WHATSAPP_URL_MAX,
): WhatsappUrlResult {
  const validatedBusinessNumber = businessNumber.trim();

  if (!isValidIndonesianWhatsappNumber(validatedBusinessNumber)) {
    return {
      ok: false,
      reason: 'INVALID_CONTACT',
      message:
        'Nomor WhatsApp layanan belum dikonfigurasi pada pratinjau ini. Anda tetap dapat menyalin teks pesan di atas.',
    };
  }

  const trimmedMessage = plainTextMessage.trim();
  if (!trimmedMessage) {
    return {
      ok: false,
      reason: 'EMPTY_MESSAGE',
      message: 'Pesan belum tersedia untuk dibuatkan tautan WhatsApp.',
    };
  }

  const url = new URL('https://wa.me/' + validatedBusinessNumber);
  url.searchParams.set('text', plainTextMessage);
  const href = url.toString();

  if (href.length > maxUrlLength) {
    return {
      ok: false,
      reason: 'URL_TOO_LONG',
      length: href.length,
      maxLength: maxUrlLength,
      message: `Tautan otomatis melebihi batas panjang aman (${maxUrlLength} karakter). Silakan ringkas cerita masalah Anda, atau salin pesan di atas lalu buka chat WhatsApp secara manual.`,
    };
  }

  return {
    ok: true,
    href,
    length: href.length,
  };
}

/**
 * Membangun tautan WhatsApp generik tanpa data pribadi (untuk noscript atau saat URL terlalu panjang).
 * Mengembalikan null bila nomor WhatsApp bisnis belum dikonfigurasi/tidak valid.
 */
export function buildGenericWhatsappUrl(
  businessNumber: string = siteConfig.whatsappNumber,
): string | null {
  const validatedBusinessNumber = businessNumber.trim();
  if (!isValidIndonesianWhatsappNumber(validatedBusinessNumber)) {
    return null;
  }
  const url = new URL('https://wa.me/' + validatedBusinessNumber);
  return url.toString();
}

