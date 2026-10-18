import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { MedicalDocument } from '../types';

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

export function HealthLocker() {
  const [documents, setDocuments] = useState<MedicalDocument[]>(INITIAL_DOCS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [elderConsentActive, setElderConsentActive] = useState<boolean>(true);
  const [viewingDoc, setViewingDoc] = useState<MedicalDocument | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // New Document Upload State
  const [newTitle, setNewTitle] = useState('');
  const [newDoctor, setNewDoctor] = useState('');
  const [newCategory, setNewCategory] = useState<'Prescription' | 'Lab Report' | 'Discharge' | 'Vaccination'>('Prescription');
  const [newSummary, setNewSummary] = useState('');

  const categories = ['All', 'Prescription', 'Lab Report', 'Discharge', 'Vaccination'];

  const filteredDocs = selectedCategory === 'All'
    ? documents
    : documents.filter(d => d.category === selectedCategory);

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

  return (
    <section id="health-locker" className="max-w-4xl mx-auto px-6 py-24 border-b border-[#F1E8D6]/10 scroll-mt-12">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="text-xs tracking-[3px] uppercase text-[#F1E8D6]/60 mb-4 flex items-center justify-center gap-3">
          <span className="text-[#F4B183] text-[9px]">◆</span>
          <span>Consent-First Health Vault</span>
          <span className="text-[#F4B183] text-[9px]">◆</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-5xl text-[#F1E8D6] mb-5 font-normal">
          Medical History <em className="italic text-[#F4B183]">Locker</em>
        </h2>
        <p className="text-base sm:text-lg font-light text-[#F1E8D6]/80 leading-relaxed">
          Centralized health records accessible to children, trusted caregivers, and attending physicians in seconds—100% controlled by the elder&apos;s dignity and consent.
        </p>
      </div>

      {/* Consent Master Switch Banner */}
      <div className="bg-[#163938]/80 border-2 border-[#F1E8D6]/20 p-6 rounded-xl mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
            elderConsentActive 
              ? 'border-[#F4B183] bg-[#F4B183]/20 text-[#F4B183]' 
              : 'border-[#F1E8D6]/30 bg-[#12302F] text-[#F1E8D6]/50'
          }`}>
            {elderConsentActive ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-xl text-[#F1E8D6]">
                Elder Sharing Consent: {elderConsentActive ? 'Active' : 'Private (Locked)'}
              </h3>
              <span className={`text-[11px] uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
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
          className={`shrink-0 px-6 py-2.5 text-xs tracking-wider uppercase font-bold border transition-colors ${
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
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap border ${
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
          className="inline-flex items-center gap-2 border border-[#F4B183] text-[#F4B183] hover:bg-[#F4B183] hover:text-[#12302F] px-4 py-2 text-xs tracking-wider uppercase font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Health Document
        </button>
      </div>

      {/* Documents Grid */}
      <div className="space-y-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#163938]/60 border border-[#F1E8D6]/15 p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#F4B183]/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#12302F] border border-[#F4B183]/40 flex items-center justify-center shrink-0 text-[#F4B183]">
                <FileText className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[#12302F] text-[#F4B183] border border-[#F4B183]/30 font-semibold">
                    {doc.category}
                  </span>
                  <span className="text-xs text-[#F1E8D6]/60">
                    {doc.date} · {doc.fileSize}
                  </span>
                </div>

                <h4 className="font-heading text-xl text-[#F1E8D6]">
                  {doc.title}
                </h4>

                <p className="text-xs text-[#F1E8D6]/75 font-light">
                  Physician: <strong className="text-[#F1E8D6]">{doc.doctorName}</strong>
                </p>

                <p className="text-xs text-[#F1E8D6]/60 line-clamp-1 italic">
                  &ldquo;{doc.summary}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => setViewingDoc(doc)}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#F4B183] text-[#12302F] text-xs font-bold uppercase tracking-wider hover:bg-[#f6c29d] transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View &amp; Verify
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Downloading ${doc.title} (${doc.fileSize}). Stored securely in your downloads folder.`);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-[#F1E8D6]/20 text-[#F1E8D6] text-xs hover:border-[#F4B183] transition-colors"
                title="Download Document"
              >
                <Download className="w-3.5 h-3.5 text-[#F4B183]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* DOCUMENT VIEWER MODAL                                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {viewingDoc && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-6 sm:p-8 rounded-xl max-w-xl w-full space-y-6 text-[#F1E8D6] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#F4B183] font-semibold">
                  {viewingDoc.category} Verified Record
                </span>
                <h3 className="font-heading text-2xl text-[#F1E8D6] mt-0.5">
                  {viewingDoc.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl px-2"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-[#163938]/60 p-4 rounded-lg border border-[#F1E8D6]/15">
              <div>
                <span className="text-[#F1E8D6]/60 block uppercase tracking-wider">Consulting Doctor:</span>
                <span className="font-semibold text-sm text-[#F1E8D6]">{viewingDoc.doctorName}</span>
              </div>
              <div>
                <span className="text-[#F1E8D6]/60 block uppercase tracking-wider">Date of Record:</span>
                <span className="font-semibold text-sm text-[#F1E8D6]">{viewingDoc.date}</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F4B183]">
                Clinical Summary:
              </h4>
              <p className="text-sm leading-relaxed text-[#F1E8D6]/85 bg-[#163938]/30 p-4 border border-[#F1E8D6]/10 rounded">
                {viewingDoc.summary}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#F4B183]">
                Key Instructions &amp; Findings:
              </h4>
              <ul className="space-y-2">
                {viewingDoc.keyFindings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-[#F1E8D6]/85">
                    <CheckCircle2 className="w-4 h-4 text-[#F4B183] shrink-0 mt-0.5" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#F1E8D6]/15 flex items-center justify-between text-xs text-[#F1E8D6]/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#F4B183]" />
                Consent Active: Shared with {viewingDoc.sharedWith.join(', ')}
              </span>
              <button
                type="button"
                onClick={() => setViewingDoc(null)}
                className="px-5 py-2 bg-[#F4B183] text-[#12302F] font-bold uppercase tracking-wider hover:bg-[#f6c29d]"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ADD NEW DOCUMENT MODAL                                      */}
      {/* ─────────────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#12302F] border-2 border-[#F4B183] p-6 sm:p-8 rounded-xl max-w-lg w-full space-y-5 text-[#F1E8D6] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#F1E8D6]/15 pb-3">
              <h3 className="font-heading text-2xl text-[#F4B183]">
                Upload Health Document
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-[#F1E8D6]/60 hover:text-[#F1E8D6] text-xl px-2"
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
                  className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    Doctor / Clinic Name
                  </label>
                  <input
                    type="text"
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    placeholder="e.g. Dr. Verma"
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#F1E8D6]/80 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#163938] border border-[#F1E8D6]/30 px-3 py-2 text-sm text-[#F1E8D6] focus:border-[#F4B183]"
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
                  className="w-full bg-[#163938] border border-[#F1E8D6]/30 p-3 text-sm text-[#F1E8D6] placeholder-[#F1E8D6]/30 focus:border-[#F4B183]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1E8D6]/15">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-[#F1E8D6]/30 text-xs tracking-wider uppercase text-[#F1E8D6]/70 hover:text-[#F1E8D6]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F4B183] text-[#12302F] font-bold text-xs tracking-wider uppercase hover:bg-[#f6c29d]"
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
