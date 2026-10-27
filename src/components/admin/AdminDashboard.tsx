import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  FileCheck2,
  AlertTriangle,
  Building,
  GraduationCap,
  Award,
  Eye,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  onSelectTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ onSelectTab }) => {
  const {
    doctors,
    appointments,
    auditLogs,
    verifyDoctor,
    flagDoctorFraud,
  } = useApp();

  const [fraudReasonModalDocId, setFraudReasonModalDocId] = useState<string | null>(null);
  const [fraudReasonText, setFraudReasonText] = useState('');
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const pendingDoctors = doctors.filter(d => !d.isVerified && d.verificationStatus !== 'flagged');
  const verifiedDoctors = doctors.filter(d => d.isVerified);
  const flaggedDoctors = doctors.filter(d => d.verificationStatus === 'flagged');

  const handleApprove = (doctorId: string, name: string) => {
    verifyDoctor(doctorId, 'verified');
    setActionSuccessNotice(`Physician ${name} has been verified! Their profile now features the administrator-verified badge.`);
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleReject = (doctorId: string, name: string) => {
    verifyDoctor(doctorId, 'rejected');
    setActionSuccessNotice(`Credentials for ${name} were marked as rejected. Additional documentation requested.`);
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleConfirmFraud = () => {
    if (!fraudReasonModalDocId || !fraudReasonText.trim()) return;
    flagDoctorFraud(fraudReasonModalDocId, fraudReasonText.trim());
    setActionSuccessNotice('Doctor profile was reported and flagged as fraudulent. Account suspended.');
    setFraudReasonModalDocId(null);
    setFraudReasonText('');
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            Administrator Compliance & Verification Desk
          </h1>
          <p className="text-sm text-slate-600">
            Verify state medical licenses, prevent fraudulent provider listings, and audit sensitive record queries.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('admin-audit-logs')}
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Security Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {actionSuccessNotice && (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessNotice}</span>
        </div>
      )}

      {/* ADMIN PRIVACY NOTICE SAFEGUARD */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 text-white shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-4 h-4 text-purple-400" />
          <span>Strict Administrator Privacy Safeguard (HIPAA / Zero-Trust Standard)</span>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed">
          Platform administrators have full oversight over credential verification, account compliance, and security logs. However, administrators are <strong>strictly forbidden from casually browsing patient health records</strong>. MediLink's Firestore rules deny read access on clinical records to admin tokens to ensure absolute patient confidentiality.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Verification</div>
          <div className="text-2xl font-black text-amber-600">{pendingDoctors.length}</div>
          <div className="text-[11px] text-amber-700 font-medium">Awaiting license review</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Doctors</div>
          <div className="text-2xl font-black text-emerald-600">{verifiedDoctors.length}</div>
          <div className="text-[11px] text-emerald-700 font-medium">In good standing</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flagged Fraudulent</div>
          <div className="text-2xl font-black text-rose-600">{flaggedDoctors.length}</div>
          <div className="text-[11px] text-rose-700 font-medium">Suspended profiles</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Audit Log Entries</div>
          <div className="text-2xl font-black text-purple-700">{auditLogs.length}</div>
          <div className="text-[11px] text-purple-600 font-medium">Total logged events</div>
        </div>
      </div>

      {/* Credential Verification Desk Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Doctor Credential Verification Queue</h2>
            <p className="text-xs text-slate-500">Review state medical license numbers and approve verified badges</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            {pendingDoctors.length} Requires Review
          </span>
        </div>

        {pendingDoctors.length > 0 ? (
          <div className="space-y-4">
            {pendingDoctors.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-amber-200/80 bg-amber-50/20 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                    />
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-sm">{doc.name}</div>
                      <div className="font-semibold text-teal-700">{doc.specialty}</div>
                      <div className="text-slate-500">{doc.clinicName} — {doc.city}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase self-start">
                    Pending Verification
                  </span>
                </div>

                {/* Submitted Credentials Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-white rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">License Number</span>
                    <strong className="text-slate-900 font-mono">{doc.licenseNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Licensing Board</span>
                    <strong className="text-slate-900">{doc.medicalBoard}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Medical Degree</span>
                    <strong className="text-slate-900">{doc.education}</strong>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed italic">
                  "{doc.bio}"
                </p>

                {/* Decision Action Buttons */}
                <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    onClick={() => setFraudReasonModalDocId(doc.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold transition cursor-pointer"
                  >
                    Flag as Fraudulent
                  </button>

                  <button
                    onClick={() => handleReject(doc.id, doc.name)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                  >
                    Request More Documentation
                  </button>

                  <button
                    onClick={() => handleApprove(doc.id, doc.name)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve & Mark Verified</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            No doctors currently pending verification. All submitted credentials have been audited.
          </div>
        )}
      </div>

      {/* Directory of Verified Doctors (With Fraud Reporting) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Active Verified Directory ({verifiedDoctors.length})
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {verifiedDoctors.map(doc => (
            <div key={doc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{doc.name}</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    License Active
                  </span>
                </div>
                <div className="text-slate-500">
                  {doc.specialty} • {doc.clinicName} • License: {doc.licenseNumber}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFraudReasonModalDocId(doc.id)}
                  className="text-rose-600 hover:text-rose-800 font-medium text-xs cursor-pointer"
                >
                  Report Suspicious Activity
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flag Fraudulent Profile Modal */}
      {fraudReasonModalDocId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Report & Flag Fraudulent Doctor Profile
              </h3>
              <button onClick={() => setFraudReasonModalDocId(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              Flagging a doctor profile immediately suspends their ability to receive appointments and revokes their verified badge. An immutable incident entry will be created in the platform audit log.
            </p>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reason for Fraud Flag *</label>
              <textarea
                rows={3}
                placeholder="Detail reason (e.g., revoked state license, impersonation, fabricated credentials)..."
                value={fraudReasonText}
                onChange={e => setFraudReasonText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setFraudReasonModalDocId(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFraud}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
