import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  ShieldAlert,
  ShieldCheck,
  Filter,
  Lock,
  Clock,
  Search,
} from 'lucide-react';

export const AdminAuditLogs: React.FC = () => {
  const { auditLogs } = useApp();

  const [roleFilter, setRoleFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (roleFilter !== 'all' && log.actorRole !== roleFilter) return false;
    if (levelFilter !== 'all' && log.securityLevel !== levelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchActor = log.actorName.toLowerCase().includes(q);
      if (!matchAction && !matchDetails && !matchActor) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Lock className="w-6 h-6 text-purple-600" />
            Immutable Security & Clinical Access Audit Logs
          </h1>
          <p className="text-sm text-slate-600">
            Cryptographically sealed audit trail recording all patient consent updates, physician record queries, and admin actions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search audit actions, doctors, or details..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Role:</span>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Severity:</span>
            <select
              value={levelFilter}
              onChange={e => setLevelFilter(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500">
          Showing <strong>{filteredLogs.length}</strong> of {auditLogs.length} events
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor / User</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Action Event</th>
                <th className="p-3.5">Details</th>
                <th className="p-3.5">Security Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                    {log.actorName}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      log.actorRole === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : log.actorRole === 'doctor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}>
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-800 font-semibold whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="p-3.5 text-slate-600 max-w-md">
                    {log.details}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.securityLevel === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : log.securityLevel === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.securityLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
