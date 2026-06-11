import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { StatCard } from '../../components/StatCard';
import { 
  Calendar, Users, CheckCircle, BarChart3, 
  ArrowRight, PlusCircle, Clock, History,
  ArrowUpRight
} from 'lucide-react';
import { chartData } from '../../data/mockData';

export default function AdminDashboard() {
  const [dbStats, setDbStats] = useState({ totalEvents: 0, registrations: 0 });
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminApi.getAdminEvents();
        setDbStats({
          totalEvents: res.data.length || 0,
          registrations: res.data.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0)
        });
        setRecentEvents(res.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10 text-white">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Admin <span className="gradient-text">Dashboard</span></h1>
            <p className="text-slate-400">Welcome back! Manage your campus events and students.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard icon={Calendar} label="Total Events" value={loading ? '...' : dbStats.totalEvents} color="indigo" />
            <StatCard icon={Users} label="Total Registrations" value={loading ? '...' : dbStats.registrations} color="emerald" />
            <StatCard icon={CheckCircle} label="Success Rate" value="98%" color="cyan" />
            <StatCard icon={Clock} label="Pending Tasks" value="12" color="amber" />
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
               <div className="glass rounded-3xl p-8 border border-white/5 bg-indigo-600/5">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <BarChart3 className="text-indigo-400" size={20} /> Registration Performance
                    </h3>
                  </div>
                  <div className="w-full h-64 flex items-end justify-between gap-4 px-4 pt-10 border-t border-white/5">
                    {chartData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="w-full bg-indigo-500/20 rounded-t-lg relative overflow-hidden group-hover:bg-indigo-500/30 transition-all duration-500" style={{ height: `${(d.registrations/550)*100}%` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/40 to-transparent" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">{d.name}</span>
                        </div>
                    ))}
                  </div>
               </div>
            </div>

            <div className="space-y-6">
              <div className="glass p-6 rounded-3xl border border-white/5">
                <div className="flex items-center gap-2 mb-6 text-indigo-400">
                  <History size={20} />
                  <h3 className="text-lg font-bold text-white">Recent Events</h3>
                </div>
                <div className="space-y-5">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
                    ))
                  ) : recentEvents.length > 0 ? (
                    recentEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden shrink-0 border border-white/5">
                          <img src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80'} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-bold truncate group-hover:text-indigo-400 transition-colors uppercase">{event.title}</h4>
                          <p className="text-slate-500 text-[10px] font-bold mt-0.5">{event.registeredCount} Students registered</p>
                        </div>
                        <ArrowUpRight size={16} className="text-slate-700 group-hover:text-indigo-400 transition-all" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                        <PlusCircle size={24} className="text-slate-800 mx-auto mb-2" />
                        <p className="text-slate-500 text-xs mb-3">No events found</p>
                        <a href="/admin/create-event" className="text-xs font-bold text-indigo-400 hover:underline">Create Event</a>
                    </div>
                  )}
                </div>
                {!loading && recentEvents.length > 0 && (
                    <a href="/admin/events" className="block text-center text-[10px] font-bold text-slate-500 hover:text-white mt-6 pt-4 border-t border-white/5 tracking-widest uppercase transition-all">
                        View All Activity
                    </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
