import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';

export default function FeedbackForm({ onSubmit, isSubmitting }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment });
    // Reset after submit is handled by parent, or keep as is.
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
      <h4 className="text-white font-bold mb-3">Leave Feedback</h4>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-all"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
          >
            <Star
              size={24}
              className={`${
                (hoverRating || rating) >= star
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-slate-600'
              }`}
            />
          </button>
        ))}
      </div>
      <textarea
        className="w-full bg-slate-900/50 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-indigo-500 mb-4 h-24 resize-none"
        placeholder="Share your experience (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        disabled={rating === 0 || isSubmitting}
        className="btn-primary w-full py-2.5 rounded-xl flex justify-center items-center gap-2 text-sm disabled:opacity-50"
      >
        <Send size={16} />
        {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}
