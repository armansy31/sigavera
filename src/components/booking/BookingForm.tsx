'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Info } from 'lucide-react';
import { siteConfig } from '@/config/site';
import {
  bookingSchema,
  FIELD_LIMITS,
  parseAllowedServiceQuery,
  PEST_LABELS,
  PEST_VALUES,
  PROPERTY_TYPE_LABELS,
  PROPERTY_TYPE_VALUES,
  SERVICE_LABELS,
  SERVICE_VALUES,
  type BookingFormInput,
  type ServiceType,
  type ValidatedBookingData,
} from '@/lib/booking-schema';
import { buildBookingMessage } from '@/lib/booking-message';
import {
  buildWhatsappUrl,
  type WhatsappUrlResult,
} from '@/lib/whatsapp-url';
import { formatConsultationPriceRange, isValidIndonesianWhatsappNumber } from '@/lib/site-config';
import { ErrorSummary, type FieldErrorItem } from '@/components/booking/ErrorSummary';
import { MessagePreview } from '@/components/booking/MessagePreview';

interface BookingFormProps {
  initialServiceQuery?: string | null;
  whatsappNumberOverride?: string;
  maxUrlLengthOverride?: number;
}

interface PreviewSnapshot {
  validatedData: ValidatedBookingData;
  plainTextMessage: string;
  whatsappResult: WhatsappUrlResult;
}

const FIELD_ORDER: ReadonlyArray<{
  name: keyof BookingFormInput;
  fieldId: string;
  label: string;
}> = [
  { name: 'service', fieldId: 'field-service-online', label: 'Jenis layanan' },
  { name: 'name', fieldId: 'field-name', label: 'Nama panggilan' },
  { name: 'pest', fieldId: 'field-pest', label: 'Jenis hama' },
  { name: 'propertyType', fieldId: 'field-propertyType', label: 'Jenis tempat' },
  { name: 'area', fieldId: 'field-area', label: 'Kecamatan dan kota' },
  { name: 'problem', fieldId: 'field-problem', label: 'Cerita masalah hama' },
  {
    name: 'privacyAcknowledged',
    fieldId: 'field-privacyAcknowledged',
    label: 'Pemahaman perpindahan data',
  },
];

export function BookingForm({
  initialServiceQuery,
  whatsappNumberOverride,
  maxUrlLengthOverride,
}: BookingFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [step, setStep] = useState<'edit' | 'preview'>('edit');
  const [previewSnapshot, setPreviewSnapshot] = useState<PreviewSnapshot | null>(null);

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const previewHeadingRef = useRef<HTMLHeadingElement>(null);
  const editStepHeadingRef = useRef<HTMLHeadingElement>(null);
  const shouldFocusEditHeadingRef = useRef(false);

  const activeWhatsappNumber =
    whatsappNumberOverride !== undefined ? whatsappNumberOverride : siteConfig.whatsappNumber;
  const isContactConfigured = isValidIndonesianWhatsappNumber(activeWhatsappNumber);
  const priceRange = formatConsultationPriceRange();

  const initialService: ServiceType | '' = parseAllowedServiceQuery(initialServiceQuery) ?? '';

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, submitCount },
  } = useForm<BookingFormInput>({
    resolver: zodResolver(bookingSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      service: initialService,
      name: '',
      pest: '',
      propertyType: '',
      area: '',
      problem: '',
      privacyAcknowledged: false,
    },
  });

  // Setelah client siap, periksa query string window.location.search bila prop initialServiceQuery belum diberikan
  useEffect(() => {
    setIsMounted(true);
    if (initialServiceQuery === undefined && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const safeService = parseAllowedServiceQuery(params.get('layanan'));
      if (safeService) {
        setValue('service', safeService, { shouldValidate: false, shouldDirty: false });
      }
    }
  }, [initialServiceQuery, setValue]);

  // Sinkronisasi apabila initialServiceQuery berubah melalui navigasi klien
  useEffect(() => {
    if (initialServiceQuery !== undefined) {
      const safeService = parseAllowedServiceQuery(initialServiceQuery);
      if (safeService) {
        setValue('service', safeService, { shouldValidate: false });
      }
    }
  }, [initialServiceQuery, setValue]);

  // Batalkan snapshot preview lama setiap kali nilai form berubah
  useEffect(() => {
    const subscription = watch(() => {
      setPreviewSnapshot(null);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Pindahkan fokus ke judul preview saat masuk ke tahap tinjau, atau ke bagian edit saat kembali
  useEffect(() => {
    if (step === 'preview') {
      previewHeadingRef.current?.focus();
    } else if (step === 'edit' && shouldFocusEditHeadingRef.current) {
      shouldFocusEditHeadingRef.current = false;
      editStepHeadingRef.current?.focus();
    }
  }, [step]);

  // Pindahkan fokus ke ErrorSummary setiap kali submit gagal
  const errorItems: FieldErrorItem[] = FIELD_ORDER.flatMap((item) => {
    const fieldError = errors[item.name];
    if (!fieldError || typeof fieldError.message !== 'string') {
      return [];
    }
    return [
      {
        fieldId: item.fieldId,
        label: item.label,
        message: fieldError.message,
      },
    ];
  });

  useEffect(() => {
    if (submitCount > 0 && errorItems.length > 0 && step === 'edit') {
      errorSummaryRef.current?.focus();
    }
  }, [submitCount, errorItems.length, step]);

  const selectedService = watch('service');

  function onValidSubmit(rawValues: BookingFormInput) {
    const parsed = bookingSchema.parse(rawValues);
    const plainTextMessage = buildBookingMessage(parsed);
    const whatsappResult = buildWhatsappUrl(
      plainTextMessage,
      activeWhatsappNumber,
      maxUrlLengthOverride ?? FIELD_LIMITS.WHATSAPP_URL_MAX,
    );

    setPreviewSnapshot({
      validatedData: parsed,
      plainTextMessage,
      whatsappResult,
    });
    setStep('preview');
  }

  function handleBackToEdit() {
    shouldFocusEditHeadingRef.current = true;
    setStep('edit');
  }

  function handleFocusField(fieldId: string) {
    const element = document.getElementById(fieldId);
    if (element) {
      element.focus();
    }
  }

  // Sebelum hydration/JavaScript siap: jangan merender form HTML yang dapat jatuh ke submit GET bawaan
  if (!isMounted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-panel-lg border border-border bg-surface p-6 text-base text-ink-muted"
      >
        Menyiapkan formulir penyusunan pesan...
      </div>
    );
  }

  if (step === 'preview' && previewSnapshot) {
    return (
      <div className="animate-slide-up motion-reduce:animate-none">
        <MessagePreview
          ref={previewHeadingRef}
          data={previewSnapshot.validatedData}
          plainTextMessage={previewSnapshot.plainTextMessage}
          whatsappResult={previewSnapshot.whatsappResult}
          businessWhatsappNumber={activeWhatsappNumber}
          onBackToEdit={handleBackToEdit}
        />
      </div>
    );
  }

  return (
    <div className="animate-slide-up motion-reduce:animate-none rounded-2xl sm:rounded-3xl border border-hairline bg-white p-6 sm:p-10 md:p-12 shadow-xs text-ink">
      <div className="border-b border-hairline pb-6">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-forest">
            Tahap 01 · Formulir Masalah
          </span>
          <span className="font-mono text-xs text-ink-muted">01 / 02</span>
        </div>
        <h2
          ref={editStepHeadingRef}
          tabIndex={-1}
          className="mt-3 font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-ink focus:outline-none focus-visible:outline-focus"
        >
          Lengkapi rincian masalah hama
        </h2>
        <p className="mt-2 font-sans text-sm sm:text-base leading-relaxed text-ink-muted">
          Isian hanya disimpan di memori halaman untuk menyusun teks pesan WhatsApp Anda.
        </p>
      </div>

      {!isContactConfigured && (
        <div
          role="note"
          data-testid="draft-contact-banner"
          className="mt-6 flex items-start gap-3 rounded-2xl border border-[#C5D7BF] bg-gradient-to-r from-[#EFF6EC] to-[#E5EFE1] p-4 sm:p-5 text-sm text-ink shadow-xs"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-forest" aria-hidden="true" />
          <div>
            <p className="font-bold text-ink">Mode pratinjau: Nomor WhatsApp belum diisi</p>
            <p className="mt-0.5 text-xs sm:text-sm text-ink-muted leading-relaxed">
              Anda tetap dapat mengisi formulir, meninjau hasil pesan, dan menyalin teks pesan. Tombol pembuka WhatsApp otomatis baru aktif setelah nomor usaha dikonfigurasi.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <ErrorSummary
          ref={errorSummaryRef}
          errors={errorItems}
          onSelectField={handleFocusField}
        />
      </div>

      <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-8">
        {/* 1. Pilihan Layanan (Radio Native di dalam Fieldset/Legend dengan gaya Kartu Konsultasi) */}
        <fieldset
          aria-describedby={
            errors.service ? 'service-helper service-error' : 'service-helper'
          }
          className="space-y-3"
        >
          <legend className="font-heading text-base sm:text-lg font-bold text-ink">
            1. Pilih jenis layanan <span className="text-danger font-bold ml-0.5" aria-hidden="true">*</span>
            <span className="sr-only"> (wajib)</span>
          </legend>
          <p id="service-helper" className="font-sans text-sm text-ink-muted">
            Konsultasi online ({priceRange}) untuk penilaian awal jarak jauh, atau ajukan penanganan langsung di lokasi.
          </p>

          <div
            role="radiogroup"
            aria-label="Pilihan jenis layanan"
            aria-invalid={Boolean(errors.service)}
            className="grid gap-3.5 sm:grid-cols-2"
          >
            {SERVICE_VALUES.map((val) => {
              const inputId = `field-service-${val}`;
              const isChecked = selectedService === val;
              return (
                <label
                  key={val}
                  htmlFor={inputId}
                  className={`flex min-h-[72px] cursor-pointer items-start gap-3.5 rounded-2xl border p-4 sm:p-5 transition-calm ${
                    isChecked
                      ? 'border-2 border-forest bg-gradient-to-br from-[#EFF6EC] via-[#E8F2E6] to-[#DEEADA] shadow-xs'
                      : 'border-hairline bg-white hover:border-forest/40 hover:bg-[#F9FBF8]'
                  }`}
                >
                  <div className="flex h-6 items-center justify-center">
                    <input
                      id={inputId}
                      type="radio"
                      value={val}
                      {...register('service')}
                      aria-describedby={errors.service ? 'service-error' : undefined}
                      className="m-0 h-4 w-4 shrink-0 accent-forest"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex h-6 items-center">
                      <span className="inline-flex items-center rounded-md bg-forest/10 px-2.5 py-0.5 font-sans text-xs font-bold uppercase tracking-wider text-forest">
                        {val === 'online' ? 'Jalur Jarak Jauh' : 'Jalur Lokasi'}
                      </span>
                    </div>
                    <span className="mt-1.5 block font-heading text-base sm:text-lg font-extrabold tracking-tight text-ink">
                      {SERVICE_LABELS[val]}
                    </span>
                    <span className="mt-1 block font-sans text-xs text-ink-muted leading-relaxed">
                      {val === 'online'
                        ? `Penilaian via WhatsApp · ${priceRange}`
                        : 'Pemeriksaan/tindakan lokasi · Biaya terpisah'}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          {errors.service?.message && (
            <p id="service-error" className="text-sm font-semibold text-danger">
              {errors.service.message}
            </p>
          )}
        </fieldset>

        {/* 2. Kelompok Kondisi Hama & Tempat */}
        <div className="space-y-6 border-t border-hairline pt-6">
          <div>
            <label htmlFor="field-pest" className="block font-heading text-base sm:text-lg font-bold text-ink">
              2. Jenis hama yang ditemukan <span className="text-danger font-bold ml-0.5" aria-hidden="true">*</span>
              <span className="sr-only"> (wajib)</span>
            </label>
            <p id="pest-helper" className="mt-1 font-sans text-sm text-ink-muted">
              Pilih &ldquo;Belum tahu jenisnya&rdquo; bila Anda baru melihat jejak, kotoran, atau tanda gangguan.
            </p>
            <div className="relative mt-2">
              <select
                id="field-pest"
                {...register('pest')}
                aria-invalid={Boolean(errors.pest)}
                aria-describedby={errors.pest ? 'pest-helper pest-error' : 'pest-helper'}
                className="block min-h-[50px] w-full cursor-pointer appearance-none rounded-xl border border-[#BDCFB8] bg-white px-4 py-3 pr-11 font-sans text-base text-ink shadow-xs transition-calm hover:border-forest/60 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              >
                <option value="">Pilih jenis hama yang dihadapi</option>
                {PEST_VALUES.map((val) => (
                  <option key={val} value={val} className="py-2 text-ink">
                    {PEST_LABELS[val]}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-forest/70">
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            {errors.pest?.message && (
              <p id="pest-error" className="mt-2 text-sm font-semibold text-danger">
                {errors.pest.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="field-propertyType" className="block font-heading text-base sm:text-lg font-bold text-ink">
              3. Jenis tempat <span className="font-sans text-xs font-normal text-ink-muted">(opsional)</span>
            </label>
            <p id="propertyType-helper" className="mt-1 font-sans text-sm text-ink-muted">
              Membantu saya memahami konteks bangunan Anda.
            </p>
            <div className="relative mt-2">
              <select
                id="field-propertyType"
                {...register('propertyType')}
                aria-invalid={Boolean(errors.propertyType)}
                aria-describedby="propertyType-helper"
                className="block min-h-[50px] w-full cursor-pointer appearance-none rounded-xl border border-[#BDCFB8] bg-white px-4 py-3 pr-11 font-sans text-base text-ink shadow-xs transition-calm hover:border-forest/60 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20"
              >
                <option value="">Pilih jenis tempat tinggal / usaha (opsional)</option>
                {PROPERTY_TYPE_VALUES.map((val) => (
                  <option key={val} value={val} className="py-2 text-ink">
                    {PROPERTY_TYPE_LABELS[val]}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-forest/70">
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="field-problem" className="block font-heading text-base sm:text-lg font-bold text-ink">
              4. Ceritakan kondisi masalahnya <span className="text-danger font-bold ml-0.5" aria-hidden="true">*</span>
              <span className="sr-only"> (wajib)</span>
            </label>
            <p id="problem-helper" className="mt-1 font-sans text-sm text-ink-muted leading-relaxed">
              Hama apa, terlihat di bagian mana, dan sejak kapan?
            </p>
            <textarea
              id="field-problem"
              rows={4}
              {...register('problem')}
              aria-invalid={Boolean(errors.problem)}
              aria-describedby={errors.problem ? 'problem-helper problem-error' : 'problem-helper'}
              className="mt-2 block w-full rounded-xl border border-[#BDCFB8]/80 bg-white p-4 font-sans text-base text-ink transition-calm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />
            {errors.problem?.message && (
              <p id="problem-error" className="mt-2 text-sm font-semibold text-danger">
                {errors.problem.message}
              </p>
            )}
          </div>
        </div>

        {/* 3. Kelompok Identitas Panggilan & Area Lokasi */}
        <div className="space-y-6 border-t border-hairline pt-6">
          <div>
            <label htmlFor="field-area" className="block font-heading text-base sm:text-lg font-bold text-ink">
              5. Kecamatan dan kota{' '}
              {selectedService === 'kunjungan' ? (
                <>
                  <span className="text-danger font-bold ml-0.5" aria-hidden="true">*</span>
                  <span className="sr-only"> (wajib untuk kunjungan)</span>
                  <span className="font-sans text-xs font-normal text-danger"> (wajib untuk kunjungan)</span>
                </>
              ) : (
                <span className="font-sans text-xs font-normal text-ink-muted">
                  (opsional untuk konsultasi online)
                </span>
              )}
            </label>
            <p id="area-helper" className="mt-1 font-sans text-sm text-ink-muted">
              {selectedService === 'kunjungan'
                ? 'Cantumkan kecamatan dan kota untuk memeriksa jangkauan wilayah (tanpa alamat rumah lengkap).'
                : 'Cukup kecamatan/kota, tanpa alamat lengkap (contoh: Kecamatan Lowokwaru, Kota Malang).'}
            </p>
            <input
              id="field-area"
              type="text"
              {...register('area')}
              aria-invalid={Boolean(errors.area)}
              aria-describedby={errors.area ? 'area-helper area-error' : 'area-helper'}
              className="mt-2 block min-h-[48px] w-full rounded-xl border border-[#BDCFB8]/80 bg-white px-4 py-3 font-sans text-base text-ink transition-calm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />
            {errors.area?.message && (
              <p id="area-error" className="mt-2 text-sm font-semibold text-danger">
                {errors.area.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="field-name" className="block font-heading text-base sm:text-lg font-bold text-ink">
              6. Nama panggilan <span className="font-sans text-xs font-normal text-ink-muted">(opsional)</span>
            </label>
            <p id="name-helper" className="mt-1 font-sans text-sm text-ink-muted">
              Agar saya dapat menyapa Anda dengan benar di WhatsApp.
            </p>
            <input
              id="field-name"
              type="text"
              autoComplete="given-name"
              {...register('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-helper name-error' : 'name-helper'}
              className="mt-2 block min-h-[48px] w-full rounded-xl border border-[#BDCFB8]/80 bg-white px-4 py-3 font-sans text-base text-ink transition-calm focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
            />
            {errors.name?.message && (
              <p id="name-error" className="mt-2 text-sm font-semibold text-danger">
                {errors.name.message}
              </p>
            )}
          </div>
        </div>

        {/* 4. Persetujuan Pemahaman Perpindahan Data */}
        <div className="border-t border-hairline pt-6">
          <div className="rounded-2xl border border-hairline bg-surface-soft/80 p-5 sm:p-6 shadow-xs">
            <div className="flex items-start gap-3">
              <input
                id="field-privacyAcknowledged"
                type="checkbox"
                {...register('privacyAcknowledged')}
                aria-invalid={Boolean(errors.privacyAcknowledged)}
                aria-describedby={
                  errors.privacyAcknowledged
                    ? 'privacy-helper privacy-error'
                    : 'privacy-helper'
                }
                className="mt-1 h-5 w-5 shrink-0 rounded border-hairline accent-forest"
              />
              <label
                htmlFor="field-privacyAcknowledged"
                className="cursor-pointer font-sans text-sm font-medium leading-relaxed text-ink"
              >
                Saya memahami bahwa isian ini digunakan untuk menyusun pesan yang akan diteruskan ke layanan WhatsApp saat saya membuka tautannya.
              </label>
            </div>
            <p id="privacy-helper" className="mt-2 pl-8 font-sans text-xs leading-relaxed text-ink-muted">
              Situs ini tidak menyimpan isian Anda di database aplikasi. Pelajari selengkapnya di halaman{' '}
              <Link
                href="/kebijakan-privasi"
                className="font-bold text-forest underline underline-offset-4 hover:text-forest-hover"
              >
                Kebijakan Privasi
              </Link>{' '}
              dan{' '}
              <Link
                href="/syarat-layanan"
                className="font-bold text-forest underline underline-offset-4 hover:text-forest-hover"
              >
                Syarat Layanan
              </Link>
              .
            </p>
            {errors.privacyAcknowledged?.message && (
              <p
                id="privacy-error"
                className="mt-2 pl-8 text-sm font-semibold text-danger"
              >
                {errors.privacyAcknowledged.message}
              </p>
            )}
          </div>
        </div>

        {/* Tombol Submit ke Tahap Pratinjau */}
        <div className="pt-2">
          <button
            type="submit"
            data-testid="submit-preview-button"
            className="inline-flex min-h-[50px] w-full items-center justify-center rounded-full bg-forest px-8 py-3.5 font-sans text-base font-bold text-white shadow-sm transition-calm hover:bg-forest-hover focus-visible:outline-focus sm:w-auto"
          >
            Tinjau pesan
          </button>
        </div>
      </form>
    </div>
  );
}

