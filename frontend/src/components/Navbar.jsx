import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Bell, User, LogOut, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-110 transition-transform">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">EventHub</span>
          </Link>

          {/* Desktop Search */}
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

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center gap-2 p-1 pl-3 rounded-full border border-white/10 hover:bg-white/5 transition-all"
                  >
                    <span className="hidden md:block text-xs font-bold text-slate-300">{user.name}</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-slate-950">
                      {user.name?.[0].toUpperCase()}
                    </div>
                  </button>

                  {showProfile && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                      <div className="absolute right-0 mt-3 w-56 glass p-2 rounded-2xl border border-white/10 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-3 py-2 border-b border-white/5 mb-1">
                          <p className="text-sm font-bold text-white mb-0.5">{user.name}</p>
                          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{user.role.replace('ROLE_', '')}</p>
                        </div>
                        <Link to={user.role === 'ROLE_ADMIN' ? '/admin/dashboard' : '/student/dashboard'} className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                          <User size={16} /> Dashboard
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </>
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
