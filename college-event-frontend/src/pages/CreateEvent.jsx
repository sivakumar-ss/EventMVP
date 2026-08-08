import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import { motion } from 'framer-motion';
import { Calendar, MapPin, AlignLeft, Info, ArrowLeft, Save, Sparkles, Image as ImageIcon } from 'lucide-react';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    venue: '',
    description: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    eventService.createEvent(formData);
    navigate('/admin-dashboard');
  };

  return (
    <div className="p-6 md:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-10 group font-bold uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Cancel and return
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[2rem] shadow-xl shadow-blue-500/5 border border-slate-100"
        >
          <div className="flex items-center gap-6 mb-12">
            <div className="bg-blue-600 p-4 rounded-2xl text-white rotate-3 shadow-lg shadow-blue-500/30">
              <Sparkles size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Host Opportunity</h2>
              <p className="text-slate-500 font-medium">Create a high-impact event for your campus</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Event Identity</label>
              <div className="relative group">
                <Info size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="text" 
                  required
                  className="input-unstop pl-12 py-4"
                  placeholder="e.g. National Level Hackathon 2024"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Timeline</label>
                <div className="relative group">
                  <Calendar size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="date" 
                    required
                    className="input-unstop pl-12 py-4"
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Venue / Mode</label>
                <div className="relative group">
                  <MapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text" 
                    required
                    className="input-unstop pl-12 py-4"
                    placeholder="e.g. Main Auditorium / Online"
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 ml-1 uppercase tracking-widest">Opportunity Details</label>
              <div className="relative group">
                <AlignLeft size={20} className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <textarea 
                  required
                  rows={5}
                  className="input-unstop pl-12 pt-4 resize-none"
                  placeholder="Briefly describe the event, rules, eligibility, and what participants stand to gain..."
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-slate-400 mb-8 cursor-pointer hover:bg-white hover:border-blue-600 hover:text-blue-600 transition-all">
                    <ImageIcon size={40} className="mb-4" />
                    <span className="font-black text-sm uppercase tracking-widest">Click to upload cover image</span>
                    <span className="text-[10px] uppercase font-bold text-slate-300 mt-2">Recommended: 1200 x 600 px</span>
                </div>

                <div className="flex gap-4">
                     <button type="submit" className="btn-unstop flex-1 py-5 text-lg flex items-center justify-center gap-3">
                        <Save size={24} />
                        Publish Opportunity
                    </button>
                </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEvent;
