import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, LogOut, ChevronRight, 
  Crown, Settings, ShieldCheck, Shield, BookmarkCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function MasterSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/master-admin/dashboard' },
    { icon: ShieldCheck, label: 'Admin Requests', path: '/master-admin/admin-requests' },
    { icon: Users, label: 'User Accounts', path: '/master-admin/accounts' },
    { icon: Shield, label: 'Security Log', path: '/master-admin/security' },
    { icon: Settings, label: 'Global Settings', path: '/master-admin/settings' },
    { icon: BookmarkCheck, label: 'Support Tickets', path: '/master-admin/support-tickets' },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-950 border-r border-white/5 flex-col z-50 transition-all">
      <div className="h-16 flex items-center px-8 border-b border-white/5">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:rotate-12 ">
            <Crown size={18} />
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">MasterHub</span>
        </div>
      </div>

      <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Platform Control</p>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active text-white' : ''} group`}
          >
            <item.icon size={20} className="shrink-0 " />
            <span className="flex-1 font-medium">{item.label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-40 transition-opacity text-amber-400" />
          </NavLink>
        ))}
      </div>

      {user && (
        <div className="p-4 mt-auto border-t border-white/5">
          <div className="glass p-4 rounded-2xl border border-amber-500/10 bg-amber-600/5 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-slate-950">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-amber-400 font-bold truncate uppercase">Master Admin</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all "
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
