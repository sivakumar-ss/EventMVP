import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { User, Mail, School, Camera, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    college: 'Government Institute of Technology',
    dept: 'Computer Science & Engineering',
    year: '3rd Year'
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
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
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs">Events Attended</span>
                            <span className="text-white font-bold">12</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs">Workshops Done</span>
                            <span className="text-white font-bold">5</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 text-xs">Global Rank</span>
                            <span className="text-white font-bold">#42</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="md:col-span-2">
                <div className="glass p-8 rounded-3xl border border-white/5 h-full">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="text" 
                                        className="input-field pl-12" 
                                        value={profile.name}
                                        onChange={e => setProfile({...profile, name: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input 
                                        type="email" 
                                        className="input-field pl-12 bg-white/5 cursor-not-allowed text-slate-500" 
                                        value={profile.email}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">College / University</label>
                            <div className="relative">
                                <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input 
                                    type="text" 
                                    className="input-field pl-12" 
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
