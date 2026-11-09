import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Provider() {
  const hasProviderName = Boolean(siteConfig.providerName.trim());
  const hasBaseCity = Boolean(siteConfig.baseCity.trim());
  const photo = siteConfig.providerPhoto?.licenseConfirmed ? siteConfig.providerPhoto : null;

  return (
    <section aria-labelledby="provider-heading" className="border-b border-hairline bg-canvas py-16 md:py-24">
      <div className="container-editorial">
        {/* Signature Deep Forest Gradient Color-Block Section */}
        <div className="rounded-lg border border-white/10 bg-gradient-to-br from-[#174A33] via-[#123C29] to-[#0E2E1F] p-8 text-white shadow-md sm:p-12 lg:p-16">
          <div className="grid gap-10 md:grid-cols-12 md:items-start lg:gap-14">
            <div className="md:col-span-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A2E2B8]">
                Komitmen Personal
              </p>
              <h2
                id="provider-heading"
                className="mt-3 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl"
              >
                Dikerjakan langsung secara personal, bukan diteruskan ke tim acak
              </h2>
              <blockquote className="mt-6 border-l-2 border-[#A2E2B8] pl-4 text-base italic leading-relaxed text-white/95">
                &ldquo;Menangani hama bukan sekadar menyemprotkan cairan kimia, melainkan memahami celah masuk dan sarang sumber masalah.&rdquo;
              </blockquote>
              {photo && (
                <figure className="mt-8 overflow-hidden rounded-md border border-white/20 bg-black/40">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="border-t border-white/20 px-4 py-2.5 text-xs text-white/80">
                    {photo.caption}
                  </figcaption>
                </figure>
              )}
            </div>

            <div className="md:col-span-7">
              <p className="text-base font-normal leading-relaxed text-white/95 sm:text-lg">
                Saat Anda menghubungi layanan ini, Anda berbicara langsung dengan saya yang akan memeriksa masalah dan—bila disepakati—datang menangani kondisi di lokasi Anda.
              </p>
              <p className="mt-4 text-base font-normal leading-relaxed text-white/80">
                Pendekatan kerja saya dimulai dari memahami kebiasaan hama dan celah di bangunan rumah atau tempat usaha Anda, bukan sekadar menyemprotkan bahan kimia tanpa memeriksa sumbernya.
              </p>

              <dl className="mt-8 grid gap-x-8 gap-y-4 border-t border-white/20 pt-6 sm:grid-cols-2">
                <div className="border-b border-white/15 pb-3">
                  <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A2E2B8]">Praktisi Layanan</dt>
                  <dd className="mt-1 text-base font-semibold text-white">
                    {hasProviderName
                      ? siteConfig.providerName
                      : 'Belum diisi (menunggu konfigurasi pemilik)'}
                  </dd>
                </div>
                <div className="border-b border-white/15 pb-3">
                  <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A2E2B8]">Kota Basis Keberangkatan</dt>
                  <dd className="mt-1 text-base font-semibold text-white">
                    {hasBaseCity
                      ? siteConfig.baseCity
                      : 'Belum diisi (dikonfirmasi melalui WhatsApp)'}
                  </dd>
                </div>
                <div className="border-b border-white/15 pb-3">
                  <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A2E2B8]">Jam Layanan</dt>
                  <dd className="mt-1 text-base font-semibold text-white">
                    {siteConfig.serviceHours}
                  </dd>
                </div>
                <div className="border-b border-white/15 pb-3">
                  <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#A2E2B8]">Akuntabilitas</dt>
                  <dd className="mt-1 text-base font-semibold text-white">
                    Langsung dengan praktisi, tanpa perantara
                  </dd>
                </div>
              </dl>

              {siteConfig.credentials.length > 0 && (
                <div className="mt-6 border-t border-white/20 pt-6">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">Pengalaman & latar belakang</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/80">
                    {siteConfig.credentials.map((cred) => (
                      <li key={cred}>{cred}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 border-t border-white/20 pt-6">
                <Link
                  href="/tentang"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-pill bg-white px-7 py-3 text-sm font-semibold text-forest shadow-sm transition-calm hover:bg-[#F7F5EF] focus-visible:outline-focus"
                >
                  <span>Pelajari lebih lanjut cara kerja saya</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

