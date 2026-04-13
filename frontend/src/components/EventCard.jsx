import { Calendar, MapPin, Users, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventCard({ event, onRegister, registered, isAdmin, onEdit, onDelete }) {
  const isFull = event.registeredCount >= event.maxParticipants;
  const fillPercent = Math.round((event.registeredCount / event.maxParticipants) * 100);

  const categoryColors = {
    Technical: 'text-cyan-400 bg-cyan-400/10',
    Cultural: 'text-pink-400 bg-pink-400/10',
    Sports: 'text-green-400 bg-green-400/10',
    Workshop: 'text-orange-400 bg-orange-400/10',
    Seminar: 'text-purple-400 bg-purple-400/10',
  };

  return (
    <div className="glass rounded-2xl overflow-hidden card-hover group flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          {event.status === 'UPCOMING' ? (
            <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Upcoming
            </span>
          ) : (
            <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full border border-red-500/30 backdrop-blur-sm">
              <XCircle size={11} />
              Closed
            </span>
          )}
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm border border-white/10 ${categoryColors[event.category] || 'text-slate-400 bg-slate-400/10'}`}>
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-bold text-base mb-2 line-clamp-2 leading-snug">{event.title}</h3>
        <p className="text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="space-y-1.5 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-indigo-400 shrink-0" />
            <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-indigo-400 shrink-0" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={12} className="text-indigo-400 shrink-0" />
            <span>{event.registeredCount} / {event.maxParticipants} registered</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${fillPercent >= 90 ? 'bg-red-500' : fillPercent >= 70 ? 'bg-amber-500' : 'bg-indigo-500'}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">{fillPercent}% filled</p>
        </div>

        {/* Actions */}
        <div className="mt-auto">
          {isAdmin ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit?.(event)} className="flex-1 text-xs py-2 rounded-xl border border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10 transition-all font-medium">Edit</button>
              <button onClick={() => onDelete?.(event)} className="flex-1 text-xs py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all font-medium">Delete</button>
            </div>
          ) : registered ? (
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle size={15} />
              <span>Registered</span>
            </div>
          ) : (
            <button
              onClick={() => onRegister?.(event)}
              disabled={event.status === 'CLOSED' || isFull}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                event.status === 'CLOSED' || isFull
                  ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95'
              }`}
            >
              {isFull ? 'Seats Full' : event.status === 'CLOSED' ? 'Registration Closed' : <>Register Now <ArrowRight size={13} /></>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
