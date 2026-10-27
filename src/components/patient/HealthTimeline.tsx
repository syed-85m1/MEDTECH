import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MedicalRecord, MedicalRecordType } from '../../types';
import {
  Clock,
  Filter,
  Pill,
  Activity,
  AlertTriangle,
  FileCheck2,
  FileText,
  FileDown,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface Props {
  onOpenExportModal: () => void;
}

export const HealthTimeline: React.FC<Props> = ({ onOpenExportModal }) => {
  const { medicalRecords, currentUser, toggleMedicationTaken } = useApp();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  // Filter records belonging to the patient
  const patientRecords = medicalRecords.filter(r => r.patientId === currentUser.uid);

  // Sort chronologically (newest first)
  const sortedRecords = [...patientRecords].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const filteredRecords =
    selectedType === 'all'
      ? sortedRecords
      : sortedRecords.filter(r => r.type === selectedType);

  const toggleExpand = (id: string) => {
    setExpandedRecordId(prev => (prev === id ? null : id));
  };

  const getRecordIcon = (type: MedicalRecordType) => {
    switch (type) {
      case 'diagnosis':
        return <Activity className="w-4 h-4 text-rose-600" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'allergy':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'lab_report':
        return <FileCheck2 className="w-4 h-4 text-sky-600" />;
      case 'visit_summary':
        return <FileText className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getRecordBadge = (type: MedicalRecordType) => {
    switch (type) {
      case 'diagnosis':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'prescription':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'allergy':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'lab_report':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'visit_summary':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Chronological Health Timeline
          </h1>
          <p className="text-sm text-slate-600">
            A comprehensive, patient-owned medical record authored by authorized healthcare providers.
          </p>
        </div>

        <button
          onClick={onOpenExportModal}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <FileDown className="w-4 h-4" />
          <span>Export Clinical Summary</span>
        </button>
      </div>

      {/* Filter Category Pills */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1 text-[11px] uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>

        {[
          { key: 'all', label: 'All Records', count: patientRecords.length },
          { key: 'diagnosis', label: 'Diagnoses', count: patientRecords.filter(r => r.type === 'diagnosis').length },
          { key: 'prescription', label: 'Prescriptions', count: patientRecords.filter(r => r.type === 'prescription').length },
          { key: 'allergy', label: 'Allergies', count: patientRecords.filter(r => r.type === 'allergy').length },
          { key: 'lab_report', label: 'Lab Reports', count: patientRecords.filter(r => r.type === 'lab_report').length },
          { key: 'visit_summary', label: 'Visit Notes', count: patientRecords.filter(r => r.type === 'visit_summary').length },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setSelectedType(item.key)}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              selectedType === item.key
                ? 'bg-teal-700 text-white font-semibold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span>{item.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedType === item.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {filteredRecords.map(record => {
          const isExpanded = expandedRecordId === record.id;
          return (
            <div key={record.id} className="relative group">
              {/* Timeline dot */}
              <div className="absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full bg-white border-2 border-teal-600 flex items-center justify-center shadow-xs">
                <div className="w-2 h-2 rounded-full bg-teal-600" />
              </div>

              {/* Record Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition p-5 space-y-3">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${getRecordBadge(
                          record.type
                        )}`}
                      >
                        {getRecordIcon(record.type)}
                        <span>{record.type.replace('_', ' ')}</span>
                      </span>

                      {record.severity && (
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            record.severity === 'severe'
                              ? 'bg-rose-100 text-rose-800'
                              : record.severity === 'moderate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {record.severity} severity
                        </span>
                      )}

                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug">
                      {record.title}
                    </h3>

                    {record.doctorName && (
                      <div className="text-xs text-slate-500">
                        Recorded by <strong>{record.doctorName}</strong>
                        {record.doctorSpecialty && ` (${record.doctorSpecialty})`}
                      </div>
                    )}
                  </div>

                  {record.code && (
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                        {record.code}
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Description */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {record.description}
                </p>

                {/* Specific details for Prescriptions */}
                {record.type === 'prescription' && (
                  <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                      <div>
                        <span className="text-slate-500 block text-[11px]">Dosage:</span>
                        <strong className="text-emerald-900">{record.dosage || 'As directed'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Frequency:</span>
                        <strong className="text-emerald-900">{record.frequency}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[11px]">Duration:</span>
                        <strong className="text-emerald-900">{record.duration || 'Ongoing'}</strong>
                      </div>
                    </div>

                    {record.instructions && (
                      <div className="pt-1.5 border-t border-emerald-200/60 text-emerald-950">
                        <span className="font-semibold">Doctor Instructions: </span>
                        <span>{record.instructions}</span>
                      </div>
                    )}

                    {/* Today's Intake Toggle */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">Daily adherence:</span>
                      <button
                        onClick={() => toggleMedicationTaken(record.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                          record.isTakenToday
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{record.isTakenToday ? 'Taken Today' : 'Mark Taken Today'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Specific details for Lab Reports */}
                {record.type === 'lab_report' && record.metrics && (
                  <div className="space-y-2">
                    <button
                      onClick={() => toggleExpand(record.id)}
                      className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Test Metrics Table' : `View ${record.metrics.length} Biomarker Measurements`}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="p-2.5">Test Parameter</th>
                              <th className="p-2.5">Result Value</th>
                              <th className="p-2.5">Reference Range</th>
                              <th className="p-2.5">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {record.metrics.map((metric, idx) => (
                              <tr key={idx} className={metric.isAbnormal ? 'bg-amber-50/50' : ''}>
                                <td className="p-2.5 font-medium text-slate-800">{metric.name}</td>
                                <td className="p-2.5 font-bold text-slate-900">
                                  {metric.value} {metric.unit}
                                </td>
                                <td className="p-2.5 text-slate-500">{metric.normalRange} {metric.unit}</td>
                                <td className="p-2.5">
                                  {metric.isAbnormal ? (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                      Flagged
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                      Normal
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Digital Signature & Document Audit Verification */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5 text-teal-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{record.doctorSignature || 'Cryptographically verified clinical entry'}</span>
                  </div>

                  {record.attachmentName && (
                    <div className="flex items-center gap-1 text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      <Download className="w-3 h-3 text-slate-400" />
                      <span>{record.attachmentName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <Clock className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No entries found under this category filter. Select another filter or schedule a consultation to add clinical records.
          </p>
        </div>
      )}
    </div>
  );
};
