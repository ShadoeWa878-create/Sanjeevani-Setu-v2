import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Pill,
  RefreshCw,
  Calendar,
  Volume2,
  VolumeX,
  Sparkles,
  Eye,
  Sliders,
  Check
} from 'lucide-react';
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
  const [newMedPillColor, setNewMedPillColor] = useState('White Round Tablet');

  // Web Speech API state (Free Built-in Browser Voice API)
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.85); // 0.85x is gentle and clear for older adults
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  // Stop any active audio when unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Free Web Speech API playback function
  const handlePlayAudio = (med: MedicineReminder) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechNotice('Text-to-speech is not supported on this browser.');
      setTimeout(() => setSpeechNotice(null), 4000);
      return;
    }

    // If already playing this reminder, stop it
    if (playingId === med.id) {
      window.speechSynthesis.cancel();
      setPlayingId(null);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();
    setPlayingId(med.id);

    // Formulate a very clear, respectful sentence for visually impaired users
    const speechScript = `Medication Reminder. ${med.name}. Prescribed dose: ${med.dose}. Instructions: ${med.instructions}. Scheduled for ${med.time}. Please remember to take it with water.`;

    const utterance = new SpeechSynthesisUtterance(speechScript);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Pick best available English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en-IN') || v.name.includes('Natural') || v.lang.startsWith('en-GB') || v.lang.startsWith('en-US'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setPlayingId(null);
    };

    utterance.onerror = () => {
      setPlayingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

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
      takenToday: false,
      pillColor: newMedPillColor,
      remainingPills: 30
    });

    setNewMedName('');
    setNewMedDose('');
    setShowAddModal(false);
  };

  return (
    <section id="medicine-timer" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-b border-[#F1E8D6]/10 scroll-mt-12">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Care Routine Clock</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl text-[#F1E8D6] mb-4 sm:mb-5 font-normal">
          Medicine <em className="italic text-[#F4B183]">Clock &amp; Timer</em>
        </h2>
        <p className="text-sm sm:text-lg font-light text-[#F1E8D6]/80 leading-relaxed">
          Never second-guess whether a dose was taken. A live countdown, accessible spoken audio for vision impairment, and one-tap confirmation keep seniors safe.
        </p>
      </div>

      {/* Speech Notice Alert */}
      {speechNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-900/60 border border-[#F4B183] text-[#F1E8D6] text-xs sm:text-sm flex items-center gap-3 animate-fade-in shadow-lg">
          <AlertCircle className="w-5 h-5 text-[#F4B183] shrink-0" />
          <span>{speechNotice}</span>
        </div>
      )}

      {/* Hero Countdown Banner */}
      <div className="bg-[#163938]/70 border-2 border-[#F4B183]/30 p-5 sm:p-10 rounded-2xl mb-8 sm:mb-12 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">

          {/* Left: Next Dose Details */}
          <div className="text-center md:text-left space-y-2.5 sm:space-y-3 w-full md:w-auto">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 bg-[#12302F] border border-[#F4B183]/40 text-[10px] sm:text-xs uppercase tracking-wider text-[#F4B183] rounded">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Next Upcoming Medication</span>
            </div>

            {nextReminder ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <h3 className="font-heading text-2xl sm:text-4xl text-[#F1E8D6] break-words">
                    {nextReminder.name}
                  </h3>

                  {/* Accessible Hero Play Audio Button */}
                  <button
                    type="button"
                    onClick={() => handlePlayAudio(nextReminder)}
                    aria-label={`Play audio description for ${nextReminder.name}`}
                    title="Read reminder aloud using free browser text-to-speech"
                    className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md self-center sm:self-auto ${
                      playingId === nextReminder.id
                        ? 'bg-[#F4B183] text-[#12302F] ring-2 ring-amber-300 animate-pulse'
                        : 'bg-[#12302F] hover:bg-[#1a4442] text-[#F4B183] border border-[#F4B183]/50'
                    }`}
                  >
                    {playingId === nextReminder.id ? (
                      <>
                        <VolumeX className="w-4 h-4 text-[#12302F]" />
                        <span>Stop Audio</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#F4B183]" />
                        <span>Play Audio</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm sm:text-lg text-[#F1E8D6]/80 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
                  <span className="font-semibold text-[#F4B183]">{nextReminder.dose}</span>
                  <span>·</span>
                  <span>{nextReminder.instructions}</span>
                </p>

                {/* Pill Identifier & Time */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-[#F1E8D6]/70">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#12302F] border border-[#F1E8D6]/15 text-[#F4B183]">
                    <Pill className="w-3.5 h-3.5" />
                    <span>{nextReminder.pillColor || 'Round Tablet'}</span>
                  </span>
                  <span>·</span>
                  <span>
                    Scheduled for <strong className="text-[#F4B183]">{nextReminder.time}</strong> ({nextReminder.timeSlot})
                  </span>
                </div>
              </>
            ) : (
              <div>
                <h3 className="font-heading text-2xl sm:text-3xl text-[#F4B183]">
                  All Doses Taken For Today!
                </h3>
                <p className="text-xs sm:text-sm text-[#F1E8D6]/80 mt-1">
                  Wonderful job adhering to the routine. Tomorrow&apos;s schedule will resume at 8:00 AM.
                </p>
              </div>
            )}
          </div>

          {/* Right: Digital Countdown Display & Mark as Taken */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 w-full md:w-auto shrink-0">
            {nextReminder && (
              <div className="text-center w-full">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#F1E8D6]/60 block mb-2 font-semibold">
                  Time Remaining Until Dose
                </span>
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <div className="bg-[#12302F] border border-[#F1E8D6]/20 px-2.5 sm:px-4 py-2 sm:py-3 rounded-lg text-center min-w-[56px] sm:min-w-[70px]">
                    <span className="font-mono text-2xl sm:text-4xl text-[#F4B183] font-bold block tabular-nums">
                      {countdown.hours}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#F1E8D6]/60">Hours</span>
                  </div>
                  <span className="text-xl sm:text-2xl text-[#F4B183] font-bold">:</span>
                  <div className="bg-[#12302F] border border-[#F1E8D6]/20 px-2.5 sm:px-4 py-2 sm:py-3 rounded-lg text-center min-w-[56px] sm:min-w-[70px]">
                    <span className="font-mono text-2xl sm:text-4xl text-[#F4B183] font-bold block tabular-nums">
                      {countdown.minutes}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#F1E8D6]/60">Mins</span>
                  </div>
                  <span className="text-xl sm:text-2xl text-[#F4B183] font-bold">:</span>
                  <div className="bg-[#12302F] border border-[#F1E8D6]/20 px-2.5 sm:px-4 py-2 sm:py-3 rounded-lg text-center min-w-[56px] sm:min-w-[70px]">
                    <span className="font-mono text-2xl sm:text-4xl text-[#F4B183] font-bold block tabular-nums">
                      {countdown.seconds}
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#F1E8D6]/60">Secs</span>
                  </div>
                </div>
              </div>
            )}

            {nextReminder && (
              <button
                type="button"
                onClick={() => onToggleTaken(nextReminder.id)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F4B183] hover:bg-[#f6c29d] text-[#12302F] px-6 sm:px-8 py-3 sm:py-3.5 font-bold text-xs sm:text-sm tracking-widest uppercase transition-all shadow-md active:scale-95 rounded"
              >
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                Mark Next Dose As Taken
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Voice Readability & Impairment Accessibility Bar */}
      <div className="bg-[#163938]/50 border border-[#F1E8D6]/15 rounded-xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#F1E8D6]/80 text-center sm:text-left">
          <Eye className="w-4 h-4 text-[#F4B183] shrink-0" />
          <span>
            <strong className="text-[#F4B183]">Vision Impairment Assistance:</strong> Tap <strong>Play Audio</strong> on any medicine to hear dosage and instructions spoken via free browser Web Speech.
          </span>
        </div>

        {/* Speech Speed Switcher */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] text-[#F1E8D6]/60">Voice Speed:</span>
          <button
            type="button"
            onClick={() => setSpeechRate(0.8)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              speechRate <= 0.85 ? 'bg-[#F4B183] text-[#12302F]' : 'bg-[#12302F] text-[#F1E8D6]/70'
            }`}
          >
            Gentle Slow (0.8x)
          </button>
          <button
            type="button"
            onClick={() => setSpeechRate(1.0)}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              speechRate === 1.0 ? 'bg-[#F4B183] text-[#12302F]' : 'bg-[#12302F] text-[#F1E8D6]/70'
            }`}
          >
            Normal (1.0x)
          </button>
        </div>
      </div>

      {/* Header for Full Day's Schedule with "Add Medicine" button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6">
        <div>
          <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6]">
            Today&apos;s Medication Schedule
          </h3>
          <p className="text-xs text-[#F1E8D6]/70 mt-0.5">
            Click any tablet to mark taken or undo. Each routine includes spoken audio assistance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#F4B183] text-[#F4B183] hover:bg-[#F4B183] hover:text-[#12302F] px-4 py-2 text-xs tracking-wider uppercase font-semibold transition-colors rounded"
        >
          <Plus className="w-4 h-4" />
          Add Medicine Reminder
        </button>
      </div>

      {/* Medication Cards List */}
      <div className="space-y-3 sm:space-y-4">
        {reminders.map((med) => {
          const isPlayingThis = playingId === med.id;
          return (
            <div
              key={med.id}
              className={`p-4 sm:p-5 border rounded-xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                med.takenToday
                  ? 'bg-[#163938]/30 border-[#F1E8D6]/10 opacity-75'
                  : 'bg-[#163938]/60 border-[#F1E8D6]/20 hover:border-[#F4B183]/50'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border ${
                    med.takenToday
                      ? 'border-[#F4B183] bg-[#F4B183]/20 text-[#F4B183]'
                      : 'border-[#F1E8D6]/30 bg-[#12302F] text-[#F1E8D6]'
                  }`}
                >
                  <Pill className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-lg sm:text-xl font-heading font-medium truncate ${med.takenToday ? 'line-through text-[#F1E8D6]/60' : 'text-[#F1E8D6]'}`}>
                      {med.name}
                    </h4>
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider px-2 py-0.5 border border-[#F1E8D6]/20 bg-[#12302F] text-[#F4B183] rounded">
                      {med.dose}
                    </span>

                    {/* Prominent Play Audio Button next to medicine name */}
                    <button
                      type="button"
                      onClick={() => handlePlayAudio(med)}
                      aria-label={`Play spoken audio for ${med.name}`}
                      title="Play spoken reminder using free Web Speech API"
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold transition-all border ${
                        isPlayingThis
                          ? 'bg-[#F4B183] text-[#12302F] border-[#F4B183] font-bold shadow-md animate-pulse'
                          : 'bg-[#12302F] text-[#F4B183] border-[#F4B183]/40 hover:bg-[#1a4442]'
                      }`}
                    >
                      {isPlayingThis ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Play Audio</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#F1E8D6]/75 mt-1 font-light">
                    {med.instructions}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs text-[#F1E8D6]/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#F4B183]" />
                      {med.time} ({med.timeSlot})
                    </span>
                    <span>·</span>
                    <span className="uppercase text-[10px] sm:text-[11px] text-[#F4B183]">
                      Via {med.mode === 'call' ? 'Phone Call' : 'SMS'}
                    </span>
                    {med.pillColor && (
                      <>
                        <span>·</span>
                        <span className="text-[11px] text-[#F1E8D6]/70 flex items-center gap-1">
                          <Eye className="w-3 h-3 text-[#F4B183]" />
                          {med.pillColor}
                        </span>
                      </>
                    )}
                    {med.takenToday && med.takenAt && (
                      <>
                        <span>·</span>
                        <span className="text-[#F4B183] font-semibold text-[11px]">
                          Recorded taken at {med.takenAt}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button: Mark Taken */}
              <div className="shrink-0 flex items-center justify-end pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => onToggleTaken(med.id)}
                  className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 text-xs tracking-wider uppercase font-bold border transition-colors flex items-center justify-center gap-2 rounded active:scale-95 ${
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
          );
        })}
      </div>

      {/* Modal: Add New Medicine Reminder */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-5 sm:p-8 rounded-2xl max-w-lg w-full space-y-5 text-[#F1E8D6] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1E8D6]/10">
              <h3 className="font-heading text-xl sm:text-2xl text-[#F4B183]">
                Add Medication Routine
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMedicine} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1.5 font-semibold">
                  Medicine Name &amp; Strength *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Telmisartan 40mg, Thyronorm 50mcg"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full bg-[#163938] border border-[#F1E8D6]/20 p-2.5 sm:p-3 rounded text-[#F1E8D6] placeholder-[#F1E8D6]/40 focus:border-[#F4B183] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1.5 font-semibold">
                    Dose Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1 Tablet, 5ml Syrup"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    className="w-full bg-[#163938] border border-[#F1E8D6]/20 p-2.5 sm:p-3 rounded text-[#F1E8D6] placeholder-[#F1E8D6]/40 focus:border-[#F4B183] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1.5 font-semibold">
                    Scheduled Time (24h)
                  </label>
                  <input
                    type="time"
                    required
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="w-full bg-[#163938] border border-[#F1E8D6]/20 p-2.5 sm:p-3 rounded text-[#F1E8D6] focus:border-[#F4B183] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1.5 font-semibold">
                  Visual Pill Shape / Color (For Low Vision Identification)
                </label>
                <select
                  value={newMedPillColor}
                  onChange={(e) => setNewMedPillColor(e.target.value)}
                  className="w-full bg-[#163938] border border-[#F1E8D6]/20 p-2.5 sm:p-3 rounded text-[#F1E8D6] focus:border-[#F4B183] focus:outline-none"
                >
                  <option value="White Round Tablet">⚪ White Round Tablet</option>
                  <option value="Yellow Oval Tablet">🟡 Yellow Oval Tablet</option>
                  <option value="Red / Orange Softgel">🔴 Red / Orange Softgel</option>
                  <option value="Blue Capsule">🔵 Blue Capsule</option>
                  <option value="Green Film-Coated">🟢 Green Film-Coated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1.5 font-semibold">
                  Time Slot
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Morning', 'Afternoon', 'Evening', 'Night'] as const).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewMedSlot(slot)}
                      className={`py-2 px-2 text-xs font-semibold rounded border transition-colors ${
                        newMedSlot === slot
                          ? 'border-[#F4B183] bg-[#F4B183] text-[#12302F]'
                          : 'border-[#F1E8D6]/20 bg-[#163938] text-[#F1E8D6]/80'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1.5 font-semibold">
                  Instructions / Food Advice
                </label>
                <input
                  type="text"
                  placeholder="e.g., After breakfast with lukewarm water"
                  value={newMedInstructions}
                  onChange={(e) => setNewMedInstructions(e.target.value)}
                  className="w-full bg-[#163938] border border-[#F1E8D6]/20 p-2.5 sm:p-3 rounded text-[#F1E8D6] placeholder-[#F1E8D6]/40 focus:border-[#F4B183] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1E8D6]/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#F1E8D6]/30 text-xs tracking-wider uppercase text-[#F1E8D6]/70 hover:text-[#F1E8D6] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d] transition-colors rounded shadow"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
