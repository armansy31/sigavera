import {
  bookingSchema,
  PEST_LABELS,
  PROPERTY_TYPE_LABELS,
  SERVICE_LABELS,
  type ValidatedBookingData,
} from '@/lib/booking-schema';

/**
 * Menyusun pesan WhatsApp plain text dari input formulir yang telah tervalidasi.
 * Menggunakan label tampilan resmi dari enum dan menghilangkan baris opsional yang kosong.
 */
export function buildBookingMessage(input: ValidatedBookingData): string {
  const parsed = bookingSchema.parse(input);

  const detailLines: string[] = [`Layanan: ${SERVICE_LABELS[parsed.service]}`];

  if (parsed.name.length > 0) {
    detailLines.push(`Nama panggilan: ${parsed.name}`);
  }

  detailLines.push(`Jenis hama: ${PEST_LABELS[parsed.pest]}`);

  if (parsed.propertyType !== '') {
    detailLines.push(`Jenis tempat: ${PROPERTY_TYPE_LABELS[parsed.propertyType]}`);
  }

  if (parsed.area.length > 0) {
    detailLines.push(`Area: ${parsed.area}`);
  }

  detailLines.push(`Kondisi: ${parsed.problem}`);

  return [
    'Halo, saya ingin mengajukan layanan hama.',
    '',
    ...detailLines,
    '',
    'Mohon informasi langkah berikutnya, biaya dan ketersediaan.',
    'Saya memahami bahwa jadwal dan biaya belum dikonfirmasi.',
  ].join('\n');
}

