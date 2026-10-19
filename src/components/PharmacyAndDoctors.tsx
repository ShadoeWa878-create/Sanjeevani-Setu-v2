import React, { useState } from 'react';
import {
  Phone,
  MapPin,
  ShoppingBag,
  UserCheck,
  Clock,
  Send,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Truck,
  FileText,
  ShieldCheck,
  X,
  Volume2,
  Copy,
  PhoneOff
} from 'lucide-react';
import { Doctor, Pharmacy } from '../types';

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ramesh K. Verma, MD',
    specialty: 'Senior Geriatric Specialist & Internal Medicine',
    clinic: 'Vasant Vihar Senior Health Center',
    distance: '0.8 km away',
    phone: '+91 1800 200 0101',
    consultationFee: '₹600',
    availableDays: 'Mon – Sat (10:00 AM – 2:00 PM)',
    nextSlot: 'Today at 11:30 AM'
  },
  {
    id: 'doc-2',
    name: 'Dr. Meera Nambiar, DM',
    specialty: 'Cardiologist & Hypertension Consultant',
    clinic: 'Heart & Elder Care Clinic',
    distance: '1.4 km away',
    phone: '+91 1800 200 0102',
    consultationFee: '₹800',
    availableDays: 'Tue, Thu, Sat (3:00 PM – 7:00 PM)',
    nextSlot: 'Tomorrow at 3:30 PM'
  },
  {
    id: 'doc-3',
    name: 'Dr. S. K. Gupta, MBBS',
    specialty: 'Family & General Physician (Home Visits Available)',
    clinic: 'Community Neighborhood Polyclinic',
    distance: '0.5 km away',
    phone: '+91 1800 200 0103',
    consultationFee: '₹400',
    availableDays: 'Daily (9:00 AM – 8:00 PM)',
    nextSlot: 'Available Now'
  }
];

const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: 'pharm-1',
    name: 'Apollo Pharmacy & Senior Supplies',
    address: 'Shop 4, Main Market, Green Park',
    distance: '0.4 km away',
    phone: '+91 1800 200 0201',
    whatsapp: '',
    deliveryTime: '30 – 45 mins',
    homeDelivery: true,
    openHours: '24 Hours Open'
  },
  {
    id: 'pharm-2',
    name: 'MedPlus Chemist & Diagnostic Store',
    address: 'Plot 12, Community Center, Block B',
    distance: '0.9 km away',
    phone: '+91 1800 200 0202',
    whatsapp: '',
    deliveryTime: '45 – 60 mins',
    homeDelivery: true,
    openHours: '8:00 AM – 11:00 PM'
  },
  {
    id: 'pharm-3',
    name: 'Sanjeevani Local Chemist & Ayurvedic Store',
    address: 'Near Old Post Office, Sector 3',
    distance: '1.2 km away',
    phone: '+91 1800 200 0203',
    whatsapp: '',
    deliveryTime: 'Within 2 hours',
    homeDelivery: true,
    openHours: '9:00 AM – 10:00 PM'
  }
];

export function PharmacyAndDoctors() {
  const [activeTab, setActiveTab] = useState<'pharmacy' | 'doctors'>('pharmacy');

  // Order Medicine State
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy>(MOCK_PHARMACIES[0]);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [medicineOrderText, setMedicineOrderText] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('Flat 204, Rosewood Apts, Sector 4');
  const [deliveryUrgency, setDeliveryUrgency] = useState<'urgent' | 'standard'>('standard');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Doctor Consultation Booking State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [consultType, setConsultType] = useState<'clinic' | 'home' | 'phone'>('home');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Safe In-App Simulation State (No External Messages or Calls Dispatched)
  const [simulatedWhatsApp, setSimulatedWhatsApp] = useState<{ name: string; text: string } | null>(null);
  const [simulatedCall, setSimulatedCall] = useState<{ name: string; phone: string; role: string } | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicineOrderText.trim()) return;

    setOrderConfirmed(true);
    setTimeout(() => {
      setOrderConfirmed(false);
      setShowOrderModal(false);
      setMedicineOrderText('');
    }, 3500);
  };

  const handleBookDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
    setTimeout(() => {
      setBookingConfirmed(false);
      setShowDocModal(false);
      setSelectedDoctor(null);
    }, 3500);
  };

  const handleOpenSimulatedWhatsApp = (pharmName: string) => {
    setSimulatedWhatsApp({
      name: pharmName,
      text: `Namaste, this is an elder care prescription refill request for ${pharmName} via Sanjeevani Setu.`
    });
  };

  const handleOpenSimulatedCall = (name: string, phone: string, role: string) => {
    setSimulatedCall({ name, phone, role });
  };

  return (
    <section id="pharmacy-care" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-b border-[#F1E8D6]/10 scroll-mt-12">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Neighborhood Support Grid</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl text-[#F1E8D6] mb-4 sm:mb-5 font-normal">
          Local Care &amp; <em className="italic text-[#F4B183]">Pharmacy</em>
        </h2>
        <p className="text-sm sm:text-lg font-light text-[#F1E8D6]/80 leading-relaxed">
          Order prescription refills from trusted chemists or schedule trusted geriatric doctors nearby. Designed with safe preview loops and doorstep delivery.
        </p>
      </div>

      {/* Segmented Switcher for Pharmacy vs Doctors */}
      <div className="flex justify-center mb-8 sm:mb-10 px-2">
        <div className="inline-flex w-full sm:w-auto p-1 bg-[#163938] border border-[#F1E8D6]/20 rounded-xl" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pharmacy'}
            onClick={() => setActiveTab('pharmacy')}
            className={`flex-1 sm:flex-initial px-3 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeTab === 'pharmacy'
                ? 'bg-[#F4B183] text-[#12302F] shadow-md'
                : 'text-[#F1E8D6]/70 hover:text-[#F1E8D6]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Local Chemists &amp; Meds</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'doctors'}
            onClick={() => setActiveTab('doctors')}
            className={`flex-1 sm:flex-initial px-3 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-xs uppercase tracking-wider font-bold transition-all rounded-lg flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeTab === 'doctors'
                ? 'bg-[#F4B183] text-[#12302F] shadow-md'
                : 'text-[#F1E8D6]/70 hover:text-[#F1E8D6]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Nearby Senior Doctors</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 1: PHARMACIES & MEDICINE ORDERING                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'pharmacy' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#F1E8D6]/70 pb-2 border-b border-[#F1E8D6]/10 gap-1">
            <span>Verified Neighborhood Pharmacies with Elder Doorstep Delivery</span>
            <span className="text-[#F4B183] font-semibold">Home Delivery Enabled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {MOCK_PHARMACIES.map((pharm) => (
              <div
                key={pharm.id}
                className="bg-[#163938]/60 border border-[#F1E8D6]/15 p-5 sm:p-6 rounded-xl flex flex-col justify-between hover:border-[#F4B183]/50 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[#12302F] border border-[#F4B183]/30 text-[#F4B183] font-semibold">
                      {pharm.distance}
                    </span>
                    <span className="text-xs text-[#F1E8D6]/60 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#F4B183]" />
                      {pharm.deliveryTime}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg sm:text-xl text-[#F1E8D6] mb-1">
                    {pharm.name}
                  </h3>
                  <p className="text-xs text-[#F1E8D6]/70 flex items-center gap-1.5 mb-3 font-light">
                    <MapPin className="w-3.5 h-3.5 text-[#F4B183] shrink-0" />
                    <span>{pharm.address}</span>
                  </p>
                  <p className="text-xs text-[#F1E8D6]/60 font-mono">
                    Hours: {pharm.openHours}
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-4 border-t border-[#F1E8D6]/10 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPharmacy(pharm);
                      setShowOrderModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#F4B183] text-[#12302F] py-2.5 px-4 font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d] transition-colors rounded active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Order Medicine Here
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenSimulatedCall(pharm.name, pharm.phone, 'Pharmacy Chemist')}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 border border-[#F1E8D6]/20 text-[#F1E8D6] text-[11px] sm:text-xs font-semibold hover:border-[#F4B183] transition-colors rounded active:scale-95"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#F4B183] shrink-0" />
                      Direct Call
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenSimulatedWhatsApp(pharm.name)}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 border border-[#F1E8D6]/20 text-[#F1E8D6] text-[11px] sm:text-xs font-semibold hover:border-[#F4B183] transition-colors rounded active:scale-95"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#F4B183] shrink-0" />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 2: NEARBY DOCTORS                                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#F1E8D6]/70 pb-2 border-b border-[#F1E8D6]/10 gap-1">
            <span>Geriatric-Trained Doctors &amp; Neighborhood Home Visit Specialists</span>
            <span className="text-[#F4B183] font-semibold">Priority Elder Consultation</span>
          </div>

          <div className="space-y-4">
            {MOCK_DOCTORS.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#163938]/60 border border-[#F1E8D6]/15 p-5 sm:p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-[#F4B183]/50 transition-colors"
              >
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider px-2 py-0.5 bg-[#12302F] text-[#F4B183] border border-[#F4B183]/30 font-semibold">
                      {doc.distance}
                    </span>
                    <span className="text-xs text-[#F1E8D6]/70 font-semibold">
                      Fee: {doc.consultationFee}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6]">
                    {doc.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#F4B183] font-medium">
                    {doc.specialty}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#F1E8D6]/70 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F4B183] shrink-0" />
                      <span>{doc.clinic}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#F4B183] shrink-0" />
                      <span>{doc.availableDays}</span>
                    </span>
                    <span>·</span>
                    <span className="text-[#F4B183] font-semibold">
                      Next: {doc.nextSlot}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setShowDocModal(true);
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d] transition-colors rounded text-center"
                  >
                    Request Consultation
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenSimulatedCall(doc.name, doc.phone, 'Doctor Clinic')}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-[#F1E8D6]/30 text-[#F1E8D6] text-xs font-semibold hover:border-[#F4B183] transition-colors rounded"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F4B183]" />
                    Call Clinic
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SAFE SIMULATED WHATSAPP PREVIEW MODAL                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {simulatedWhatsApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-5 sm:p-7 rounded-xl max-w-md w-full space-y-4 text-[#F1E8D6] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#F4B183]" />
                <h3 className="font-heading text-xl text-[#F4B183]">
                  WhatsApp Simulation
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSimulatedWhatsApp(null)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#163938] rounded-lg border border-[#F4B183]/30 text-xs space-y-1">
              <div className="flex justify-between text-[#F1E8D6]/70">
                <span>Simulated Recipient:</span>
                <strong className="text-[#F4B183]">{simulatedWhatsApp.name}</strong>
              </div>
              <div className="flex justify-between text-[#F1E8D6]/70">
                <span>Delivery Status:</span>
                <span className="text-[#F4B183] font-semibold">Local Sandbox Preview</span>
              </div>
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider text-[#F1E8D6]/80 block mb-1 font-semibold">
                Message Content:
              </span>
              <div className="bg-[#0e2726] border border-[#F1E8D6]/20 p-3.5 rounded text-sm text-[#F1E8D6] font-mono leading-relaxed">
                {simulatedWhatsApp.text}
              </div>
            </div>

            <div className="p-3 bg-[#12302F] border border-[#F1E8D6]/15 rounded text-xs text-[#F1E8D6]/80 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F4B183] shrink-0 mt-0.5" />
              <span>
                <strong>Sandbox Guarantee:</strong> No external message was sent to WhatsApp. This action is safely simulated within the browser.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E8D6]/15">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(simulatedWhatsApp.text);
                  setCopiedText(true);
                  setTimeout(() => setCopiedText(false), 2000);
                }}
                className="px-3.5 py-2 border border-[#F1E8D6]/30 text-xs font-semibold text-[#F1E8D6] hover:border-[#F4B183] flex items-center gap-1.5 rounded"
              >
                <Copy className="w-3.5 h-3.5 text-[#F4B183]" />
                {copiedText ? 'Copied' : 'Copy Text'}
              </button>
              <button
                type="button"
                onClick={() => setSimulatedWhatsApp(null)}
                className="px-5 py-2 bg-[#F4B183] text-[#12302F] font-bold text-xs uppercase tracking-wider hover:bg-[#f6c29d] rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* SAFE SIMULATED CALL PREVIEW MODAL                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      {simulatedCall && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-6 sm:p-8 rounded-xl max-w-md w-full space-y-5 text-[#F1E8D6] shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-[#163938] border-2 border-[#F4B183] mx-auto flex items-center justify-center text-[#F4B183] animate-pulse">
              <Phone className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#F4B183] font-bold block mb-1">
                Simulated Sandbox Call (Inactive Line)
              </span>
              <h3 className="font-heading text-2xl text-[#F1E8D6]">
                {simulatedCall.name}
              </h3>
              <p className="text-xs text-[#F1E8D6]/70 mt-1">
                {simulatedCall.role} · Simulated Phone: {simulatedCall.phone}
              </p>
            </div>

            <div className="bg-[#0e2726] border border-[#F1E8D6]/20 p-4 rounded text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-[#F4B183] font-semibold">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span>Simulated Line Connected (Demo IVR)</span>
              </div>
              <p className="text-[#F1E8D6]/80 italic">
                &ldquo;Namaste! Welcome to {simulatedCall.name}. For senior priority prescription refilling or doctor consultation, our elder assistance team is ready.&rdquo;
              </p>
            </div>

            <div className="p-3 bg-[#163938] border border-[#F4B183]/30 rounded text-xs text-[#F1E8D6]/80 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F4B183] shrink-0" />
              <span>Simulated in-app only. No cellular or carrier network was dialed.</span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSimulatedCall(null)}
                className="w-full py-3 bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-widest transition-colors rounded flex items-center justify-center gap-2"
              >
                <PhoneOff className="w-4 h-4" />
                End Demo Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ORDER MEDICINE MODAL                                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      {showOrderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-5 sm:p-8 rounded-xl max-w-lg w-full space-y-4 sm:space-y-5 text-[#F1E8D6] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-3">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#F4B183] font-semibold block">
                  Doorstep Refill Request
                </span>
                <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6] truncate">
                  Order from {selectedPharmacy.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {orderConfirmed ? (
              <div className="py-8 text-center space-y-3" role="status">
                <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-[#F4B183] mx-auto animate-bounce" />
                <h4 className="font-heading text-2xl text-[#F1E8D6]">
                  Medicine Order Dispatched!
                </h4>
                <p className="text-xs sm:text-sm text-[#F1E8D6]/80 max-w-sm mx-auto">
                  {selectedPharmacy.name} received your list. The delivery partner will arrive within {selectedPharmacy.deliveryTime} at your doorstep.
                </p>
                <p className="text-xs text-[#F4B183] font-mono">
                  Order Ref: #SANJ-MED-{Math.floor(1000 + Math.random() * 9000)}
                </p>
                <p className="text-[11px] text-[#F1E8D6]/60">
                  (Simulated locally. No external SMS dispatched.)
                </p>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    List of Medicines or Daily Tablets needed
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={medicineOrderText}
                    onChange={(e) => setMedicineOrderText(e.target.value)}
                    placeholder="e.g. Amlodipine 5mg (1 strip), Glycomet 500mg (2 strips)"
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 p-2.5 sm:p-3 text-xs sm:text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183] rounded"
                  />
                  <p className="text-[11px] text-[#F1E8D6]/60 mt-1">
                    Chemist will verify against your digital prescription on record.
                  </p>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    Delivery Address (Flat / House / Room)
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-xs sm:text-sm text-[#F1E8D6] focus:border-[#F4B183] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    Delivery Speed
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryUrgency('standard')}
                      className={`p-2.5 sm:p-3 border text-left rounded transition-colors ${
                        deliveryUrgency === 'standard'
                          ? 'border-[#F4B183] bg-[#F4B183]/15 text-[#F1E8D6]'
                          : 'border-[#F1E8D6]/20 bg-[#163938] text-[#F1E8D6]/70'
                      }`}
                    >
                      <span className="font-semibold text-xs uppercase block">Standard</span>
                      <span className="text-[11px] opacity-75">Within 2 hours · Free</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryUrgency('urgent')}
                      className={`p-2.5 sm:p-3 border text-left rounded transition-colors ${
                        deliveryUrgency === 'urgent'
                          ? 'border-[#F4B183] bg-[#F4B183]/15 text-[#F1E8D6]'
                          : 'border-[#F1E8D6]/20 bg-[#163938] text-[#F1E8D6]/70'
                      }`}
                    >
                      <span className="font-semibold text-xs uppercase block text-[#F4B183]">Urgent Express</span>
                      <span className="text-[11px] opacity-75">30 mins priority</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#12302F] border border-[#F1E8D6]/15 rounded text-xs text-[#F1E8D6]/80 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#F4B183] shrink-0" />
                  <span>
                    Pay via Cash on Delivery or UPI upon doorstep arrival. Safe elder verification.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-[#F1E8D6]/15">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-3.5 sm:px-4 py-2 border border-[#F1E8D6]/30 text-xs tracking-wider uppercase text-[#F1E8D6]/70 hover:text-[#F1E8D6] rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 sm:px-6 py-2.5 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d] rounded"
                  >
                    Confirm &amp; Place Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* DOCTOR CONSULTATION BOOKING MODAL                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      {showDocModal && selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-5 sm:p-8 rounded-xl max-w-lg w-full space-y-4 sm:space-y-5 text-[#F1E8D6] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-3">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#F4B183] font-semibold block">
                  Schedule Doctor Consultation
                </span>
                <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6] truncate">
                  {selectedDoctor.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-8 text-center space-y-3" role="status">
                <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-[#F4B183] mx-auto animate-bounce" />
                <h4 className="font-heading text-2xl text-[#F1E8D6]">
                  Consultation Confirmed!
                </h4>
                <p className="text-xs sm:text-sm text-[#F1E8D6]/80 max-w-sm mx-auto">
                  {selectedDoctor.name} clinic has scheduled your visit. A reminder will also ring on the elder&apos;s phone 1 hour before the appointment.
                </p>
                <p className="text-xs text-[#F4B183] font-mono">
                  Scheduled Slot: {selectedDoctor.nextSlot}
                </p>
                <p className="text-[11px] text-[#F1E8D6]/60">
                  (Simulated in local sandbox. No external SMS dispatched.)
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookDoctor} className="space-y-4">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-2 font-semibold">
                    Consultation Format
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultType('home')}
                      className={`p-2 sm:p-2.5 border text-center rounded transition-colors ${
                        consultType === 'home'
                          ? 'border-[#F4B183] bg-[#F4B183] text-[#12302F] font-bold'
                          : 'border-[#F1E8D6]/20 bg-[#163938] text-[#F1E8D6]/80'
                      }`}
                    >
                      <span className="text-xs block">Home Visit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('clinic')}
                      className={`p-2 sm:p-2.5 border text-center rounded transition-colors ${
                        consultType === 'clinic'
                          ? 'border-[#F4B183] bg-[#F4B183] text-[#12302F] font-bold'
                          : 'border-[#F1E8D6]/20 bg-[#163938] text-[#F1E8D6]/80'
                      }`}
                    >
                      <span className="text-xs block">At Clinic</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultType('phone')}
                      className={`p-2 sm:p-2.5 border text-center rounded transition-colors ${
                        consultType === 'phone'
                          ? 'border-[#F4B183] bg-[#F4B183] text-[#12302F] font-bold'
                          : 'border-[#F1E8D6]/20 bg-[#163938] text-[#F1E8D6]/80'
                      }`}
                    >
                      <span className="text-xs block">Phone Call</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#163938]/40 border border-[#F1E8D6]/15 rounded text-xs text-[#F1E8D6]/80 space-y-1">
                  <div className="flex justify-between">
                    <span>Consultation Fee:</span>
                    <strong className="text-[#F4B183]">{selectedDoctor.consultationFee}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Available Slot:</span>
                    <span className="font-semibold">{selectedDoctor.nextSlot}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-[#F1E8D6]/15">
                  <button
                    type="button"
                    onClick={() => setShowDocModal(false)}
                    className="px-3.5 sm:px-4 py-2 border border-[#F1E8D6]/30 text-xs tracking-wider uppercase text-[#F1E8D6]/70 hover:text-[#F1E8D6] rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 sm:px-6 py-2.5 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d] rounded"
                  >
                    Book Consultation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
