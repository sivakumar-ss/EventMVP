import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { adminApi, eventApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import {
  Search, Mail, Download, Users, ArrowLeft, Filter,
  CheckCircle, XCircle, Clock, Award, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Participants() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get('eventId');

  const [participants, setParticipants] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [grantingId, setGrantingId] = useState(null);

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
        toast.error('No event selected. Please go back and choose an event.');
      }
    } catch (err) {
      const msg = err?.response?.data || err?.message || 'Failed to load participants';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [eventId]);

  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.utrNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const handleVerify = async (registrationId, verified) => {
    try {
      await adminApi.verifyRegistration(registrationId, verified);
      toast.success(`Registration ${verified ? 'verified ✅' : 'rejected ❌'}`);
      await fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleGrantCertificate = async (registrationId) => {
    setGrantingId(registrationId);
    try {
      await adminApi.grantCertificate(registrationId);
      toast.success('Certificate granted! 🎓 Student can now download it.', { duration: 4000 });
      await fetchData();
    } catch (err) {
      toast.error(err?.response?.data || 'Failed to grant certificate');
    } finally {
      setGrantingId(null);
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.loading('Exporting CSV...', { id: 'csv' });
      const res = await adminApi.exportCsv(eventId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `participants_${eventId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV Exported Successfully', { id: 'csv' });
    } catch (err) {
      toast.error('Failed to export CSV', { id: 'csv' });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10 min-w-0">
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
                <p className="text-slate-400">Verify payments and grant certificates to participants.</p>
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
                <button
                  onClick={handleExportCSV}
                  className="flex-1 md:flex-none btn-primary !py-2.5 !px-5 text-sm flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Export CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">UTR Number</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Payment</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Certificate</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredParticipants.map((p, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Student */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold group-hover:bg-indigo-500 group-hover:text-white transition-all text-sm">
                            {p.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{p.name}</p>
                            <p className="text-xs text-slate-500">{p.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* UTR */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-indigo-400">{p.utrNumber || 'N/A'}</p>
                        <p className="text-[10px] text-slate-500 uppercase mt-0.5">
                          {p.registeredDate ? new Date(p.registeredDate).toLocaleDateString() : ''}
                        </p>
                      </td>

                      {/* Payment screenshot */}
                      <td className="px-6 py-4">
                        {p.paymentScreenshot ? (
                          <a
                            href={p.paymentScreenshot}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all text-xs font-medium"
                          >
                            <Download size={12} /> View
                          </a>
                        ) : (
                          <span className="text-xs text-slate-600">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-lg border uppercase flex items-center gap-1 w-fit ${
                          p.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          p.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {p.status === 'VERIFIED' ? <><CheckCircle size={10} /> Verified</> :
                           p.status === 'REJECTED' ? <><XCircle size={10} /> Rejected</> :
                           <><Clock size={10} /> Pending</>}
                        </span>
                      </td>

                      {/* Certificate */}
                      <td className="px-6 py-4">
                        {p.certificateGranted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-bold uppercase">
                            <Sparkles size={10} /> Granted
                          </span>
                        ) : (
                          <span className="text-xs text-slate-600">Not issued</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {/* Verify / Reject — only for PENDING */}
                          {p.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleVerify(p.registrationId, true)}
                                className="w-9 h-9 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg inline-flex items-center justify-center transition-all"
                                title="Verify Payment"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => handleVerify(p.registrationId, false)}
                                className="w-9 h-9 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg inline-flex items-center justify-center transition-all"
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}

                          {/* Grant Certificate — only for VERIFIED and not yet granted */}
                          {p.status === 'VERIFIED' && !p.certificateGranted && (
                            <button
                              onClick={() => handleGrantCertificate(p.registrationId)}
                              disabled={grantingId === p.registrationId}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-white border border-yellow-500/20 transition-all text-xs font-bold disabled:opacity-60"
                              title="Grant Certificate to Student"
                            >
                              {grantingId === p.registrationId
                                ? <div className="w-3 h-3 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full " />
                                : <Award size={14} />}
                              Grant Certificate
                            </button>
                          )}

                          {p.status === 'VERIFIED' && p.certificateGranted && (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium px-2">
                              <CheckCircle size={12} /> Certificate Issued
                            </span>
                          )}

                          <button className="w-9 h-9 glass rounded-lg inline-flex items-center justify-center text-slate-500 hover:text-white transition-all" title="Email Student">
                            <Mail size={16} />
                          </button>
                        </div>
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
