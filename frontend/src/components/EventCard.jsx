import { Calendar, MapPin, Users, ArrowRight, CheckCircle, XCircle, School, Banknote, Clock, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function EventCard({ event, onRegister, registered, isAdmin, onEdit, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  const isFull = event.registeredCount >= event.maxParticipants;
  const fillPercent = Math.round((event.registeredCount / event.maxParticipants) * 100);

  const categoryColors = {
    Technical: 'text-indigo-600 bg-indigo-100 border-indigo-300',
    Cultural: 'text-pink-600 bg-pink-100 border-pink-300',
    Sports: 'text-green-600 bg-green-100 border-green-300',
    Workshop: 'text-orange-600 bg-orange-100 border-orange-300',
    Seminar: 'text-purple-600 bg-purple-100 border-purple-300',
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <>
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass rounded-2xl overflow-hidden card-hover group flex flex-col cursor-pointer"
      onClick={() => setShowDetails(true)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover "
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          {event.status === 'UPCOMING' ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-300 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 " />
              Upcoming
            </span>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-300 backdrop-blur-sm">
              <XCircle size={11} />
              Closed
            </span>
          )}
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${categoryColors[event.category] || 'text-gray-600 bg-gray-100 border-gray-300'}`}>
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-base mb-1 line-clamp-2 leading-snug">{event.title}</h3>
        <div className="flex items-center gap-1.5 mb-2">
            <School size={12} className="text-indigo-600" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{event.collegeName || 'General Event'}</span>
        </div>
        <p className="text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="space-y-1.5 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-indigo-600 shrink-0" />
            <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-indigo-600 shrink-0" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={12} className="text-indigo-600 shrink-0" />
            <span>{event.registeredCount} / {event.maxParticipants} registered</span>
          </div>
          <div className="flex items-center gap-2">
            <Banknote size={12} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-white">{event.fee > 0 ? `₹${event.fee}` : 'Free'}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${fillPercent >= 90 ? 'bg-red-500' : fillPercent >= 70 ? 'bg-amber-500' : 'bg-indigo-600'}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{fillPercent}% filled</p>
        </div>

        {/* Actions */}
        <div className="mt-auto">
          {isAdmin ? (
            <div className="flex gap-2">
              <button onClick={(e) => { e.stopPropagation(); onEdit?.(event); }} className="flex-1 text-xs py-2 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium">Edit</button>
              <button onClick={(e) => { e.stopPropagation(); onDelete?.(event); }} className="flex-1 text-xs py-2 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 font-medium">Delete</button>
            </div>
          ) : registered ? (
            <div className="flex flex-col gap-2 w-full">
              <div className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${
                event.registrationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                event.registrationStatus === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-300' :
                event.registrationStatus === 'WAITLISTED' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                'bg-amber-100 text-amber-700 border-amber-300'
              }`}>
                {event.registrationStatus === 'VERIFIED' ? <CheckCircle size={13} /> : event.registrationStatus === 'REJECTED' ? <XCircle size={13} /> : event.registrationStatus === 'WAITLISTED' ? <Clock size={13} /> : <div className="w-2.5 h-2.5 rounded-full bg-amber-600 " />}
                <span>{event.registrationStatus || 'PENDING'}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onRegister?.(event); }}
              disabled={event.status === 'CLOSED'}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                event.status === 'CLOSED'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : isFull
                    ? 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg hover:shadow-purple-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95'
              }`}
            >
              {event.status === 'CLOSED' ? 'Registration Closed' : isFull ? 'Join Waitlist' : <>Register Now <ArrowRight size={13} /></>}
            </button>
          )}
        </div>
      </div>
    </motion.div>

    {showDetails && (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowDetails(false)}
      >
        <div 
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="relative h-64 w-full shrink-0">
            <img
              src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <button 
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md"
              onClick={() => setShowDetails(false)}
            >
              <X size={20} />
            </button>
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border ${categoryColors[event.category] || 'text-gray-600 bg-gray-100 border-gray-300'}`}>
                {event.category}
              </span>
            </div>
          </div>
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{event.title}</h2>
              <div className="flex items-center gap-2 text-indigo-600 font-medium">
                <School size={16} />
                <span>{event.collegeName || 'General Event'}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0"><Calendar size={16}/></div>
                <div>
                  <p className="font-semibold text-white">Date & Time</p>
                  <p>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0"><MapPin size={16}/></div>
                <div>
                  <p className="font-semibold text-white">Venue</p>
                  <p>{event.venue}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0"><Banknote size={16}/></div>
                <div>
                  <p className="font-semibold text-white">Registration Fee</p>
                  <p className="font-semibold">{event.fee > 0 ? `₹${event.fee}` : 'Free'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0"><Users size={16}/></div>
                <div>
                  <p className="font-semibold text-white">Spots Filled</p>
                  <p>{event.registeredCount} / {event.maxParticipants}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-2">About This Event</h3>
              <p className="text-slate-400 whitespace-pre-wrap leading-relaxed">{event.description}</p>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
