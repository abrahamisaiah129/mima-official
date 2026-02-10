import React from "react";
import { ArrowUpDown } from "lucide-react";

const Sort = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-500 hidden sm:inline">
        Sort by:
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-zinc-900 border border-zinc-800 text-white text-sm font-bold rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-white cursor-pointer transition"
        >
          <option value="Newest Arrivals">Newest Arrivals</option>
          <option value="Price: Low to High">Price: Low to High</option>
          <option value="Price: High to Low">Price: High to Low</option>
          <option value="Best Selling">Best Selling</option>
        </select>
        <ArrowUpDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default Sort;
