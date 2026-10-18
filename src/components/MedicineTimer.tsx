import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle, Plus, Pill, RefreshCw, Calendar } from 'lucide-react';
import { MedicineReminder } from '../types';

interface MedicineTimerProps {
  reminders: MedicineReminder[];
  onToggleTaken: (id: string) => void;
  onAddReminder: (newMed: Omit<MedicineReminder, 'id'>) => void;
}

export function MedicineTimer({ reminders, onToggleTaken, onAddReminder }: MedicineTimerProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedTime, setNewMedTime] = useState('08:00');
  const [newMedSlot, setNewMedSlot] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning');
  const [newMedInstructions, setNewMedInstructions] = useState('After breakfast with warm water');

  // Live real-time clock tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate next upcoming dose
  const getNextDoseInfo = () => {
    const untakenReminders = reminders.filter(r => r.isActive && !r.takenToday);
    if (untakenReminders.length === 0) {
      return { nextReminder: null, diffMs: 0 };
    }

    const now = currentTime;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let closest: MedicineReminder | null = null;
    let minDiff = Infinity;

    for (const rem of untakenReminders) {
      // Parse time e.g., "08:00" or "8:00 AM" or "20:00"
      let remMinutes = 0;
      if (rem.time.includes(':')) {
        const parts = rem.time.replace(/[^0-9:]/g, '').split(':');
        let hrs = parseInt(parts[0], 10) || 8;
        const mins = parseInt(parts[1], 10) || 0;
        if (rem.time.toLowerCase().includes('pm') && hrs < 12) hrs += 12;
        if (rem.time.toLowerCase().includes('am') && hrs === 12) hrs = 0;
        remMinutes = hrs * 60 + mins;
      }

      let diff = remMinutes - nowMinutes;
      if (diff < 0) {
        // Scheduled earlier today but not taken yet (overdue)
        diff += 24 * 60;
      }

      if (diff < minDiff) {
        minDiff = diff;
        closest = rem;
      }
    }

    const diffMs = (minDiff === Infinity ? 0 : minDiff * 60 - now.getSeconds()) * 1000;
    return { nextReminder: closest, diffMs: Math.max(0, diffMs) };
  };

  const { nextReminder, diffMs } = getNextDoseInfo();

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  };

  const countdown = formatCountdown(diffMs);

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    onAddReminder({
      name: newMedName.trim(),
      dose: newMedDose.trim() || '1 Tablet',
      time: newMedTime,
      timeSlot: newMedSlot,
      instructions: newMedInstructions.trim(),
      mode: 'call',
      customScript: `Namaste. This is Sanjeevani Setu. It is time for your ${newMedName}. ${newMedInstructions}.`,
      customSms: `⏰ Sanjeevani Setu: Time to take your ${newMedName} (${newMedDose || '1 Tablet'}). ${newMedInstructions}.`,
      isActive: true,
      takenToday: false
    });

    setNewMedName('');
    setNewMedDose('');
    setShowAddModal(false);
  };

  return (
    <section id="medicine-timer" className="max-w-4xl mx-auto px-6 py-24 border-b border-[#F1E8D6]/10 scroll-mt-12">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Care Routine Clock</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl text-[#F1E8D6] mb-5 font-normal">
          Medicine <em className="italic text-[#F4B183]">Clock &amp; Timer</em>
        </h2>
        <p className="text-base sm:text-lg font-light text-[#F1E8D6]/80 leading-relaxed">
          Never second-guess whether a dose was taken. A live countdown and one-tap confirmation loop keep seniors on schedule and families at ease.
        </p>
      </div>

      {/* Hero Countdown Banner */}
      <div className="bg-[#163938]/70 border-2 border-[#F4B183]/30 p-6 sm:p-10 rounded-2xl mb-12 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left: Next Dose Details */}
          <div className="text-center md:text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#12302F] border border-[#F4B183]/40 text-xs uppercase tracking-wider text-[#F4B183]">
              <Clock className="w-3.5 h-3.5" />
              <span>Next Upcoming Medication</span>
            </div>

            {nextReminder ? (
              <>
                <h3 className="font-heading text-3xl sm:text-4xl text-[#F1E8D6]">
                  {nextReminder.name}
                </h3>
                <p className="text-base sm:text-lg text-[#F1E8D6]/80 flex items-center justify-center md:justify-start gap-2">
                  <span className="font-semibold text-[#F4B183]">{nextReminder.dose}</span>
                  <span>·</span>
                  <span>{nextReminder.instructions}</span>
                </p>
                <p className="text-xs text-[#F1E8D6]/60">
                  Scheduled for <span className="text-[#F4B183] font-semibold">{nextReminder.time}</span> ({nextReminder.timeSlot})
                </p>
              </>
            ) : (
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl text-[#F4B183]">
                  All Doses Taken For Today!
                </h3>
                <p className="text-sm text-[#F1E8D6]/80 mt-1">
                  Wonderful job adhering to the routine. Tomorrow&apos;s schedule will resume at 8:00 AM.
                </p>
              </div>
            )}
          </div>

          {/* Right: Digital Countdown Display & Mark as Taken */}
          <div className="flex flex-col items-center gap-4">
            {nextReminder && (
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest text-[#F1E8D6]/60 block mb-2 font-semibold">
                  Time Remaining Until Dose
                </span>
                <div className="flex items-center gap-3">
                  <div className="bg-[#12302F] border border-[#F1E8D6]/20 px-4 py-3 rounded-lg text-center min-w-[70px]">
                    <span className="font-mono text-3xl sm:text-4xl text-[#F4B183] font-bold block tabular-nums">
                      {countdown.hours}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#F1E8D6]/60">Hours</span>
                  </div>
                  <span className="text-2xl text-[#F4B183] font-bold">:</span>
                  <div className="bg-[#12302F] border border-[#F1E8D6]/20 px-4 py-3 rounded-lg text-center min-w-[70px]">
                    <span className="font-mono text-3xl sm:text-4xl text-[#F4B183] font-bold block tabular-nums">
                      {countdown.minutes}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#F1E8D6]/60">Mins</span>
                  </div>
                  <span className="text-2xl text-[#F4B183] font-bold">:</span>
                  <div className="bg-[#12302F] border border-[#F1E8D6]/20 px-4 py-3 rounded-lg text-center min-w-[70px]">
                    <span className="font-mono text-3xl sm:text-4xl text-[#F4B183] font-bold block tabular-nums">
                      {countdown.seconds}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#F1E8D6]/60">Secs</span>
                  </div>
                </div>
              </div>
            )}

            {nextReminder && (
              <button
                type="button"
                onClick={() => onToggleTaken(nextReminder.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F4B183] hover:bg-[#f6c29d] text-[#12302F] px-8 py-3.5 font-bold text-sm tracking-widest uppercase transition-all shadow-md active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                Mark Next Dose As Taken
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Header for Full Day's Schedule with "Add Medicine" button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-heading text-2xl text-[#F1E8D6]">
            Today&apos;s Medication Schedule
          </h3>
          <p className="text-xs text-[#F1E8D6]/70 mt-0.5">
            Click any tablet to mark taken or undo. Caregivers receive instant sync.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 border border-[#F4B183] text-[#F4B183] hover:bg-[#F4B183] hover:text-[#12302F] px-4 py-2 text-xs tracking-wider uppercase font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Medicine Reminder
        </button>
      </div>

      {/* Medication Cards List */}
      <div className="space-y-4">
        {reminders.map((med) => (
          <div
            key={med.id}
            className={`p-5 border rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              med.takenToday
                ? 'bg-[#163938]/30 border-[#F1E8D6]/10 opacity-75'
                : 'bg-[#163938]/60 border-[#F1E8D6]/20 hover:border-[#F4B183]/50'
            }`}
          >
            <div className="flex items-start gap-4">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                  med.takenToday
                    ? 'border-[#F4B183] bg-[#F4B183]/20 text-[#F4B183]'
                    : 'border-[#F1E8D6]/30 bg-[#12302F] text-[#F1E8D6]'
                }`}
              >
                <Pill className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h4 className={`text-xl font-heading font-medium ${med.takenToday ? 'line-through text-[#F1E8D6]/60' : 'text-[#F1E8D6]'}`}>
                    {med.name}
                  </h4>
                  <span className="text-xs uppercase tracking-wider px-2 py-0.5 border border-[#F1E8D6]/20 bg-[#12302F] text-[#F4B183]">
                    {med.dose}
                  </span>
                </div>

                <p className="text-sm text-[#F1E8D6]/75 mt-1 font-light">
                  {med.instructions}
                </p>

                <div className="flex items-center gap-3 mt-2 text-xs text-[#F1E8D6]/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#F4B183]" />
                    {med.time} ({med.timeSlot})
                  </span>
                  <span>·</span>
                  <span className="uppercase text-[11px] text-[#F4B183]">
                    Via {med.mode === 'call' ? 'Phone Call' : 'SMS'}
                  </span>
                  {med.takenToday && med.takenAt && (
                    <>
                      <span>·</span>
                      <span className="text-[#F4B183] font-semibold">
                        Recorded taken at {med.takenAt}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="shrink-0 flex sm:flex-col items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => onToggleTaken(med.id)}
                className={`w-full sm:w-auto px-5 py-2.5 text-xs tracking-wider uppercase font-bold border transition-colors flex items-center justify-center gap-2 ${
                  med.takenToday
                    ? 'border-[#F1E8D6]/30 text-[#F1E8D6]/70 hover:border-[#F4B183] hover:text-[#F4B183]'
                    : 'border-[#F4B183] bg-[#F4B183] text-[#12302F] hover:bg-[#f6c29d]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {med.takenToday ? 'Taken (Undo)' : 'Mark Taken'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-6 sm:p-8 rounded-xl max-w-lg w-full space-y-5 text-[#F1E8D6] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-3">
              <h3 className="font-heading text-2xl text-[#F4B183]">
                Add Medication Routine
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl px-2"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMedicine} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                  Medicine Name
                </label>
                <input
                  type="text"
                  required
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Metformin 500mg, EcoSprin 75mg"
                  className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    placeholder="e.g. 1 Tablet / 5ml"
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-sm text-[#F1E8D6] focus:border-[#F4B183]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                  Day Time Slot
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Morning', 'Afternoon', 'Evening', 'Night'] as const).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewMedSlot(slot)}
                      className={`py-2 text-xs uppercase font-medium border text-center transition-colors ${
                        newMedSlot === slot
                          ? 'border-[#F4B183] bg-[#F4B183] text-[#12302F] font-bold'
                          : 'border-[#F1E8D6]/20 bg-[#163938] text-[#F1E8D6]/70'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                  Instructions for Elder
                </label>
                <input
                  type="text"
                  value={newMedInstructions}
                  onChange={(e) => setNewMedInstructions(e.target.value)}
                  placeholder="e.g. After meal with warm water, avoid milk"
                  className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E8D6]/15">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#F1E8D6]/30 text-xs tracking-wider uppercase text-[#F1E8D6]/70 hover:text-[#F1E8D6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d]"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
