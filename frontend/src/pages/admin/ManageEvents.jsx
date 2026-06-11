import React, { useState, useEffect } from 'react';
import { adminApi, eventApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import EventCard from '../../components/EventCard';
import { 
  Plus, Search, Filter, Trash2, Edit3, 
  Users as UsersIcon, Power, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
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
                    <div key={i} className="h-80 glass rounded-3xl animate-pulse bg-white/5" />
                ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredEvents.map(event => (
                  <div key={event.id} className="relative group">
                    <EventCard 
                        event={event} 
                        isAdmin={true}
                        onEdit={(e) => toast.info(`Editing ${e.title}`)}
                        onDelete={(e) => toast.error(`Deletion limited for security.`)}
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
                            <span className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg shadow-xl uppercase tracking-widest">Registrations Closed</span>
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
    </div>
  );
}
