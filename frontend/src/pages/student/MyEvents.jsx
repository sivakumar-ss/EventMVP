import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import {
  Download, Calendar, MapPin, CheckCircle, Clock,
  Zap, Shield, Award, Star, Sparkles, XCircle, AlertCircle,
  Ticket, QrCode, Hash
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Entry Card (printable ticket) ─── */
function EntryCard({ reg, user, onClose }) {
  const regCode = `EVT-${String(reg.registrationId).padStart(6, '0')}`;
  const eventDate = new Date(reg.date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 no-print-overlay"
      style={{ background: 'rgba(2,6,23,0.92)', backdropFilter: 'blur(12px)' }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all z-10 no-print"
      >
        ✕
      </button>

      <div className="w-full max-w-md">
        {/* Screen card */}
        <div
          id="entry-card-printable"
          className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20"
          style={{
            background: 'linear-gradient(135deg, #0f0c29 0%, #1a1060 50%, #24243e 100%)',
            border: '1px solid rgba(99,102,241,0.3)'
          }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-600/20 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-purple-600/20 blur-2xl pointer-events-none" />

          {/* Header */}
          <div className="relative px-8 pt-8 pb-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Ticket size={16} className="text-white" />
                </div>
                <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Event Entry Pass</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                reg.registrationStatus === 'VERIFIED'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {reg.registrationStatus === 'VERIFIED' ? '✓ Verified' : '⏳ Pending'}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">{reg.title}</h2>
            <p className="text-indigo-300 text-xs font-medium">{reg.collegeName || 'Campus Event'}</p>
          </div>

          {/* Details */}
          <div className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Participant</p>
                <p className="text-white font-bold text-sm">{user?.name || 'Student'}</p>
                <p className="text-slate-400 text-xs">{user?.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Category</p>
                <p className="text-white font-bold text-sm">{reg.category || 'General'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Date & Time</p>
                  <p className="text-white text-xs font-medium">{eventDate}</p>
                  <p className="text-indigo-300 text-xs">{reg.time || ''}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Venue</p>
                  <p className="text-white text-xs font-medium">{reg.venue}</p>
                </div>
              </div>
            </div>

            {/* Divider with scissor line */}
            <div className="flex items-center gap-2 py-2">
              <div className="flex-1 border-t border-dashed border-white/10" />
              <span className="text-slate-600 text-xs">✂</span>
              <div className="flex-1 border-t border-dashed border-white/10" />
            </div>

            {/* Registration Code */}
            <div className="flex items-center justify-between bg-white/5 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-3">
                <Hash size={18} className="text-indigo-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registration Code</p>
                  <p className="text-white font-mono font-bold text-lg tracking-widest">{regCode}</p>
                </div>
              </div>
              {/* Simple barcode-like visual */}
              <div className="flex gap-[2px] h-10 items-end">
                {[3,5,2,7,4,6,3,5,8,4,2,6,5,3,7,4].map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] rounded-sm bg-indigo-400/60"
                    style={{ height: `${h * 4}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8 flex items-center justify-between">
            <p className="text-[10px] text-slate-600 max-w-[60%] leading-relaxed">
              Present this pass at the event entrance. Keep your registration code handy.
            </p>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-600/30 flex items-center justify-center">
              <Shield size={18} className="text-indigo-400" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary !py-3 text-sm"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Print just the card
              const card = document.getElementById('entry-card-printable');
              const w = window.open('', '_blank');
              w.document.write(`
                <html><head><title>Entry Pass - ${reg.title}</title>
                <style>
                  body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0f0c29; font-family: system-ui, sans-serif; }
                  .card { ${card.getAttribute('style') || ''} border-radius: 24px; overflow: hidden; max-width: 420px; width: 100%; }
                </style></head><body>
                <div class="card">${card.innerHTML}</div>
                </body></html>
              `);
              w.document.close();
              w.print();
            }}
            className="flex-1 btn-primary !py-3 text-sm flex items-center justify-center gap-2"
          >
            <Download size={16} /> Download Pass
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Certificate (printable) ─── */
function Certificate({ reg, user, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.92)', backdropFilter: 'blur(12px)' }}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all z-10"
      >
        ✕
      </button>

      <div className="w-full max-w-2xl">
        <div
          id="certificate-printable"
          className="bg-slate-50 rounded-2xl p-10 border-[12px] border-double border-indigo-900 relative"
          style={{ minHeight: '520px' }}
        >
          <div className="absolute top-4 left-4 w-12 h-12 border-t-8 border-l-8 border-indigo-600" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-8 border-r-8 border-indigo-600" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-8 border-l-8 border-indigo-600" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-8 border-r-8 border-indigo-600" />

          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
                <Shield size={32} fill="currentColor" className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-serif font-extrabold text-indigo-900 uppercase tracking-widest">
              Certificate of Participation
            </h1>
            <p className="text-lg italic text-slate-600 font-serif">This certifies that</p>
            <h2 className="text-3xl font-bold text-slate-800 border-b-2 border-slate-300 pb-2 inline-block px-10">
              {user?.name || 'Active Student'}
            </h2>
            <p className="text-base text-slate-600 font-serif max-w-lg mx-auto">
              has successfully participated in the event<br />
              <span className="font-bold text-indigo-700 font-sans">"{reg.title}"</span><br />
              held at {reg.venue} on {new Date(reg.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </p>

            <div className="pt-14 flex justify-between px-16 relative">
              <div className="text-center">
                <div className="w-36 border-b border-slate-900 mb-2" />
                <p className="text-xs font-bold text-slate-900 uppercase">Event Coordinator</p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -top-8">
                <div className="w-20 h-20 rounded-full border-4 border-indigo-200 flex items-center justify-center rotate-12 opacity-50 bg-indigo-50">
                  <Award className="text-indigo-400" size={40} />
                </div>
              </div>
              <div className="text-center">
                <div className="w-36 border-b border-slate-900 mb-2" />
                <p className="text-xs font-bold text-slate-900 uppercase">College Principal</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 pt-4">
              Verification ID: CERT-{String(reg.registrationId).padStart(8, '0')}-{reg.category?.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className="flex-1 btn-secondary !py-3 text-sm">Close</button>
          <button
            onClick={() => {
              const el = document.getElementById('certificate-printable');
              const w = window.open('', '_blank');
              w.document.write(`
                <html><head><title>Certificate - ${reg.title}</title>
                <style>
                  body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; font-family: Georgia, serif; }
                  @media print { body { margin: 0; } }
                </style></head>
                <body>${el.outerHTML}</body></html>
              `);
              w.document.close();
              w.print();
            }}
            className="flex-1 btn-primary !py-3 text-sm flex items-center justify-center gap-2"
          >
            <Download size={16} /> Print Certificate
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function MyEvents() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entryCardReg, setEntryCardReg] = useState(null);
  const [certificateReg, setCertificateReg] = useState(null);
  const [claiming, setClaiming] = useState(null);

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

  useEffect(() => { fetchMyEvents(); }, []);

  const handleClaimCertificate = async (reg) => {
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
    setCertificateReg(reg);
  };

  const getPointsLabel = (reg) => {
    if (!reg.category) return '5 pts';
    return reg.category.toLowerCase() === 'technical' ? '10 pts' : '5 pts';
  };

  const statusConfig = {
    VERIFIED: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle size={14} />, label: 'Verified' },
    PENDING:  { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   icon: <Clock size={14} />,        label: 'Pending Approval' },
    REJECTED: { badge: 'bg-red-500/10 text-red-400 border-red-500/20',         icon: <XCircle size={14} />,      label: 'Rejected' },
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">My <span className="gradient-text">Registrations</span></h1>
            <p className="text-slate-400">Track events, view your entry pass, and download your certificate once the admin grants it.</p>
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
                const certGranted = reg.certificateGranted;
                const certClaimed = reg.certificateClaimed;

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
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${cfg.badge}`}>
                          {cfg.icon} {cfg.label}
                        </span>
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
                      {isVerified && certClaimed && (
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
                    <div className="shrink-0 flex flex-col gap-2 w-full md:w-auto">
                      {/* Entry Pass — always visible for non-rejected */}
                      {!isRejected && (
                        <button
                          onClick={() => setEntryCardReg(reg)}
                          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 transition-all text-sm font-medium"
                        >
                          <Ticket size={16} /> View Entry Pass
                        </button>
                      )}

                      {/* Certificate — only if admin has granted it */}
                      {isVerified && certGranted ? (
                        <button
                          onClick={() => handleClaimCertificate(reg)}
                          disabled={isClaiming}
                          className={`w-full flex items-center justify-center gap-2 btn-primary !py-2.5 !px-5 text-sm transition-all ${isClaiming ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          {isClaiming
                            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Claiming...</>
                            : certClaimed
                              ? <><Download size={16} /> Download Certificate</>
                              : <><Award size={16} /> Get Certificate & Points</>
                          }
                        </button>
                      ) : isVerified && !certGranted ? (
                        <div className="flex items-center gap-2 text-slate-500 text-xs px-3 py-2 bg-white/5 rounded-xl border border-white/5 justify-center">
                          <Clock size={12} /> Certificate pending from admin
                        </div>
                      ) : null}

                      {/* Verified badge */}
                      {isVerified && (
                        <div className="flex items-center gap-2 text-emerald-400 font-bold px-3 py-2 bg-emerald-500/5 rounded-xl border border-emerald-500/10 justify-center text-sm">
                          <CheckCircle size={16} /> Verified
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
              <h3 className="text-2xl font-bold text-white mb-2">No registrations yet</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">Explore all active events and start your journey!</p>
              <a href="/student/events" className="btn-primary inline-flex items-center gap-2">
                Browse All Events <Zap size={18} />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Entry Card Modal */}
      {entryCardReg && (
        <EntryCard
          reg={entryCardReg}
          user={user}
          onClose={() => setEntryCardReg(null)}
        />
      )}

      {/* Certificate Modal */}
      {certificateReg && (
        <Certificate
          reg={certificateReg}
          user={user}
          onClose={() => setCertificateReg(null)}
        />
      )}
    </div>
  );
}
