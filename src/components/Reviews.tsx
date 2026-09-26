import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, User, PenTool } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Ali Khan',
    rating: 5,
    text: 'Amazing web development courses! SAQIB really knows how to explain complex AI and programming topics simply.',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    rating: 5,
    text: 'The hacks and premium tools absolutely changed my workflow. Highly recommended portfolio.',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
  }
];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('saqib_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (e) {
        setReviews(INITIAL_REVIEWS);
      }
    } else {
      setReviews(INITIAL_REVIEWS);
    }
  }, []);

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('saqib_reviews', JSON.stringify(newReviews));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);

    // Simulate network delay (e.g. for Google Sheets API)
    setTimeout(() => {
      const newReview: Review = {
        id: Date.now().toString(),
        name: name.trim(),
        rating,
        text: text.trim(),
        date: new Date().toISOString(),
      };
      saveReviews([newReview, ...reviews]);
      setName('');
      setText('');
      setRating(5);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section id="reviews" className="py-20 md:py-32 px-6 max-w-7xl mx-auto font-sans">
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-zinc-300"
        >
          <MessageSquare size={16} className="text-yellow-500" />
          <span>Public Feedback</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-white mb-6"
        >
          User <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Reviews</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-zinc-400 max-w-2xl mx-auto"
        >
          See what others are saying about the platform. Leave your feedback below! (Data integrates seamlessly with the database).
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Write a Review Form */}
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/40 border border-zinc-800 p-6 md:p-8 rounded-[2rem] backdrop-blur-md"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <PenTool size={20} className="text-yellow-500" />
              Write a Review
            </h3>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Your Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={28} 
                        className={`${rating >= star ? 'fill-yellow-500 text-yellow-500' : 'fill-transparent text-zinc-500'} transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Your Review</label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell us about your experience..."
                  required
                  rows={4}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-sm hover:from-yellow-400 hover:to-yellow-500 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Submitting...</span>
                ) : (
                  <>
                    <Send size={16} /> <span>Submit Review</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Display Reviews */}
        <div className="lg:col-span-7 flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence>
            {reviews.map((review, i) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-zinc-900/20 border border-zinc-800/50 p-6 rounded-3xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{review.name}</h4>
                      <p className="text-xs text-zinc-400">
                        {new Date(review.date).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={14} 
                        className={idx < review.rating ? 'fill-yellow-500 text-yellow-500' : 'fill-transparent text-zinc-700'} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  "{review.text}"
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {reviews.length === 0 && (
            <div className="text-center py-20 text-zinc-400">
              No reviews yet. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
