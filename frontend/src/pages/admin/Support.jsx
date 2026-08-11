import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { adminApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Send, Clock, CheckCircle, Search, HelpCircle } from 'lucide-react';

export default function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await adminApi.getMySupportTickets();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !description) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await adminApi.createSupportTicket({ subject, description });
      toast.success('Support ticket submitted successfully!');
      setSubject('');
      setDescription('');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to submit support ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10 min-w-0">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Help & <span className="gradient-text">Support</span></h1>
            <p className="text-slate-400">Report issues or request assistance from the Master Admin.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ticket Submission Form */}
            <div className="lg:col-span-1">
              <div className="glass rounded-3xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                    <HelpCircle className="text-indigo-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">New Ticket</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Brief issue description"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Details</label>
                    <textarea
                      className="input-field min-h-[150px] resize-y"
                      placeholder="Describe your issue in detail..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full btn-primary flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full " /> Submitting...</>
                    ) : (
                      <><Send size={18} /> Submit Ticket</>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Past Tickets List */}
            <div className="lg:col-span-2">
              <div className="glass rounded-3xl p-6 border border-white/5 h-full">
                <h2 className="text-xl font-bold text-white mb-6">Your Tickets</h2>
                
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="h-24 bg-white/5 rounded-2xl" />
                    ))}
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="mx-auto text-slate-600 mb-3" size={32} />
                    <p className="text-slate-400 text-sm">You haven't submitted any support tickets yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center justify-between mb-2">
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
                        <p className="text-sm text-slate-400 mb-4 whitespace-pre-wrap">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                          <span>Created: {ticket.createdAt}</span>
                          {ticket.resolvedAt && (
                            <span className="text-emerald-400/70">Resolved: {ticket.resolvedAt}</span>
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
      </div>
    </div>
  );
}
