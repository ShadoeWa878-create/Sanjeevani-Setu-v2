import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, CheckCircle2 } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SosModal({ isOpen, onClose }: SosModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && countdown > 0 && !isTriggered) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsTriggered(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, countdown, isTriggered]);

  const handleCancel = () => {
    setCountdown(5);
    setIsTriggered(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="bg-[#12302F] border-2 border-red-500/80 p-6 sm:p-10 rounded-2xl max-w-md w-full space-y-6 text-[#F1E8D6] shadow-2xl text-center">
        
        {!isTriggered ? (
          <>
            <div className="w-20 h-20 rounded-full bg-red-950/60 border-2 border-red-500 mx-auto flex items-center justify-center text-red-400 animate-pulse">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-red-400 font-bold block mb-1">
                Emergency Alert Initiated
              </span>
              <h3 className="font-heading text-3xl text-[#F1E8D6]">
                Broadcasting SOS in {countdown}s
              </h3>
              <p className="text-sm text-[#F1E8D6]/80 mt-2 leading-relaxed">
                Will alert trusted family caregivers (Priya &amp; Rahul) and send live GPS coordinates to emergency services.
              </p>
            </div>

            <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-lg">
              <span className="text-xs text-red-300 block mb-1">
                Elder Dignity Safe-Guard:
              </span>
              <p className="text-xs text-[#F1E8D6]/70">
                Accidental press? Tap Cancel below immediately without notifying family.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-4 bg-[#F1E8D6] text-[#12302F] font-bold text-sm tracking-widest uppercase hover:bg-white transition-all shadow-lg active:scale-95"
              >
                Cancel SOS Alert ({countdown}s)
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-[#163938] border-2 border-[#F4B183] mx-auto flex items-center justify-center text-[#F4B183]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#F4B183] font-bold block mb-1">
                Family &amp; Services Notified
              </span>
              <h3 className="font-heading text-3xl text-[#F1E8D6]">
                SOS Broadcast Live
              </h3>
              <p className="text-sm text-[#F1E8D6]/80 mt-2 leading-relaxed">
                Emergency automated call dispatched to Priya (+91 98111 22334). Nearby emergency response center on standby.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-3 border border-[#F4B183] text-[#F4B183] font-bold text-xs tracking-widest uppercase hover:bg-[#F4B183] hover:text-[#12302F] transition-colors"
              >
                Dismiss Screen
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
