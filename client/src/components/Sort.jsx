import React from "react";
import { ArrowUpDown } from "lucide-react";

const Sort = () => {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-500 hidden sm:inline">
        Sort by:
      </span>
      <div className="relative">
        <select className="appearance-none bg-gray-50 border border-gray-200 text-slate-900 text-sm font-bold rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:border-slate-900 cursor-pointer transition">
          <option>Newest Arrivals</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Best Selling</option>
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
