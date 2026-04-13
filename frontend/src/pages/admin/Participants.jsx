import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { adminApi, eventApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Search, Mail, Download, Users, ArrowLeft, Filter } from 'lucide-react';
import { mockParticipants } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function Participants() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get('eventId');
  
  const [participants, setParticipants] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (eventId) {
          const [detailsRes, partRes] = await Promise.all([
            eventApi.getById(eventId),
            adminApi.getParticipants(eventId)
          ]);
          setEventDetails(detailsRes.data);
          setParticipants(partRes.data);
        } else {
          // If no specific event, show all/mock
          setParticipants(mockParticipants);
        }
      } catch (err) {
        // Fallback to mock if API fails
        setParticipants(mockParticipants);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-4">
                <a href="/admin/events" className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                    <ArrowLeft size={20} />
                </a>
                <div>
                     <h1 className="text-4xl font-bold text-white mb-1">
                        {eventDetails ? eventDetails.title : 'All'} <span className="gradient-text">Participants</span>
                    </h1>
                    <p className="text-slate-400">Manage and export student registration data.</p>
                </div>
            </div>
          </header>

          <div className="glass rounded-3xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="glass-input-group relative w-full md:w-96">
                    <Search className="icon-left" size={18} />
                    <input
                        type="text"
                        placeholder="Search student by name or email..."
                        className="input-field input-with-icon"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none btn-secondary !py-2.5 !px-5 text-sm flex items-center justify-center gap-2">
                        <Filter size={16} /> Filters
                    </button>
                    <button onClick={() => toast.success('CSV Export Started')} className="flex-1 md:flex-none btn-primary !py-2.5 !px-5 text-sm flex items-center justify-center gap-2">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02]">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Student info</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Registration Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredParticipants.map((p, i) => (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                            {p.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{p.name}</p>
                                            <p className="text-xs text-slate-500">{p.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-white/5 text-slate-300 text-[10px] font-bold rounded-lg border border-white/5 uppercase">
                                        {p.role || 'Student'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">
                                    {new Date(p.registeredDate || Date.now()).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="w-9 h-9 glass rounded-lg inline-flex items-center justify-center text-slate-500 hover:text-white transition-all">
                                        <Mail size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredParticipants.length === 0 && (
                <div className="p-20 text-center">
                    <Users className="mx-auto text-slate-700 mb-4" size={48} />
                    <p className="text-slate-500">No participants found matching your criteria.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
