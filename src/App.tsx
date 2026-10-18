/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Clock, 
  ShoppingBag, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  PhoneCall,
  CheckCircle2,
  Calendar,
  HeartHandshake
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { MedicineTimer } from './components/MedicineTimer';
import { PharmacyAndDoctors } from './components/PharmacyAndDoctors';
import { HealthLocker } from './components/HealthLocker';
import { ReminderStudio } from './components/ReminderStudio';
import { PricingPlans } from './components/PricingPlans';
import { SosModal } from './components/SosModal';
import { MedicineReminder } from './types';

/*
 * ============================================================================
 * TELEPHONY & SMS BACKEND ROADMAP
 * ============================================================================
 * // TODO: Production Telephony & SMS API Integration:
 * 
 * 1. Telephony Provider Wiring:
 *    - Voice Calls: Twilio Voice API (`<Say voice="Polly.Aditi">` or regional neural voices)
 *      or Exotel IVR for regional Indian languages (Hindi, Marathi, Gujarati, Tamil, etc.).
 *    - SMS Dispatch: Twilio Programmable SMS / AWS SNS / Gupshup / WhatsApp Business Cloud API.
 * 
 * 2. Scheduled Cron & Worker:
 *    - Use Cloud Tasks or BullMQ worker queue running on a Node.js/Go backend to trigger
 *      calls/texts exactly at the caregiver's scheduled reminder intervals (e.g., 08:00 AM, 09:00 PM).
 * 
 * 3. Two-Way Confirmation Loop:
 *    - During voice call, IVR prompts: "Press 1 on your keypad or say 'Taken' to confirm."
 *    - Webhook captures DTMF tone '1' and logs the dose as taken in Firestore/PostgreSQL,
 *      silently notifying the caregiver app loop. If unanswered after 2 retries, trigger Caregiver SOS.
 * ============================================================================
 */

const INITIAL_MEDICINES: MedicineReminder[] = [
  {
    id: 'med-bp',
    name: 'Blood Pressure Tablet (Amlodipine 5mg)',
    dose: '1 Tablet',
    time: '08:00',
    timeSlot: 'Morning',
    instructions: 'After breakfast with a full glass of warm water',
    mode: 'call',
    customScript: "Namaste. This is Sanjeevani Setu. It is 8:00 AM, time for your morning blood pressure tablet. Please take it with warm water. Press 1 once taken.",
    customSms: "⏰ Sanjeevani Setu: Good morning! Please take your 8:00 AM Blood Pressure tablet with water.",
    isActive: true,
    takenToday: false
  },
  {
    id: 'med-vit',
    name: 'Calcium & Vitamin D3',
    dose: '1 Softgel',
    time: '13:30',
    timeSlot: 'Afternoon',
    instructions: 'Immediately after afternoon lunch',
    mode: 'sms',
    customScript: "Namaste. This is your Sanjeevani Setu reminder. It is 1:30 PM. Please take your Calcium supplement after lunch.",
    customSms: "⏰ Sanjeevani Setu: Afternoon reminder to take your Calcium & Vitamin D3 softgel after lunch.",
    isActive: true,
    takenToday: false
  },
  {
    id: 'med-night',
    name: 'Evening Sugar Tablet (Metformin 500mg)',
    dose: '1 Tablet',
    time: '21:00',
    timeSlot: 'Night',
    instructions: '30 minutes after dinner. Avoid drinking chilled beverages',
    mode: 'call',
    customScript: "Namaste. This is your Sanjeevani Setu reminder. It is 9:00 PM. Please take your night tablet after dinner. Have a restful night.",
    customSms: "⏰ Sanjeevani Setu: Reminder to take your 9:00 PM night tablet after your meal.",
    isActive: true,
    takenToday: false
  }
];

export default function App() {
  const [reminders, setReminders] = useState<MedicineReminder[]>(() => {
    const saved = localStorage.getItem('sanjeevani_reminders');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [isLargeText, setIsLargeText] = useState<boolean>(false);
  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sanjeevani_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleTaken = (id: string) => {
    setReminders(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.takenToday;
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        showToast(nextState 
          ? `Recorded: ${item.name} marked as taken at ${nowStr}. Caregiver notified.` 
          : `${item.name} reset to pending.`);
        return {
          ...item,
          takenToday: nextState,
          takenAt: nextState ? nowStr : undefined
        };
      }
      return item;
    }));
  };

  const handleAddReminder = (newMed: Omit<MedicineReminder, 'id'>) => {
    const created: MedicineReminder = {
      ...newMed,
      id: `med-${Date.now()}`
    };
    setReminders(prev => [...prev, created]);
    showToast(`Added reminder for ${created.name} at ${created.time}.`);
  };

  const handleUpdateReminder = (updated: MedicineReminder) => {
    setReminders(prev => prev.map(item => item.id === updated.id ? updated : item));
    showToast(`Updated routine settings for ${updated.name}.`);
  };

  return (
    <div className={`min-h-screen text-[#F1E8D6] bg-[#12302F] selection:bg-[#F4B183] selection:text-[#12302F] ${
      isLargeText ? 'text-lg [&_h1]:text-5xl [&_h2]:text-4xl [&_p]:text-xl' : 'text-base'
    }`}>
      
      {/* ─────────────────────────────────────────────────────────── */}
      {/* TOP NOTIFICATION TOAST                                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div 
          className="fixed top-20 right-6 z-50 max-w-md bg-[#163938] border-2 border-[#F4B183] text-[#F1E8D6] px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in"
          role="status"
        >
          <CheckCircle2 className="w-5 h-5 text-[#F4B183] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* NAVIGATION BAR                                              */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Navbar 
        isLargeText={isLargeText}
        onToggleLargeText={() => setIsLargeText(!isLargeText)}
        onTriggerSos={() => setIsSosOpen(true)}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* HERO SECTION                                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center border-b border-[#F1E8D6]/10">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-6 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>ElderCare Connect</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>

        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl leading-[1.1] font-normal mb-8 max-w-3xl mx-auto">
          Technology that<br />
          cares for <em className="italic text-[#F4B183]">elders.</em>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto font-light text-[#F1E8D6]/85 leading-relaxed mb-10">
          We help families coordinate daily health routines, keeping elders safe and caregivers informed—behind the scenes, with zero friction and phone-first simplicity.
        </p>

        {/* Quick Jump Action Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <a 
            href="#medicine-timer"
            className="p-4 bg-[#163938]/60 border border-[#F1E8D6]/15 hover:border-[#F4B183] transition-colors rounded-lg group"
          >
            <Clock className="w-5 h-5 text-[#F4B183] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#F1E8D6]">Medicine Clock</h4>
            <p className="text-[11px] text-[#F1E8D6]/60 mt-0.5">Live countdown &amp; logs</p>
          </a>

          <a 
            href="#pharmacy-care"
            className="p-4 bg-[#163938]/60 border border-[#F1E8D6]/15 hover:border-[#F4B183] transition-colors rounded-lg group"
          >
            <ShoppingBag className="w-5 h-5 text-[#F4B183] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#F1E8D6]">Order Meds</h4>
            <p className="text-[11px] text-[#F1E8D6]/60 mt-0.5">Chemists &amp; Doctors</p>
          </a>

          <a 
            href="#health-locker"
            className="p-4 bg-[#163938]/60 border border-[#F1E8D6]/15 hover:border-[#F4B183] transition-colors rounded-lg group"
          >
            <FileText className="w-5 h-5 text-[#F4B183] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#F1E8D6]">Health Locker</h4>
            <p className="text-[11px] text-[#F1E8D6]/60 mt-0.5">Family medical history</p>
          </a>

          <a 
            href="#reminder-studio"
            className="p-4 bg-[#163938]/60 border border-[#F1E8D6]/15 hover:border-[#F4B183] transition-colors rounded-lg group"
          >
            <PhoneCall className="w-5 h-5 text-[#F4B183] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#F1E8D6]">Voice Studio</h4>
            <p className="text-[11px] text-[#F1E8D6]/60 mt-0.5">Custom phone reminders</p>
          </a>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ABOUT: TWO SIDES, ONE BRIDGE                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="about" className="max-w-3xl mx-auto px-6 py-20 text-center border-b border-[#F1E8D6]/10">
        <h2 className="font-heading text-3xl sm:text-4xl text-[#F4B183] mb-6 font-normal">
          Two sides, one bridge.
        </h2>
        <div className="space-y-6 text-base sm:text-lg font-light text-[#F1E8D6]/85 leading-relaxed text-justify [text-align-last:center]">
          <p>
            Great care is about more than just remembering a pill. It&apos;s about peace of mind, usability, reliability, and preserving dignity. Sanjeevani Setu is designed specifically for the unique needs of older adults who find modern apps overwhelming.
          </p>
          <p>
            From the initial concept to the interface design, our focus is entirely on building a solution that is practical, accessible, and thoughtfully minimal. We strip away the complicated menus to deliver a clean, consent-first experience that adapts to the user, not the other way around.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ARCHITECTURE OF CARE (Cards 01 to 05)                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-3xl mx-auto px-6 py-20 border-b border-[#F1E8D6]/10">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-10 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>The Architecture of Care</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>

        <div className="divide-y divide-[#F1E8D6]/5">
          {/* 01 */}
          <div className="flex flex-col sm:flex-row items-start gap-6 py-6">
            <div className="font-body text-sm font-semibold tracking-widest text-[#F4B183] w-12 shrink-0 pt-1">
              01
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-2xl text-[#F1E8D6] mb-2">
                Simplified Reminders
              </h3>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-base">
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Large-text daily checklists
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Track meds &amp; appointments instantly
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Zero confusing menus
                </li>
              </ul>
            </div>
          </div>

          {/* 02 */}
          <div className="flex flex-col sm:flex-row items-start gap-6 py-6">
            <div className="font-body text-sm font-semibold tracking-widest text-[#F4B183] w-12 shrink-0 pt-1">
              02
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-2xl text-[#F1E8D6] mb-2">
                Consent-First Records
              </h3>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-base">
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Secure, centralized health documents
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> 100% elder-controlled sharing
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> One-tap caregiver access
                </li>
              </ul>
            </div>
          </div>

          {/* 03 */}
          <div className="flex flex-col sm:flex-row items-start gap-6 py-6">
            <div className="font-body text-sm font-semibold tracking-widest text-[#F4B183] w-12 shrink-0 pt-1">
              03
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-2xl text-[#F1E8D6] mb-2">
                Caregiver Loop &amp; SOS
              </h3>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-base">
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> One-tap SOS with 5-second cancel timer
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Instant alerts to trusted family
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Non-intrusive peace of mind
                </li>
              </ul>
            </div>
          </div>

          {/* 04 */}
          <div className="flex flex-col sm:flex-row items-start gap-6 py-6">
            <div className="font-body text-sm font-semibold tracking-widest text-[#F4B183] w-12 shrink-0 pt-1">
              04
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-2xl text-[#F1E8D6] mb-2">
                Built for 60+ Users
              </h3>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-base">
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> High-contrast visual design
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Adjustable text sizes
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Read-aloud toggle for low vision
                </li>
              </ul>
            </div>
          </div>

          {/* 05 */}
          <div className="flex flex-col sm:flex-row items-start gap-6 py-6 bg-[#163938]/40 -mx-4 px-4 sm:mx-0 sm:px-4 border border-[#F4B183]/20">
            <div className="font-body text-sm font-bold tracking-widest text-[#F4B183] w-12 shrink-0 pt-1">
              05
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-heading text-2xl text-[#F1E8D6]">
                  Phone-Based Reminders
                </h3>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#12302F] bg-[#F4B183] px-2 py-0.5">
                  Zero App Needed
                </span>
              </div>
              <p className="text-sm sm:text-base font-light text-[#F1E8D6]/80 mb-3 leading-relaxed">
                The elder gives their phone number once. They choose <em>&ldquo;Call me&rdquo;</em> or <em>&ldquo;Text me&rdquo;</em>, and reminders reach them the way they already understand—a traditional ringing phone or a simple text.
              </p>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-base mb-3">
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Direct telephone call with spoken Hindi/English voice
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Clean SMS with large text and zero confusing URLs
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-[#F4B183]">→</span> Automatic caregiver confirmation when call is answered
                </li>
              </ul>
              <a
                href="#reminder-studio"
                className="inline-flex items-center gap-2 text-sm text-[#F4B183] font-semibold hover:underline"
              >
                <span>Customize voice script in Studio</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. MEDICINE CLOCK & COUNTDOWN TIMER                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      <MedicineTimer 
        reminders={reminders}
        onToggleTaken={handleToggleTaken}
        onAddReminder={handleAddReminder}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. LOCAL PHARMACY & NEARBY DOCTORS                          */}
      {/* ─────────────────────────────────────────────────────────── */}
      <PharmacyAndDoctors />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. CAREGIVER MEDICAL HISTORY & HEALTH LOCKER                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <HealthLocker />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. CUSTOMIZABLE VOICE & SMS REMINDERS STUDIO                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <ReminderStudio 
        reminders={reminders}
        onUpdateReminder={handleUpdateReminder}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. TRANSPARENT PRICING & SUBSCRIPTION PLANS                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <PricingPlans />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONTACT & COMMUNITY                                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-20 text-center border-b border-[#F1E8D6]/10">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-6 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Let&apos;s Connect</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>

        <h2 className="font-heading text-4xl sm:text-5xl font-normal mb-6">
          Behind every build is a<br />
          <em className="italic text-[#F4B183]">problem worth solving.</em>
        </h2>

        <p className="text-base sm:text-lg font-light text-[#F1E8D6]/80 mb-10 max-w-lg mx-auto">
          Have thoughts on our elder-care prototype, want to partner with local pharmacies, or follow our journey?
        </p>

        <a 
          href="https://www.instagram.com/sanjeevi.setu?xtok=MWt6d3V4eGttNXlqOQ==" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block border border-[#F4B183] text-[#F4B183] px-9 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#F4B183] hover:text-[#12302F] transition-colors"
        >
          Follow on Instagram
        </a>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* FOOTER & DISCLAIMER                                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      <footer className="text-center py-16 px-6 bg-black/15 text-xs text-[#F1E8D6]/60">
        <div className="max-w-xl mx-auto space-y-4">
          <p className="leading-relaxed">
            <strong className="text-[#F1E8D6]/80">Disclaimer:</strong> Sanjeevani Setu is a conceptual support layer for routine care coordination. It does not diagnose medical conditions and does not replace professional medical advice, doctors, or emergency services (108/112).
          </p>
          <div className="pt-4 border-t border-[#F1E8D6]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#F1E8D6]/50">
            <p>&copy; 2026 Sanjeevani Setu. All rights reserved.</p>
            <p>Designed for Dignity &amp; Accessibility (GitHub Pages Ready)</p>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SOS EMERGENCY MODAL                                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      <SosModal 
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
      />

    </div>
  );
}
