import React from "react";

const Filter = ({ categories, selectedCategory, onSelectCategory, priceRange, setPriceRange }) => {
  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={() => onSelectCategory(category)}
                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
              />
              <span
                className={`text-sm font-medium transition ${selectedCategory === category ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}
              >
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">
          Max Price
        </h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="300000"
            step="5000"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
          <div className="flex justify-between text-sm font-bold text-gray-300">
            <span>₦0</span>
            <span>₦{priceRange.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;