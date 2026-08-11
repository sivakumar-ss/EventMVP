import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi, studentApi } from '../../services/api';
import EventCard from '../../components/EventCard';
import Sidebar from '../../components/Sidebar';
import PaymentModal from '../../components/PaymentModal';
import { Search, Filter, SlidersHorizontal, LayoutGrid, List as ListIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [myRegs, setMyRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res, regs] = await Promise.all([
          eventApi.getAllPublic(),
          studentApi.getRegistrations().catch(() => ({ data: [] }))
        ]);
        setEvents(res.data);
        setMyRegs(regs.data);
      } catch (err) {
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async (paymentData) => {
    try {
      await studentApi.registerForEvent(selectedEvent.id, paymentData);
      toast.success(`Registration submitted for ${selectedEvent.title}`);
      const regs = await studentApi.getRegistrations();
      setMyRegs(regs.data);
      setIsModalOpen(false);
      navigate('/student/my-events');
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to submit registration');
    }
  };

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || e.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10 min-w-0">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Explore <span className="gradient-text">Events</span></h1>
              <p className="text-slate-400">Discover and register for the best campus opportunities.</p>
            </div>
          </header>

          {/* Controls */}
          <div className="glass p-4 rounded-2xl mb-10 flex flex-col md:flex-row gap-4 items-center">
            <div className="glass-input-group relative flex-1 w-full">
              <Search className="icon-left" size={18} />
              <input
                type="text"
                placeholder="Search events by title..."
                className="input-field input-with-icon"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 shrink-0">
                {['All', 'Technical', 'Cultural', 'Sports'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${filter === cat ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button className="w-12 h-12 glass flex items-center justify-center text-slate-400 hover:text-white rounded-xl border border-white/10 transition-all">
                <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-2xl h-80 bg-white/5" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    registered={myRegs.some(r => r.id === event.id)}
                    onRegister={handleRegister}
                  />
                ))}
              </div>
              {filteredEvents.length === 0 && (
                <div className="text-center py-20 glass rounded-3xl border border-white/5">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any events matching your current search or filter. Try a different query!</p>
                </div>
              )}
            </>
          )}

          <PaymentModal 
            isOpen={isModalOpen}
            event={selectedEvent}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handlePaymentSubmit}
          />
        </div>
      </div>
    </div>
  );
}
