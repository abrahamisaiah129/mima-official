import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../../api";

const SearchTab = () => {
    const [searches, setSearches] = useState([]);

    // Fetch Searches
    useEffect(() => {
        const fetchSearches = async () => {
            try {
                const res = await api.get("/searches");
                const data = res.data;
                setSearches(Array.isArray(data) ? data.sort((a, b) => b.count - a.count) : []);
            } catch (error) {
                console.error("Failed to fetch searches", error);
            }
        };
        fetchSearches();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Search Operations</h2>
                <p className="text-sm text-gray-400">Analyze what customers are looking for.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 col-span-full">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Search size={20} className="text-gray-400" /> Top Search Terms
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-widest">
                                    <th className="py-4">Term</th>
                                    <th className="py-4 text-right">Count</th>
                                    <th className="py-4 text-right">Last Searched</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {searches.map((term, i) => (
                                    <tr key={term.term} className="border-b border-white/5 hover:bg-white/5 transition">
                                        <td className="py-4 font-bold text-white">{term.term}</td>
                                        <td className="py-4 text-right text-gray-400">{term.count}</td>
                                        <td className="py-4 text-right text-gray-500">{new Date(term.lastSearched).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {searches.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No search data available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchTab;
