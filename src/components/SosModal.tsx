import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X, CheckCircle2, MapPin, Send, Phone } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  isElderlyMode?: boolean;
}

export function SosModal({ isOpen, onClose, isElderlyMode = false }: SosModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [isTriggered, setIsTriggered] = useState(false);
  const [called108, setCalled108] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && countdown > 0 && !isTriggered) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsTriggered(true);
            setSmsSent(true);
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
    setCalled108(false);
    setSmsSent(false);
    onClose();
  };

  const handleCall108 = () => {
    setCalled108(true);
    window.location.href = 'tel:108';
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="bg-[#12302F] border-2 border-red-500 p-5 sm:p-8 rounded-2xl max-w-md w-[92vw] sm:w-full space-y-4 sm:space-y-5 text-[#F1E8D6] shadow-2xl text-center">

        {!isTriggered ? (
          <>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-950/70 border-2 border-red-500 mx-auto flex items-center justify-center text-red-400 animate-pulse">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-red-400 font-bold block mb-1">
                {isElderlyMode ? 'आपातकालीन अलर्ट सक्रिय' : 'Emergency Alert Initiated'}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl text-white">
                {isElderlyMode
                  ? `SOS संदेश भेजा जा रहा है (${countdown}s)`
                  : `Broadcasting SOS in ${countdown}s`}
              </h3>
              <p className="text-xs sm:text-sm text-[#F1E8D6]/85 mt-2 leading-relaxed">
                {isElderlyMode
                  ? 'तुरंत 108 एम्बुलेंस और परिवार (प्रिया व राहुल) को आपकी लोकेशन के साथ अलर्ट जाएगा।'
                  : 'Dispatching alert to 108 Ambulance and notifying emergency caregivers (Priya & Rahul).'}
              </p>
            </div>

            <div className="bg-red-950/40 border border-red-500/30 p-3 sm:p-4 rounded-xl text-left">
              <span className="text-xs text-red-300 font-bold block mb-1">
                {isElderlyMode ? 'गलती से दब गया?' : 'Elder Dignity Guard:'}
              </span>
              <p className="text-xs text-[#F1E8D6]/75">
                {isElderlyMode
                  ? 'अगर यह बटन गलती से दब गया है, तो नीचे दिए गए बटन को तुरंत दबाएं।'
                  : 'Accidental press? Tap Cancel below immediately within the countdown.'}
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-4 bg-[#fef3c7] text-[#065f46] font-extrabold text-sm tracking-wider uppercase hover:bg-white transition-all shadow-lg active:scale-95 rounded-xl min-h-[52px]"
              >
                {isElderlyMode ? `रद्द करें / Cancel SOS (${countdown}s)` : `Cancel SOS Alert (${countdown}s)`}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-400 mx-auto flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                {isElderlyMode ? 'अलर्ट सफलतापूर्वक प्रेषित' : 'Emergency Alert Dispatched'}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl text-white">
                {isElderlyMode ? 'परिवार को सूचना दी गई' : 'Caregivers Notified'}
              </h3>
              <p className="text-xs sm:text-sm text-[#F1E8D6]/85 mt-2 leading-relaxed">
                {isElderlyMode
                  ? 'प्रिया (+91 98765 43210) और राहुल को आपातकालीन संदेश व स्थान भेज दिया गया है।'
                  : 'Automated urgent alert dispatched to registered caregivers (Priya & Rahul) with live GPS location.'}
              </p>
            </div>

            {/* Direct 108 Ambulance Call Action */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleCall108}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide uppercase rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform min-h-[52px]"
              >
                <Phone className="w-5 h-5" />
                <span>{isElderlyMode ? '108 एम्बुलेंस को कॉल करें' : 'Call 108 Ambulance Now'}</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full py-3 border border-[#F1E8D6]/30 text-[#F1E8D6] font-semibold text-xs tracking-wider uppercase hover:bg-[#163938] transition-colors rounded-xl min-h-[48px]"
              >
                {isElderlyMode ? 'बंद करें / Dismiss' : 'Dismiss Alert'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
