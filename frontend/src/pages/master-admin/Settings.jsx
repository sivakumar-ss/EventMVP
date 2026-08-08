import React, { useState } from 'react';
import MasterSidebar from '../../components/MasterSidebar';
import { Settings as SettingsIcon, Globe, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Global settings updated successfully');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen">
      <MasterSidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Global <span className="gradient-text">Settings</span></h1>
            <p className="text-slate-400">Configure platform-wide parameters and features.</p>
          </header>

          <div className="grid gap-8">
            <div className="glass rounded-3xl p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <Globe className="text-indigo-400" size={24} />
                <h2 className="text-xl font-bold text-white">Platform Configuration</h2>
              </div>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div>
                    <h3 className="font-bold text-white">Maintenance Mode</h3>
                    <p className="text-sm text-slate-400">Temporarily disable platform access for students and admins</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div>
                    <h3 className="font-bold text-white">Auto-Approve Students</h3>
                    <p className="text-sm text-slate-400">Allow students to register without email verification</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-8">
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full " /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
