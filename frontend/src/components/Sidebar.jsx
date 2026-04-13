import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, BookmarkCheck, User, 
  Settings, LogOut, ChevronRight, Zap, ListChecks, BarChart3, Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const menuItems = isAdmin ? [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Plus, label: 'Create Event', path: '/admin/create-event' },
    { icon: ListChecks, label: 'Manage Events', path: '/admin/events' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  ] : [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: Calendar, label: 'Browse Events', path: '/student/events' },
    { icon: BookmarkCheck, label: 'My Registrations', path: '/student/my-events' },
    { icon: User, label: 'My Profile', path: '/student/profile' },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-950 border-r border-white/5 flex-col z-40 transition-all">
      <div className="h-16 flex items-center px-8 border-b border-white/5">
         <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">EventHub</span>
          </div>
      </div>

      <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Main Menu</p>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active text-white' : ''} group`}
          >
            <item.icon size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
            <span className="flex-1 font-medium">{item.label}</span>
            <ChevronRight size={14} className={`opacity-0 group-hover:opacity-40 transition-opacity ${isAdmin ? 'text-indigo-400' : 'text-indigo-400'}`} />
          </NavLink>
        ))}

        <div className="pt-8">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Account</p>
            <NavLink
                to={isAdmin ? "/admin/settings" : "/student/profile"}
                className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''} group`}
            >
                <Settings size={20} className="shrink-0 group-hover:rotate-45 transition-transform" />
                <span className="flex-1 font-medium">Settings</span>
            </NavLink>
        </div>
      </div>

      <div className="p-4 mt-auto border-t border-white/5">
        <div className="glass p-4 rounded-2xl border border-white/10 bg-indigo-600/5 group">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-slate-950">
                    {user?.name?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate uppercase">{user?.role.replace('ROLE_', '')}</p>
                </div>
            </div>
            <button 
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all duration-300"
            >
                <LogOut size={14} /> Sign Out
            </button>
        </div>
      </div>
    </aside>
  );
}
