import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Calendar, Shield, Award, ArrowRight, Star } from 'lucide-react';
import { testimonials } from '../data/mockData';

export default function LandingPage() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-20">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-slate-950">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse-glow" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 text-indigo-400 text-sm font-medium mb-8 animate-float">
            <Zap size={16} /> Now live for University Campus
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Never Miss a <span className="gradient-text">College Event</span> Again
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate event management hub for students and admins. Discover workshops, 
            hackathons, and cultural fests all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/student/events" className="btn-primary flex items-center gap-2 w-full sm:w-auto">
              Explore Events <ArrowRight size={18} />
            </Link>
            <Link to="/student/login" className="btn-secondary w-full sm:w-auto">
              Admin Login
            </Link>
          </div>

          {/* Stats Preview */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Events', value: '500+' },
              { label: 'Active Students', value: '10k+' },
              { label: 'Registrations', value: '25k+' },
              { label: 'Success Rate', value: '99%' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Why Choose <span className="text-indigo-500">EventHub</span>?</h2>
            <p className="section-sub">Powerful features designed specifically for the college ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: 'Smart Scheduling', desc: 'Auto-sync events with your academic calendar and get timely notifications.' },
              { icon: Shield, title: 'Secure Registration', desc: 'One-click registration for students with verified college credentials.' },
              { icon: Award, title: 'Instant Certificates', desc: 'Automatically generate and download participation certificates after event closure.' },
            ].map((feat, i) => (
              <div key={i} className="glass p-8 rounded-3xl card-hover border border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <feat.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-title">Simple & Efficient</h2>
          <div className="mt-16 grid md:grid-cols-3 gap-12 relative">
             {/* Connector bubbles on desktop */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-indigo-500/20 -z-10" />
            
            {[
              { step: '01', title: 'Admins Create', desc: 'College admins post event details, banners, and set participant limits.' },
              { step: '02', title: 'Students Browse', desc: 'Browse trending events across departments and apply filters based on interest.' },
              { step: '03', title: 'Register & Track', desc: 'Register instantly and view all your upcoming/attended events on your personal dashboard.' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-indigo-600/30">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-indigo-600/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="section-title">Trusted by Thousands</h2>
            <p className="section-sub">Here is what our growing community says about us.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="glass p-8 rounded-3xl relative">
                <div className="flex gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-300 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{t.name}</h4>
                    <p className="text-indigo-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-indigo-500" />
            <span className="text-white font-bold">EventHub</span>
          </div>
          <p className="text-slate-500 text-sm text-center">© 2026 Smart College Event Management. Built with ⚡ by Advanced Agentic Coding.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
