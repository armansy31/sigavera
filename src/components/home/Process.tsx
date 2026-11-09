import { PROCESS_STEPS } from '@/content/home';

export function Process() {
  return (
    <section
      id="cara-kerja"
      aria-labelledby="process-heading"
      className="border-b border-hairline bg-canvas py-16 sm:py-20 md:py-24 lg:py-28"
    >
      <div className="container-editorial">
        {/* Header Section: Kicker Badge, Headline H2 Berbobot, & Subtitle Sederhana */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-forest/5 px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-forest">
            Alur Layanan
          </div>
          <h2
            id="process-heading"
            className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-5xl"
          >
            Tiga Langkah Sederhana Menuju Solusi
          </h2>
          <p className="mt-4 font-sans text-base leading-relaxed text-ink-muted sm:text-lg">
            Tidak perlu mendaftar akun atau membayar di muka. Percakapan berlangsung langsung dan transparan melalui WhatsApp.
          </p>
        </div>

        {/* 3 Kartu Alur Layanan Luas (Responsive Grid: 1 col di mobile, 3 cols di desktop) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col justify-between rounded-2xl border border-hairline bg-white p-5 sm:p-7 shadow-xs transition-calm hover:border-forest/40 hover:shadow-sm lg:p-8"
            >
              <div>
                <div className="flex items-center justify-between border-b border-hairline pb-4">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                    Langkah
                  </span>
                  <span className="font-heading text-2xl font-extrabold text-forest">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold leading-snug text-ink sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink-muted sm:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Box Penegasan Prinsip Layanan dengan Gradasi Hijau Lumut Asli */}
        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-[#C5D7BF] bg-gradient-to-r from-[#EFF6EC] to-[#E5EFE1] p-5 font-sans text-xs sm:text-sm text-ink leading-relaxed shadow-xs">
          <div>
            <strong className="font-bold text-ink">Prinsip Layanan:</strong> Kepastian jadwal dan penawaran biaya selalu dikonfirmasi bersama di WhatsApp sebelum tindakan apapun dimulai.
          </div>
        </div>
      </div>
    </section>
  );
}
