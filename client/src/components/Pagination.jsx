import React from "react";

const ChevronLeft = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const ChevronRight = ({ className, size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  return (
    <div className="mt-16 flex justify-center">
      <nav className="inline-flex items-center p-1 rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-12 h-12 rounded-full flex items-center justify-center text-gray-400 hover:text-slate-900 disabled:text-gray-200 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1 px-2">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition ${
                  isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30" : "text-gray-500 hover:bg-gray-50 hover:text-red-600"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-slate-900 hover:bg-red-600 hover:text-white disabled:bg-white disabled:text-gray-200 disabled:cursor-not-allowed transition-all duration-300 shadow-sm"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;