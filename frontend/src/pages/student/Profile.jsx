import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { User, Mail, School, Camera, Save, Shield, Trophy, Users, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentApi } from '../../services/api';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: 'Government Institute of Technology',
    dept: 'Computer Science & Engineering',
    year: '3rd Year'
  });
  const [stats, setStats] = useState({ score: 0, followersCount: 0, followingCount: 0 });
  const [adminRequestStatus, setAdminRequestStatus] = useState(null);
  const [isRequestingAdmin, setIsRequestingAdmin] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await studentApi.getNetworkSummary();
        setStats({
          score: res.data.score || 0,
          followersCount: res.data.followersCount || 0,
          followingCount: res.data.followingCount || 0
        });
      } catch (err) {
        console.error("Failed to load profile stats", err);
      }
    };
    
    const fetchAdminStatus = async () => {
      try {
        const res = await studentApi.getAdminRequestStatus();
        if (res.status === 200 && res.data) {
          setAdminRequestStatus(res.data);
        }
      } catch (err) {
        console.error("Failed to load admin request status", err);
      }
    };

    fetchStats();
    fetchAdminStatus();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  const handleRequestAdmin = async () => {
    if (!profile.college) {
      toast.error('Please enter your College Name before requesting Admin access.');
      return;
    }
    setIsRequestingAdmin(true);
    try {
      const res = await studentApi.requestAdminRole({ collegeName: profile.college });
      setAdminRequestStatus(res.data);
      toast.success('Admin access request submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request admin access');
    } finally {
      setIsRequestingAdmin(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">Your <span className="gradient-text">Profile</span></h1>
            <p className="text-slate-400">View and manage your account settings.</p>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Avatar & Summary */}
            <div className="md:col-span-1 space-y-6">
                <div className="glass p-8 rounded-3xl border border-white/5 text-center">
                    <div className="relative inline-block mb-6">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl shadow-indigo-600/30">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-white hover:bg-slate-800 transition-all">
                            <Camera size={18} />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                    <p className="text-indigo-400 text-sm font-medium mb-4">{profile.dept}</p>
                    <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 w-fit mx-auto">
                        <Shield size={12} className="text-indigo-400" />
                        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Verified Student</span>
                    </div>
                </div>

                <div className="glass p-6 rounded-3xl border border-white/5">
                    <h3 className="text-white font-bold mb-4 text-sm">Account Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Trophy size={16} className="text-amber-400" />
                                <span className="text-slate-400 text-xs">Total Score</span>
                            </div>
                            <span className="text-amber-400 font-extrabold text-sm">{stats.score} pts</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-white/5">
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-indigo-400" />
                                <span className="text-slate-400 text-xs">Followers</span>
                            </div>
                            <span className="text-white font-bold text-sm">{stats.followersCount}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                            <div className="flex items-center gap-2">
                                <UserPlus size={16} className="text-purple-400" />
                                <span className="text-slate-400 text-xs">Following</span>
                            </div>
                            <span className="text-white font-bold text-sm">{stats.followingCount}</span>
                        </div>
                    </div>
                </div>

                {/* Become Admin Section */}
                <div className="glass p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-600/5">
                    <h3 className="text-white font-bold mb-2 text-sm flex items-center gap-2">
                      <Shield size={16} className="text-indigo-400" /> Become an Admin
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">Want to host events for your college? Request an admin account.</p>
                    
                    {adminRequestStatus ? (
                      <div className={`p-3 rounded-xl border text-xs font-bold flex flex-col gap-1 ${
                        adminRequestStatus.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                        adminRequestStatus.status === 'REJECTED' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                        'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        <span className="uppercase tracking-wider">Status: {adminRequestStatus.status}</span>
                        {adminRequestStatus.status === 'PENDING' && (
                          <span className="text-[10px] text-amber-400/70 font-medium">Waiting for Master Admin approval.</span>
                        )}
                        {adminRequestStatus.status === 'REJECTED' && (
                          <button onClick={handleRequestAdmin} disabled={isRequestingAdmin} className="mt-2 py-1.5 px-3 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors">
                            Request Again
                          </button>
                        )}
                      </div>
                    ) : (
                      <button 
                        onClick={handleRequestAdmin}
                        disabled={isRequestingAdmin}
                        className={`w-full py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-bold text-xs hover:bg-indigo-500/20 hover:text-white transition-all ${isRequestingAdmin ? 'opacity-50' : ''}`}
                      >
                        {isRequestingAdmin ? 'Submitting...' : 'Request Admin Access'}
                      </button>
                    )}
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="md:col-span-2">
                <div className="glass p-8 rounded-3xl border border-white/5 h-full">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
                                <div className="glass-input-group relative">
                                    <User className="icon-left" size={18} />
                                    <input 
                                        type="text" 
                                        className="input-field input-with-icon" 
                                        value={profile.name}
                                        onChange={e => setProfile({...profile, name: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                                <div className="glass-input-group relative">
                                    <Mail className="icon-left" size={18} />
                                    <input 
                                        type="email" 
                                        className="input-field input-with-icon bg-white/5 cursor-not-allowed text-slate-500" 
                                        value={profile.email}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">College / University</label>
                            <div className="glass-input-group relative">
                                <School className="icon-left" size={18} />
                                <input 
                                    type="text" 
                                    className="input-field input-with-icon" 
                                    value={profile.college}
                                    onChange={e => setProfile({...profile, college: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Department</label>
                                <input 
                                    type="text" 
                                    className="input-field" 
                                    value={profile.dept}
                                    onChange={e => setProfile({...profile, dept: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Current Year</label>
                                <select 
                                    className="input-field" 
                                    value={profile.year}
                                    onChange={e => setProfile({...profile, year: e.target.value})}
                                >
                                    <option>1st Year</option>
                                    <option>2nd Year</option>
                                    <option>3rd Year</option>
                                    <option>4th Year</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex justify-end">
                            <button type="submit" className="btn-primary flex items-center gap-2">
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
