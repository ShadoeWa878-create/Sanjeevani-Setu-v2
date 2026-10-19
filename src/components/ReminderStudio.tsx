import React, { useState } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Volume2,
  VolumeX,
  Send,
  CheckCircle2,
  Edit3,
  Clock,
  RotateCcw,
  Sparkles,
  Phone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { MedicineReminder, DeliveryMode } from '../types';

interface ReminderStudioProps {
  reminders: MedicineReminder[];
  onUpdateReminder: (updated: MedicineReminder) => void;
}

export function ReminderStudio({ reminders, onUpdateReminder }: ReminderStudioProps) {
  const [selectedReminderId, setSelectedReminderId] = useState<string>(reminders[0]?.id || '');
  const currentReminder = reminders.find(r => r.id === selectedReminderId) || reminders[0];

  const [mode, setMode] = useState<DeliveryMode>(currentReminder ? currentReminder.mode : 'call');
  const [script, setScript] = useState<string>(currentReminder ? currentReminder.customScript : '');
  const [sms, setSms] = useState<string>(currentReminder ? currentReminder.customSms : '');
  const [time, setTime] = useState<string>(currentReminder ? currentReminder.time : '08:00');
  const [elderPhone, setElderPhone] = useState<string>('98000 00000');

  // Speech Synthesis & Simulation State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [testSent, setTestSent] = useState<boolean>(false);
  const [isRinging, setIsRinging] = useState<boolean>(false);
  const [speechWarning, setSpeechWarning] = useState<string | null>(null);

  // Sync state when selecting a different reminder
  const handleSelectReminder = (rem: MedicineReminder) => {
    setSelectedReminderId(rem.id);
    setMode(rem.mode);
    setScript(rem.customScript);
    setSms(rem.customSms);
    setTime(rem.time);
    setIsSpeaking(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // Web Speech API Voice Preview
  const handleToggleVoicePlayback = () => {
    if (!('speechSynthesis' in window)) {
      setSpeechWarning("Browser speech synthesis is not supported in this browser environment. Visual simulation is active.");
      setTimeout(() => setSpeechWarning(null), 4000);
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.rate = 0.88; // Gentle measured speech for elders
    utterance.pitch = 1.0;
    utterance.lang = 'en-IN';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSaveReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentReminder) return;

    onUpdateReminder({
      ...currentReminder,
      mode,
      time,
      customScript: script,
      customSms: sms
    });

    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  const handleTriggerSimulatedSend = () => {
    setIsRinging(true);
    if (mode === 'call') {
      handleToggleVoicePlayback();
    }
    setTimeout(() => {
      setIsRinging(false);
    }, 7000);
  };

  const handleResetToDefault = () => {
    if (!currentReminder) return;
    const defaultScript = `Namaste. This is Sanjeevani Setu. It is ${time}, time for your ${currentReminder.name}. ${currentReminder.instructions}. Press 1 once taken.`;
    const defaultSms = `⏰ Sanjeevani Setu Reminder: It is time for your ${currentReminder.name} (${currentReminder.dose}). ${currentReminder.instructions}.`;
    setScript(defaultScript);
    setSms(defaultSms);
  };

  return (
    <section id="reminder-studio" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-b border-[#F1E8D6]/10 scroll-mt-12">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Caregiver Voice &amp; Message Studio</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl text-[#F1E8D6] mb-4 sm:mb-5 font-normal">
          Customize &amp; Test <em className="italic text-[#F4B183]">Reminders</em>
        </h2>
        <p className="text-sm sm:text-lg font-light text-[#F1E8D6]/80 leading-relaxed">
          Craft personal, reassuring voice prompts and clear text messages in the elder&apos;s mother tongue. Listen to the voice live or run a safe local simulation.
        </p>
      </div>

      {speechWarning && (
        <div className="mb-6 p-4 bg-[#163938] border border-amber-400 text-amber-200 text-xs sm:text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{speechWarning}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

        {/* LEFT COLUMN: Routine Selector & Script Editor */}
        <div className="lg:col-span-7 bg-[#163938]/60 border border-[#F1E8D6]/15 p-5 sm:p-8 rounded-xl space-y-5 sm:space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F4B183] font-semibold mb-2">
              1. Choose Medication Routine to Customize
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {reminders.map((rem) => (
                <button
                  key={rem.id}
                  type="button"
                  onClick={() => handleSelectReminder(rem)}
                  className={`p-2.5 sm:p-3 text-left border rounded transition-colors text-xs ${
                    selectedReminderId === rem.id
                      ? 'border-[#F4B183] bg-[#F4B183] text-[#12302F] font-bold'
                      : 'border-[#F1E8D6]/20 bg-[#12302F] text-[#F1E8D6]/70 hover:border-[#F1E8D6]/40'
                  }`}
                >
                  <span className="truncate block font-semibold">{rem.name}</span>
                  <span className="text-[10px] opacity-80 block mt-0.5">{rem.time}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#F4B183] font-semibold mb-2">
              2. Reminder Channel
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3" role="radiogroup">
              <button
                type="button"
                onClick={() => setMode('call')}
                className={`flex items-center gap-2 p-2.5 sm:p-3 border rounded transition-colors ${
                  mode === 'call'
                    ? 'border-[#F4B183] bg-[#F4B183]/15 text-[#F1E8D6] font-semibold'
                    : 'border-[#F1E8D6]/20 bg-[#12302F] text-[#F1E8D6]/70'
                }`}
              >
                <PhoneCall className={`w-4 h-4 shrink-0 ${mode === 'call' ? 'text-[#F4B183]' : 'text-[#F1E8D6]/60'}`} />
                <span className="text-xs uppercase tracking-wider">Spoken Voice Call</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('sms');
                  if (isSpeaking && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                }}
                className={`flex items-center gap-2 p-2.5 sm:p-3 border rounded transition-colors ${
                  mode === 'sms'
                    ? 'border-[#F4B183] bg-[#F4B183]/15 text-[#F1E8D6] font-semibold'
                    : 'border-[#F1E8D6]/20 bg-[#12302F] text-[#F1E8D6]/70'
                }`}
              >
                <MessageSquare className={`w-4 h-4 shrink-0 ${mode === 'sms' ? 'text-[#F4B183]' : 'text-[#F1E8D6]/60'}`} />
                <span className="text-xs uppercase tracking-wider">Plain Text SMS</span>
              </button>
            </div>
          </div>

          {/* Script / Text Editor Form */}
          <form onSubmit={handleSaveReminder} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                  Recipient Phone (Demo Number)
                </label>
                <input
                  type="text"
                  value={elderPhone}
                  onChange={(e) => setElderPhone(e.target.value)}
                  className="w-full bg-[#12302F] border border-[#F1E8D6]/30 px-3 py-2 text-xs sm:text-sm text-[#F1E8D6] focus:border-[#F4B183] rounded"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                  Scheduled Time
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#12302F] border border-[#F1E8D6]/30 px-3 py-2 text-xs sm:text-sm text-[#F1E8D6] focus:border-[#F4B183] rounded"
                />
              </div>
            </div>

            {mode === 'call' ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs uppercase tracking-wider text-[#F1E8D6]/80">
                    Spoken Call Voice Script
                  </label>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[11px] text-[#F4B183] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="w-full bg-[#12302F] border border-[#F1E8D6]/30 p-2.5 sm:p-3 text-xs sm:text-sm text-[#F1E8D6] font-serif leading-relaxed focus:border-[#F4B183] rounded"
                />
                <p className="text-[11px] text-[#F1E8D6]/60 mt-1">
                  Elder will hear this exact message read aloud in a gentle tone when they pick up.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs uppercase tracking-wider text-[#F1E8D6]/80">
                    SMS Message Text
                  </label>
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="text-[11px] text-[#F4B183] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={sms}
                  onChange={(e) => setSms(e.target.value)}
                  className="w-full bg-[#12302F] border border-[#F1E8D6]/30 p-2.5 sm:p-3 text-xs sm:text-sm text-[#F1E8D6] font-sans leading-relaxed focus:border-[#F4B183] rounded"
                />
                <p className="text-[11px] text-[#F1E8D6]/60 mt-1">
                  Sent as standard SMS text. Visible on basic feature phones without Internet.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-[#F4B183] text-[#12302F] py-2.5 sm:py-3 px-5 sm:px-6 font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d] transition-colors rounded"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Custom Routine
              </button>

              <button
                type="button"
                onClick={handleTriggerSimulatedSend}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#F1E8D6]/30 hover:border-[#F4B183] text-[#F1E8D6] py-2.5 sm:py-3 px-5 sm:px-6 text-xs tracking-wider uppercase font-semibold transition-colors rounded"
              >
                <Send className="w-3.5 h-3.5 text-[#F4B183]" />
                Test Send Alert
              </button>
            </div>

            {testSent && (
              <div className="p-3 bg-[#12302F] border border-[#F4B183] rounded text-xs text-[#F1E8D6] flex items-center gap-2" role="status">
                <CheckCircle2 className="w-4 h-4 text-[#F4B183] shrink-0" />
                <span>
                  Reminder saved for {time}. Previewing voice synthesis and on-screen message below.
                </span>
              </div>
            )}
          </form>
        </div>

        {/* RIGHT COLUMN: Live Audio & Simulator Screen */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between text-xs text-[#F1E8D6]/60 px-1">
            <span className="uppercase tracking-widest font-semibold text-[#F4B183]">
              Live Simulation
            </span>
            <span className="text-[11px]">Receiver: +91 {elderPhone}</span>
          </div>

          <div className="bg-[#0e2726] border-2 border-[#F1E8D6]/20 rounded-xl p-4 sm:p-6 shadow-2xl relative min-h-[340px] sm:min-h-[380px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#F1E8D6]/50 border-b border-[#F1E8D6]/10 pb-2 font-mono">
              <span>{mode === 'call' ? 'INCOMING TELEPHONE CALL' : 'INCOMING SMS MESSAGE'}</span>
              <span>{time}</span>
            </div>

            <div className="py-4 sm:py-6 text-center space-y-3 sm:space-y-4">
              {mode === 'call' ? (
                <>
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto flex items-center justify-center border-2 border-[#F4B183] ${
                    isRinging ? 'animate-bounce bg-[#F4B183]/20' : 'bg-[#12302F]'
                  }`}>
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-[#F4B183]" />
                  </div>

                  <div>
                    <h4 className="font-heading text-xl sm:text-2xl text-[#F1E8D6]">
                      Sanjeevani Care Line
                    </h4>
                    <p className="text-[11px] sm:text-xs uppercase tracking-widest text-[#F4B183] mt-0.5">
                      {isRinging ? 'Call in Progress...' : 'Automated Elder Reminder'}
                    </p>
                  </div>

                  <div className="bg-[#12302F] border border-[#F1E8D6]/15 p-3 sm:p-4 rounded text-left">
                    <span className="text-[10px] uppercase tracking-wider text-[#F4B183] block mb-1">
                      Spoken Speech Preview:
                    </span>
                    <p className="font-serif text-xs sm:text-sm italic text-[#F1E8D6] leading-relaxed">
                      &ldquo;{script}&rdquo;
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleVoicePlayback}
                    className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-all rounded ${
                      isSpeaking
                        ? 'bg-[#F4B183] text-[#12302F] border-[#F4B183]'
                        : 'border-[#F4B183] text-[#F4B183] hover:bg-[#F4B183]/15'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        Stop Voice Audio
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Listen to Voice Demo
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="space-y-3 sm:space-y-4 text-left">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#12302F] border border-[#F4B183] flex items-center justify-center text-[#F4B183] shrink-0">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-[#F1E8D6] block">
                        SANJEEVANI-REMIND
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#F1E8D6]/50">Priority SMS Service</span>
                    </div>
                  </div>

                  <div className="bg-[#12302F] border-2 border-[#F1E8D6]/25 p-3.5 sm:p-4 rounded-lg space-y-2">
                    <p className="text-xs sm:text-sm text-[#F1E8D6] leading-relaxed font-sans">
                      {sms}
                    </p>
                    <div className="pt-2 border-t border-[#F1E8D6]/10 flex items-center justify-between text-[10px] sm:text-[11px] text-[#F1E8D6]/60">
                      <span>Simulated locally</span>
                      <span className="text-[#F4B183] font-mono">100% Offline Compatible</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#F1E8D6]/10 pt-2 text-center text-[10px] sm:text-[11px] text-[#F1E8D6]/50">
              Zero internet or app download required by elder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
