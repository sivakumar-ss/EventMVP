import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentApi, eventApi } from '../../services/api';
import { StatCard } from '../../components/StatCard';
import EventCard from '../../components/EventCard';
import Sidebar from '../../components/Sidebar';
import PaymentModal from '../../components/PaymentModal';
import { Calendar, CheckCircle, Zap, Bell, ArrowRight } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, registered: 0, upcoming: 0 });
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allEvents, myRegs] = await Promise.all([
          eventApi.getAllPublic(),
          studentApi.getRegistrations()
        ]);
        
        setEvents(allEvents.data.slice(0, 3)); // Just show recent 3
        setMyRegistrations(myRegs.data);
        
        // Convert registrations to recent activity notifications
        const regNotifications = myRegs.data.map(reg => ({
            id: reg.id,
            message: `You are registered for "${reg.title}"`,
            time: 'Active',
            type: 'success'
        }));
        setNotifications([...regNotifications, ...mockNotifications].slice(0, 5));
        
        const registeredIds = new Set(myRegs.data.map(r => r.id));
        setStats({
          total: allEvents.data.length,
          registered: myRegs.data.length,
          upcoming: allEvents.data.filter(e => e.status === 'UPCOMING' && !registeredIds.has(e.id)).length
        });
      } catch (err) {
        console.error(err);
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
      toast.success(`Registration submitted for ${selectedEvent.title}. Verification pending.`);
      const myRegs = await studentApi.getRegistrations();
      setMyRegistrations(myRegs.data);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, <span className="gradient-text">{user?.name}</span>! 👋</h1>
            <p className="text-slate-400">Here is what is happening in your campus today.</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatCard icon={Zap} label="Total Events" value={stats.total} color="indigo" />
            <StatCard icon={CheckCircle} label="My Registrations" value={stats.registered} color="emerald" />
            <StatCard icon={Calendar} label="New Opportunities" value={stats.upcoming} color="cyan" />
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Recommended for You</h2>
                  <a href="/student/events" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1">
                    View All <ArrowRight size={16} />
                  </a>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {events.map(event => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      registered={myRegistrations.some(r => r.id === event.id)} // This check might need fixing based on registration entity structure
                      onRegister={handleRegister}
                    />
                  ))}
                  {events.length === 0 && !loading && (
                     <div className="col-span-2 glass p-10 text-center rounded-3xl border border-white/5">
                        <p className="text-slate-400">No upcoming events found. Check back later!</p>
                     </div>
                  )}
                </div>
              </section>
            </div>

            {/* Notifications Sidebar */}
            <div className="space-y-8">
              <section className="glass rounded-3xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="text-indigo-400" size={20} />
                  <h2 className="text-xl font-bold text-white">Notifications</h2>
                </div>
                <div className="space-y-4">
                  {notifications.map((n, i) => (
                    <div key={i} className={`p-4 rounded-2xl border transition-all ${n.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                      <p className={`text-sm leading-snug mb-1 ${n.type === 'success' ? 'text-emerald-400 font-medium' : 'text-white/90'}`}>{n.message}</p>
                      <p className="text-[10px] text-slate-500 opacity-60 uppercase font-bold tracking-wider">{n.time}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-slate-500 text-sm py-4 italic">No new activity.</p>
                  )}
                </div>
              </section>

              <section className="glass rounded-3xl p-6 border border-white/5 bg-gradient-to-br from-indigo-600/20 to-purple-600/20">
                <h3 className="text-white font-bold mb-2">Need Help?</h3>
                <p className="text-slate-400 text-xs mb-4">Contact the event coordinator if you have any issues with registration.</p>
                <button className="w-full py-2.5 rounded-xl bg-white text-indigo-600 text-xs font-bold hover:bg-white/90 transition-all">
                  Contact Support
                </button>
              </section>
            </div>
          </div>

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
