import React from 'react';
import MasterSidebar from '../../components/MasterSidebar';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Security() {
  const mockLogs = [
    { id: 1, type: 'ALERT', message: 'Failed login attempt from IP 192.168.1.100', time: '2 mins ago', icon: AlertTriangle, color: 'rose' },
    { id: 2, type: 'SUCCESS', message: 'Master Admin logged in successfully', time: '1 hour ago', icon: CheckCircle, color: 'emerald' },
    { id: 3, type: 'INFO', message: 'New college admin registration pending', time: '3 hours ago', icon: Info, color: 'indigo' },
    { id: 4, type: 'SUCCESS', message: 'College admin application approved', time: '5 hours ago', icon: Shield, color: 'amber' },
  ];

  return (
    <div className="flex min-h-screen">
      <MasterSidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Security <span className="gradient-text">Log</span></h1>
            <p className="text-slate-400">Monitor platform-wide security events and administrative actions.</p>
          </header>

          <div className="glass rounded-3xl p-6 border border-white/5">
            <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {mockLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-${log.color}-500/10 flex items-center justify-center text-${log.color}-400 shrink-0`}>
                    <log.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{log.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{log.type} • {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
