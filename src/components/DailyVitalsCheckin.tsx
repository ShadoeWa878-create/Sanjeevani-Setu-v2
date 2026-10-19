import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  Droplets,
  Activity,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Plus,
  Minus,
  Volume2,
  Sparkles,
  PhoneCall,
  Clock
} from 'lucide-react';
import { DailyHealthCheckin } from '../types';

export function DailyVitalsCheckin() {
  const [bpSys, setBpSys] = useState<number>(122);
  const [bpDia, setBpDia] = useState<number>(78);
  const [bloodSugar, setBloodSugar] = useState<number>(104);
  const [waterGlasses, setWaterGlasses] = useState<number>(5);
  const [mood, setMood] = useState<'great' | 'good' | 'tired' | 'unwell'>('good');
  const [lastLoggedAt, setLastLoggedAt] = useState<string>('Today, 08:30 AM');
  const [loggedConfirmed, setLoggedConfirmed] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sanjeevani_vitals');
      if (saved) {
        const parsed: DailyHealthCheckin = JSON.parse(saved);
        setBpSys(parsed.bloodPressureSys || 122);
        setBpDia(parsed.bloodPressureDia || 78);
        setBloodSugar(parsed.bloodSugar || 104);
        setWaterGlasses(parsed.waterGlasses || 5);
        setMood(parsed.mood || 'good');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: DailyHealthCheckin = {
      date: new Date().toLocaleDateString('en-GB'),
      bloodPressureSys: bpSys,
      bloodPressureDia: bpDia,
      bloodSugar: bloodSugar,
      waterGlasses: waterGlasses,
      mood: mood
    };
    localStorage.setItem('sanjeevani_vitals', JSON.stringify(payload));
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastLoggedAt(`Today, ${nowTime}`);
    setLoggedConfirmed(true);
    setTimeout(() => setLoggedConfirmed(false), 3500);
  };

  const speakVitals = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Today's Daily Vitals summary. Blood pressure is ${bpSys} over ${bpDia}. Blood sugar is ${bloodSugar} milligrams per deciliter. You have had ${waterGlasses} glasses of water today. Feeling: ${mood}. Everything is recorded for your family.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getBpStatus = () => {
    if (bpSys < 120 && bpDia < 80) return { label: 'Optimal Normal', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' };
    if (bpSys <= 130 && bpDia <= 85) return { label: 'Normal / Stable', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' };
    if (bpSys <= 140 || bpDia <= 90) return { label: 'Mild Elevation (Monitor)', color: 'text-amber-400 border-amber-500/30 bg-amber-950/40' };
    return { label: 'High (Alert Family)', color: 'text-red-400 border-red-500/30 bg-red-950/40' };
  };

  const bpStatus = getBpStatus();

  return (
    <section id="vitals-checkin" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-b border-[#F1E8D6]/10 scroll-mt-12">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Daily Wellness &amp; Vitals</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl text-[#F1E8D6] mb-4 sm:mb-5 font-normal">
          Daily Vitals &amp; <em className="italic text-[#F4B183]">Check-in</em>
        </h2>
        <p className="text-sm sm:text-lg font-light text-[#F1E8D6]/80 leading-relaxed">
          Log daily blood pressure, sugar, hydration, and mood with phone-sized touch controls. Automatically synced for family peace of mind.
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={speakVitals}
            title="Read vitals aloud"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#163938] hover:bg-[#1a4442] border border-[#F4B183]/40 text-xs font-semibold text-[#F4B183] transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Play Vitals Audio</span>
          </button>
        </div>
      </div>

      {/* Confirmation Toast Bar */}
      {loggedConfirmed && (
        <div className="mb-6 p-4 bg-[#163938] border-2 border-emerald-400 text-emerald-200 rounded-xl flex items-center gap-3 shadow-xl animate-fade-in" role="status">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">
            Vitals recorded successfully at {lastLoggedAt}. Caregivers Priya &amp; Rahul can view today&apos;s updates.
          </span>
        </div>
      )}

      {/* Vitals Form Card */}
      <form onSubmit={handleSaveVitals} className="bg-[#163938]/70 border-2 border-[#F4B183]/30 p-5 sm:p-8 rounded-2xl shadow-2xl space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* BP Card */}
          <div className="bg-[#12302F] p-4 sm:p-5 rounded-xl border border-[#F1E8D6]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F4B183] flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-red-400" />
                Blood Pressure (BP)
              </span>
              <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${bpStatus.color}`}>
                {bpStatus.label}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex-1 text-center">
                <span className="text-[10px] text-[#F1E8D6]/60 block mb-1">Systolic (Upper)</span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBpSys(prev => Math.max(80, prev - 2))}
                    className="w-8 h-8 rounded-lg bg-[#163938] text-[#F1E8D6] font-bold text-sm hover:bg-[#1f4a49]"
                  >
                    -
                  </button>
                  <span className="font-mono text-2xl font-bold text-[#F1E8D6] min-w-[50px]">{bpSys}</span>
                  <button
                    type="button"
                    onClick={() => setBpSys(prev => Math.min(220, prev + 2))}
                    className="w-8 h-8 rounded-lg bg-[#163938] text-[#F1E8D6] font-bold text-sm hover:bg-[#1f4a49]"
                  >
                    +
                  </button>
                </div>
              </div>

              <span className="text-2xl text-[#F1E8D6]/40 font-thin">/</span>

              <div className="flex-1 text-center">
                <span className="text-[10px] text-[#F1E8D6]/60 block mb-1">Diastolic (Lower)</span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBpDia(prev => Math.max(50, prev - 2))}
                    className="w-8 h-8 rounded-lg bg-[#163938] text-[#F1E8D6] font-bold text-sm hover:bg-[#1f4a49]"
                  >
                    -
                  </button>
                  <span className="font-mono text-2xl font-bold text-[#F1E8D6] min-w-[50px]">{bpDia}</span>
                  <button
                    type="button"
                    onClick={() => setBpDia(prev => Math.min(140, prev + 2))}
                    className="w-8 h-8 rounded-lg bg-[#163938] text-[#F1E8D6] font-bold text-sm hover:bg-[#1f4a49]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-center text-[#F1E8D6]/50">mmHg (Target: 120/80)</div>
          </div>

          {/* Blood Sugar Card */}
          <div className="bg-[#12302F] p-4 sm:p-5 rounded-xl border border-[#F1E8D6]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F4B183] flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                Blood Sugar (Fasting / Post-Meal)
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-300 bg-emerald-950/40">
                {bloodSugar < 140 ? 'Normal Range' : 'Elevated'}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBloodSugar(prev => Math.max(50, prev - 5))}
                className="w-9 h-9 rounded-lg bg-[#163938] text-[#F1E8D6] font-bold text-base hover:bg-[#1f4a49]"
              >
                -
              </button>
              <div className="text-center min-w-[90px]">
                <span className="font-mono text-3xl font-extrabold text-[#F4B183]">{bloodSugar}</span>
                <span className="text-[10px] text-[#F1E8D6]/60 block">mg/dL</span>
              </div>
              <button
                type="button"
                onClick={() => setBloodSugar(prev => Math.min(400, prev + 5))}
                className="w-9 h-9 rounded-lg bg-[#163938] text-[#F1E8D6] font-bold text-base hover:bg-[#1f4a49]"
              >
                +
              </button>
            </div>
            <div className="text-[11px] text-center text-[#F1E8D6]/50">Fasting target: 70 - 110 mg/dL</div>
          </div>

        </div>

        {/* Second Row: Hydration & Mood */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

          {/* Water Intake Tracker */}
          <div className="bg-[#12302F] p-4 sm:p-5 rounded-xl border border-[#F1E8D6]/15 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F4B183] flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-sky-400" />
                Hydration Tracker ({waterGlasses} of 8 Glasses)
              </span>
              <span className="text-[11px] text-sky-300 font-mono font-bold">
                {Math.round((waterGlasses / 8) * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2 py-1 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setWaterGlasses(g)}
                  className={`w-7 h-9 sm:w-8 sm:h-10 rounded-lg flex items-center justify-center transition-all ${
                    g <= waterGlasses
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'bg-[#163938] text-[#F1E8D6]/30 border border-[#F1E8D6]/10'
                  }`}
                  title={`${g} Glasses of warm water`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <div className="text-[11px] text-[#F1E8D6]/50">Lukewarm water is recommended with elder medication.</div>
          </div>

          {/* Daily Mood / Feeling Check-in */}
          <div className="bg-[#12302F] p-4 sm:p-5 rounded-xl border border-[#F1E8D6]/15 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F4B183] block">
              How are you feeling right now?
            </span>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'great', label: 'Energetic', icon: '😊' },
                { id: 'good', label: 'Comfortable', icon: '😌' },
                { id: 'tired', label: 'Tired / Weak', icon: '🥱' },
                { id: 'unwell', label: 'Dizzy / Low', icon: '🤒' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMood(item.id as any)}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    mood === item.id
                      ? 'bg-[#F4B183] text-[#12302F] border-[#F4B183] font-bold shadow-md'
                      : 'bg-[#163938] text-[#F1E8D6]/80 border-[#F1E8D6]/10 hover:border-[#F4B183]/40'
                  }`}
                >
                  <span className="text-lg block mb-0.5">{item.icon}</span>
                  <span className="text-[10px] block leading-tight">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="text-[11px] text-[#F1E8D6]/50">Alerts caregiver Priya automatically if feeling dizzy or low.</div>
          </div>

        </div>

        {/* Submit & Sync Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F1E8D6]/10">
          <span className="text-xs text-[#F1E8D6]/60">
            Last logged: <strong className="text-[#F1E8D6]">{lastLoggedAt}</strong>
          </span>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-[#F4B183] hover:bg-[#f6c29d] text-[#12302F] font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Today&apos;s Vitals &amp; Notify Family</span>
          </button>
        </div>
      </form>
    </section>
  );
}
