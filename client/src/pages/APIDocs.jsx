import React, { useState } from "react";

const APIDocs = () => {
    const [activeTab, setActiveTab] = useState("products");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const endpoints = [
        { name: "Products", url: "http://localhost:5000/products", method: "GET" },
        { name: "Users", url: "http://localhost:5000/users", method: "GET" },
        { name: "Orders", url: "http://localhost:5000/orders", method: "GET" },
        { name: "Newsletters", url: "http://localhost:5000/newsletters", method: "GET" },
        { name: "Most Searched", url: "http://localhost:5000/most-searched", method: "GET" },
        { name: "Admins", url: "http://localhost:5000/admins", method: "GET" }
    ];

    const fetchData = async (url) => {
        setLoading(true);
        setError("");
        setData(null);
        try {
            const res = await fetch(url);
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-8">API Documentation & Tester</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-2">
                        {endpoints.map((ep) => (
                            <button
                                key={ep.name}
                                onClick={() => { setActiveTab(ep.name); fetchData(ep.url); }}
                                className={`w-full text-left px-4 py-3 rounded-xl font-bold uppercase tracking-wide transition ${activeTab === ep.name ? "bg-white text-black" : "bg-zinc-900 text-gray-400 hover:bg-zinc-800"}`}
                            >
                                <span className="text-xs opacity-50 block mb-1">{ep.method}</span>
                                {ep.name}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3 bg-zinc-900 border border-white/10 rounded-3xl p-6 overflow-hidden flex flex-col h-[70vh]">
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                            <code className="bg-black px-3 py-1 rounded text-green-400 font-mono text-sm">
                                {endpoints.find(e => e.name === activeTab)?.url}
                            </code>
                            <button
                                onClick={() => fetchData(endpoints.find(e => e.name === activeTab)?.url)}
                                className="bg-white text-black px-4 py-1 rounded-lg font-bold text-sm hover:bg-blue-400 transition"
                            >
                                {loading ? "Fetching..." : "Test Endpoint"}
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto bg-black rounded-xl p-4 font-mono text-xs text-green-400 relative">
                            {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">Loading...</div>}
                            {error && <div className="text-red-500">Error: {error}</div>}
                            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
                            {!data && !loading && !error && <div className="text-gray-600">Click 'Test Endpoint' to see data.</div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APIDocs;
