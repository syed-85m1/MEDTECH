import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Search,
  Calendar,
  Clock,
  ShieldCheck,
  Stethoscope,
  Users,
  FileText,
  Lock,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileNavigation: React.FC<Props> = ({ currentTab, onSelectTab }) => {
  const { activeRole, appointments, accessGrants } = useApp();

  const pendingCount = appointments.filter(a => a.status === 'requested').length;
  const activeGrants = accessGrants.filter(g => g.status === 'active').length;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {activeRole === 'patient' && (
          <>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'dashboard' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Home className={`w-5 h-5 mb-0.5 ${currentTab === 'dashboard' ? 'stroke-[2.5]' : ''}`} />
              <span>Home</span>
            </button>

            <button
              onClick={() => onSelectTab('find-doctors')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'find-doctors' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Search className={`w-5 h-5 mb-0.5 ${currentTab === 'find-doctors' ? 'stroke-[2.5]' : ''}`} />
              <span>Doctors</span>
            </button>

            <button
              onClick={() => onSelectTab('appointments')}
              className={`relative flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'appointments' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Calendar className={`w-5 h-5 mb-0.5 ${currentTab === 'appointments' ? 'stroke-[2.5]' : ''}`} />
              <span>Visits</span>
              {pendingCount > 0 && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white" />
              )}
            </button>

            <button
              onClick={() => onSelectTab('timeline')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'timeline' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Clock className={`w-5 h-5 mb-0.5 ${currentTab === 'timeline' ? 'stroke-[2.5]' : ''}`} />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => onSelectTab('access-control')}
              className={`relative flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'access-control' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Lock className={`w-5 h-5 mb-0.5 ${currentTab === 'access-control' ? 'stroke-[2.5]' : ''}`} />
              <span>Access</span>
              {activeGrants > 0 && (
                <span className="absolute top-1 right-2 text-[9px] bg-teal-100 text-teal-800 font-bold px-1 rounded-full">
                  {activeGrants}
                </span>
              )}
            </button>
          </>
        )}

        {activeRole === 'doctor' && (
          <>
            <button
              onClick={() => onSelectTab('doctor-dashboard')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'doctor-dashboard' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Stethoscope className="w-5 h-5 mb-0.5" />
              <span>Desk</span>
            </button>

            <button
              onClick={() => onSelectTab('doctor-appointments')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'doctor-appointments' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Calendar className="w-5 h-5 mb-0.5" />
              <span>Queue</span>
            </button>

            <button
              onClick={() => onSelectTab('doctor-patient-records')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'doctor-patient-records' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Lock className="w-5 h-5 mb-0.5" />
              <span>Records</span>
            </button>

            <button
              onClick={() => onSelectTab('doctor-profile')}
              className={`flex flex-col items-center py-1.5 px-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'doctor-profile' ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users className="w-5 h-5 mb-0.5" />
              <span>Credentials</span>
            </button>
          </>
        )}

        {activeRole === 'admin' && (
          <>
            <button
              onClick={() => onSelectTab('admin-dashboard')}
              className={`flex flex-col items-center py-1.5 px-4 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'admin-dashboard' ? 'text-purple-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-5 h-5 mb-0.5" />
              <span>Verification</span>
            </button>

            <button
              onClick={() => onSelectTab('admin-audit-logs')}
              className={`flex flex-col items-center py-1.5 px-4 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                currentTab === 'admin-audit-logs' ? 'text-purple-700 font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5 mb-0.5" />
              <span>Audit Logs</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
