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
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Calendar,
  HeartHandshake,
  HeartPulse,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { Navbar, TextScaleLevel } from './components/Navbar';
import { MedicineTimer } from './components/MedicineTimer';
import { DailyVitalsCheckin } from './components/DailyVitalsCheckin';
import { PharmacyAndDoctors } from './components/PharmacyAndDoctors';
import { HealthLocker } from './components/HealthLocker';
import { ReminderStudio } from './components/ReminderStudio';
import { PricingPlans } from './components/PricingPlans';
import { SosModal } from './components/SosModal';
import { MedicineReminder } from './types';

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
    takenToday: false,
    pillColor: 'White Round Tablet',
    remainingPills: 24
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
    takenToday: false,
    pillColor: 'Red / Orange Softgel',
    remainingPills: 18
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
    takenToday: false,
    pillColor: 'Yellow Oval Tablet',
    remainingPills: 12
  }
];

export default function App() {
  const [reminders, setReminders] = useState<MedicineReminder[]>(() => {
    try {
      const saved = localStorage.getItem('sanjeevani_reminders');
      return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  // Text Increase Meter Level: 1 (100%), 2 (125%), 3 (150%), 4 (175%), 5 (200% Max)
  const [textScale, setTextScale] = useState<TextScaleLevel>(() => {
    try {
      const saved = localStorage.getItem('sanjeevani_text_scale');
      const parsed = Number(saved);
      if (parsed >= 1 && parsed <= 5) return parsed as TextScaleLevel;
      return 1;
    } catch {
      return 1;
    }
  });

  const [isSosOpen, setIsSosOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sanjeevani_reminders', JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('sanjeevani_text_scale', String(textScale));
  }, [textScale]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleTaken = (id: string) => {
    setReminders(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.takenToday;
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        showToast(nextState
          ? `Recorded: ${item.name} marked as taken at ${nowStr}.`
          : `${item.name} reset to pending.`);

        // Append to Caregiver Activity Log in localStorage if taken
        if (nextState) {
          try {
            const existingLogs = JSON.parse(localStorage.getItem('sanjeevani_activity_logs') || '[]');
            const newLog = {
              id: `log-${Date.now()}`,
              medicineName: item.name,
              dose: item.dose,
              scheduledTime: item.time,
              takenAt: nowStr,
              date: 'Today',
              status: 'On Time',
              confirmationMethod: 'Caregiver App (Priya)',
              delayMinutes: 0
            };
            localStorage.setItem('sanjeevani_activity_logs', JSON.stringify([newLog, ...existingLogs]));
          } catch {
            // ignore
          }
        }

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
    showToast(`Added routine: ${created.name} at ${created.time}.`);
  };

  const handleUpdateReminder = (updated: MedicineReminder) => {
    setReminders(prev => prev.map(item => item.id === updated.id ? updated : item));
    showToast(`Updated routine settings for ${updated.name}.`);
  };

  // Text Meter Controls (Up to 200%)
  const scalePercentLabels: Record<TextScaleLevel, string> = {
    1: '100%',
    2: '125%',
    3: '150%',
    4: '175%',
    5: '200%'
  };

  const handleIncreaseText = () => {
    setTextScale(prev => {
      const next = (Math.min(5, prev + 1)) as TextScaleLevel;
      showToast(`Text size increased to ${scalePercentLabels[next]}${next === 5 ? ' (200% Max Vision)' : ''}`);
      return next;
    });
  };

  const handleDecreaseText = () => {
    setTextScale(prev => {
      const next = (Math.max(1, prev - 1)) as TextScaleLevel;
      showToast(`Text size adjusted to ${scalePercentLabels[next]}`);
      return next;
    });
  };

  const handleResetText = () => {
    setTextScale(1);
    showToast('Text size reset to default 100%');
  };

  // Dynamic Tailwind font scaling for 100% up to 200%
  const getTextScaleClass = () => {
    switch (textScale) {
      case 2:
        return 'text-lg [&_h1]:text-4xl sm:[&_h1]:text-6xl md:[&_h1]:text-7xl [&_h2]:text-3xl sm:[&_h2]:text-5xl [&_p]:text-lg sm:[&_p]:text-2xl';
      case 3:
        return 'text-xl [&_h1]:text-5xl sm:[&_h1]:text-7xl md:[&_h1]:text-8xl [&_h2]:text-4xl sm:[&_h2]:text-6xl [&_p]:text-xl sm:[&_p]:text-3xl font-medium';
      case 4:
        return 'text-2xl [&_h1]:text-5xl sm:[&_h1]:text-8xl md:[&_h1]:text-9xl [&_h2]:text-4xl sm:[&_h2]:text-7xl [&_p]:text-2xl sm:[&_p]:text-4xl font-semibold';
      case 5:
        return 'text-3xl [&_h1]:text-6xl sm:[&_h1]:text-8xl md:[&_h1]:text-9xl [&_h2]:text-5xl sm:[&_h2]:text-8xl [&_p]:text-2xl sm:[&_p]:text-4xl [&_button]:text-base sm:[&_button]:text-lg font-bold';
      case 1:
      default:
        return 'text-base [&_h1]:text-3xl xs:[&_h1]:text-4xl sm:[&_h1]:text-6xl md:[&_h1]:text-7xl [&_h2]:text-2xl sm:[&_h2]:text-4xl [&_p]:text-base sm:[&_p]:text-xl';
    }
  };

  return (
    <div className={`min-h-screen text-[#F1E8D6] bg-[#12302F] selection:bg-[#F4B183] selection:text-[#12302F] transition-all duration-200 ${getTextScaleClass()}`}>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TOP NOTIFICATION TOAST                                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      {toastMessage && (
        <div
          className="fixed top-16 sm:top-20 inset-x-3 sm:inset-x-auto sm:right-6 z-50 max-w-md bg-[#163938] border-2 border-[#F4B183] text-[#F1E8D6] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in"
          role="status"
        >
          <CheckCircle2 className="w-5 h-5 text-[#F4B183] shrink-0" />
          <span className="text-xs sm:text-sm font-medium leading-snug">{toastMessage}</span>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* NAVIGATION BAR WITH TEXT INCREASE METER (Up to 200%)        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <Navbar
        textScale={textScale}
        onIncreaseText={handleIncreaseText}
        onDecreaseText={handleDecreaseText}
        onResetText={handleResetText}
        onTriggerSos={() => setIsSosOpen(true)}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* HERO SECTION                                                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-12 sm:pb-16 text-center border-b border-[#F1E8D6]/10">
        <div className="text-[10px] sm:text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>ElderCare Connect</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>

        <h1 className="font-heading leading-[1.12] sm:leading-[1.1] font-normal mb-5 sm:mb-8 max-w-3xl mx-auto break-words">
          Technology that<br />
          cares for <em className="italic text-[#F4B183]">elders.</em>
        </h1>

        <p className="max-w-2xl mx-auto font-light text-[#F1E8D6]/85 leading-relaxed mb-8 sm:mb-10">
          We help families coordinate daily health routines, keeping elders safe and caregivers informed—behind the scenes, with zero friction, spoken audio assistance, and phone-first simplicity.
        </p>

        {/* Quick Jump Action Hub (5-Column Grid with Daily Vitals) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3 max-w-4xl mx-auto text-left">

          <a
            href="#medicine-timer"
            className="p-3.5 sm:p-4 bg-[#163938]/60 border border-[#F1E8D6]/15 hover:border-[#F4B183] transition-colors rounded-lg group"
          >
            <Clock className="w-5 h-5 text-[#F4B183] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#F1E8D6]">Medicine Clock</h4>
            <p className="text-[11px] text-[#F1E8D6]/60 mt-0.5">Spoken audio &amp; timer</p>
          </a>

          <a
            href="#vitals-checkin"
            className="p-3.5 sm:p-4 bg-[#163938]/60 border border-emerald-500/25 hover:border-[#F4B183] transition-colors rounded-lg group"
          >
            <HeartPulse className="w-5 h-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#F1E8D6]">Daily Vitals</h4>
            <p className="text-[11px] text-[#F1E8D6]/60 mt-0.5">BP, sugar &amp; water</p>
          </a>

          <a
            href="#pharmacy-care"
            className="p-3.5 sm:p-4 bg-[#163938]/60 border border-[#F1E8D6]/15 hover:border-[#F4B183] transition-colors rounded-lg group"
          >
            <ShoppingBag className="w-5 h-5 text-[#F4B183] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#F1E8D6]">Order Meds</h4>
            <p className="text-[11px] text-[#F1E8D6]/60 mt-0.5">Chemists &amp; Doctors</p>
          </a>

          <a
            href="#health-locker"
            className="p-3.5 sm:p-4 bg-[#163938]/60 border border-[#F1E8D6]/15 hover:border-[#F4B183] transition-colors rounded-lg group"
          >
            <FileText className="w-5 h-5 text-[#F4B183] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold text-xs uppercase tracking-wider text-[#F1E8D6]">Health Locker</h4>
            <p className="text-[11px] text-[#F1E8D6]/60 mt-0.5">Family medical vault</p>
          </a>

          <a
            href="#reminder-studio"
            className="p-3.5 sm:p-4 bg-[#163938]/60 border border-[#F1E8D6]/15 hover:border-[#F4B183] transition-colors rounded-lg group"
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
      <section id="about" className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center border-b border-[#F1E8D6]/10">
        <h2 className="font-heading text-[#F4B183] mb-4 sm:mb-6 font-normal">
          Two sides, one bridge.
        </h2>
        <div className="space-y-4 sm:space-y-6 font-light text-[#F1E8D6]/85 leading-relaxed text-justify [text-align-last:center]">
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
      <section id="features" className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 border-b border-[#F1E8D6]/10">
        <div className="text-[10px] sm:text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-8 sm:mb-10 flex items-center justify-center gap-2 sm:gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>The Architecture of Care</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>

        <div className="divide-y divide-[#F1E8D6]/5">
          {/* 01 */}
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 py-5 sm:py-6">
            <div className="font-body text-xs sm:text-sm font-semibold tracking-widest text-[#F4B183] w-12 shrink-0 pt-0.5 sm:pt-1">
              01
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6] mb-2">
                Simplified Reminders with Spoken Audio
              </h3>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-sm sm:text-base">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Free Web Speech API read-aloud for vision impairment
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Track meds &amp; appointments instantly
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Zero confusing menus
                </li>
              </ul>
            </div>
          </div>

          {/* 02 */}
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 py-5 sm:py-6">
            <div className="font-body text-xs sm:text-sm font-semibold tracking-widest text-[#F4B183] w-12 shrink-0 pt-0.5 sm:pt-1">
              02
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6] mb-2">
                Consent-First Records
              </h3>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-sm sm:text-base">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Secure, centralized health documents
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> 100% elder-controlled sharing
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> One-tap caregiver access
                </li>
              </ul>
            </div>
          </div>

          {/* 03 */}
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 py-5 sm:py-6">
            <div className="font-body text-xs sm:text-sm font-semibold tracking-widest text-[#F4B183] w-12 shrink-0 pt-0.5 sm:pt-1">
              03
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6] mb-2">
                Caregiver Loop &amp; SOS
              </h3>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-sm sm:text-base">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> One-tap SOS with 5-second cancel timer
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Instant alerts to trusted family
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Non-intrusive peace of mind
                </li>
              </ul>
            </div>
          </div>

          {/* 04 */}
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 py-5 sm:py-6">
            <div className="font-body text-xs sm:text-sm font-semibold tracking-widest text-[#F4B183] w-12 shrink-0 pt-0.5 sm:pt-1">
              04
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6] mb-2">
                Built for 60+ Users (Up to 200% Text Scale)
              </h3>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-sm sm:text-base">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> High-contrast visual design
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Interactive 5-level text meter scaling up to 200%
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Spoken audio playback for low-vision assistance
                </li>
              </ul>
            </div>
          </div>

          {/* 05 */}
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 py-5 sm:py-6 bg-[#163938]/40 p-4 sm:p-5 rounded-xl border border-[#F4B183]/20">
            <div className="font-body text-xs sm:text-sm font-bold tracking-widest text-[#F4B183] w-12 shrink-0 pt-0.5 sm:pt-1">
              05
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6]">
                  Phone-Based Reminders
                </h3>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#12302F] bg-[#F4B183] px-2 py-0.5 rounded">
                  Zero App Needed
                </span>
              </div>
              <p className="text-xs sm:text-base font-light text-[#F1E8D6]/80 mb-3 leading-relaxed">
                The elder gives their phone number once. They choose <em>&ldquo;Call me&rdquo;</em> or <em>&ldquo;Text me&rdquo;</em>, and reminders reach them the way they already understand—a traditional ringing phone or a simple text.
              </p>
              <ul className="space-y-1.5 text-[#F1E8D6]/75 font-light text-xs sm:text-base mb-3">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Direct telephone call with spoken Hindi/English voice
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Clean SMS with large text and zero confusing URLs
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F4B183]">→</span> Automatic caregiver confirmation when call is answered
                </li>
              </ul>
              <a
                href="#reminder-studio"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#F4B183] font-semibold hover:underline"
              >
                <span>Customize voice script in Studio</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. MEDICINE CLOCK & COUNTDOWN TIMER (With Play Audio)       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <MedicineTimer
        reminders={reminders}
        onToggleTaken={handleToggleTaken}
        onAddReminder={handleAddReminder}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. DAILY VITALS & WELLNESS CHECK-IN MODULE                  */}
      {/* ─────────────────────────────────────────────────────────── */}
      <DailyVitalsCheckin />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. LOCAL PHARMACY & NEARBY DOCTORS                          */}
      {/* ─────────────────────────────────────────────────────────── */}
      <PharmacyAndDoctors />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. CAREGIVER MEDICAL HISTORY & HEALTH LOCKER                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <HealthLocker />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. CUSTOMIZABLE VOICE & SMS REMINDERS STUDIO                */}
      {/* ─────────────────────────────────────────────────────────── */}
      <ReminderStudio
        reminders={reminders}
        onUpdateReminder={handleUpdateReminder}
      />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 6. TRANSPARENT PRICING & SUBSCRIPTION PLANS                 */}
      {/* ─────────────────────────────────────────────────────────── */}
      <PricingPlans />

      {/* ─────────────────────────────────────────────────────────── */}
      {/* CONTACT & COMMUNITY                                         */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="contact" className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center border-b border-[#F1E8D6]/10">
        <div className="text-[10px] sm:text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 sm:mb-6 flex items-center justify-center gap-2 sm:gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Let&apos;s Connect</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>

        <h2 className="font-heading text-3xl sm:text-5xl font-normal mb-4 sm:mb-6">
          Behind every build is a<br />
          <em className="italic text-[#F4B183]">problem worth solving.</em>
        </h2>

        <p className="text-sm sm:text-lg font-light text-[#F1E8D6]/80 mb-8 sm:mb-10 max-w-lg mx-auto">
          Have thoughts on our elder-care prototype, want to partner with local pharmacies, or follow our journey?
        </p>

        <a
          href="https://www.instagram.com/sanjeevi.setu?xtok=MWt6d3V4eGttNXlqOQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block border border-[#F4B183] text-[#F4B183] px-7 sm:px-9 py-3 sm:py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#F4B183] hover:text-[#12302F] transition-colors rounded active:scale-95"
        >
          Follow on Instagram
        </a>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* FOOTER & DISCLAIMER (Removed GitHub Pages Ready text)       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <footer className="text-center py-12 sm:py-16 px-4 sm:px-6 bg-black/15 text-xs text-[#F1E8D6]/60">
        <div className="max-w-xl mx-auto space-y-4">
          <p className="leading-relaxed">
            <strong className="text-[#F1E8D6]/80">Disclaimer:</strong> Sanjeevani Setu is a conceptual support layer for routine care coordination. It does not diagnose medical conditions and does not replace professional medical advice, doctors, or emergency services (108/112).
          </p>
          <div className="pt-4 border-t border-[#F1E8D6]/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#F1E8D6]/50">
            <p>&copy; 2026 Sanjeevani Setu. All rights reserved.</p>
            <p>Designed for Dignity, Accessibility &amp; Elder Care</p>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* FLOATING QUICK TEXT SIZE METER FOR ELDERS (Up to 200%)      */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-4 right-4 z-40 bg-[#163938]/95 border-2 border-[#F4B183]/50 p-1.5 sm:p-2 rounded-2xl shadow-2xl flex items-center gap-1.5 backdrop-blur-md"
        role="region"
        aria-label="Text Size Controller"
      >
        <button
          type="button"
          onClick={handleDecreaseText}
          disabled={textScale === 1}
          aria-label="Decrease text size"
          title="Decrease text size (A-)"
          className="w-8 h-8 rounded-lg bg-[#12302F] hover:bg-[#1f4a49] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-serif font-bold text-xs text-[#F1E8D6] transition-colors"
        >
          A-
        </button>

        <button
          type="button"
          onClick={handleResetText}
          title="Reset to 100% (or tap to reset)"
          className="px-2 py-1 rounded-lg bg-[#12302F] text-[11px] font-mono font-bold text-[#F4B183] hover:text-white"
        >
          {scalePercentLabels[textScale]}
        </button>

        <button
          type="button"
          onClick={handleIncreaseText}
          disabled={textScale === 5}
          aria-label="Increase text size up to 200%"
          title="Increase text size up to 200% (A+)"
          className="w-8 h-8 rounded-lg bg-[#12302F] hover:bg-[#1f4a49] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-serif font-bold text-xs text-[#F1E8D6] transition-colors"
        >
          A+
        </button>
      </div>

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
