import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '@/components/booking/BookingForm';

describe('BookingForm integration behavior', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('ignores untrusted service query and shows accessible validation errors on empty submit', async () => {
    const user = userEvent.setup();
    render(<BookingForm initialServiceQuery="https://contoh.invalid" whatsappNumberOverride="" />);

    const radioOnline = await screen.findByRole('radio', { name: /Konsultasi online/i });
    const radioVisit = screen.getByRole('radio', { name: /Penanganan langsung/i });
    expect(radioOnline).not.toBeChecked();
    expect(radioVisit).not.toBeChecked();

    await user.click(screen.getByTestId('submit-preview-button'));

    const alertSummary = await screen.findByRole('alert');
    expect(alertSummary).toHaveTextContent(/Periksa kembali isian berikut/i);
    expect(screen.getAllByText(/Pilih jenis layanan terlebih dahulu/i).length).toBeGreaterThan(0);
  });

  it('requires area for kunjungan, preserves input on error, and transitions to preview when valid', async () => {
    const user = userEvent.setup();
    render(
      <BookingForm
        initialServiceQuery="kunjungan"
        whatsappNumberOverride="6281234567890"
      />,
    );

    const radioVisit = await screen.findByRole('radio', { name: /Penanganan langsung/i });
    expect(radioVisit).toBeChecked();

    await user.selectOptions(screen.getByLabelText(/Jenis hama yang ditemukan/i), 'kecoa');
    await user.type(
      screen.getByLabelText(/Ceritakan kondisi masalahnya/i),
      'Kecoa muncul di dapur dan kamar mandi sejak tiga hari lalu. <img src=x onerror=alert(1)>',
    );
    await user.click(screen.getByLabelText(/Saya memahami bahwa isian ini digunakan/i));

    // Submit tanpa mengisi area -> wajib muncul error area, dan cerita tidak hilang
    await user.click(screen.getByTestId('submit-preview-button'));
    expect(await screen.findAllByText(/Untuk kunjungan, isi kecamatan dan kota Anda/i)).not.toHaveLength(0);
    expect(screen.getByLabelText(/Ceritakan kondisi masalahnya/i)).toHaveValue(
      'Kecoa muncul di dapur dan kamar mandi sejak tiga hari lalu. <img src=x onerror=alert(1)>',
    );

    // Isi area lalu submit ulang
    await user.type(screen.getByLabelText(/Kecamatan dan kota/i), 'Kecamatan Sukmajaya, Kota Depok');
    await user.click(screen.getByTestId('submit-preview-button'));

    // Masuk ke tahap pratinjau; payload XSS tampil sebagai teks biasa
    const previewText = await screen.findByTestId('message-preview-text');
    expect(previewText.textContent).toContain('<img src=x onerror=alert(1)>');
    expect(previewText.textContent).toContain('Area: Kecamatan Sukmajaya, Kota Depok');

    // Tautan WhatsApp mengarah ke https://wa.me/6281234567890
    const waLink = screen.getByTestId('open-whatsapp-link') as HTMLAnchorElement;
    expect(waLink.href).toMatch(/^https:\/\/wa\.me\/6281234567890\?text=/);
    expect(waLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Kembali ke edit mempertahankan seluruh isian
    await user.click(screen.getByTestId('back-to-edit-button'));
    expect(await screen.findByLabelText(/Kecamatan dan kota/i)).toHaveValue(
      'Kecamatan Sukmajaya, Kota Depok',
    );
  });

  it('handles clipboard success and clipboard failure fallback gracefully', async () => {
    const user = userEvent.setup();
    const writeTextMock = vi.fn().mockRejectedValueOnce(new Error('Permission denied'));
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
    });

    render(<BookingForm initialServiceQuery="online" whatsappNumberOverride="" />);

    await user.selectOptions(await screen.findByLabelText(/Jenis hama yang ditemukan/i), 'tikus');
    await user.type(
      screen.getByLabelText(/Ceritakan kondisi masalahnya/i),
      'Tikus terlihat berlari di atas plafon dapur setiap malam hari.',
    );
    await user.click(screen.getByLabelText(/Saya memahami bahwa isian ini digunakan/i));
    await user.click(screen.getByTestId('submit-preview-button'));

    // Saat nomor WA kosong, tombol Buka WhatsApp nonaktif
    expect(await screen.findByTestId('open-whatsapp-disabled')).toBeDisabled();

    // Klik salin pesan pertama kali gagal -> menampilkan fallback textarea manual
    await user.click(screen.getByTestId('copy-message-button'));
    expect(await screen.findByTestId('manual-copy-fallback')).toBeInTheDocument();

    // Klik salin pesan kedua kali berhasil -> menampilkan feedback aria-live
    writeTextMock.mockResolvedValueOnce(undefined);
    await user.click(screen.getByTestId('copy-message-button'));
    await waitFor(() => {
      expect(screen.getByTestId('copy-success-feedback')).toBeInTheDocument();
    });
  });
});

