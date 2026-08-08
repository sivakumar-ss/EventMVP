import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, User, Lock, Mail, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'student' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple mock registration & login
    login({ ...formData, token: 'mock-jwt-token' });
    navigate('/dashboard');
  };

  return (
    <div className="min-height-screen flex items-center justify-center p-6 mt-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md p-8 bg-slate-900/40"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-pink-500/10 rounded-2xl mb-4">
            <UserPlus className="text-pink-500" size={32} />
          </div>
          <h2 className="text-3xl font-bold gradient-text">Join the Hub</h2>
          <p className="text-slate-400 mt-2">Create an account to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                required
                className="input-field w-full pl-12"
                placeholder="Choose a username"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="email" 
                required
                className="input-field w-full pl-12"
                placeholder="your@email.com"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="password" 
                required
                className="input-field w-full pl-12"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 mt-2 flex items-center justify-center gap-2 group">
            Register Account
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
