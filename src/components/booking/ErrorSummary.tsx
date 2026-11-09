'use client';

import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface FieldErrorItem {
  fieldId: string;
  label: string;
  message: string;
}

interface ErrorSummaryProps {
  errors: readonly FieldErrorItem[];
  onSelectField?: (fieldId: string) => void;
}

export const ErrorSummary = forwardRef<HTMLDivElement, ErrorSummaryProps>(
  function ErrorSummary({ errors, onSelectField }, ref) {
    if (errors.length === 0) {
      return null;
    }

    return (
      <div
        ref={ref}
        tabIndex={-1}
        role="alert"
        aria-labelledby="error-summary-title"
        className="mb-6 rounded-panel border-2 border-danger bg-surface p-5 text-ink"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <div className="w-full">
            <h2 id="error-summary-title" className="text-base font-bold text-danger">
              Periksa kembali isian berikut ({errors.length} perlu diperbaiki):
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Isian Anda tetap tersimpan. Pilih salah satu petunjuk di bawah untuk langsung menuju kolom terkait:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
              {errors.map((err) => (
                <li key={err.fieldId}>
                  <a
                    href={`#${err.fieldId}`}
                    onClick={(event) => {
                      if (onSelectField) {
                        event.preventDefault();
                        onSelectField(err.fieldId);
                      }
                    }}
                    className="font-semibold text-danger underline underline-offset-4 hover:text-ink"
                  >
                    {err.label}: {err.message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  },
);

