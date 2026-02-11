import React, { useState, useEffect } from "react";
import { Instagram } from "lucide-react";
import api from "../api";

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get('/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error("Failed to load instagram posts", err));
  }, []);

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
        {posts.map((post, index) => (
          <a
            key={post.id || post._id || index}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="min-w-[250px] md:min-w-[300px] aspect-square relative group rounded-2xl overflow-hidden snap-center cursor-pointer block"
          >
            <img src={post.image} alt="Instagram Post" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.8] group-hover:brightness-100" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Instagram className="text-white" size={32} />
            </div>
            <div className="absolute bottom-4 left-4 text-xs font-bold text-white bg-black/50 backdrop-blur px-3 py-1 rounded-full">
              {post.user}
            </div>
            <div className="absolute bottom-4 right-4 text-[10px] font-medium text-white/80 bg-black/30 backdrop-blur px-2 py-1 rounded-full">
              {post.date}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed;
