import React from 'react';
import { Calendar, MapPin, Users, Heart, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EventCard = ({ event, onRegister, isRegistered }) => {
  const isUpcoming = event.status === 'Upcoming';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-unstop group h-full flex flex-col"
    >
      <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl">
        <img 
          src={`https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80&event=${event.id}`} 
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 backdrop-blur-md text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
               Featured
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              isUpcoming ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {event.status}
            </span>
        </div>
        <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white hover:text-red-500 transition-all">
            <Heart size={18} />
        </button>
      </div>

      <div className="flex-1">
        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">{event.title}</h3>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed h-10">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Calendar size={16} className="text-blue-600" />
            {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <MapPin size={16} className="text-blue-600" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <div className="flex -space-x-2">
            {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${event.id + i}`} alt="user" />
                </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                +{event.participants?.length || 0}
            </div>
        </div>

        <div className="flex gap-2">
            {!isRegistered ? (
              <button 
                onClick={() => onRegister(event.id)}
                disabled={!isUpcoming}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black transition-all text-sm uppercase tracking-wider ${
                  isUpcoming 
                    ? 'bg-blue-600 hover:bg-black text-white shadow-lg shadow-blue-500/20 active:scale-95' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isUpcoming ? 'Register' : 'Closed'}
                {isUpcoming && <ArrowRight size={16} />}
              </button>
            ) : (
              <div className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-black text-sm uppercase tracking-wider border border-blue-100">
                Registered
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
