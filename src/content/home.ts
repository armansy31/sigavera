export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const HERO_COPY = {
  kicker: 'Konsultasi & Penanganan Hama',
  title: 'Masalah hama perlu ditangani dengan langkah yang tepat.',
  description:
    'Ceritakan kondisi yang Anda hadapi. SIGAVERA membantu menilai masalah awal dan mendiskusikan langkah penanganan yang realistis.',
  ctaOnline: 'Mulai Konsultasi',
  ctaVisit: 'Lihat Layanan',
  note: 'Jadwal dan ketersediaan kunjungan dikonfirmasi melalui WhatsApp.',
  fallbackPanelTitle: 'Konsultasi online · Penanganan sesuai lokasi',
  fallbackPanelFacts: [
    {
      label: 'Penilaian awal terarah',
      detail: 'Ceritakan tanda hama, area yang terdampak, dan sejak kapan muncul sebelum memutuskan tindakan.',
    },
    {
      label: 'Biaya dibicarakan di awal',
      detail: 'Biaya konsultasi online terpisah dari penanganan langsung. Tidak ada tindakan tanpa persetujuan Anda.',
    },
    {
      label: 'Kunjungan sesuai kesepakatan',
      detail: 'Permintaan pemeriksaan atau penanganan di lokasi menyesuaikan jarak, kondisi tempat, dan ketersediaan jadwal.',
    },
  ],
} as const;

export const PROCESS_STEPS: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Ceritakan Masalah',
    description:
      'Tuliskan keluhan atau tanda hama yang terlihat dan kirimkan foto kondisi langsung melalui WhatsApp.',
  },
  {
    number: '02',
    title: 'Konsultasi Terarah',
    description:
      'Saya pelajari tandanya, berikan analisis kemungkinan sumber sarang, dan saran langkah awal yang aman.',
  },
  {
    number: '03',
    title: 'Tindakan Sesuai Kesepakatan',
    description:
      'Terapkan panduan mandiri atau sepakati jadwal dan penawaran biaya jika memerlukan penanganan langsung di lokasi.',
  },
];

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'konsultasi-saja',
    question: 'Apakah bisa konsultasi saja tanpa kunjungan?',
    answer:
      'Bisa. Anda dapat memilih konsultasi online untuk membahas tanda hama dan langkah penanganan awal. Penanganan langsung di lokasi bersifat opsional dan dibicarakan terpisah sesuai kebutuhan serta persetujuan Anda.',
  },
  {
    id: 'jangkauan-lokasi',
    question: 'Apakah semua lokasi bisa dikunjungi?',
    answer:
      'Kunjungan menyesuaikan jarak dari kota basis saya, permintaan, dan ketersediaan waktu. Cantumkan kecamatan dan kota Anda pada formulir agar ketersediaan kunjungan dapat dibicarakan terlebih dahulu.',
  },
  {
    id: 'biaya-terpisah',
    question: 'Apakah biaya konsultasi sudah termasuk kunjungan?',
    answer:
      'Belum. Biaya penanganan atau pemeriksaan langsung di lokasi dihitung terpisah dari konsultasi online. Rincian penawaran biaya disampaikan melalui WhatsApp sebelum Anda menyetujui tindakan.',
  },
  {
    id: 'kirim-foto',
    question: 'Apakah saya bisa mengirim foto kondisi hama?',
    answer:
      'Foto kondisi atau jejak hama dapat dikirim langsung di ruang percakapan WhatsApp setelah pesan awal terkirim. Situs ini sengaja tidak menyediakan fitur unggah berkas demi menjaga kesederhanaan dan privasi.',
  },
  {
    id: 'jadwal-otomatis',
    question: 'Apakah mengisi formulir langsung membuat jadwal kunjungan?',
    answer:
      'Tidak. Formulir di situs ini membantu Anda menyusun ringkasan pesan yang rapi. Anda tetap perlu menekan tombol kirim di aplikasi WhatsApp, kemudian jadwal dan biaya dikonfirmasi bersama saya melalui percakapan.',
  },
  {
    id: 'batas-hasil',
    question: 'Apakah hasil penanganan dijamin bebas hama selamanya?',
    answer:
      'Penilaian dan rencana penanganan bergantung pada kondisi bangunan, sanitasi lingkungan, dan tingkat gangguan di lokasi. Saya tidak menjanjikan klaim mutlak atau garansi yang belum disepakati secara tertulis.',
  },
];

