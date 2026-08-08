import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'student' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ ...formData, token: 'mock-jwt-token' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-cover">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl shadow-2xl shadow-blue-500/10 border border-slate-100 w-full max-w-lg"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-xl shadow-blue-500/40 mb-6 text-white rotate-3">
            <LogIn size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-2">Login to your account</h2>
          <p className="text-slate-400 font-medium">Empower your campus life today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Username / ID</label>
            <div className="relative group">
              <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                required
                className="input-unstop pl-12"
                placeholder="Enter your username"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <button type="button" className="text-blue-600 text-xs font-bold hover:underline">Forgot Password?</button>
            </div>
            <div className="relative group">
              <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="password" 
                required
                className="input-unstop pl-12"
                placeholder="••••••••"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 ml-1">Login As</label>
            <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl">
              {['student', 'admin'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`flex-1 py-3 rounded-xl capitalize font-bold text-sm transition-all ${
                    formData.role === role 
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' 
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-unstop w-full py-4 flex items-center justify-center gap-3 text-lg font-bold mt-4">
            Sign In
            <ArrowRight size={22} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-slate-600 font-medium">
              Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register Now</Link>
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                <ShieldCheck size={16} />
                <span>Secure Authentication Enabled</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
