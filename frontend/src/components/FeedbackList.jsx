import React from 'react';
import { Star, User } from 'lucide-react';

export default function FeedbackList({ feedbacks }) {
  if (!feedbacks || feedbacks.length === 0) {
    return <p className="text-slate-500 text-sm italic">No feedback yet. Be the first to share your experience!</p>;
  }

  return (
    <div className="space-y-4">
      {feedbacks.map((fb) => (
        <div key={fb.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                <User size={14} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{fb.studentName}</p>
                <p className="text-[10px] text-slate-500">{fb.createdAt}</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={star <= fb.rating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-700'}
                />
              ))}
            </div>
          </div>
          {fb.comment && <p className="text-slate-300 text-sm mt-2">{fb.comment}</p>}
        </div>
      ))}
    </div>
  );
}
