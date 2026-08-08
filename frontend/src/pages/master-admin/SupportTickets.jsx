import React, { useState, useEffect } from 'react';
import MasterSidebar from '../../components/MasterSidebar';
import { masterAdminApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Search, CheckCircle, Clock, Inbox, Check } from 'lucide-react';

export default function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [filter, setFilter] = useState('ALL'); // ALL, OPEN, RESOLVED

  const fetchTickets = async () => {
    try {
      const res = await masterAdminApi.getAllSupportTickets();
      setTickets(res.data);
    } catch (err) {
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await masterAdminApi.resolveSupportTicket(id);
      toast.success('Ticket resolved successfully');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to resolve ticket');
    } finally {
      setResolvingId(null);
    }
  };

  const filteredTickets = tickets.filter(t => filter === 'ALL' || t.status === filter);

  return (
    <div className="flex min-h-screen">
      <MasterSidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Support <span className="gradient-text">Tickets</span></h1>
            <p className="text-slate-400">Review and resolve issues reported by College Admins.</p>
          </header>

          <div className="glass rounded-3xl p-6 border border-white/5">
            <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'ALL' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                All Tickets
              </button>
              <button
                onClick={() => setFilter('OPEN')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'OPEN' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Open
              </button>
              <button
                onClick={() => setFilter('RESOLVED')}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                Resolved
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-white/5 rounded-2xl" />
                ))}
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-20">
                <Inbox className="mx-auto text-slate-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
                <p className="text-slate-400 text-sm">There are no {filter !== 'ALL' ? filter.toLowerCase() : ''} support tickets.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row gap-6 hover:border-white/10 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white text-lg">{ticket.subject}</h3>
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg border ${
                          ticket.status === 'RESOLVED' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {ticket.status === 'RESOLVED' ? (
                            <span className="flex items-center gap-1"><CheckCircle size={12} /> Resolved</span>
                          ) : (
                            <span className="flex items-center gap-1"><Clock size={12} /> Open</span>
                          )}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-4 whitespace-pre-wrap">{ticket.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                          <div className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px]">
                            {ticket.adminName[0].toUpperCase()}
                          </div>
                          {ticket.adminName} ({ticket.adminEmail})
                        </span>
                        <span>Created: {ticket.createdAt}</span>
                        {ticket.resolvedAt && (
                          <span className="text-emerald-400/70">Resolved: {ticket.resolvedAt}</span>
                        )}
                      </div>
                    </div>

                    <div className="md:border-l md:border-white/5 md:pl-6 flex flex-col justify-center shrink-0">
                      {ticket.status === 'OPEN' ? (
                        <button
                          onClick={() => handleResolve(ticket.id)}
                          disabled={resolvingId === ticket.id}
                          className={`btn-primary flex items-center justify-center gap-2 !py-2.5 ${resolvingId === ticket.id ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          {resolvingId === ticket.id ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full " /> Resolving...</>
                          ) : (
                            <><Check size={18} /> Mark Resolved</>
                          )}
                        </button>
                      ) : (
                        <div className="px-4 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 flex items-center justify-center gap-2 text-sm font-bold">
                          <CheckCircle size={18} /> Issue Resolved
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
