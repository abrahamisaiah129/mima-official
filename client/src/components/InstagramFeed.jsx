import React from "react";
import { Instagram } from "lucide-react";

const posts = [
  { id: 1, image: "https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?q=80&w=600&auto=format&fit=crop", user: "@sarah.style" },
  { id: 2, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop", user: "@luxury.feet" },
  { id: 3, image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600&auto=format&fit=crop", user: "@urban.minimalist" },
  { id: 4, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop", user: "@kicks.daily" },
  { id: 5, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop", user: "@ceo.looks" },
];

const InstagramFeed = () => {
  return (
    <div className="py-20 border-t border-white/5 relative overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">MIMA on You</h2>
        <p className="text-gray-400">Join the community. Tag <span className="text-white font-bold">@mima_official</span> to be featured.</p>
        
        <a href="#" className="inline-flex items-center space-x-2 mt-6 text-white text-sm font-bold border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all">
            <Instagram size={18} />
            <span>Follow Us</span>
        </a>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-8 px-4 scrollbar-hide snap-x">
         {posts.map((post) => (
             <div key={post.id} className="min-w-[250px] md:min-w-[300px] aspect-square relative group rounded-2xl overflow-hidden snap-center cursor-pointer">
                 <img src={post.image} alt="Instagram Post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.8] group-hover:brightness-100" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                     <Instagram className="text-white" size={32} />
                 </div>
                 <div className="absolute bottom-4 left-4 text-xs font-bold text-white bg-black/50 backdrop-blur px-3 py-1 rounded-full">
                     {post.user}
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};

export default InstagramFeed;
