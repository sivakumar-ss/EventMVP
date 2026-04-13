import React, { useState, useEffect } from 'react';
import { adminApi, eventApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { StatCard } from '../../components/StatCard';
import { 
  Calendar, Users, CheckCircle, BarChart3, 
  Plus, ArrowUpRight, TrendingUp, History 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartData, adminStats } from '../../data/mockData';

export default function AdminDashboard() {
  const [dbStats, setDbStats] = useState({ totalEvents: 0, registrations: 0 });
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await eventApi.getAllPublic();
        setDbStats({
            totalEvents: res.data.length,
            registrations: res.data.reduce((acc, curr) => acc + curr.registeredCount, 0)
        });
        setRecentEvents(res.data.slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Admin <span className="gradient-text">Dashboard</span></h1>
              <p className="text-slate-400">Monitor campus events and student participation.</p>
            </div>
            <a href="/admin/create-event" className="btn-primary flex items-center gap-2">
              <Plus size={20} /> Create New Event
            </a>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard icon={Calendar} label="Total Events" value={dbStats.totalEvents || adminStats.totalEvents} trend={12} color="indigo" />
            <StatCard icon={Users} label="Total Registrations" value={dbStats.registrations || adminStats.totalRegistrations} trend={8} color="cyan" />
            <StatCard icon={CheckCircle} label="Active Events" value={dbStats.totalEvents || adminStats.activeEvents} trend={5} color="emerald" />
            <StatCard icon={TrendingUp} label="Reach" value="12.4k" trend={24} color="purple" />
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Chart Section */}
            <div className="lg:col-span-2 space-y-10">
              <div className="glass p-8 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <BarChart3 className="text-indigo-400" size={20} /> Registration Trends
                  </h2>
                  <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-400 outline-none">
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{backgroundColor: 'rgba(15, 15, 40, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                        itemStyle={{color: '#fff'}}
                      />
                      <Area type="monotone" dataKey="registrations" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="space-y-6">
              <div className="glass p-6 rounded-3xl border border-white/5 h-full">
                <div className="flex items-center gap-2 mb-6">
                  <History className="text-indigo-400" size={20} />
                  <h2 className="text-xl font-bold text-white">Recent Events</h2>
                </div>
                <div className="space-y-5">
                  {recentEvents.map((event, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                        <img src={event.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-bold truncate group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                        <p className="text-slate-500 text-xs">{event.registeredCount} Students registered</p>
                      </div>
                      <ArrowUpRight size={16} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  ))}
                  <a href="/admin/events" className="block text-center text-xs font-bold text-indigo-400 hover:text-indigo-300 mt-6 pt-4 border-t border-white/5 transition-all">
                    View All Events
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
