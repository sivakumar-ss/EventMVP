import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as Icons from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { name: 'Home', icon: 'LayoutDashboard', path: '/dashboard' },
    ...(isAdmin 
      ? [
          { name: 'Analytics', icon: 'BarChart3', path: '/admin-dashboard' },
          { name: 'Events Plan', icon: 'Calendar', path: '/dashboard' },
          { name: 'Add Event', icon: 'PlusCircle', path: '/create-event' },
        ]
      : [
          { name: 'My Activity', icon: 'Award', path: '/my-registrations' },
          { name: 'Profile', icon: 'User', path: '/dashboard' }
        ]
    )
  ];

  return (
    <aside className="w-24 lg:w-72 bg-white border-r border-slate-100 h-[calc(100vh-80px)] sticky top-20 flex flex-col py-8 px-4 z-40">
      <div className="space-y-2">
        <p className="hidden lg:block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-6 text-center lg:text-left">Explore</p>
        
        {menuItems.map((item) => {
          const IconComponent = Icons[item.icon] || Icons.HelpCircle;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}
              `}
            >
              <IconComponent size={22} className="transition-transform group-hover:scale-110" />
              <span className="hidden lg:block font-black text-sm uppercase tracking-wider">{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto space-y-2">
        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all group">
          <Icons.Settings size={22} className="group-hover:rotate-90 transition-transform" />
          <span className="hidden lg:block font-black text-sm uppercase tracking-wider">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
