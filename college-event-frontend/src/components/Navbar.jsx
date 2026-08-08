import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, Search, Bell, Menu } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="unstop-header py-4 px-6 md:px-12 flex justify-between items-center h-20">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30">
            <Calendar size={24} />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">Campus<span className="text-blue-600">Events</span></span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-6">
          <Link to="/dashboard" className="text-slate-600 font-semibold hover:text-blue-600 transition-colors">Courses</Link>
          <Link to="/dashboard" className="text-slate-600 font-semibold hover:text-blue-600 transition-colors">Events</Link>
          <Link to="/dashboard" className="text-slate-600 font-semibold hover:text-blue-600 transition-colors">Hackathons</Link>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search opportunities..." 
            className="bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:bg-white focus:border-blue-500 transition-all outline-none" 
          />
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></div>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-blue-600 uppercase">
                {user.username.charAt(0)}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user.username}</p>
                <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">{user.role}</p>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="text-slate-700 font-bold hover:text-blue-600 transition-colors py-2 px-4">Login</Link>
            <Link to="/register" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">Register</Link>
          </div>
        )}
        <button className="lg:hidden p-2 text-slate-700">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
