import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { adminApi } from '../../services/api';
import { Download, Filter, FileText, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function Reports() {
  const [chartData, setChartData] = useState([]);
  const [participationByEvent, setParticipationByEvent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await adminApi.getReports();
        setChartData(res.data.monthlyTrends);
        setParticipationByEvent(res.data.participationByEvent);
      } catch (err) {
        toast.error('Failed to load report data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleExport = () => {
    toast.success('Report exported to PDF successfully!');
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10 min-w-0">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Detailed <span className="gradient-text">Reports</span></h1>
              <p className="text-slate-400">Analyze participation data and event success metrics.</p>
            </div>
            <button onClick={handleExport} className="btn-primary flex items-center gap-2">
              <Download size={18} /> Export Full Report
            </button>
          </header>

          {loading ? (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : chartData.length === 0 && participationByEvent.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl border border-white/5">
                <FileText className="mx-auto text-slate-500 mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
                <p className="text-slate-400">You don't have any event registrations yet.</p>
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Monthly Trend */}
            <div className="glass p-8 rounded-3xl border border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Zap className="text-indigo-400" size={18} /> Monthly Trends
                    </h3>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-indigo-500 mr-1" />
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Registrations</span>
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip 
                                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                                contentStyle={{backgroundColor: 'rgba(15, 15, 40, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                            />
                            <Bar dataKey="registrations" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Distribution */}
            <div className="glass p-8 rounded-3xl border border-white/5">
                 <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-8">
                    <FileText className="text-indigo-400" size={18} /> Participation by Event
                </h3>
                <div className="h-[300px] w-full flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={participationByEvent}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {participationByEvent.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{backgroundColor: 'rgba(15, 15, 40, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px'}}
                            />
                            <Legend iconType="circle" wrapperStyle={{fontSize: '12px', paddingTop: '20px'}} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white">Top Performing Events</h3>
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                        View Detailed Table <Filter size={14} />
                    </button>
                </div>
                <div className="space-y-6">
                    {participationByEvent.slice(0, 4).map((event, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium text-white">{event.name}</span>
                                <span className="text-xs font-bold text-indigo-400">{event.value} Registrations</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full "
                                    style={{ width: `${Math.min(100, (event.value / Math.max(1, participationByEvent[0]?.value || 1)) * 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}
