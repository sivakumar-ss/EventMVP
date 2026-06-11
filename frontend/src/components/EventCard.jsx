import { Calendar, MapPin, Users, ArrowRight, CheckCircle, XCircle, School } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventCard({ event, onRegister, registered, isAdmin, onEdit, onDelete }) {
  const isFull = event.registeredCount >= event.maxParticipants;
  const fillPercent = Math.round((event.registeredCount / event.maxParticipants) * 100);

  const categoryColors = {
    Technical: 'text-indigo-600 bg-indigo-100 border-indigo-300',
    Cultural: 'text-pink-600 bg-pink-100 border-pink-300',
    Sports: 'text-green-600 bg-green-100 border-green-300',
    Workshop: 'text-orange-600 bg-orange-100 border-orange-300',
    Seminar: 'text-purple-600 bg-purple-100 border-purple-300',
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
            <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-300 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
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
        <h3 className="text-gray-900 font-bold text-base mb-1 line-clamp-2 leading-snug">{event.title}</h3>
        <div className="flex items-center gap-1.5 mb-2">
            <School size={12} className="text-indigo-600" />
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">{event.collegeName || 'General Event'}</span>
        </div>
        <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="space-y-1.5 mb-4 text-xs text-gray-600">
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
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${fillPercent >= 90 ? 'bg-red-500' : fillPercent >= 70 ? 'bg-amber-500' : 'bg-indigo-600'}`}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-500 mt-1">{fillPercent}% filled</p>
        </div>

        {/* Actions */}
        <div className="mt-auto">
          {isAdmin ? (
            <div className="flex gap-2">
              <button onClick={() => onEdit?.(event)} className="flex-1 text-xs py-2 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all font-medium">Edit</button>
              <button onClick={() => onDelete?.(event)} className="flex-1 text-xs py-2 rounded-xl border border-red-600 text-red-600 hover:bg-red-50 transition-all font-medium">Delete</button>
            </div>
          ) : registered ? (
            <div className="flex flex-col gap-2 w-full">
              <div className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider ${
                event.registrationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                event.registrationStatus === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-300' :
                'bg-amber-100 text-amber-700 border-amber-300'
              }`}>
                {event.registrationStatus === 'VERIFIED' ? <CheckCircle size={13} /> : event.registrationStatus === 'REJECTED' ? <XCircle size={13} /> : <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />}
                <span>{event.registrationStatus || 'PENDING'}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onRegister?.(event)}
              disabled={event.status === 'CLOSED' || isFull}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                event.status === 'CLOSED' || isFull
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95'
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
