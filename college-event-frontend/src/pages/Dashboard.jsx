import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, Zap, Trophy, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    setEvents(eventService.getEvents());
    if (user && user.role === 'student') {
      setRegistrations(eventService.getUserRegistrations(user.username).map(e => e.id));
    }
  };

  const handleRegister = (eventId) => {
    eventService.registerForEvent(eventId, user.username);
    loadData();
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Hackathons', icon: Zap },
    { name: 'Competitions', icon: Trophy },
    { name: 'Workshops', icon: Briefcase },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-100 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2"
          >
            <Sparkles size={14} />
            Exclusive Campus Opportunities
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter">
            Unlock Your <span className="text-blue-600">Potential</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed mb-10">
            Discover hackathons, events, and workshops happening across your campus. 
            Connect, compete, and grow your career with our all-in-one platform.
          </p>
          
          <div className="w-full max-w-3xl relative group">
            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by event title, host, or venue..."
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 pl-16 pr-8 text-lg font-medium outline-none transition-all focus:bg-white focus:border-blue-600 focus:shadow-2xl focus:shadow-blue-500/10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button className="bg-blue-600 text-white p-3 rounded-2xl hover:bg-black transition-all">
                    <SlidersHorizontal size={20} />
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                        activeCategory === cat.name 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-95' 
                        : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-600 hover:text-blue-600'
                    }`}
                >
                    <cat.icon size={18} />
                    {cat.name}
                </button>
            ))}
        </div>

        {/* Section Heading */}
        <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Opportunities</h2>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Found {filteredEvents.length} events matching your profile</p>
            </div>
            <button className="text-blue-600 font-black text-sm uppercase tracking-widest hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                View All <Sparkles size={14} />
            </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, idx) => (
                <EventCard 
                    key={event.id}
                    event={event}
                    onRegister={handleRegister}
                    isRegistered={registrations.includes(event.id)}
                />
            ))}
        </div>

        {filteredEvents.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200"
            >
                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Search size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">No opportunities found</h3>
                <p className="text-slate-400 font-medium">Try adjusting your filters or searching for something else.</p>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
