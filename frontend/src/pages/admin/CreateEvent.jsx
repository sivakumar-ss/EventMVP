import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { 
  Plus, Calendar, MapPin, AlignLeft, 
  Image as ImageIcon, Users, Tag, Save, X, QrCode, UploadCloud 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '09:00',
    venue: '',
    category: 'Technical',
    maxParticipants: 100,
    fee: 0,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    paymentScanner: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        eventDate: new Date(`${formData.date}T${formData.time}:00`).toISOString(),
        category: formData.category,
        maxParticipants: formData.maxParticipants,
        fee: parseFloat(formData.fee) || 0,
        image: formData.image,
        paymentScanner: formData.paymentScanner
      };

      await adminApi.createEvent(eventPayload);
      toast.success('Event created successfully!');
      navigate('/admin/events');
    } catch (err) {
        console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          <header className="mb-10 flex items-center justify-between">
            <div>
                <h1 className="text-4xl font-bold text-white mb-2">Create <span className="gradient-text">Event</span></h1>
                <p className="text-slate-400">Launch a new experience for your students.</p>
            </div>
            <button onClick={() => navigate('/admin/events')} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <X size={20} />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Tag className="text-indigo-400" size={18} /> General Information
                    </h3>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Event Title</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. Annual Tech Summit 2026"
                            className="input-field" 
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                        <textarea 
                            required
                            rows="4"
                            placeholder="Tell students what the event is about..."
                            className="input-field py-4 resize-none" 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                </div>

                {/* Logistics */}
                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Calendar className="text-indigo-400" size={18} /> Date & Time
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
                                <input 
                                    required
                                    type="date" 
                                    className="input-field text-xs" 
                                    value={formData.date}
                                    onChange={e => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Time</label>
                                <input 
                                    required
                                    type="time" 
                                    className="input-field text-xs" 
                                    value={formData.time}
                                    onChange={e => setFormData({...formData, time: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <MapPin className="text-indigo-400" size={18} /> Venue
                        </h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Location</label>
                            <input 
                                required
                                type="text" 
                                placeholder="Main Auditorium, Block C"
                                className="input-field" 
                                value={formData.venue}
                                onChange={e => setFormData({...formData, venue: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="grid md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users className="text-indigo-400" size={18} /> Capacity
                        </h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Max Participants</label>
                            <input 
                                required
                                type="number" 
                                className="input-field" 
                                value={formData.maxParticipants}
                                onChange={e => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Plus className="text-indigo-400" size={18} /> Fee (₹)
                        </h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Registration Fee</label>
                            <input 
                                required
                                type="number" 
                                min="0"
                                step="0.01"
                                className="input-field" 
                                value={formData.fee}
                                onChange={e => setFormData({...formData, fee: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Tag className="text-indigo-400" size={18} /> Category
                        </h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Event Type</label>
                            <select 
                                className="input-field"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                                <option>Technical</option>
                                <option>Cultural</option>
                                <option>Sports</option>
                                <option>Workshop</option>
                                <option>Seminar</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Banner */}
                <div className="pt-6 border-t border-white/5">
                     <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                        <ImageIcon className="text-indigo-400" size={18} /> Event Banner
                    </h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="w-40 h-24 rounded-2xl overflow-hidden glass border border-white/10 shrink-0">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-3 w-full">
                             <div className="flex items-center gap-2">
                               <input 
                                  type="text" 
                                  placeholder="Paste image URL or click upload..."
                                  className="input-field flex-1" 
                                  value={formData.image}
                                  onChange={e => setFormData({...formData, image: e.target.value})}
                               />
                               <button 
                                  type="button"
                                  onClick={() => {
                                      toast.loading('Simulating Cloud Upload...', { id: 'upload' });
                                      setTimeout(() => {
                                          setFormData({...formData, image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80'});
                                          toast.success('Uploaded to mock AWS S3!', { id: 'upload' });
                                      }, 1500);
                                  }}
                                  className="btn-secondary !py-3 flex items-center gap-2 shrink-0"
                               >
                                  <UploadCloud size={16} /> Upload
                               </button>
                             </div>
                             <p className="text-[10px] text-slate-500">Upload to our mock cloud storage or paste a direct URL. Recommended size: 1200x600.</p>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => navigate('/admin/events')} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 min-w-[160px] justify-center">
                    {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full " /> : <><Save size={18} /> Publish Event</>}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
