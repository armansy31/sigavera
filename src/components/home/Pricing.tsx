import { siteConfig } from '@/config/site';
import { formatConsultationPriceRange } from '@/lib/site-config';

export function Pricing() {
  const priceRange = formatConsultationPriceRange();
  const hasBaseCity = Boolean(siteConfig.baseCity.trim());

  return (
    <section
      id="biaya"
      aria-labelledby="pricing-heading"
      className="border-b border-hairline bg-canvas py-16 md:py-24"
    >
      <div className="container-editorial">
        <div className="max-w-prose">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
            Biaya & Jangkauan
          </p>
          <h2
            id="pricing-heading"
            className="mt-3 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Terbuka soal biaya sejak percakapan pertama
          </h2>
          <p className="mt-4 text-base font-normal leading-relaxed text-ink-muted sm:text-lg">
            Anda selalu mengetahui kisaran biaya awal sebelum memutuskan untuk melanjutkan sesi konsultasi maupun tindakan lapangan.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:gap-8">
          {/* Blok 1: Biaya Konsultasi Online */}
          <div className="flex flex-col justify-between rounded-lg border border-hairline bg-white p-8 text-ink shadow-sm transition-calm sm:p-9">
            <div>
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                  Konsultasi Online
                </span>
                <span className="font-mono text-xs text-ink-muted">Teks & Foto</span>
              </div>
              <p className="mt-5 font-mono text-3xl font-bold tracking-tight text-forest sm:text-4xl">{priceRange}</p>
              <p className="mt-1.5 text-xs font-normal text-ink-muted">
                {siteConfig.consultationPricing.isFinalized
                  ? `Durasi: ${siteConfig.consultationPricing.sessionDuration}`
                  : 'Kisaran biaya awal per sesi penilaian (rincian durasi & ketentuan final dikonfirmasi di chat)'}
              </p>

              <div className="mt-6 border-t border-hairline pt-5">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">Cakupan pembahasan:</h3>
                <p className="mt-2.5 text-base font-normal leading-relaxed text-ink-muted">
                  {siteConfig.consultationPricing.scopeSummary}
                </p>
                <div className="mt-5 rounded-md border border-[#C5D7BF] bg-gradient-to-r from-[#EFF6EC] to-[#E5EFE1] p-4 text-xs font-medium text-ink leading-relaxed">
                  <strong>Ketentuan Bayar:</strong> Pembayaran dilakukan via Transfer Bank, QRIS, atau Tunai <em>hanya setelah sesi selesai</em>. Pembatalan sebelum selesai tidak dikenakan biaya (Rp0).
                </div>
              </div>
            </div>
          </div>

          {/* Blok 2: Biaya Penanganan & Jangkauan Kunjungan */}
          <div className="flex flex-col justify-between rounded-lg border border-hairline bg-white p-8 text-ink shadow-sm transition-calm sm:p-9">
            <div>
              <div className="flex items-baseline justify-between border-b border-hairline pb-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                  Penanganan Lapangan
                </span>
                <span className="font-mono text-xs text-ink-muted">Kunjungan Lokasi</span>
              </div>
              <p className="mt-5 text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">
                Dihitung Sesuai Kondisi
              </p>
              <p className="mt-1.5 text-xs font-normal text-ink-muted">
                Tidak ada tarif flat yang memaksa; diinformasikan sebelum Anda menyetujui.
              </p>

              <div className="mt-6 border-t border-hairline pt-5">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">Faktor penentuan biaya & jangkauan:</h3>
                <ul className="mt-3.5 space-y-2.5 text-sm font-normal leading-relaxed text-ink-muted">
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                    <span><strong>Komponen penawaran:</strong> Spesies hama, luas area terdampak, metode penanganan, dan jarak tempuh.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                    <span>
                      <strong>Kota basis:</strong>{' '}
                      {hasBaseCity
                        ? `Keberangkatan dari ${siteConfig.baseCity}, fleksibel menurut jarak, permintaan, dan ketersediaan.`
                        : 'Fleksibel menurut jarak dari basis saya yang dikonfirmasi manual via WhatsApp.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                    <span><strong>Persetujuan penuh:</strong> Apabila biaya atau waktu yang dihitung belum cocok, Anda bebas untuk tidak melanjutkan.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

