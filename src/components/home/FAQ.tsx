import { FAQ_ITEMS } from '@/content/home';

export function FAQ() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-b border-hairline bg-canvas py-16 md:py-24"
    >
      <div className="container-editorial">
        {/* Oversized Signature Linen Cream FAQ Block */}
        <div className="rounded-lg border border-[#DFD8C9] bg-gradient-to-br from-[#F5F1E8] via-[#ECE5D8] to-[#E2DACB] p-8 text-ink shadow-sm sm:p-12 lg:p-16">
          <div className="grid gap-10 md:grid-cols-12 lg:gap-14">
            <div className="md:col-span-5">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                Pertanyaan Umum
              </p>
              <h2
                id="faq-heading"
                className="mt-3 text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl lg:text-4xl"
              >
                Hal yang sering ditanyakan sebelum memulai
              </h2>
              <p className="mt-3 text-base font-normal leading-relaxed text-ink-muted sm:text-lg">
                Jawaban ringkas mengenai cara konsultasi, jangkauan kunjungan, dan batas layanan.
              </p>
            </div>

            <div className="md:col-span-7">
              <div className="divide-y divide-[#D4CCA7]/60 border-y border-[#D4CCA7]/60">
                {FAQ_ITEMS.map((item, index) => (
                  <details key={item.id} className="group py-5 transition-calm">
                    <summary className="flex min-h-[48px] cursor-pointer list-none items-start justify-between gap-4 text-left text-base font-bold text-ink transition-calm hover:text-forest">
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
                          0{index + 1}.
                        </span>
                        <span>{item.question}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D4CCA7] bg-white/90 text-base font-bold text-forest shadow-xs transition-transform duration-200 group-open:rotate-45 hover:bg-white"
                      >
                        +
                      </span>
                    </summary>
                    <div className="mt-3 pl-7 pr-4 text-base font-normal leading-relaxed text-ink-muted">
                      <p>{item.answer}</p>
                    </div>
                  </details>
                ))}
              </div>

              <p className="mt-8 font-mono text-xs tracking-wider text-ink-muted">
                Ada pertanyaan khusus yang belum tercantum? Anda dapat menanyakannya langsung saat memulai percakapan WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

