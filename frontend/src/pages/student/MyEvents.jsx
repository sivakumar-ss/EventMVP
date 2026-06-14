import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { Download, Calendar, MapPin, ExternalLink, CheckCircle, Clock, Zap, Shield, Award, Star, Sparkles, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyEvents() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState(null);
  const [claiming, setClaiming] = useState(null);

  const location = useLocation();

  const fetchMyEvents = async () => {
    try {
      const res = await studentApi.getRegistrations();
      setRegistrations(res.data);
    } catch (err) {
      toast.error('Failed to load your registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDownloadCertificate = async (reg) => {
    if (!reg.certificateClaimed) {
      setClaiming(reg.registrationId);
      try {
        const res = await studentApi.claimCertificate(reg.registrationId);
        toast.success(res.data, { icon: '🏆', duration: 4000 });
        await fetchMyEvents();
      } catch (err) {
        toast.error(err?.response?.data || 'Failed to claim certificate');
        setClaiming(null);
        return;
      }
      setClaiming(null);
    }

    setSelectedReg(reg);
    setTimeout(() => {
      window.print();
      setSelectedReg(null);
    }, 500);
  };

  const getPointsLabel = (reg) => {
    if (!reg.category) return '5 pts';
    return reg.category.toLowerCase() === 'technical' ? '10 pts' : '5 pts';
  };

  const statusConfig = {
    VERIFIED: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: <CheckCircle size={14} />,
      label: 'Verified',
    },
    PENDING: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: <Clock size={14} />,
      label: 'Pending Approval',
    },
    REJECTED: {
      badge: 'bg-red-500/10 text-red-400 border-red-500/20',
      icon: <XCircle size={14} />,
      label: 'Rejected',
    },
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10 no-print">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">My <span className="gradient-text">Registrations</span></h1>
            <p className="text-slate-400">Track your events — download your certificate once verified to claim score points.</p>
          </header>

          {loading ? (
             <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-40 glass rounded-3xl animate-pulse bg-white/5" />
                ))}
             </div>
          ) : registrations.length > 0 ? (
            <div className="grid gap-6">
              {registrations.map(reg => {
                const regStatus = reg.registrationStatus || 'PENDING';
                const isVerified = regStatus === 'VERIFIED';
                const isRejected = regStatus === 'REJECTED';
                const isClaiming = claiming === reg.registrationId;
                const cfg = statusConfig[regStatus] || statusConfig.PENDING;

                return (
                  <div
                    key={reg.id}
                    className={`glass rounded-3xl p-6 border flex flex-col md:flex-row items-center gap-6 group transition-all
                      ${isVerified ? 'border-emerald-500/10 hover:bg-white/[0.03]' : isRejected ? 'border-red-500/10 opacity-70' : 'border-white/5 hover:bg-white/[0.03]'}`}
                  >
                    {/* Event Image */}
                    <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shrink-0">
                      <img
                          src={reg.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'}
                          alt={reg.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-white">{reg.title}</h3>
                          {/* Registration status badge */}
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cfg.badge}`}>
                            {cfg.icon} {cfg.label}
                          </span>
                          {/* Category badge */}
                          {reg.category && (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${reg.category.toLowerCase() === 'technical' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                              {reg.category}
                            </span>
                          )}
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-400 mb-3">
                          <div className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-indigo-400" />
                              <span>{new Date(reg.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                              <MapPin size={14} className="text-indigo-400" />
                              <span>{reg.venue}</span>
                          </div>
                          {isVerified && (
                            <div className="flex items-center gap-1.5">
                                <Star size={14} className="text-yellow-400" />
                                <span className="text-yellow-400 font-semibold">{getPointsLabel(reg)}</span>
                            </div>
                          )}
                      </div>

                      {/* Sub-status info */}
                      {isVerified && reg.certificateClaimed && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                          <Sparkles size={12} /> Points Added to Your Score!
                        </div>
                      )}
                      {regStatus === 'PENDING' && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                          <AlertCircle size={12} /> Waiting for admin to verify your payment
                        </div>
                      )}
                      {isRejected && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                          <XCircle size={12} /> Registration was not approved
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 space-y-3 w-full md:w-auto">
                      {isVerified ? (
                        <>
                          <div className="flex items-center gap-2 text-emerald-400 font-bold px-4 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10 justify-center">
                              <CheckCircle size={18} /> Verified
                          </div>
                          <button
                              id={`cert-btn-${reg.registrationId}`}
                              onClick={() => handleDownloadCertificate(reg)}
                              disabled={isClaiming}
                              className={`w-full flex items-center justify-center gap-2 btn-primary !py-2.5 !px-6 text-sm transition-all ${isClaiming ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                              {isClaiming ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Claiming...
                                </>
                              ) : reg.certificateClaimed ? (
                                <>
                                  <Download size={16} /> Download Again
                                </>
                              ) : (
                                <>
                                  <Award size={16} /> Get Certificate &amp; Points
                                </>
                              )}
                          </button>
                        </>
                      ) : regStatus === 'PENDING' ? (
                        <div className="flex items-center gap-2 text-amber-400 font-bold px-4 py-2 bg-amber-500/5 rounded-xl border border-amber-500/10 justify-center">
                            <Clock size={18} /> Awaiting Verification
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400 font-bold px-4 py-2 bg-red-500/5 rounded-xl border border-red-500/10 justify-center">
                            <XCircle size={18} /> Not Approved
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 glass rounded-3xl border border-white/5">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-700">
                    <Calendar size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">You haven't registered for any events yet</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">Explore all active events and start your journey!</p>
                <a href="/student/events" className="btn-primary inline-flex items-center gap-2">
                    Browse All Events <Zap size={18} />
                </a>
            </div>
          )}
        </div>
      </div>

      {/* Printable Certificate */}
      {selectedReg && (
        <div id="certificate" className="print-only fixed inset-0 bg-white z-[9999] flex items-center justify-center p-10">
            <div className="w-[800px] h-[600px] border-[20px] border-double border-indigo-900 p-10 relative bg-slate-50 shadow-inner">
                <div className="absolute top-4 left-4 w-16 h-16 border-t-8 border-l-8 border-indigo-600" />
                <div className="absolute top-4 right-4 w-16 h-16 border-t-8 border-r-8 border-indigo-600" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-8 border-l-8 border-indigo-600" />
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-8 border-r-8 border-indigo-600" />

                <div className="text-center space-y-8 mt-10">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                            <Shield size={40} fill="currentColor" />
                        </div>
                    </div>
                    <h1 className="text-5xl font-serif font-extrabold text-indigo-900 uppercase tracking-widest">Certificate of Participation</h1>
                    <p className="text-xl italic text-slate-600 font-serif">This certifies that</p>
                    <h2 className="text-4xl font-bold text-slate-800 border-b-2 border-slate-300 pb-2 inline-block px-10">
                        {user?.name || 'Active Student'}
                    </h2>
                    <p className="text-lg text-slate-600 font-serif max-w-xl mx-auto">
                        has successfully participated in the event <br/>
                        <span className="font-bold text-indigo-700 font-sans">"{selectedReg.title}"</span><br/>
                        held at {selectedReg.venue} on {new Date(selectedReg.date).toLocaleDateString()}.
                    </p>
                    <div className="pt-20 flex justify-between px-20 relative">
                        <div className="text-center">
                            <div className="w-40 border-b border-slate-900 mb-2" />
                            <p className="text-xs font-bold text-slate-900 uppercase">Event Coordinator</p>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 -top-10">
                            <div className="w-24 h-24 rounded-full border-4 border-indigo-200 flex items-center justify-center rotate-12 opacity-50 bg-indigo-50">
                                <Award className="text-indigo-400" size={48} />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="w-40 border-b border-slate-900 mb-2" />
                            <p className="text-xs font-bold text-slate-900 uppercase">College Principal</p>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-10">Verification ID: {selectedReg.id?.toString().padStart(8,'0').toUpperCase()}-{Date.now()}</p>
                </div>
            </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          .print-only { display: flex !important; visibility: visible !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; }
          #certificate { position: absolute; top: 0; left: 0; width: 100%; height: 100%; margin: 0; padding: 0; }
        }
        .print-only { display: none; }
      `}} />
    </div>
  );
}
