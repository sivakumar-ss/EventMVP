import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import { 
  Users, UserPlus, Search, Shield, 
  Trash2, Mail, MoreVertical, School,
  UserCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Accounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, STUDENT, ADMIN

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete account: ${name}?`)) return;
    try {
      await adminApi.deleteUser(id);
      toast.success('Account deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || (filter === 'ADMIN' ? u.role === 'ROLE_ADMIN' : u.role === 'ROLE_STUDENT');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">User <span className="gradient-text">Accounts</span></h1>
              <p className="text-slate-400">Manage student and college administrator profiles.</p>
            </div>
            <div className="flex gap-3">
                <div className="glass flex p-1 rounded-xl border border-white/10">
                    <button 
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setFilter('STUDENT')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'STUDENT' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Students
                    </button>
                    <button 
                        onClick={() => setFilter('ADMIN')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'ADMIN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Colleges
                    </button>
                </div>
            </div>
          </header>

          <div className="glass-input-group relative mb-8 max-w-md">
            <Search className="icon-left" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input-field input-with-icon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="glass rounded-3xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Identity</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Institution</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="4" className="px-6 py-8">
                          <div className="h-4 bg-white/5 rounded w-1/2" />
                        </td>
                      </tr>
                    ))
                  ) : filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${user.role === 'ROLE_ADMIN' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white mb-0.5">{user.name}</p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Mail size={10} /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase border ${user.role === 'ROLE_ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <School size={14} className="text-indigo-400" />
                          <span>{user.collegeName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white transition-all">
                                <MoreVertical size={14} />
                            </button>
                            <button 
                                onClick={() => handleDelete(user.id, user.name)}
                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loading && filteredUsers.length === 0 && (
              <div className="p-20 text-center">
                <UserCheck size={48} className="text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-1">No accounts found</h3>
                <p className="text-slate-500">Your search criteria didn't match any users.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
