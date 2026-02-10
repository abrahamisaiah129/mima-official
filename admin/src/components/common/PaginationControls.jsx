import React from "react";

const PaginationControls = ({ totalItems, currentPage, setPage, itemsPerPage = 5 }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center space-x-4 mt-8">
            <button
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-zinc-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-zinc-700 transition"
            >
                Previous
            </button>
            <span className="text-sm text-gray-500">
                Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
            </span>
            <button
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-zinc-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-zinc-700 transition"
            >
                Next
            </button>
        </div>
    );
};

export default PaginationControls;
