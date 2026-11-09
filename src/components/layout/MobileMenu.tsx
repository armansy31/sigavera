'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  items: readonly NavItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = 'mobile-site-navigation';

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node | null;
      if (
        target &&
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label="Menu navigasi"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center gap-2 rounded-pill border border-hairline bg-white px-4 py-2 text-sm font-[480] text-black transition-calm hover:bg-surface-soft"
      >
        {isOpen ? (
          <>
            <X className="h-4 w-4" aria-hidden="true" />
            <span>Tutup</span>
          </>
        ) : (
          <>
            <Menu className="h-4 w-4" aria-hidden="true" />
            <span>Menu</span>
          </>
        )}
      </button>

      {isOpen && (
        <div
          id={menuId}
          ref={panelRef}
          className="absolute left-0 right-0 top-full z-40 border-b border-hairline bg-white shadow-lg animate-slide-down motion-reduce:animate-none"
        >
          <nav aria-label="Navigasi seluler" className="container-editorial py-5">
            <ul className="flex flex-col divide-y divide-hairline">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex min-h-[48px] items-center py-2 text-base font-[330] text-black transition-calm hover:opacity-70"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-col gap-2.5 pt-2">
              <Link
                href="/pesan?layanan=online"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[48px] w-full items-center justify-center rounded-pill bg-primary px-5 py-3 text-center text-base font-[480] text-on-primary transition-calm hover:bg-neutral-800"
              >
                Mulai konsultasi
              </Link>
              <Link
                href="/pesan?layanan=kunjungan"
                onClick={() => setIsOpen(false)}
                className="flex min-h-[48px] w-full items-center justify-center rounded-pill border border-hairline bg-white px-5 py-3 text-center text-base font-[480] text-black transition-calm hover:bg-surface-soft"
              >
                Ajukan kunjungan
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

