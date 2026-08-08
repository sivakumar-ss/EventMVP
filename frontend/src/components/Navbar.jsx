import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Bell, User, LogOut, Search, Menu, CheckCircle, Info, AlertCircle, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { notificationApi } from '../services/api';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef, profileRef]);

  const fetchNotifications = async () => {
    if (user) {
      try {
        const res = await notificationApi.getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle size={16} className="text-emerald-400" />;
      case 'ALERT': return <AlertCircle size={16} className="text-rose-400" />;
      default: return <Info size={16} className="text-indigo-400" />;
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 ">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">NexusEvents</span>
          </Link>

          {/* Desktop Search */}
          {!location.pathname.includes('/login') && (
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Search events, venues..." 
                  className="w-full bg-white/5 border border-white/10 rounded-full px-10 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle Night Mode"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowProfile(false);
                    }}
                    className="relative p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white border border-slate-950">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 glass rounded-2xl border border-white/10 shadow-2xl z-20 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="font-bold text-white text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllAsRead} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                            Mark all as read
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center">
                            <Bell className="mx-auto text-slate-600 mb-2" size={24} />
                            <p className="text-sm text-slate-400">No notifications yet.</p>
                          </div>
                        ) : (
                          <div className="divide-y divide-white/5">
                            {notifications.map((notif) => (
                              <div 
                                key={notif.id} 
                                className={`p-4 flex gap-3 hover:bg-white/[0.02] transition-colors ${!notif.isRead ? 'bg-indigo-500/[0.03]' : ''}`}
                                onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
                              >
                                <div className="mt-0.5 shrink-0">
                                  {getIconForType(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm ${!notif.isRead ? 'text-white font-medium' : 'text-slate-300'}`}>
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">{notif.createdAt}</p>
                                </div>
                                {!notif.isRead && (
                                  <div className="shrink-0 flex items-center">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Profile */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => {
                      setShowProfile(!showProfile);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-1 pl-3 rounded-full border border-white/10 hover:bg-white/5 transition-all"
                  >
                    <span className="hidden md:block text-xs font-bold text-slate-300">{user?.name}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-950">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 mt-3 w-56 glass p-2 rounded-2xl border border-white/10 shadow-2xl z-20 ">
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm font-bold text-white mb-0.5">{user?.name}</p>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{user?.role?.replace('ROLE_', '')}</p>
                      </div>
                      <Link to={user?.role === 'ROLE_MASTER_ADMIN' ? '/master-admin/dashboard' : user?.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/dashboard'} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <User size={16} /> Dashboard
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/student/login" className="text-sm font-bold text-slate-400 hover:text-white px-4 py-2 transition-colors">Sign In</Link>
                <Link to="/student/login" className="btn-primary !py-2 !px-5 !text-sm !rounded-full">Join Now</Link>
              </div>
            )}
            
            <button className="md:hidden text-white">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
