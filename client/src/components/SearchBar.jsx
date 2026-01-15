import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        placeholder="Search for heels, sneakers..."
        onChange={(e) => onSearch && onSearch(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 transition-all font-medium"
      />
    </div>
  );
};

export default SearchBar;
