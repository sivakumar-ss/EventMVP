import React, { useState, useEffect } from 'react';
import { masterAdminApi } from '../../services/api';
import MasterSidebar from '../../components/MasterSidebar';
import { 
  Users, Search, Shield, Crown,
  Trash2, Mail, School, UserCheck,
  ArrowUpDown, ShieldCheck, GraduationCap
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MasterAccounts() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await masterAdminApi.getUsers();
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
      await masterAdminApi.deleteUser(id);
      toast.success('Account deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data || 'Failed to delete account');
    }
  };

  const handleToggleRole = async (id, name, currentRole) => {
    const newRole = currentRole === 'ROLE_ADMIN' ? 'Student' : 'Admin';
    if (!window.confirm(`Change ${name}'s role to ${newRole}?`)) return;
    try {
      await masterAdminApi.toggleRole(id);
      toast.success(`${name} is now a ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data || 'Failed to change role');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase()) ||
                          (u.collegeName && u.collegeName.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'ALL' || 
                          (filter === 'ADMIN' ? u.role === 'ROLE_ADMIN' : u.role === 'ROLE_STUDENT');
    return matchesSearch && matchesFilter;
  });

  const adminCount = users.filter(u => u.role === 'ROLE_ADMIN').length;
  const studentCount = users.filter(u => u.role === 'ROLE_STUDENT').length;

  return (
    <div className="flex">
      <MasterSidebar />
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Crown size={20} className="text-white" />
                </div>
                <h1 className="text-4xl font-bold text-white">Account <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Management</span></h1>
              </div>
              <p className="text-slate-400 ml-[52px]">Manage all college administrators and student accounts.</p>
            </div>
            <div className="flex gap-3">
              <div className="glass flex p-1 rounded-xl border border-white/10">
                <button 
                  onClick={() => setFilter('ALL')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${filter === 'ALL' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  All <span className="opacity-60">({users.length})</span>
                </button>
                <button 
                  onClick={() => setFilter('ADMIN')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${filter === 'ADMIN' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <Shield size={12} /> Admins <span className="opacity-60">({adminCount})</span>
                </button>
                <button 
                  onClick={() => setFilter('STUDENT')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${filter === 'STUDENT' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <GraduationCap size={12} /> Students <span className="opacity-60">({studentCount})</span>
                </button>
              </div>
            </div>
          </header>

          <div className="glass-input-group relative mb-8 max-w-md">
            <Search className="icon-left" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or college..."
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
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            user.role === 'ROLE_ADMIN' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
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
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border flex items-center gap-1 w-fit ${
                          user.role === 'ROLE_ADMIN' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {user.role === 'ROLE_ADMIN' ? <Shield size={10} /> : <GraduationCap size={10} />}
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <School size={14} className="text-amber-400/60" />
                          <span>{user.collegeName || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleToggleRole(user.id, user.name, user.role)}
                            className={`h-8 px-3 rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all border ${
                              user.role === 'ROLE_ADMIN'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-white'
                            }`}
                            title={user.role === 'ROLE_ADMIN' ? 'Demote to Student' : 'Promote to Admin'}
                          >
                            <ArrowUpDown size={12} />
                            {user.role === 'ROLE_ADMIN' ? 'Demote' : 'Promote'}
                          </button>
                          <button 
                            onClick={() => handleDelete(user.id, user.name)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            title="Delete Account"
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
