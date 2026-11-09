import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-canvas py-16 md:py-24">
      <div className="container-editorial">
        <div className="mx-auto max-w-prose rounded-lg border border-hairline bg-white p-8 text-center sm:p-12 shadow-sm">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
            404 · Halaman tidak ditemukan
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Halaman yang Anda cari tidak tersedia
          </h1>
          <p className="mt-3 text-base text-ink-muted">
            Tautan mungkin sudah berubah atau alamat yang dimasukkan kurang tepat. Anda dapat kembali ke halaman utama atau langsung menyusun pesan konsultasi.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-[48px] items-center justify-center rounded-pill bg-forest px-7 py-3 text-base font-semibold text-white shadow-sm transition-calm hover:bg-forest-hover focus-visible:outline-focus"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/pesan"
              className="inline-flex min-h-[48px] items-center justify-center rounded-pill border border-hairline bg-white px-7 py-3 text-base font-semibold text-ink shadow-sm transition-calm hover:bg-moss-soft/40 focus-visible:outline-focus"
            >
              Buka Formulir Pesan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

