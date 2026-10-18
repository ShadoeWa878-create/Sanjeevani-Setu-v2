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
  FileText
} from 'lucide-react';
import { Doctor, Pharmacy } from '../types';

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ramesh K. Verma, MD',
    specialty: 'Senior Geriatric Specialist & Internal Medicine',
    clinic: 'Vasant Vihar Senior Health Center',
    distance: '0.8 km away',
    phone: '+91 98112 34567',
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
    phone: '+91 98234 56789',
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
    phone: '+91 98450 12345',
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
    phone: '+91 98711 22334',
    whatsapp: '919871122334',
    deliveryTime: '30 – 45 mins',
    homeDelivery: true,
    openHours: '24 Hours Open'
  },
  {
    id: 'pharm-2',
    name: 'MedPlus Chemist & Diagnostic Store',
    address: 'Plot 12, Community Center, Block B',
    distance: '0.9 km away',
    phone: '+91 98990 88776',
    whatsapp: '919899088776',
    deliveryTime: '45 – 60 mins',
    homeDelivery: true,
    openHours: '8:00 AM – 11:00 PM'
  },
  {
    id: 'pharm-3',
    name: 'Sanjeevani Local Chemist & Ayurvedic Store',
    address: 'Near Old Post Office, Sector 3',
    distance: '1.2 km away',
    phone: '+91 98101 55443',
    whatsapp: '919810155443',
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

  return (
    <section id="pharmacy-care" className="max-w-4xl mx-auto px-6 py-24 border-b border-[#F1E8D6]/10 scroll-mt-12">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Neighborhood Support Grid</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl text-[#F1E8D6] mb-5 font-normal">
          Local Care &amp; <em className="italic text-[#F4B183]">Pharmacy</em>
        </h2>
        <p className="text-base sm:text-lg font-light text-[#F1E8D6]/80 leading-relaxed">
          Order prescription refills from trusted chemists or schedule trusted geriatric doctors nearby. Designed with direct telephone dials and instant doorstep delivery.
        </p>
      </div>

      {/* Segmented Switcher for Pharmacy vs Doctors */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex p-1.5 bg-[#163938] border border-[#F1E8D6]/20 rounded-xl" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pharmacy'}
            onClick={() => setActiveTab('pharmacy')}
            className={`px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold transition-all rounded-lg flex items-center gap-2 ${
              activeTab === 'pharmacy'
                ? 'bg-[#F4B183] text-[#12302F] shadow-md'
                : 'text-[#F1E8D6]/70 hover:text-[#F1E8D6]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Local Chemists &amp; Meds</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'doctors'}
            onClick={() => setActiveTab('doctors')}
            className={`px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold transition-all rounded-lg flex items-center gap-2 ${
              activeTab === 'doctors'
                ? 'bg-[#F4B183] text-[#12302F] shadow-md'
                : 'text-[#F1E8D6]/70 hover:text-[#F1E8D6]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Nearby Senior Doctors</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 1: PHARMACIES & MEDICINE ORDERING                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'pharmacy' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-[#F1E8D6]/70 pb-2 border-b border-[#F1E8D6]/10">
            <span>Verified Neighborhood Pharmacies with Elder Doorstep Delivery</span>
            <span className="text-[#F4B183] font-semibold">Home Delivery Enabled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_PHARMACIES.map((pharm) => (
              <div
                key={pharm.id}
                className="bg-[#163938]/60 border border-[#F1E8D6]/15 p-6 rounded-xl flex flex-col justify-between hover:border-[#F4B183]/50 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[#12302F] border border-[#F4B183]/30 text-[#F4B183] font-semibold">
                      {pharm.distance}
                    </span>
                    <span className="text-xs text-[#F1E8D6]/60 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#F4B183]" />
                      {pharm.deliveryTime}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl text-[#F1E8D6] mb-1">
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

                <div className="mt-6 pt-4 border-t border-[#F1E8D6]/10 space-y-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPharmacy(pharm);
                      setShowOrderModal(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-[#F4B183] text-[#12302F] py-2.5 px-4 font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d] transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Order Medicine Here
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${pharm.phone.replace(/[^0-9+]/g, '')}`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 border border-[#F1E8D6]/20 text-[#F1E8D6] text-xs font-semibold hover:border-[#F4B183] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#F4B183]" />
                      Direct Call
                    </a>
                    <a
                      href={`https://wa.me/${pharm.whatsapp}?text=Hello%20${encodeURIComponent(pharm.name)},%20I%20would%20like%20to%20order%20medicines%20via%20Sanjeevani%20Setu.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 px-3 border border-[#F1E8D6]/20 text-[#F1E8D6] text-xs font-semibold hover:border-[#F4B183] transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#F4B183]" />
                      WhatsApp
                    </a>
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
          <div className="flex items-center justify-between text-xs text-[#F1E8D6]/70 pb-2 border-b border-[#F1E8D6]/10">
            <span>Geriatric-Trained Doctors &amp; Neighborhood Home Visit Specialists</span>
            <span className="text-[#F4B183] font-semibold">Priority Elder Consultation</span>
          </div>

          <div className="space-y-4">
            {MOCK_DOCTORS.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#163938]/60 border border-[#F1E8D6]/15 p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#F4B183]/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider px-2 py-0.5 bg-[#12302F] text-[#F4B183] border border-[#F4B183]/30 font-semibold">
                      {doc.distance}
                    </span>
                    <span className="text-xs text-[#F1E8D6]/70 font-semibold">
                      Fee: {doc.consultationFee}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl text-[#F1E8D6]">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-[#F4B183] font-medium">
                    {doc.specialty}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#F1E8D6]/70 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#F4B183]" />
                      {doc.clinic}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#F4B183]" />
                      {doc.availableDays}
                    </span>
                    <span>·</span>
                    <span className="text-[#F4B183] font-semibold">
                      Next: {doc.nextSlot}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center gap-2.5 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setShowDocModal(true);
                    }}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d] transition-colors"
                  >
                    Request Consultation
                  </button>

                  <a
                    href={`tel:${doc.phone.replace(/[^0-9+]/g, '')}`}
                    className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 border border-[#F1E8D6]/30 text-[#F1E8D6] text-xs font-semibold hover:border-[#F4B183] transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F4B183]" />
                    Call Clinic
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ORDER MEDICINE MODAL                                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      {showOrderModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-6 sm:p-8 rounded-xl max-w-lg w-full space-y-5 text-[#F1E8D6] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#F4B183] font-semibold">
                  Doorstep Refill Request
                </span>
                <h3 className="font-heading text-2xl text-[#F1E8D6]">
                  Order from {selectedPharmacy.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl px-2"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {orderConfirmed ? (
              <div className="py-8 text-center space-y-3" role="status">
                <CheckCircle2 className="w-16 h-16 text-[#F4B183] mx-auto animate-bounce" />
                <h4 className="font-heading text-2xl text-[#F1E8D6]">
                  Medicine Order Dispatched!
                </h4>
                <p className="text-sm text-[#F1E8D6]/80 max-w-sm mx-auto">
                  {selectedPharmacy.name} received your list. The delivery partner will arrive within {selectedPharmacy.deliveryTime} at your doorstep.
                </p>
                <p className="text-xs text-[#F4B183] font-mono">
                  Order Ref: #SANJ-MED-{Math.floor(1000 + Math.random() * 9000)}
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
                    placeholder="e.g. Amlodipine 5mg (1 strip), Glycomet 500mg (2 strips), D-Rise sachet"
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 p-3 text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183]"
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
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-sm text-[#F1E8D6] focus:border-[#F4B183]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    Delivery Speed
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryUrgency('standard')}
                      className={`p-3 border text-left rounded transition-colors ${
                        deliveryUrgency === 'standard'
                          ? 'border-[#F4B183] bg-[#F4B183]/15 text-[#F1E8D6]'
                          : 'border-[#F1E8D6]/20 bg-[#163938] text-[#F1E8D6]/70'
                      }`}
                    >
                      <span className="font-semibold text-xs uppercase block">Standard</span>
                      <span className="text-xs opacity-75">Within 2 hours · Free</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryUrgency('urgent')}
                      className={`p-3 border text-left rounded transition-colors ${
                        deliveryUrgency === 'urgent'
                          ? 'border-[#F4B183] bg-[#F4B183]/15 text-[#F1E8D6]'
                          : 'border-[#F1E8D6]/20 bg-[#163938] text-[#F1E8D6]/70'
                      }`}
                    >
                      <span className="font-semibold text-xs uppercase block text-[#F4B183]">Urgent Express</span>
                      <span className="text-xs opacity-75">30 mins priority</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#12302F] border border-[#F1E8D6]/15 rounded text-xs text-[#F1E8D6]/80 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#F4B183] shrink-0" />
                  <span>
                    Pay via Cash on Delivery or UPI upon doorstep arrival. Elder-safe verification.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E8D6]/15">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 border border-[#F1E8D6]/30 text-xs tracking-wider uppercase text-[#F1E8D6]/70 hover:text-[#F1E8D6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d]"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-6 sm:p-8 rounded-xl max-w-lg w-full space-y-5 text-[#F1E8D6] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#F4B183] font-semibold">
                  Schedule Doctor Consultation
                </span>
                <h3 className="font-heading text-2xl text-[#F1E8D6]">
                  {selectedDoctor.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl px-2"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {bookingConfirmed ? (
              <div className="py-8 text-center space-y-3" role="status">
                <CheckCircle2 className="w-16 h-16 text-[#F4B183] mx-auto animate-bounce" />
                <h4 className="font-heading text-2xl text-[#F1E8D6]">
                  Consultation Confirmed!
                </h4>
                <p className="text-sm text-[#F1E8D6]/80 max-w-sm mx-auto">
                  {selectedDoctor.name} clinic has scheduled your visit. A reminder will also ring on the elder&apos;s phone 1 hour before the appointment.
                </p>
                <p className="text-xs text-[#F4B183] font-mono">
                  Scheduled Slot: {selectedDoctor.nextSlot}
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookDoctor} className="space-y-4">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-2">
                    Consultation Format
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultType('home')}
                      className={`p-2.5 border text-center rounded transition-colors ${
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
                      className={`p-2.5 border text-center rounded transition-colors ${
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
                      className={`p-2.5 border text-center rounded transition-colors ${
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

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E8D6]/15">
                  <button
                    type="button"
                    onClick={() => setShowDocModal(false)}
                    className="px-4 py-2 border border-[#F1E8D6]/30 text-xs tracking-wider uppercase text-[#F1E8D6]/70 hover:text-[#F1E8D6]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d]"
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
