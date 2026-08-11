import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import EventCard from '../../components/EventCard';
import {
  Plus, Search, Users as UsersIcon, Power, AlertCircle,
  X, Save, Calendar, MapPin, Tag, Image as ImageIcon,
  QrCode, Edit3
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

function EditEventModal({ event, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.description || '',
    date: event.date || '',           // "yyyy-MM-dd"
    time: event.time || '09:00',      // "HH:mm"
    venue: event.venue || '',
    category: event.category || 'Technical',
    maxParticipants: event.maxParticipants || 100,
    image: event.image || '',
    paymentScanner: event.paymentScanner || '',
  });

  const set = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        venue: formData.venue,
        eventDate: new Date(`${formData.date}T${formData.time}:00`).toISOString(),
        category: formData.category,
        maxParticipants: parseInt(formData.maxParticipants),
        image: formData.image,
        paymentScanner: formData.paymentScanner,
      };
      await adminApi.updateEvent(event.id, payload);
      toast.success('Event updated successfully!');
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl"
        style={{ background: 'rgba(15,20,50,0.98)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-5 border-b border-white/5"
          style={{ background: 'rgba(15,20,50,0.98)' }}>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Edit3 size={20} className="text-indigo-400" />
              Edit <span className="gradient-text">Event</span>
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">Changes are saved immediately to the database.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Tag size={11} /> Event Title
            </label>
            <input
              required type="text"
              className="input-field"
              placeholder="e.g. Annual Tech Summit 2026"
              value={formData.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Description</label>
            <textarea
              required rows={3}
              className="input-field py-3 resize-none"
              placeholder="Tell students what the event is about..."
              value={formData.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Date / Time / Venue */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Calendar size={10} /> Date
              </label>
              <input
                required type="date"
                className="input-field text-xs"
                value={formData.date}
                onChange={e => set('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Time</label>
              <input
                required type="time"
                className="input-field text-xs"
                value={formData.time}
                onChange={e => set('time', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <MapPin size={10} /> Venue
              </label>
              <input
                required type="text"
                className="input-field text-xs"
                placeholder="Main Auditorium"
                value={formData.venue}
                onChange={e => set('venue', e.target.value)}
              />
            </div>
          </div>

          {/* Category / Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
              <select
                className="input-field"
                value={formData.category}
                onChange={e => set('category', e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <UsersIcon size={10} /> Max Participants
              </label>
              <input
                required type="number" min={1}
                className="input-field"
                value={formData.maxParticipants}
                onChange={e => set('maxParticipants', e.target.value)}
              />
            </div>
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <ImageIcon size={11} /> Event Banner URL
            </label>
            <div className="flex gap-4 items-center">
              <div className="w-28 h-16 rounded-xl overflow-hidden glass border border-white/10 shrink-0">
                <img
                  src={formData.image}
                  alt="preview"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'; }}
                />
              </div>
              <input
                type="text"
                className="input-field flex-1"
                placeholder="Paste image URL..."
                value={formData.image}
                onChange={e => set('image', e.target.value)}
              />
            </div>
          </div>

          {/* Payment QR */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <QrCode size={11} /> Payment QR Code URL
            </label>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-16 p-1 rounded-xl bg-white shrink-0">
                <img
                  src={formData.paymentScanner}
                  alt="QR"
                  className="w-full h-full object-contain"
                  onError={e => { e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'; }}
                />
              </div>
              <input
                type="text"
                className="input-field flex-1"
                placeholder="Paste QR image URL..."
                value={formData.paymentScanner}
                onChange={e => set('paymentScanner', e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2 min-w-[140px] justify-center"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full " />
                : <><Save size={16} /> Save Changes</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await adminApi.getAdminEvents();
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseEvent = async (id) => {
    if (!window.confirm('Are you sure you want to close registrations for this event?')) return;
    try {
      await adminApi.closeEvent(id);
      toast.success('Event registrations closed');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to close event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you ABSOLUTELY sure you want to delete this event? This will also delete all registrations associated with it.')) return;
    try {
      await adminApi.deleteEvent(id);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10 min-w-0">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Manage <span className="gradient-text">Events</span></h1>
              <p className="text-slate-400">Edit, close, and track your active campus events.</p>
            </div>
            <a href="/admin/create-event" className="btn-primary flex items-center gap-2">
              <Plus size={20} /> New Event
            </a>
          </header>

          <div className="glass-input-group relative mb-8 max-w-md">
            <Search className="icon-left" size={18} />
            <input
              type="text"
              placeholder="Search by event title..."
              className="input-field input-with-icon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 glass rounded-3xl bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div key={event.id} className="relative group">
                  <EventCard
                    event={event}
                    isAdmin={true}
                    onEdit={(e) => setEditingEvent(e)}
                    onDelete={(e) => handleDeleteEvent(e.id)}
                  />

                  {/* Admin Overlay Actions */}
                  <div className="absolute top-44 right-5 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => handleCloseEvent(event.id)}
                      className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-2xl"
                      title="Close Registration"
                      disabled={event.status === 'CLOSED'}
                    >
                      <Power size={18} />
                    </button>
                    <a
                      href={`/admin/participants?eventId=${event.id}`}
                      className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-2xl"
                      title="View Participants"
                    >
                      <UsersIcon size={18} />
                    </a>
                  </div>

                  {event.status === 'CLOSED' && (
                    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] rounded-2xl flex items-center justify-center pointer-events-none">
                      <span className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg shadow-xl uppercase tracking-widest">
                        Registrations Closed
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-20 glass rounded-3xl border border-white/5">
              <AlertCircle size={48} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No events to manage</h3>
              <p className="text-slate-500">Create your first event to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSaved={fetchEvents}
        />
      )}
    </div>
  );
}
