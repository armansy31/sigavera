import type { Metadata } from 'next';
import { BookingForm } from '@/components/booking/BookingForm';
import { buildGenericWhatsappUrl } from '@/lib/whatsapp-url';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.businessName,
  description:
    'Isi formulir singkat untuk menyusun pesan konsultasi online atau pengajuan kunjungan penanganan hama melalui WhatsApp.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PesanPage() {
  const genericWaHref = buildGenericWhatsappUrl();

  return (
    <div className="bg-canvas py-12 md:py-20">
      <div className="container-editorial">
        <div className="mx-auto max-w-form">
          <header className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-forest">
              Formulir Layanan
            </div>
            <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Ceritakan masalah hamanya
            </h1>
            <p className="mt-3 font-sans text-base text-ink-muted sm:text-lg">
              Isi singkat, periksa pesan, lalu lanjutkan ke WhatsApp.
            </p>
          </header>

          <noscript>
            <div className="mb-6 rounded-lg border border-hairline bg-surface-soft p-6 text-ink">
              <h2 className="text-lg font-bold text-ink">
                JavaScript tidak aktif pada browser Anda
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Demi mencegah data keluhan Anda masuk ke riwayat alamat URL browser melalui pengiriman formulir standar, formulir interaktif dinonaktifkan ketika JavaScript mati.
              </p>
              {genericWaHref ? (
                <div className="mt-4">
                  <p className="text-sm text-ink">
                    Anda tetap dapat menghubungi saya secara langsung melalui tautan WhatsApp umum berikut (tanpa teks otomatis), lalu menceritakan jenis layanan, jenis hama, area kecamatan/kota, dan kondisi yang dialami:
                  </p>
                  <a
                    href={genericWaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="mt-3 inline-flex min-h-[48px] items-center justify-center rounded-pill bg-forest px-6 py-3 text-base font-semibold text-white shadow-sm transition-calm hover:bg-forest-hover"
                  >
                    Hubungi via WhatsApp (Tanpa Isian Otomatis)
                  </a>
                </div>
              ) : (
                <p className="mt-3 rounded-md border border-hairline bg-block-cream p-3 text-sm font-medium text-ink">
                  Pemberitahuan: Nomor kontak WhatsApp layanan belum dikonfigurasi pada lingkungan pratinjau ini.
                </p>
              )}
            </div>
          </noscript>

          <BookingForm />
        </div>
      </div>
    </div>
  );
}

