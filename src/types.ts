export type DeliveryMode = 'call' | 'sms';

export interface MedicineReminder {
  id: string;
  name: string;
  dose: string;
  time: string; // HH:MM (24h or 12h display)
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  instructions: string; // e.g., 'After meal with warm water'
  mode: DeliveryMode;
  customScript: string;
  customSms: string;
  isActive: boolean;
  takenToday?: boolean;
  takenAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  distance: string;
  phone: string;
  consultationFee: string;
  availableDays: string;
  nextSlot: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  whatsapp: string;
  deliveryTime: string;
  homeDelivery: boolean;
  openHours: string;
}

export interface MedicalDocument {
  id: string;
  title: string;
  doctorName: string;
  category: 'Prescription' | 'Lab Report' | 'Discharge' | 'Vaccination';
  date: string;
  summary: string;
  keyFindings: string[];
  fileSize: string;
  sharedWith: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  ctaLabel: string;
}
