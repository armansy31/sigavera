import { z } from 'zod';

/**
 * Unit panjang string yang digunakan di seluruh aplikasi:
 * Panjang dihitung menggunakan UTF-16 code units standar JavaScript (`string.length`)
 * setelah normalisasi baris baru (`\r\n` / `\r` -> `\n`) dan `trim()` spasi pinggir.
 */
export const FIELD_LIMITS = {
  NAME_MIN: 1,
  NAME_MAX: 60,
  AREA_MIN: 3,
  AREA_MAX: 80,
  PROBLEM_MIN: 20,
  PROBLEM_MAX: 400,
  WHATSAPP_URL_MAX: 6000,
} as const;

export const SERVICE_VALUES = ['online', 'kunjungan'] as const;
export type ServiceType = (typeof SERVICE_VALUES)[number];

export const SERVICE_LABELS: Record<ServiceType, string> = {
  online: 'Konsultasi online',
  kunjungan: 'Penanganan langsung',
};

export const PEST_VALUES = ['kecoa', 'tikus', 'lainnya', 'belum-tahu'] as const;
export type PestType = (typeof PEST_VALUES)[number];

export const PEST_LABELS: Record<PestType, string> = {
  kecoa: 'Kecoa',
  tikus: 'Tikus',
  lainnya: 'Lainnya',
  'belum-tahu': 'Belum tahu jenisnya',
};

export const PROPERTY_TYPE_VALUES = ['rumah', 'kos', 'tempat-usaha', 'lainnya'] as const;
export type PropertyType = (typeof PROPERTY_TYPE_VALUES)[number];

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  rumah: 'Rumah',
  kos: 'Kos',
  'tempat-usaha': 'Tempat usaha',
  lainnya: 'Lainnya',
};

/**
 * Deteksi karakter kontrol terlarang:
 * - Untuk input satu baris (name, area): menolak seluruh ASCII control characters (0x00-0x1F, 0x7F), termasuk NUL dan newline.
 * - Untuk input multi-baris (problem): mengizinkan LF (\n) setelah normalisasi CRLF, tetapi menolak karakter kontrol lain (0x00-0x09, 0x0B-0x1F, 0x7F).
 */
export function normalizeSingleLineText(value: string): string {
  return value.trim();
}

export function normalizeMultiLineText(value: string): string {
  return value.replace(/\r\n?/g, '\n').trim();
}

export function hasSingleLineControlChars(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) {
      return true;
    }
  }
  return false;
}

export function hasMultiLineControlChars(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if ((code <= 0x1f && code !== 0x0a) || code === 0x7f) {
      return true;
    }
  }
  return false;
}

/**
 * Memvalidasi query string `layanan` dari URL situs sendiri menggunakan allowlist ketat.
 * Jika tidak dikenal atau berbahaya (mis. URL eksternal), kembalikan undefined tanpa preselect.
 */
export function parseAllowedServiceQuery(
  rawQuery: string | string[] | null | undefined,
): ServiceType | undefined {
  if (typeof rawQuery !== 'string') {
    return undefined;
  }
  if (rawQuery === 'online' || rawQuery === 'kunjungan') {
    return rawQuery;
  }
  return undefined;
}

export const bookingSchema = z
  .object({
    service: z.enum(SERVICE_VALUES, {
      errorMap: () => ({ message: 'Pilih jenis layanan terlebih dahulu.' }),
    }),
    name: z
      .string()
      .transform(normalizeSingleLineText)
      .refine((val) => !hasSingleLineControlChars(val), {
        message: 'Nama panggilan mengandung karakter kontrol atau baris baru yang tidak diizinkan.',
      })
      .refine((val) => val.length === 0 || val.length >= FIELD_LIMITS.NAME_MIN, {
        message: 'Nama panggilan tidak valid.',
      })
      .refine((val) => val.length <= FIELD_LIMITS.NAME_MAX, {
        message: `Ringkas nama panggilan menjadi maksimal ${FIELD_LIMITS.NAME_MAX} karakter. Isian Anda belum dihapus.`,
      })
      .optional()
      .default(''),
    pest: z.enum(PEST_VALUES, {
      errorMap: () => ({ message: 'Pilih jenis hama atau pilih Belum tahu jenisnya.' }),
    }),
    propertyType: z
      .union([z.enum(PROPERTY_TYPE_VALUES), z.literal('')])
      .optional()
      .default(''),
    area: z
      .string()
      .transform(normalizeSingleLineText)
      .refine((val) => !hasSingleLineControlChars(val), {
        message: 'Area mengandung karakter kontrol atau baris baru yang tidak diizinkan.',
      })
      .optional()
      .default(''),
    problem: z
      .string()
      .transform(normalizeMultiLineText)
      .refine((val) => !hasMultiLineControlChars(val), {
        message: 'Deskripsi masalah mengandung karakter kontrol yang tidak diizinkan.',
      })
      .refine((val) => val.length >= FIELD_LIMITS.PROBLEM_MIN, {
        message: `Ceritakan sedikit lebih lengkap, minimal ${FIELD_LIMITS.PROBLEM_MIN} karakter.`,
      })
      .refine((val) => val.length <= FIELD_LIMITS.PROBLEM_MAX, {
        message: `Ringkas menjadi maksimal ${FIELD_LIMITS.PROBLEM_MAX} karakter. Isian Anda belum dihapus.`,
      }),
    privacyAcknowledged: z.boolean().refine((val) => val === true, {
      message: 'Baca pemberitahuan perpindahan data dan centang jika Anda memahaminya.',
    }),
  })
  .superRefine((data, ctx) => {
    const areaLength = data.area.length;

    if (data.service === 'kunjungan' && areaLength === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['area'],
        message: 'Untuk kunjungan, isi kecamatan dan kota Anda.',
      });
      return;
    }

    if (areaLength > 0 && areaLength < FIELD_LIMITS.AREA_MIN) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['area'],
        message: `Isi kecamatan dan kota minimal ${FIELD_LIMITS.AREA_MIN} karakter.`,
      });
    }

    if (areaLength > FIELD_LIMITS.AREA_MAX) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['area'],
        message: `Ringkas kecamatan dan kota menjadi maksimal ${FIELD_LIMITS.AREA_MAX} karakter. Isian Anda belum dihapus.`,
      });
    }
  });

export type BookingFormInput = {
  service: ServiceType | '';
  name: string;
  pest: PestType | '';
  propertyType: PropertyType | '';
  area: string;
  problem: string;
  privacyAcknowledged: boolean;
};

export type ValidatedBookingData = z.output<typeof bookingSchema>;

