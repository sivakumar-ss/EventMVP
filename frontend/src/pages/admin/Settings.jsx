import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import { 
  User, Mail, Camera, Save, Shield, 
  Settings as SettingsIcon, Bell, Lock, Globe 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: 'Senior Administrator',
    organization: 'EventHub College Network'
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings updated successfully!');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Globe },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10 min-w-0">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">Admin <span className="gradient-text">Settings</span></h1>
            <p className="text-slate-400">Manage your administrative profile and system preferences.</p>
          </header>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Tabs */}
            <div className="md:w-64 space-y-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${
                            activeTab === tab.id 
                            ? 'glass bg-indigo-600/20 text-white border-white/10 ring-1 ring-white/10' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={18} />
                        <span className="font-bold text-sm">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                <div className="glass p-8 rounded-3xl border border-white/5 min-h-[500px]">
                    {activeTab === 'profile' && (
                        <div className="space-y-8 ">
                            <div className="flex items-center gap-6 pb-8 border-b border-white/5">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                                        {user?.name?.[0]?.toUpperCase()}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-white hover:bg-slate-800 transition-all">
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
                                    <p className="text-indigo-400 text-sm font-medium">{profile.role}</p>
                                    <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/10 w-fit">
                                        <Shield size={12} className="text-indigo-400" />
                                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Master Admin</span>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
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
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
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
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Organization</label>
                                    <input 
                                        type="text" 
                                        className="input-field" 
                                        value={profile.organization}
                                        onChange={e => setProfile({...profile, organization: e.target.value})}
                                    />
                                </div>
                                <div className="sm:col-span-2 pt-6 flex justify-end">
                                    <button type="submit" className="btn-primary flex items-center gap-2 px-8">
                                        <Save size={18} /> Save Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8 ">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Lock size={20} className="text-indigo-400" /> Password Management
                                </h3>
                                <p className="text-sm text-slate-400">Regularly updating your password keeps your admin account secure.</p>
                            </div>
                            <div className="space-y-4 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Current Password</label>
                                    <input type="password" placeholder="••••••••" className="input-field" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Password</label>
                                    <input type="password" placeholder="••••••••" className="input-field" />
                                </div>
                                <div className="pt-4">
                                    <button className="btn-secondary w-full">Update Password</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-8 ">
                            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                                <h3 className="text-white font-bold mb-4">System Status</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 " />
                                            <span className="text-sm text-slate-300">Backend API</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Operational</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 " />
                                            <span className="text-sm text-slate-300">Database Cluster</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase">Operational</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl opacity-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                                            <span className="text-sm text-slate-300">Auto-Certificate Engine</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-amber-500 uppercase">Maintenance</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
                            <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-slate-600">
                                <Bell size={32} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-lg">No Notifications</h3>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto">You're all caught up! New administrative alerts will appear here.</p>
                            </div>
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
