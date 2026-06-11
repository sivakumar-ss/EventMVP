import React, { useState, useEffect } from 'react';
import { masterAdminApi } from '../../services/api';
import MasterSidebar from '../../components/MasterSidebar';
import { StatCard } from '../../components/StatCard';
import { 
  Shield, Users, School, Calendar,
  ArrowUpRight, Crown, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MasterDashboard() {
  const [stats, setStats] = useState({ totalAdmins: 0, totalStudents: 0, totalEvents: 0 });
  const [recentAdmins, setRecentAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, adminsRes] = await Promise.all([
          masterAdminApi.getStats(),
          masterAdminApi.getAdmins()
        ]);
        setStats(statsRes.data);
        setRecentAdmins(adminsRes.data.slice(0, 5));
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex">
      <MasterSidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10 text-white">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Crown size={20} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">Master <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Control</span></h1>
            </div>
            <p className="text-slate-400 ml-[52px]">Platform-wide oversight of all colleges, admins, and students.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard icon={School} label="College Admins" value={loading ? '...' : stats.totalAdmins} color="amber" />
            <StatCard icon={Users} label="Students" value={loading ? '...' : stats.totalStudents} color="emerald" />
            <StatCard icon={Calendar} label="Total Events" value={loading ? '...' : stats.totalEvents} color="indigo" />
            <StatCard icon={Activity} label="Platform Status" value="Active" color="cyan" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent College Admins */}
            <div className="glass rounded-3xl p-8 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Shield className="text-amber-400" size={20} /> College Admins
                </h3>
                <a href="/master-admin/accounts" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors">
                  View All →
                </a>
              </div>
              <div className="space-y-4">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
                  ))
                ) : recentAdmins.length > 0 ? (
                  recentAdmins.map((admin) => (
                    <div key={admin.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/[0.02] transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500/20">
                        {admin.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{admin.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{admin.email}</p>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400/60 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/10">
                        {admin.collegeName || 'N/A'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Shield size={32} className="text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">No college admins found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Overview */}
            <div className="glass rounded-3xl p-8 border border-white/5">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="text-amber-400" size={20} />
                <h3 className="text-lg font-bold text-white">Platform Overview</h3>
              </div>
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admins vs Students</span>
                    <span className="text-xs font-bold text-amber-400">
                      {stats.totalAdmins + stats.totalStudents} Total
                    </span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000"
                      style={{ width: `${stats.totalAdmins + stats.totalStudents > 0 ? (stats.totalAdmins / (stats.totalAdmins + stats.totalStudents)) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-amber-400 font-bold">{stats.totalAdmins} Admins</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{stats.totalStudents} Students</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Events per Admin</span>
                    <span className="text-xs font-bold text-indigo-400">
                      {stats.totalAdmins > 0 ? (stats.totalEvents / stats.totalAdmins).toFixed(1) : 0} avg
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10">
                  <div className="flex items-center gap-3">
                    <Crown size={20} className="text-amber-400" />
                    <div>
                      <p className="text-sm font-bold text-white">Master Admin Panel</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Full control over all platform accounts and resources</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
