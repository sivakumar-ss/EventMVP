import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import { motion } from 'framer-motion';
import { Award, Download, ArrowLeft, Calendar, MapPin, Sparkles, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const MyRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setRegistrations(eventService.getUserRegistrations(user.username));
    }
  }, [user]);

  const generateCertificate = (event) => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(5, 5, 287, 200, 'F');
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.rect(10, 10, 277, 190);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(48);
    doc.text('CERTIFICATE', 148.5, 50, { align: 'center' });
    doc.setFontSize(18);
    doc.setTextColor(100);
    doc.text('OF PARTICIPATION', 148.5, 65, { align: 'center' });
    doc.setFontSize(14);
    doc.text('This is to proudly present to', 148.5, 90, { align: 'center' });
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(36);
    doc.text(user.username.toUpperCase(), 148.5, 110, { align: 'center' });
    doc.setTextColor(100);
    doc.setFontSize(14);
    doc.text('for their successful engagement in', 148.5, 130, { align: 'center' });
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(24);
    doc.text(event.title, 148.5, 150, { align: 'center' });
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(12);
    doc.text(`Completed on ${event.date} | Campus Events Authority`, 148.5, 175, { align: 'center' });
    doc.save(`${user.username}_Certificate.pdf`);
  };

  return (
    <div className="p-6 md:p-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-10 group font-bold uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to feed
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="bg-blue-600 text-white p-3 rounded-2xl w-fit mb-6 rotate-3">
                <Trophy size={28} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-2">My Activity</h2>
              <p className="text-slate-500 font-medium">You have participated in {registrations.length} premium events</p>
            </div>
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center font-black">
                    {registrations.length}
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank</p>
                    <p className="text-lg font-black text-slate-900">Top 12%</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {registrations.length > 0 ? registrations.map((event) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-blue-200 transition-all"
            >
              <div className="flex gap-6 items-center flex-1">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0">
                    <img src={`https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80&id=${event.id}`} alt="event" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">{event.title}</h3>
                  <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5 uppercase"><Calendar size={14} className="text-blue-600"/> {event.date}</span>
                    <span className="flex items-center gap-1.5 uppercase"><MapPin size={14} className="text-blue-600"/> {event.venue}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto mt-4 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-slate-50">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  event.status === 'Upcoming' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {event.status}
                </span>
                <button 
                  onClick={() => generateCertificate(event)}
                  className="btn-unstop flex items-center gap-2 py-3 px-6 text-sm whitespace-nowrap"
                >
                  <Download size={16} />
                  Certificate
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Sparkles size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">No active registrations</h3>
              <p className="text-slate-400 font-medium mb-8">Start your journey by exploring campus opportunities.</p>
              <button onClick={() => navigate('/dashboard')} className="btn-unstop">Browse Events</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRegistrations;
