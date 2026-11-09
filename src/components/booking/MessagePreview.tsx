'use client';

import { forwardRef, useEffect, useRef, useState } from 'react';
import { AlertTriangle, ArrowLeft, Check, Copy, ExternalLink } from 'lucide-react';
import {
  PEST_LABELS,
  PROPERTY_TYPE_LABELS,
  SERVICE_LABELS,
  type ValidatedBookingData,
} from '@/lib/booking-schema';
import { buildGenericWhatsappUrl, type WhatsappUrlResult } from '@/lib/whatsapp-url';
import { formatConsultationPriceRange } from '@/lib/site-config';

interface MessagePreviewProps {
  data: ValidatedBookingData;
  plainTextMessage: string;
  whatsappResult: WhatsappUrlResult;
  businessWhatsappNumber?: string;
  onBackToEdit: () => void;
}

export const MessagePreview = forwardRef<HTMLHeadingElement, MessagePreviewProps>(
  function MessagePreview(
    { data, plainTextMessage, whatsappResult, businessWhatsappNumber, onBackToEdit },
    headingRef,
  ) {
    const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
    const [hasOpenedWhatsapp, setHasOpenedWhatsapp] = useState(false);
    const manualTextareaRef = useRef<HTMLTextAreaElement>(null);

    const genericWaHref = buildGenericWhatsappUrl(businessWhatsappNumber);

    useEffect(() => {
      if (copyState === 'failed' && manualTextareaRef.current) {
        manualTextareaRef.current.focus();
        manualTextareaRef.current.select();
      }
    }, [copyState]);

    async function handleCopyMessage() {
      try {
        if (
          typeof navigator === 'undefined' ||
          !navigator.clipboard ||
          typeof navigator.clipboard.writeText !== 'function'
        ) {
          throw new Error('Clipboard API tidak tersedia');
        }
        await navigator.clipboard.writeText(plainTextMessage);
        setCopyState('copied');
      } catch {
        setCopyState('failed');
      }
    }

    return (
      <section
        aria-labelledby="preview-heading"
        className="rounded-2xl sm:rounded-3xl border border-hairline bg-white p-6 sm:p-10 shadow-xs text-ink"
      >
        <div className="border-b border-hairline pb-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-forest">
              Tahap 02 · Tinjau Draf Pesan
            </span>
            <span className="font-mono text-xs text-ink-muted">02 / 02</span>
          </div>
          <h2
            id="preview-heading"
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-ink focus:outline-none focus-visible:outline-focus"
          >
            Periksa ringkasan pesan Anda
          </h2>
          <p className="mt-1 font-sans text-sm text-ink-muted">
            Pastikan isi pesan di bawah sudah sesuai sebelum Anda membukanya di WhatsApp atau menyalinnya.
          </p>
        </div>

        {/* Ringkasan atribut utama */}
        <dl className="mt-6 grid gap-3 rounded-2xl border border-hairline bg-surface-soft/80 p-5 sm:p-6 text-sm sm:grid-cols-2 shadow-xs">
          <div>
            <dt className="text-xs font-sans uppercase tracking-wider text-forest font-bold">Pilihan layanan</dt>
            <dd className="mt-0.5 font-heading text-base font-bold text-ink">{SERVICE_LABELS[data.service]}</dd>
          </div>
          <div>
            <dt className="text-xs font-sans uppercase tracking-wider text-forest font-bold">Area lokasi</dt>
            <dd className="mt-0.5 font-heading text-base font-bold text-ink">
              {data.area ? data.area : 'Tidak dicantumkan (konsultasi online)'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-sans uppercase tracking-wider text-forest font-bold">Jenis hama</dt>
            <dd className="mt-0.5 font-heading text-base font-bold text-ink">{PEST_LABELS[data.pest]}</dd>
          </div>
          <div>
            <dt className="text-xs font-sans uppercase tracking-wider text-forest font-bold">Jenis tempat</dt>
            <dd className="mt-0.5 font-heading text-base font-bold text-ink">
              {data.propertyType ? PROPERTY_TYPE_LABELS[data.propertyType] : 'Tidak dicantumkan'}
            </dd>
          </div>
        </dl>

        {/* Kotak pratinjau plain text */}
        <div className="mt-6">
          <p className="font-heading text-sm font-bold text-ink">Teks pesan yang akan disiapkan:</p>
          <pre
            data-testid="message-preview-text"
            className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-[#BDCFB8]/80 bg-surface-soft/80 p-4 sm:p-5 font-mono text-sm leading-relaxed text-ink"
          >
            {plainTextMessage}
          </pre>
        </div>

        {/* Pemberitahuan privasi dan cara kerja WhatsApp */}
        <div className="mt-6 rounded-2xl border border-hairline bg-surface-soft/80 p-5 font-sans text-sm leading-relaxed text-ink-muted shadow-xs">
          <p className="font-bold text-ink">Penting diketahui sebelum melanjutkan:</p>
          <p className="mt-1">
            Saat Anda menekan <strong>Buka WhatsApp</strong>, ringkasan ini dibawa ke layanan WhatsApp sebagai parameter tautan. Anda masih perlu menekan tombol kirim di aplikasi WhatsApp.
          </p>
          {data.service === 'kunjungan' ? (
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              <strong>Penanganan langsung:</strong> Ketersediaan jadwal, jangkauan wilayah keberangkatan, dan rincian penawaran biaya tindakan fisik dikonfirmasi terlebih dahulu oleh penyedia di WhatsApp. Alamat lengkap baru diminta setelah jadwal disepakati bersama.
            </p>
          ) : (
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              <strong>Konsultasi online ({formatConsultationPriceRange()}):</strong> Penilaian awal berlangsung via percakapan WhatsApp setelah pesan Anda diterima. Pembayaran dilakukan setelah sesi konsultasi selesai.
            </p>
          )}
        </div>

        {/* Peringatan apabila nomor WhatsApp belum valid atau URL terlalu panjang */}
        {!whatsappResult.ok && (
          <div
            role="status"
            data-testid="whatsapp-unavailable-notice"
            className="mt-6 flex items-start gap-3 rounded-2xl border border-[#DFD8C9] bg-gradient-to-br from-[#F5F1E8] to-[#EAE3D4] p-5 text-sm text-ink shadow-xs"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-forest" aria-hidden="true" />
            <div>
              <p className="font-bold text-ink">
                {whatsappResult.reason === 'URL_TOO_LONG'
                  ? 'Panjang tautan melebihi batas aman'
                  : 'Kontak WhatsApp belum dikonfigurasi'}
              </p>
              <p className="mt-1 text-ink-muted">{whatsappResult.message}</p>
              {whatsappResult.reason === 'URL_TOO_LONG' && genericWaHref && (
                <p className="mt-2">
                  Setelah menyalin pesan, Anda dapat membuka{' '}
                  <a
                    href={genericWaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="font-bold text-forest underline underline-offset-4 hover:text-forest-hover"
                  >
                    chat WhatsApp tanpa teks otomatis (buka di tab baru)
                  </a>{' '}
                  lalu menempelkan pesan secara manual.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Tombol aksi utama */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {whatsappResult.ok ? (
            <a
              href={whatsappResult.href}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              aria-label="Buka WhatsApp dengan pesan ini (membuka tab atau aplikasi baru)"
              onClick={() => setHasOpenedWhatsapp(true)}
              data-testid="open-whatsapp-link"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-forest px-8 py-3.5 font-sans text-base font-bold text-white shadow-sm transition-calm hover:bg-forest-hover focus-visible:outline-focus"
            >
              <span>Buka WhatsApp</span>
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled="true"
              data-testid="open-whatsapp-disabled"
              className="inline-flex min-h-[50px] cursor-not-allowed items-center justify-center gap-2 rounded-full border border-hairline bg-surface-soft px-8 py-3.5 font-sans text-base font-bold text-ink-muted opacity-60"
            >
              <span>Buka WhatsApp (Belum Tersedia)</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyMessage}
            data-testid="copy-message-button"
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-hairline bg-white px-6 py-3.5 font-sans text-base font-bold text-ink shadow-sm transition-calm hover:bg-moss-soft/40 focus-visible:outline-focus"
          >
            {copyState === 'copied' ? (
              <>
                <Check className="h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                <span>Pesan disalin</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Salin pesan</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onBackToEdit}
            data-testid="back-to-edit-button"
            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-hairline bg-white px-5 py-3.5 font-sans text-base font-bold text-ink transition-calm hover:bg-moss-soft/40 focus-visible:outline-focus sm:ml-auto"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Ubah isian</span>
          </button>
        </div>

        {/* Status umpan balik salin (aria-live polite tanpa pengumuman berulang) */}
        <div aria-live="polite" className="mt-4">
          {copyState === 'copied' && (
            <p
              data-testid="copy-success-feedback"
              className="rounded-md border border-[#C5D7BF] bg-gradient-to-r from-[#EFF6EC] to-[#E5EFE1] px-4 py-3 text-sm font-medium text-ink"
            >
              Pesan disalin ke papan klip. Menyalin pesan belum mengirimkannya—silakan tempel dan tekan kirim di WhatsApp.
            </p>
          )}
        </div>

        {/* Fallback salin manual ketika Clipboard API ditolak atau gagal */}
        {copyState === 'failed' && (
          <div
            data-testid="manual-copy-fallback"
            className="mt-4 rounded-md border border-hairline bg-surface-soft p-4"
          >
            <label
              htmlFor="manual-copy-textarea"
              className="block text-sm font-semibold text-ink"
            >
              Penyalinan otomatis tidak diizinkan oleh browser Anda. Salin teks berikut secara manual:
            </label>
            <p id="manual-copy-helper" className="mt-1 text-xs text-ink-muted">
              Tekan kotak teks di bawah, pilih semua (Ctrl+A atau tahan di layar ponsel), lalu pilih Salin (Ctrl+C).
            </p>
            <textarea
              id="manual-copy-textarea"
              ref={manualTextareaRef}
              readOnly
              rows={8}
              value={plainTextMessage}
              aria-describedby="manual-copy-helper"
              onClick={(e) => e.currentTarget.select()}
              className="mt-2 w-full rounded-md border border-hairline bg-white p-3 font-mono text-sm text-ink focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />
          </div>
        )}

        {/* Pemberitahuan jujur setelah pengguna menekan Buka WhatsApp */}
        {hasOpenedWhatsapp && (
          <div
            role="status"
            data-testid="post-whatsapp-notice"
            className="mt-5 rounded-md border border-[#C5D7BF] bg-gradient-to-r from-[#EFF6EC] to-[#E5EFE1] p-4 text-sm text-ink"
          >
            <p className="font-semibold text-ink">
              Pesan belum dapat dikonfirmasi oleh situs ini. Pastikan Anda sudah menekan kirim di WhatsApp.
            </p>
            <p className="mt-1 text-ink-muted">
              Situs ini tidak menerima status pengiriman dari WhatsApp. Jika Anda ingin memperbarui detail keluhan, pilih tombol <strong>Ubah isian</strong>.
            </p>
          </div>
        )}
      </section>
    );
  },
);

