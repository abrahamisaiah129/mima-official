import React, { useState } from "react";
import { Search, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchFilter = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSize, setActiveSize] = useState(null);
  const navigate = useNavigate();

  const handleSearchKeys = (e) => {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    }
  };

  const handleCategoryClick = (cat) => {
    // Direct navigation for faster UX
    setActiveCategory(cat);
    navigate(cat === "All" ? "/shop" : `/shop?category=${cat}`);
  };

  const categories = ["All", "Sneakers", "Heels", "Boots", "Sandals", "Flats"];
  const sizes = ["36", "37", "38", "39", "40", "41", "42"];

  return (
    <div className="w-full max-w-4xl mx-auto mb-20 px-4 relative z-10 -mt-10">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl shadow-black/50">
        {/* Search Input */}
        <div className="relative mb-6 group">
          <input
            type="text"
            placeholder="Search for luxury..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchKeys}
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-12 text-white placeholder-gray-500 focus:bg-black focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all duration-300 text-lg"
          />
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors"
            size={24}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Filters Container */}
        <div className="space-y-4">
          {/* Categories Items */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2 self-center">
              Type
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border border-transparent ${
                  activeCategory === cat
                    ? "bg-white text-black shadow-lg shadow-white/10 scale-105 font-bold"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="h-px bg-white/5 w-full my-4" />

          {/* Size Items */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2 self-center">
              Size
            </span>
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setActiveSize(activeSize === size ? null : size)}
                className={`w-10 h-10 rounded-full text-sm font-medium flex items-center justify-center transition-all duration-300 border ${
                  activeSize === size
                    ? "bg-white text-black border-white shadow-lg scale-105 font-bold"
                    : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white hover:bg-white/5"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
