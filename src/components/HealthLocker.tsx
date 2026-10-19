import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  Download,
  Plus,
  Calendar,
  CheckCircle2,
  UserCheck,
  Share2,
  AlertCircle,
  X,
  Clock,
  Activity,
  Printer,
  FileCheck,
  PhoneCall,
  Check,
  Stethoscope,
  Filter
} from 'lucide-react';
import { MedicalDocument, CaregiverActivityLog } from '../types';

const INITIAL_DOCS: MedicalDocument[] = [
  {
    id: 'doc-presc-1',
    title: 'Hypertension & Cardiac Prescription',
    doctorName: 'Dr. Meera Nambiar (Cardiologist)',
    category: 'Prescription',
    date: '14 Oct 2026',
    fileSize: '1.2 MB PDF',
    summary: 'Active prescription for Amlodipine 5mg (once morning) and Aspirin 75mg. Salt-restricted diet advised.',
    keyFindings: [
      'Amlodipine 5mg - 1 Tab Morning after breakfast',
      'Blood pressure target: < 130/80 mmHg',
      'Next ECG follow-up recommended in 3 months'
    ],
    sharedWith: ['Caregiver (Priya)', 'Dr. Verma']
  },
  {
    id: 'doc-lab-1',
    title: 'Comprehensive Metabolic & HbA1c Report',
    doctorName: 'Dr. Lal PathLabs (Verified)',
    category: 'Lab Report',
    date: '28 Sep 2026',
    fileSize: '2.4 MB PDF',
    summary: 'HbA1c level measured at 6.4% (well-controlled senior diabetic profile). Kidney parameters normal.',
    keyFindings: [
      'HbA1c: 6.4% (Target < 7.0%)',
      'Serum Creatinine: 0.9 mg/dL (Normal)',
      'Fasting Blood Sugar: 104 mg/dL'
    ],
    sharedWith: ['Caregiver (Priya)', 'Family Physician']
  },
  {
    id: 'doc-discharge-1',
    title: 'Cataract Surgery Discharge Summary',
    doctorName: 'Dr. Shroff Eye Hospital',
    category: 'Discharge',
    date: '12 Aug 2026',
    fileSize: '3.1 MB PDF',
    summary: 'Successful left-eye phacoemulsification with monofocal IOL implantation. Post-op drops completed.',
    keyFindings: [
      'Left Eye Vision: 6/6 with reading glasses',
      'No post-operative inflammation',
      'Cleared for regular reading and television'
    ],
    sharedWith: ['Caregiver (Priya)']
  },
  {
    id: 'doc-vaccine-1',
    title: 'Senior Pneumococcal & Flu Immunization Card',
    doctorName: 'Community Health Center',
    category: 'Vaccination',
    date: '15 May 2026',
    fileSize: '850 KB PDF',
    summary: 'Pneumococcal conjugate vaccine administered. Annual influenza booster recorded.',
    keyFindings: [
      'PCV20 Pneumococcal Conjugate: Done',
      'Annual Flu Booster: Done',
      'Allergy Warning: Penicillin Sensitivity'
    ],
    sharedWith: ['Caregiver (Priya)', 'Emergency SOS Contacts']
  }
];

const INITIAL_ACTIVITY_LOGS: CaregiverActivityLog[] = [
  {
    id: 'log-1',
    medicineName: 'Blood Pressure Tablet (Amlodipine 5mg)',
    dose: '1 Tablet',
    scheduledTime: '08:00 AM',
    takenAt: '08:04 AM',
    date: 'Today',
    status: 'On Time',
    confirmationMethod: 'Spoken Phone Call',
    delayMinutes: 4
  },
  {
    id: 'log-2',
    medicineName: 'Evening Sugar Tablet (Metformin 500mg)',
    dose: '1 Tablet',
    scheduledTime: '09:00 PM',
    takenAt: '09:11 PM',
    date: 'Yesterday',
    status: 'On Time',
    confirmationMethod: 'Caregiver App (Priya)',
    delayMinutes: 11
  },
  {
    id: 'log-3',
    medicineName: 'Calcium & Vitamin D3',
    dose: '1 Softgel',
    scheduledTime: '01:30 PM',
    takenAt: '01:30 PM',
    date: 'Yesterday',
    status: 'On Time',
    confirmationMethod: 'SMS Reply',
    delayMinutes: 0
  },
  {
    id: 'log-4',
    medicineName: 'Blood Pressure Tablet (Amlodipine 5mg)',
    dose: '1 Tablet',
    scheduledTime: '08:00 AM',
    takenAt: '08:06 AM',
    date: 'Yesterday',
    status: 'On Time',
    confirmationMethod: 'Spoken Phone Call',
    delayMinutes: 6
  },
  {
    id: 'log-5',
    medicineName: 'Evening Sugar Tablet (Metformin 500mg)',
    dose: '1 Tablet',
    scheduledTime: '09:00 PM',
    takenAt: '09:25 PM',
    date: '17 Oct 2026',
    status: 'Slight Delay',
    confirmationMethod: 'Caregiver App (Priya)',
    delayMinutes: 25
  },
  {
    id: 'log-6',
    medicineName: 'Calcium & Vitamin D3',
    dose: '1 Softgel',
    scheduledTime: '01:30 PM',
    takenAt: '01:34 PM',
    date: '17 Oct 2026',
    status: 'On Time',
    confirmationMethod: 'Spoken Phone Call',
    delayMinutes: 4
  },
  {
    id: 'log-7',
    medicineName: 'Blood Pressure Tablet (Amlodipine 5mg)',
    dose: '1 Tablet',
    scheduledTime: '08:00 AM',
    takenAt: '08:02 AM',
    date: '17 Oct 2026',
    status: 'On Time',
    confirmationMethod: 'Spoken Phone Call',
    delayMinutes: 2
  }
];

export function HealthLocker() {
  const [activeSubTab, setActiveSubTab] = useState<'documents' | 'activity_log'>('activity_log');
  const [documents, setDocuments] = useState<MedicalDocument[]>(INITIAL_DOCS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [elderConsentActive, setElderConsentActive] = useState<boolean>(true);
  const [viewingDoc, setViewingDoc] = useState<MedicalDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [downloadingDoc, setDownloadingDoc] = useState<MedicalDocument | null>(null);

  // Caregiver Activity Log State
  const [activityLogs, setActivityLogs] = useState<CaregiverActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('sanjeevani_activity_logs');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [showDoctorReportModal, setShowDoctorReportModal] = useState<boolean>(false);
  const [showManualLogModal, setShowManualLogModal] = useState<boolean>(false);
  const [filterMedName, setFilterMedName] = useState<string>('All');

  // Manual Log Form State
  const [manualMedName, setManualMedName] = useState('Blood Pressure Tablet (Amlodipine 5mg)');
  const [manualDose, setManualDose] = useState('1 Tablet');
  const [manualTime, setManualTime] = useState('08:00 AM');
  const [manualMethod, setManualMethod] = useState<'Spoken Phone Call' | 'SMS Reply' | 'Caregiver App (Priya)' | 'Manual Log'>('Caregiver App (Priya)');

  // New Document Upload State
  const [newTitle, setNewTitle] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newCategory, setNewCategory] = useState<'Prescription' | 'Lab Report' | 'Discharge' | 'Vaccination'>('Prescription');
  const [newSummary, setNewSummary] = useState('');

  // Persist Activity Logs
  useEffect(() => {
    localStorage.setItem('sanjeevani_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const categories = ['All', 'Prescription', 'Lab Report', 'Discharge', 'Vaccination'];

  const filteredDocs = selectedCategory === 'All'
    ? documents
    : documents.filter(d => d.category === selectedCategory);

  const filteredLogs = filterMedName === 'All'
    ? activityLogs
    : activityLogs.filter(l => l.medicineName.includes(filterMedName));

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: MedicalDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      doctorName: newDoctor.trim() || 'Attending Physician',
      category: newCategory,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: '1.4 MB PDF',
      summary: newSummary.trim() || 'Uploaded by family caregiver for elder routine coordination.',
      keyFindings: [newSummary.trim() || 'Verified document stored on secure cloud vault.'],
      sharedWith: ['Caregiver (Authorized)']
    };

    setDocuments([newDoc, ...documents]);
    setNewTitle('');
    setNewDoctor('');
    setNewSummary('');
    setShowUploadModal(false);
  };

  const handleSimulateDownload = (doc: MedicalDocument) => {
    setDownloadingDoc(doc);
    setTimeout(() => {
      setDownloadingDoc(null);
    }, 3500);
  };

  const handleAddManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: CaregiverActivityLog = {
      id: `log-${Date.now()}`,
      medicineName: manualMedName,
      dose: manualDose,
      scheduledTime: manualTime,
      takenAt: manualTime,
      date: 'Today',
      status: 'On Time',
      confirmationMethod: manualMethod,
      delayMinutes: 0
    };
    setActivityLogs([newEntry, ...activityLogs]);
    setShowManualLogModal(false);
  };

  // Metrics for doctor review
  const totalLogged = activityLogs.length;
  const onTimeCount = activityLogs.filter(l => l.status === 'On Time').length;
  const adherenceRate = Math.round((onTimeCount / (totalLogged || 1)) * 100);

  return (
    <section id="health-locker" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 border-b border-[#F1E8D6]/10 scroll-mt-12">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Consent-First Health Vault &amp; Adherence</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl text-[#F1E8D6] mb-4 sm:mb-5 font-normal">
          Medical History &amp; <em className="italic text-[#F4B183]">Locker</em>
        </h2>
        <p className="text-sm sm:text-lg font-light text-[#F1E8D6]/80 leading-relaxed">
          Centralized health records and a caregiver activity log that records when each dose was taken, providing a doctor-ready timeline of medication adherence.
        </p>
      </div>

      {/* Primary Section Switcher: Activity Log vs Clinical Documents */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-[#163938] border border-[#F1E8D6]/20 rounded-xl" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'activity_log'}
            onClick={() => setActiveSubTab('activity_log')}
            className={`px-4 sm:px-6 py-2.5 text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'activity_log'
                ? 'bg-[#F4B183] text-[#12302F] shadow-md'
                : 'text-[#F1E8D6]/70 hover:text-[#F1E8D6]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Caregiver Activity Log (Timeline)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeSubTab === 'documents'}
            onClick={() => setActiveSubTab('documents')}
            className={`px-4 sm:px-6 py-2.5 text-xs uppercase tracking-wider font-bold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'documents'
                ? 'bg-[#F4B183] text-[#12302F] shadow-md'
                : 'text-[#F1E8D6]/70 hover:text-[#F1E8D6]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Medical Records Vault</span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: CAREGIVER ACTIVITY LOG & DOCTOR ADHERENCE TIMELINE */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'activity_log' && (
        <div className="space-y-6">

          {/* Doctor Adherence KPI Summary Card */}
          <div className="bg-[#163938]/80 border-2 border-[#F4B183]/40 p-5 sm:p-6 rounded-2xl shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#F1E8D6]/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs uppercase font-bold tracking-wider text-[#F4B183]">
                    Doctor Review Readiness: Follow-up Compliant
                  </span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6]">
                  7-Day Medication Adherence Timeline
                </h3>
                <p className="text-xs text-[#F1E8D6]/70 mt-0.5">
                  Chronological loop verifying phone and SMS reminder receipts, timestamps, and caregiver check-ins.
                </p>
              </div>

              {/* Action Buttons: Export for Doctor & Add Manual Log */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setShowDoctorReportModal(true)}
                  className="px-4 py-2 bg-[#F4B183] hover:bg-[#f6c29d] text-[#12302F] font-bold text-xs uppercase tracking-wider rounded-lg shadow flex items-center gap-1.5 transition-transform active:scale-95"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Review for Doctor</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowManualLogModal(true)}
                  className="px-3.5 py-2 bg-[#12302F] hover:bg-[#1f4a49] text-[#F1E8D6] border border-[#F1E8D6]/20 font-semibold text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#F4B183]" />
                  <span>Log Past Dose</span>
                </button>
              </div>
            </div>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-3 pt-4 text-center">
              <div className="bg-[#12302F] p-3 rounded-xl border border-[#F1E8D6]/10">
                <span className="text-[10px] sm:text-xs text-[#F1E8D6]/60 uppercase block">Adherence Rate</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-400">{adherenceRate}%</span>
                <span className="text-[10px] text-emerald-300 block">High Compliance</span>
              </div>

              <div className="bg-[#12302F] p-3 rounded-xl border border-[#F1E8D6]/10">
                <span className="text-[10px] sm:text-xs text-[#F1E8D6]/60 uppercase block">Doses Verified</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#F4B183]">{totalLogged} / {totalLogged}</span>
                <span className="text-[10px] text-[#F1E8D6]/60 block">Past 7 Days</span>
              </div>

              <div className="bg-[#12302F] p-3 rounded-xl border border-[#F1E8D6]/10">
                <span className="text-[10px] sm:text-xs text-[#F1E8D6]/60 uppercase block">Average Timing</span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-[#F1E8D6]">+4 min</span>
                <span className="text-[10px] text-emerald-400 block">Punctual Intake</span>
              </div>
            </div>
          </div>

          {/* Filter Bar by Medication */}
          <div className="flex items-center justify-between text-xs text-[#F1E8D6]/70 px-1">
            <span className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-[#F4B183]">
              <Filter className="w-3.5 h-3.5" />
              Filter by Routine:
            </span>
            <div className="flex items-center gap-1.5">
              {['All', 'Blood Pressure', 'Sugar', 'Calcium'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setFilterMedName(m)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    filterMedName === m
                      ? 'bg-[#F4B183] text-[#12302F]'
                      : 'bg-[#163938] text-[#F1E8D6]/70 hover:text-[#F1E8D6]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Chronological Activity Timeline */}
          <div className="relative border-l-2 border-[#F4B183]/30 ml-4 sm:ml-6 space-y-4 py-2">
            {filteredLogs.map((log, idx) => (
              <div key={log.id} className="relative pl-6 sm:pl-8 group">
                {/* Timeline node bullet */}
                <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-[#12302F] border-2 border-[#F4B183] flex items-center justify-center group-hover:scale-125 transition-transform">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>

                {/* Event Card */}
                <div className="bg-[#163938]/60 hover:bg-[#163938] border border-[#F1E8D6]/15 hover:border-[#F4B183]/50 p-4 sm:p-5 rounded-xl transition-all shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-[#F4B183] bg-[#12302F] px-2 py-0.5 rounded border border-[#F4B183]/30">
                        {log.date} at {log.takenAt}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 font-semibold">
                        ✓ {log.status}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#F1E8D6]/60 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3 text-[#F4B183]" />
                      Via {log.confirmationMethod}
                    </span>
                  </div>

                  <h4 className="font-heading text-base sm:text-lg text-[#F1E8D6]">
                    {log.medicineName}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#F1E8D6]/75 mt-1.5 font-light">
                    <span>Dose: <strong className="text-[#F1E8D6]">{log.dose}</strong></span>
                    <span>·</span>
                    <span>Scheduled for: <strong>{log.scheduledTime}</strong></span>
                    <span>·</span>
                    <span className="text-emerald-400">
                      Confirmed taken with warm water
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: MEDICAL RECORDS VAULT (Prescriptions, Labs)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'documents' && (
        <div className="space-y-6">
          {/* Simulated Download Notification Bar */}
          {downloadingDoc && (
            <div className="mb-6 p-4 bg-[#163938] border border-[#F4B183] rounded-xl flex items-center gap-3 shadow-lg" role="status">
              <CheckCircle2 className="w-5 h-5 text-[#F4B183] shrink-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-semibold text-[#F1E8D6]">Document Verified: </span>
                <span className="text-[#F1E8D6]/80">{downloadingDoc.title} ({downloadingDoc.fileSize}) ready for consultation.</span>
              </div>
            </div>
          )}

          {/* Consent Master Switch Banner */}
          <div className="bg-[#163938]/80 border-2 border-[#F1E8D6]/20 p-5 sm:p-6 rounded-xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 border ${
                elderConsentActive
                  ? 'border-[#F4B183] bg-[#F4B183]/20 text-[#F4B183]'
                  : 'border-[#F1E8D6]/30 bg-[#12302F] text-[#F1E8D6]/50'
              }`}>
                {elderConsentActive ? <Unlock className="w-5 h-5 sm:w-6 sm:h-6" /> : <Lock className="w-5 h-5 sm:w-6 sm:h-6" />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-lg sm:text-xl text-[#F1E8D6]">
                    Elder Sharing Consent: {elderConsentActive ? 'Active' : 'Private (Locked)'}
                  </h3>
                  <span className={`text-[10px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                    elderConsentActive ? 'bg-[#F4B183] text-[#12302F]' : 'bg-[#12302F] text-[#F1E8D6]/60 border border-[#F1E8D6]/20'
                  }`}>
                    {elderConsentActive ? 'Family Sync ON' : 'Paused by Elder'}
                  </span>
                </div>
                <p className="text-xs text-[#F1E8D6]/70 mt-1 font-light">
                  {elderConsentActive
                    ? 'Authorized family caregiver (Priya) and primary doctor can view prescriptions and test records.'
                    : 'All remote sharing is paused. Only the elder can view documents on this device.'}
                </p>
              </div>
            </div>

            {/* Big accessible toggle button */}
            <button
              type="button"
              onClick={() => setElderConsentActive(!elderConsentActive)}
              className={`w-full sm:w-auto shrink-0 px-5 sm:px-6 py-2.5 text-xs tracking-wider uppercase font-bold border transition-colors rounded text-center ${
                elderConsentActive
                  ? 'border-[#F1E8D6]/30 text-[#F1E8D6] hover:border-[#F4B183]'
                  : 'border-[#F4B183] bg-[#F4B183] text-[#12302F]'
              }`}
            >
              {elderConsentActive ? 'Pause Family Access' : 'Enable Family Sharing'}
            </button>
          </div>

          {/* Filter Tabs & Upload Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap border rounded ${
                    selectedCategory === cat
                      ? 'border-[#F4B183] bg-[#F4B183] text-[#12302F]'
                      : 'border-[#F1E8D6]/20 bg-[#163938]/60 text-[#F1E8D6]/70 hover:border-[#F1E8D6]/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#F4B183] text-[#F4B183] hover:bg-[#F4B183] hover:text-[#12302F] px-4 py-2 text-xs tracking-wider uppercase font-semibold transition-colors rounded"
            >
              <Plus className="w-4 h-4" />
              Upload Medical Record
            </button>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#163938]/60 border border-[#F1E8D6]/15 hover:border-[#F4B183]/50 p-5 sm:p-6 rounded-xl flex flex-col justify-between transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[#12302F] text-[#F4B183] border border-[#F4B183]/30 font-semibold rounded">
                      {doc.category}
                    </span>
                    <span className="text-xs text-[#F1E8D6]/60 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#F4B183]" />
                      {doc.date}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg sm:text-xl text-[#F1E8D6] mb-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[#F1E8D6]/70 mb-3 font-light">
                    Issued by: {doc.doctorName}
                  </p>
                  <p className="text-xs text-[#F1E8D6]/85 bg-[#12302F]/60 p-3 rounded border border-[#F1E8D6]/10 mb-4 leading-relaxed font-light">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F1E8D6]/10 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-[#F1E8D6]/50 font-mono">
                    {doc.fileSize}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingDoc(doc)}
                      className="inline-flex items-center gap-1 text-[#F4B183] hover:underline font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Chart
                    </button>
                    <span className="text-[#F1E8D6]/30">·</span>
                    <button
                      type="button"
                      onClick={() => handleSimulateDownload(doc)}
                      className="inline-flex items-center gap-1 text-[#F1E8D6]/70 hover:text-[#F1E8D6]"
                      title="Download copy"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DOCTOR CONSULTATION ADHERENCE SUMMARY MODAL                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showDoctorReportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-5 sm:p-8 rounded-2xl max-w-2xl w-full text-[#F1E8D6] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-[#F1E8D6]/15">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#F4B183] flex items-center gap-1.5 mb-1">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  Doctor Adherence Review Report
                </span>
                <h3 className="font-heading text-2xl text-[#F1E8D6]">
                  Clinical Adherence Summary
                </h3>
                <p className="text-xs text-[#F1E8D6]/70 mt-0.5">
                  Prepared for review during cardiology or general physician consultations.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDoctorReportModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clinical Overview Grid */}
            <div className="bg-[#163938] p-4 rounded-xl border border-[#F4B183]/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-[#F1E8D6]/60 block uppercase">Overall Compliance</span>
                <span className="text-xl font-bold text-emerald-400">{adherenceRate}%</span>
              </div>
              <div>
                <span className="text-[10px] text-[#F1E8D6]/60 block uppercase">Logged Doses</span>
                <span className="text-xl font-bold text-[#F4B183]">{totalLogged}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#F1E8D6]/60 block uppercase">Missed Doses</span>
                <span className="text-xl font-bold text-emerald-400">0</span>
              </div>
              <div>
                <span className="text-[10px] text-[#F1E8D6]/60 block uppercase">Elder Dignity Method</span>
                <span className="text-xs font-semibold text-[#F1E8D6]">Phone Call IVR</span>
              </div>
            </div>

            {/* Doctor Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4B183] mb-2">
                Recent Adherence Records
              </h4>
              <div className="border border-[#F1E8D6]/15 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#163938] text-[#F1E8D6]/70 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2.5">Date &amp; Time</th>
                      <th className="p-2.5">Medication</th>
                      <th className="p-2.5">Schedule</th>
                      <th className="p-2.5">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1E8D6]/10 text-xs">
                    {activityLogs.slice(0, 6).map(log => (
                      <tr key={log.id} className="hover:bg-[#163938]/40">
                        <td className="p-2.5 font-mono text-[#F4B183]">{log.date} {log.takenAt}</td>
                        <td className="p-2.5 font-medium">{log.medicineName} ({log.dose})</td>
                        <td className="p-2.5 text-emerald-400">Scheduled {log.scheduledTime}</td>
                        <td className="p-2.5 text-[#F1E8D6]/70">{log.confirmationMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3 bg-[#12302F] rounded-xl border border-[#F1E8D6]/10 text-xs text-[#F1E8D6]/80 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Physician Note:</strong> Patient exhibits consistent compliance with morning Amlodipine regimen with average deviation under 5 minutes.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E8D6]/15">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 border border-[#F4B183] text-[#F4B183] hover:bg-[#F4B183] hover:text-[#12302F] text-xs font-bold uppercase rounded-lg flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Adherence Report</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDoctorReportModal(false)}
                className="px-5 py-2 bg-[#F4B183] text-[#12302F] font-bold text-xs uppercase tracking-wider rounded-lg"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MANUAL DOSE LOG MODAL                                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showManualLogModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-5 sm:p-7 rounded-2xl max-w-md w-full space-y-4 text-[#F1E8D6] shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#F1E8D6]/15">
              <h3 className="font-heading text-xl text-[#F4B183]">
                Log Past Medication Dose
              </h3>
              <button
                type="button"
                onClick={() => setShowManualLogModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualLog} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[#F1E8D6]/80">Medicine</label>
                <select
                  value={manualMedName}
                  onChange={e => setManualMedName(e.target.value)}
                  className="w-full bg-[#163938] border border-[#F1E8D6]/20 p-2.5 rounded-lg text-[#F1E8D6]"
                >
                  <option value="Blood Pressure Tablet (Amlodipine 5mg)">Blood Pressure Tablet (Amlodipine 5mg)</option>
                  <option value="Calcium & Vitamin D3">Calcium &amp; Vitamin D3</option>
                  <option value="Evening Sugar Tablet (Metformin 500mg)">Evening Sugar Tablet (Metformin 500mg)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#F1E8D6]/80">Dose</label>
                  <input
                    type="text"
                    value={manualDose}
                    onChange={e => setManualDose(e.target.value)}
                    className="w-full bg-[#163938] border border-[#F1E8D6]/20 p-2.5 rounded-lg text-[#F1E8D6]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#F1E8D6]/80">Time Taken</label>
                  <input
                    type="text"
                    value={manualTime}
                    onChange={e => setManualTime(e.target.value)}
                    placeholder="e.g. 08:15 AM"
                    className="w-full bg-[#163938] border border-[#F1E8D6]/20 p-2.5 rounded-lg text-[#F1E8D6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-[#F1E8D6]/80">Verified By</label>
                <select
                  value={manualMethod}
                  onChange={e => setManualMethod(e.target.value as any)}
                  className="w-full bg-[#163938] border border-[#F1E8D6]/20 p-2.5 rounded-lg text-[#F1E8D6]"
                >
                  <option value="Caregiver App (Priya)">Caregiver App (Priya)</option>
                  <option value="Spoken Phone Call">Spoken Phone Call</option>
                  <option value="SMS Reply">SMS Reply</option>
                  <option value="Manual Log">Visiting Nurse / Relative</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F1E8D6]/15">
                <button
                  type="button"
                  onClick={() => setShowManualLogModal(false)}
                  className="px-4 py-2 text-xs text-[#F1E8D6]/60 hover:text-[#F1E8D6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#F4B183] text-[#12302F] font-bold text-xs uppercase rounded-lg"
                >
                  Add to Adherence Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DOCUMENT DETAIL VIEWER MODAL                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {viewingDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-5 sm:p-8 rounded-xl max-w-xl w-full space-y-4 sm:space-y-6 text-[#F1E8D6] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-3">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-[#F4B183] font-semibold block">
                  {viewingDoc.category} Verified Record
                </span>
                <h3 className="font-heading text-xl sm:text-2xl text-[#F1E8D6] mt-0.5 truncate">
                  {viewingDoc.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#163938]/60 p-3.5 rounded-lg border border-[#F1E8D6]/15">
              <div>
                <span className="text-[#F1E8D6]/60 block uppercase tracking-wider">Consulting Doctor:</span>
                <span className="font-semibold text-xs sm:text-sm text-[#F1E8D6]">{viewingDoc.doctorName}</span>
              </div>
              <div>
                <span className="text-[#F1E8D6]/60 block uppercase tracking-wider">Date of Record:</span>
                <span className="font-semibold text-xs sm:text-sm text-[#F1E8D6]">{viewingDoc.date}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F4B183]">
                Clinical Summary:
              </h4>
              <p className="text-xs sm:text-sm leading-relaxed text-[#F1E8D6]/85 bg-[#163938]/30 p-3.5 border border-[#F1E8D6]/10 rounded">
                {viewingDoc.summary}
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F4B183]">
                Key Instructions &amp; Findings:
              </h4>
              <ul className="space-y-2">
                {viewingDoc.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#F1E8D6]/85">
                    <CheckCircle2 className="w-4 h-4 text-[#F4B183] shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#F1E8D6]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F1E8D6]/60">
              <span className="flex items-center gap-1.5 text-center sm:text-left">
                <ShieldCheck className="w-4 h-4 text-[#F4B183] shrink-0" />
                Consent Active: Shared with {viewingDoc.sharedWith.join(', ')}
              </span>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="w-full sm:w-auto px-5 py-2 bg-[#F4B183] text-[#12302F] font-bold uppercase tracking-wider hover:bg-[#f6c29d] rounded"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ADD NEW DOCUMENT MODAL                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-5 sm:p-8 rounded-xl max-w-lg w-full space-y-4 sm:space-y-5 text-[#F1E8D6] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-3">
              <h3 className="font-heading text-xl sm:text-2xl text-[#F4B183]">
                Upload Health Document
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Thyroid Ultrasound Report, Cardiologist Rx"
                  className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-xs sm:text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183] rounded"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    Doctor / Clinic Name
                  </label>
                  <input
                    type="text"
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    placeholder="e.g. Dr. Verma"
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-xs sm:text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-xs sm:text-sm text-[#F1E8D6] focus:border-[#F4B183] rounded"
                  >
                    <option value="Prescription">Prescription</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Discharge">Discharge</option>
                    <option value="Vaccination">Vaccination</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                  Doctor Notes or Summary
                </label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="e.g. Dosage adjusted. Follow up in 6 weeks with fresh fasting blood report."
                  className="w-full bg-[#163938] border border-[#F1E8D6]/30 p-2.5 sm:p-3 text-xs sm:text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183] rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-[#F1E8D6]/15">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 sm:px-4 py-2 border border-[#F1E8D6]/30 text-xs tracking-wider uppercase text-[#F1E8D6]/70 hover:text-[#F1E8D6] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-2 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d] rounded"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
