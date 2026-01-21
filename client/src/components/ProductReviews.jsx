import React from "react";
import { Star, ThumbsUp } from "lucide-react";

const reviews = [
  {
    id: 1,
    user: "Sarah Jenkins",
    date: "October 12, 2025",
    rating: 5,
    title: "Absolutely stunning!",
    comment:
      "These shoes are even more beautiful in person. The velvet finish is premium and they are surprisingly comfortable for high heels.",
    helpful: 24,
  },
  {
    id: 2,
    user: "Michelle O.",
    date: "September 28, 2025",
    rating: 5,
    title: "Worth every penny",
    comment:
      "Delivery was super fast (2 days!). The packaging was luxurious and the fit is true to size.",
    helpful: 18,
  },
  {
    id: 3,
    user: "Amara K.",
    date: "September 15, 2025",
    rating: 4,
    title: "Great quality",
    comment:
      "Love the design. Slightly tight at first but broke in nicely after one wear.",
    helpful: 6,
  },
];

const ProductReviews = () => {
  return (
    <div className="py-8">
      <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8">
        Customer Reviews
      </h3>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-white/10 pb-8 last:border-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white">{review.user}</span>
                <span className="text-gray-500 text-sm">• {review.date}</span>
              </div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < review.rating ? "currentColor" : "none"}
                    className={i < review.rating ? "" : "text-gray-600"}
                  />
                ))}
              </div>
            </div>

            <h4 className="font-bold text-white mb-2">{review.title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {review.comment}
            </p>

            <button className="flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-white transition">
              <ThumbsUp size={14} />
              <span>Helpful ({review.helpful})</span>
            </button>
          </div>
        ))}
      </div>
      
      <button className="w-full py-4 border border-white/10 rounded-xl text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all mt-4">
        Write a Review
      </button>
    </div>
  );
};

export default ProductReviews;
