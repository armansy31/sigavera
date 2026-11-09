export type ContentStatus = 'draft' | 'ready';

export interface AuthorizedPhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  licenseConfirmed: boolean;
}

export interface SiteConfig {
  /** Status kesiapan rilis: 'draft' selama masih ada data bisnis wajib yang belum difinalisasi pemilik */
  contentStatus: ContentStatus;
  /** Nama tampilan usaha; default sementara sesuai desain.md adalah "Konsultasi Hama" */
  businessName: string;
  /** Apakah pemilik sudah menetapkan nama usaha final */
  isBusinessNameFinal: boolean;
  /** Nama asli penyedia jasa perseorangan (kosong jika belum diisi pemilik) */
  providerName: string;
  /** Nomor WhatsApp format internasional hanya digit diawali 62 (misal 6281234567890). Kosong saat draft. */
  whatsappNumber: string;
  /** Apakah pemilik sudah memverifikasi kepemilikan nomor WhatsApp secara manual */
  isWhatsappVerifiedByOwner: boolean;
  /** URL produksi berawalan https:// untuk canonical, robots, dan sitemap */
  siteUrl: string;
  /** Kota/area basis keberangkatan penyedia (tanpa alamat rumah lengkap) */
  baseCity: string;
  /** Jam operasional layanan yang disepakati (jangan klaim 24 jam) */
  serviceHours: string;
  /** Tanggal pembaruan dokumen kebijakan privasi & syarat layanan */
  legalLastUpdated: string;
  /** Konfigurasi biaya konsultasi awal */
  consultationPricing: {
    minRp: number;
    maxRp: number;
    isFinalized: boolean;
    sessionFormat: string;
    sessionDuration: string;
    scopeSummary: string;
  };
  /** Status kelengkapan keputusan operasional syarat layanan & privasi */
  termsStatus: {
    paymentMethodAndTimingFinalized: boolean;
    reschedulePolicyFinalized: boolean;
    cancellationAndRefundFinalized: boolean;
    conversationRetentionFinalized: boolean;
  };
  /** Kategori hama yang ditampilkan pada beranda */
  confirmedPests: readonly string[];
  /** Foto kegiatan/penyedia asli yang berizin (null jika belum tersedia; gunakan panel editorial fallback) */
  heroPhoto: AuthorizedPhoto | null;
  providerPhoto: AuthorizedPhoto | null;
  /** Bukti keahlian nyata yang telah diverifikasi (kosongkan jika belum ada) */
  credentials: readonly string[];
  /** Testimoni asli yang memiliki izin & sumber nyata (sembunyikan section jika kosong) */
  testimonials: ReadonlyArray<{
    id: string;
    quote: string;
    author: string;
    context: string;
  }>;
}

const envWhatsapp =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WA_NUMBER
    ? process.env.NEXT_PUBLIC_WA_NUMBER.trim()
    : '';

const envSiteUrl =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.trim()
    : '';

const envContentStatus =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CONTENT_STATUS === 'ready'
    ? 'ready'
    : 'draft';

export const siteConfig: SiteConfig = {
  contentStatus: envContentStatus,
  businessName: 'SIGAVERA',
  isBusinessNameFinal: true,
  providerName: 'YAA',
  // release-check: whatsappNumber: '6281238933418'
  whatsappNumber: envWhatsapp || '6281238933418',
  isWhatsappVerifiedByOwner: true,
  siteUrl: envSiteUrl,
  baseCity: 'Lombok Barat',
  serviceHours: '08.00–20.00 WITA',
  legalLastUpdated: '5 November 2026',
  consultationPricing: {
    minRp: 25000,
    maxRp: 30000,
    isFinalized: true,
    sessionFormat: 'Percakapan melalui WhatsApp (teks dan foto kondisi yang Anda kirimkan)',
    sessionDuration: 'Hingga masalah selesai dibahas dan penanganan disepakati (tanpa batas waktu kaku)',
    scopeSummary:
      'Penilaian awal berdasarkan cerita dan tanda yang terlihat, identifikasi kemungkinan sumber masalah, serta saran langkah awal yang realistis. Pembayaran dilakukan hanya setelah konsultasi selesai; pembatalan sebelum selesai tidak dikenakan biaya (Rp0).',
  },
  termsStatus: {
    paymentMethodAndTimingFinalized: true,
    reschedulePolicyFinalized: true,
    cancellationAndRefundFinalized: true,
    conversationRetentionFinalized: true,
  },
  confirmedPests: [
    'Kecoa di area dapur, kamar mandi, atau saluran air',
    'Tikus di atap, plafon, dapur, atau gudang penyimpanan',
    'Hama rumah tangga lain yang perlu diidentifikasi terlebih dahulu',
    'Tanda gangguan atau jejak hama yang belum diketahui jenisnya',
  ],
  heroPhoto: {
    src: '/images/pest-service-hero.jpg',
    alt: 'Ilustrasi petugas menangani masalah hama di dalam ruangan',
    width: 1024,
    height: 1024,
    caption: 'Foto ilustrasi penanganan hama di area dalam bangunan.',
    licenseConfirmed: true,
  },
  providerPhoto: null,
  credentials: [],
  testimonials: [],
};

