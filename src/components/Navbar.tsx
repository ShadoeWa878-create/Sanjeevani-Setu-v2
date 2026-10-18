import React, { useState } from 'react';
import { Phone, ShieldAlert, Clock, ShoppingBag, FileText, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  isLargeText: boolean;
  onToggleLargeText: () => void;
  onTriggerSos: () => void;
}

export function Navbar({ isLargeText, onToggleLargeText, onTriggerSos }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Concept', href: '#about' },
    { label: 'Architecture', href: '#features' },
    { label: 'Medicine Clock', href: '#medicine-timer' },
    { label: 'Doctors & Chemist', href: '#pharmacy-care' },
    { label: 'Health Locker', href: '#health-locker' },
    { label: 'Voice Studio', href: '#reminder-studio' },
    { label: 'Plans & Pricing', href: '#plans' },
  ];

  return (
    <nav 
      className="sticky top-0 z-50 px-6 py-4 md:px-10 border-b border-[#F1E8D6]/10 bg-[#12302F]/95 backdrop-blur-md"
      aria-label="Main Navigation"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        
        {/* Zone 1: Wordmark */}
        <a 
          href="#" 
          className="font-heading text-2xl font-bold tracking-wide text-[#F4B183] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          Sanjeevani Setu
        </a>

        {/* Zone 2: Navigation Links (Desktop) */}
        <ul className="hidden xl:flex items-center gap-6 list-none text-xs tracking-wider uppercase font-semibold text-[#F1E8D6]/80">
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

        {/* Zone 3: Accessibility & Emergency SOS */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Senior High-Contrast Font Size Toggle */}
          <button
            type="button"
            onClick={onToggleLargeText}
            title={isLargeText ? 'Switch to Normal Text' : 'Switch to Large Text (60+ High Legibility)'}
            className={`px-3 py-1.5 text-xs font-bold border transition-colors ${
              isLargeText 
                ? 'bg-[#F4B183] text-[#12302F] border-[#F4B183]' 
                : 'border-[#F1E8D6]/30 text-[#F1E8D6] hover:border-[#F4B183]'
            }`}
          >
            {isLargeText ? 'A+ Large' : 'A Normal'}
          </button>

          {/* SOS Emergency Trigger Button */}
          <button
            type="button"
            onClick={onTriggerSos}
            className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-[#F1E8D6] p-1.5 hover:text-[#F4B183]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden pt-4 pb-6 border-t border-[#F1E8D6]/10 mt-3 space-y-3">
          <ul className="flex flex-col gap-2 list-none text-sm tracking-wider uppercase font-semibold text-[#F1E8D6]/90">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 hover:bg-[#163938] rounded text-[#F1E8D6] hover:text-[#F4B183]"
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
