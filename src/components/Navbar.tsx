import React, { useState } from 'react';
import { ShieldAlert, Clock, ShoppingBag, FileText, Menu, X, PhoneCall, HeartPulse, Activity } from 'lucide-react';

export type TextScaleLevel = 1 | 2 | 3 | 4 | 5;

interface NavbarProps {
  textScale: TextScaleLevel;
  onIncreaseText: () => void;
  onDecreaseText: () => void;
  onResetText: () => void;
  onTriggerSos: () => void;
}

export function Navbar({
  textScale,
  onIncreaseText,
  onDecreaseText,
  onResetText,
  onTriggerSos
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Concept', href: '#about' },
    { label: 'Architecture', href: '#features' },
    { label: 'Medicine Clock', href: '#medicine-timer' },
    { label: 'Daily Vitals', href: '#vitals-checkin' },
    { label: 'Doctors & Chemist', href: '#pharmacy-care' },
    { label: 'Health Locker', href: '#health-locker' },
    { label: 'Voice Studio', href: '#reminder-studio' },
    { label: 'Plans & Pricing', href: '#plans' },
  ];

  const scalePercentages: Record<TextScaleLevel, string> = {
    1: '100%',
    2: '125%',
    3: '150%',
    4: '175%',
    5: '200%'
  };

  const scaleLabels: Record<TextScaleLevel, string> = {
    1: 'Standard',
    2: 'Comfortable',
    3: 'Large',
    4: 'X-Large',
    5: '200% Max Vision'
  };

  return (
    <nav
      className="sticky top-0 z-40 px-3 sm:px-6 py-3 sm:py-3.5 border-b border-[#F1E8D6]/10 bg-[#12302F]/95 backdrop-blur-md"
      aria-label="Main Navigation"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">

        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a
            href="#"
            className="font-heading text-lg sm:text-2xl font-bold tracking-wide text-[#F4B183] whitespace-nowrap hover:opacity-90 transition-opacity truncate"
          >
            Sanjeevani Setu
          </a>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <ul className="hidden xl:flex items-center gap-4 list-none text-xs tracking-wider uppercase font-semibold text-[#F1E8D6]/80">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="hover:text-[#F4B183] transition-colors whitespace-nowrap py-1"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Zone 3: Text Increase Meter (Up to 200%) & SOS Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* ELDER TEXT INCREASE METER (100% to 200%) */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 bg-[#163938] border border-[#F4B183]/40 p-1 sm:p-1.5 rounded-xl shadow-sm"
            role="group"
            aria-label="Text Size Meter"
            title={`Elder Vision Scale: ${scaleLabels[textScale]} (${scalePercentages[textScale]})`}
          >
            {/* Decrease button */}
            <button
              type="button"
              onClick={onDecreaseText}
              disabled={textScale === 1}
              aria-label="Decrease text size"
              title="Decrease text size (A-)"
              className="p-1 sm:px-2 sm:py-1 rounded-lg text-xs font-bold text-[#F1E8D6] hover:bg-[#12302F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="font-serif">A-</span>
            </button>

            {/* Visual 5-Bar Meter Gauge (Reaches up to 200%) */}
            <div className="flex items-center gap-1 px-1 sm:px-1.5" title={`Text Size: ${scaleLabels[textScale]} (${scalePercentages[textScale]})`}>
              {([1, 2, 3, 4, 5] as TextScaleLevel[]).map((step) => (
                <span
                  key={step}
                  className={`w-1.5 sm:w-2 rounded-full transition-all ${
                    step <= textScale
                      ? 'bg-[#F4B183] h-3.5 sm:h-4.5 shadow-[0_0_6px_#F4B183]'
                      : 'bg-[#F1E8D6]/20 h-2'
                  }`}
                />
              ))}
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#F4B183] ml-1 min-w-[34px] text-center">
                {scalePercentages[textScale]}
              </span>
            </div>

            {/* Increase button */}
            <button
              type="button"
              onClick={onIncreaseText}
              disabled={textScale === 5}
              aria-label="Increase text size up to 200%"
              title="Increase text size up to 200% (A+)"
              className="p-1 sm:px-2 sm:py-1 rounded-lg text-xs font-bold text-[#F1E8D6] hover:bg-[#12302F] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="font-serif text-sm">A+</span>
            </button>
          </div>

          {/* SOS Emergency Trigger Button */}
          <button
            type="button"
            onClick={onTriggerSos}
            aria-label="Trigger SOS Emergency"
            className="flex items-center gap-1 sm:gap-1.5 bg-red-600/90 hover:bg-red-600 text-white px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors shadow-sm rounded-lg active:scale-95"
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>SOS</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-[#F1E8D6] p-1.5 hover:text-[#F4B183] rounded focus:outline-none focus:ring-1 focus:ring-[#F4B183]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden pt-4 pb-4 border-t border-[#F1E8D6]/10 mt-3 space-y-3 animate-fade-in">
          {/* Mobile Text Meter Bar (Up to 200%) */}
          <div className="flex items-center justify-between p-3 bg-[#163938] rounded-xl border border-[#F4B183]/30">
            <div>
              <span className="text-xs text-[#F1E8D6] font-semibold block">
                Text Size Meter
              </span>
              <span className="text-[10px] text-[#F4B183]">
                {scaleLabels[textScale]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onDecreaseText}
                disabled={textScale === 1}
                className="px-3 py-1 bg-[#12302F] rounded text-xs font-bold disabled:opacity-30"
              >
                A-
              </button>
              <span className="text-sm font-mono font-bold text-[#F4B183]">
                {scalePercentages[textScale]}
              </span>
              <button
                type="button"
                onClick={onIncreaseText}
                disabled={textScale === 5}
                className="px-3 py-1 bg-[#12302F] rounded text-xs font-bold disabled:opacity-30"
              >
                A+
              </button>
            </div>
          </div>

          <ul className="flex flex-col gap-1 list-none text-xs sm:text-sm tracking-wider uppercase font-semibold text-[#F1E8D6]/90">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 hover:bg-[#163938] rounded text-[#F1E8D6] hover:text-[#F4B183] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
