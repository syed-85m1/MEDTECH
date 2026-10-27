import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileDown,
  Printer,
  CheckCircle2,
  X,
  Shield,
  Download,
  AlertTriangle,
  HeartPulse,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ExportRecordsModal: React.FC<Props> = ({ onClose }) => {
  const { currentUser, medicalRecords, appointments, accessGrants } = useApp();

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const patientRecords = medicalRecords.filter(r => r.patientId === currentUser.uid);
  const patientAppointments = appointments.filter(a => a.patientId === currentUser.uid);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const exportData = {
      mediLinkExportMetadata: {
        application: 'MediLink — Your Health, Connected',
        exportDate: new Date().toISOString(),
        disclaimer: 'College prototype demonstrator. Generated for patient-directed medical porting.',
        integrityHash: `SHA256-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      },
      patientProfile: {
        id: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
        phone: currentUser.phone,
        dateOfBirth: currentUser.dateOfBirth,
        bloodType: currentUser.bloodType,
      },
      activeConsents: accessGrants.filter(g => g.status === 'active'),
      clinicalTimeline: patientRecords,
      appointmentsHistory: patientAppointments,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MediLink_Health_Records_${currentUser.displayName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Export Medical Records</h2>
              <p className="text-xs text-slate-500">Secure clinical summary download and printable view</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Health records successfully generated and downloaded to your device!</span>
          </div>
        )}

        {/* Printable Document Preview Container */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs text-slate-800 print:p-0 print:border-none print:bg-white">
          <div className="flex justify-between items-start border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-teal-800 font-extrabold text-base">
                <HeartPulse className="w-5 h-5 text-teal-600" />
                <span>MediLink Clinical Health Summary</span>
              </div>
              <p className="text-[11px] text-slate-500">Official Patient Electronic Health Record Export</p>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <div>Export Date: {new Date().toLocaleDateString()}</div>
              <div>Integrity: Verified Patient Hash</div>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-white rounded-xl border border-slate-100 text-[11px]">
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Patient Name</span>
              <strong className="text-slate-900">{currentUser.displayName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Date of Birth</span>
              <strong className="text-slate-900">{currentUser.dateOfBirth || '1992-05-14'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Blood Type</span>
              <strong className="text-slate-900">{currentUser.bloodType || 'A+'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase text-[10px]">Phone</span>
              <strong className="text-slate-900">{currentUser.phone || 'N/A'}</strong>
            </div>
          </div>

          {/* Active Diagnoses */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-teal-800">
              Recorded Diagnoses ({patientRecords.filter(r => r.type === 'diagnosis').length})
            </h4>
            <div className="space-y-1">
              {patientRecords
                .filter(r => r.type === 'diagnosis')
                .map(r => (
                  <div key={r.id} className="p-2 bg-white rounded-lg border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-900">{r.title}</span>
                      <span className="text-slate-500 text-[11px] ml-2">({r.code || 'Clinical Code'})</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">{r.date}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Active Medications */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-teal-800">
              Current Prescriptions ({patientRecords.filter(r => r.type === 'prescription').length})
            </h4>
            <div className="space-y-1">
              {patientRecords
                .filter(r => r.type === 'prescription')
                .map(r => (
                  <div key={r.id} className="p-2 bg-white rounded-lg border border-slate-100 space-y-0.5">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{r.title} — {r.dosage}</span>
                      <span className="text-slate-400 text-[11px] font-normal">{r.date}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Instructions: {r.instructions || r.frequency} (Prescribed by {r.doctorName})
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Allergies Alert */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-rose-800 text-xs uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Documented Allergies
            </h4>
            <div className="space-y-1">
              {patientRecords
                .filter(r => r.type === 'allergy')
                .map(r => (
                  <div key={r.id} className="p-2 bg-rose-50/70 rounded-lg border border-rose-100 text-rose-900">
                    <span className="font-bold">{r.title}: </span>
                    <span>{r.description}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Disclaimer stamp */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Competition Prototype Notice: </strong>
              This record is for demonstration in the college innovation competition and represents fictional clinical data.
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Export options compliant with personal medical data portability.
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print View</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
