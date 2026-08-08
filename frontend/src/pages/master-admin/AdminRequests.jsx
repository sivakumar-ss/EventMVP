import React, { useState, useEffect } from 'react';
import MasterSidebar from '../../components/MasterSidebar';
import { masterAdminApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Shield, CheckCircle, XCircle, Clock, Users, Check, X } from 'lucide-react';

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await masterAdminApi.getAdminRequests();
      setRequests(res.data);
    } catch (err) {
      toast.error('Failed to load admin requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    setProcessingId(id);
    try {
      if (action === 'APPROVE') {
        await masterAdminApi.approveAdminRequest(id);
        toast.success('Admin request approved! The user is now an Admin.');
      } else {
        await masterAdminApi.rejectAdminRequest(id);
        toast.success('Admin request rejected.');
      }
      fetchRequests();
    } catch (err) {
      toast.error(`Failed to ${action.toLowerCase()} request`);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <MasterSidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Admin <span className="gradient-text">Verification</span></h1>
            <p className="text-slate-400">Review and approve requests from users wishing to become College Admins.</p>
          </header>

          <div className="glass rounded-3xl p-6 border border-white/5">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-white/5 rounded-2xl" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-20">
                <Shield className="mx-auto text-slate-600 mb-4" size={48} />
                <h3 className="text-xl font-bold text-white mb-2">No pending requests</h3>
                <p className="text-slate-400 text-sm">There are no admin verification requests at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/10 transition-colors">
                    
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center border border-indigo-500/20">
                        <Users className="text-indigo-400" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{req.userName}</h3>
                        <p className="text-sm text-slate-400">{req.userEmail}</p>
                        <p className="text-xs font-bold text-indigo-400 mt-1">College: {req.collegeName}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end shrink-0 w-full md:w-auto">
                      <div className="mb-3">
                        {req.status === 'PENDING' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                            <Clock size={12} /> Pending Verification
                          </span>
                        ) : req.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                            <CheckCircle size={12} /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-bold uppercase tracking-wider">
                            <XCircle size={12} /> Rejected
                          </span>
                        )}
                      </div>
                      
                      {req.status === 'PENDING' && (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <button
                            onClick={() => handleAction(req.id, 'APPROVE')}
                            disabled={processingId === req.id}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold transition-colors ${processingId === req.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <Check size={16} /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(req.id, 'REJECT')}
                            disabled={processingId === req.id}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-sm font-bold transition-colors ${processingId === req.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <X size={16} /> Reject
                          </button>
                        </div>
                      )}
                      
                      {req.status !== 'PENDING' && (
                        <p className="text-[10px] text-slate-500 font-medium">Processed on: {req.resolvedAt}</p>
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
