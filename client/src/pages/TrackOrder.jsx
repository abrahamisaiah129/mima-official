import React, { useState } from "react";
import { Search, Package, MapPin, Truck, CheckCircle, AlertCircle } from "lucide-react";

// Mock Data for Tracking (In production, fetch from backend)
const MOCK_TRACKING_DB = {
  "10231": {
    status: "Delivered",
    steps: [
      { status: "Order Placed", date: "Oct 20, 10:00 AM", done: true },
      { status: "Processing", date: "Oct 20, 02:30 PM", done: true },
      { status: "Shipped", date: "Oct 21, 09:15 AM", done: true },
      { status: "Delivered", date: "Oct 22, 04:45 PM", done: true },
    ],
    items: "Velvet Stilettos (x1), Chunky Sneakers (x1)"
  },
  "10232": {
    status: "Shipped",
    steps: [
      { status: "Order Placed", date: "Oct 24, 08:00 AM", done: true },
      { status: "Processing", date: "Oct 24, 11:30 AM", done: true },
      { status: "Shipped", date: "Oct 25, 10:00 AM", done: true },
      { status: "Delivered", date: "Estimated Oct 27", done: false },
    ],
    items: "Classic Pumps (x1)"
  },
  "10233": {
     status: "Processing",
     steps: [
       { status: "Order Placed", date: "Today, 09:00 AM", done: true },
       { status: "Processing", date: "In Progress", done: true },
       { status: "Shipped", date: "Pending", done: false },
       { status: "Delivered", date: "Pending", done: false },
     ],
     items: "Ankle Boots (x2)"
  }
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    setError("");
    setTrackingData(null);
    setLoading(true);

    if (!orderId.trim()) { 
        setLoading(false);
        return; 
    }

    // Simulate API Network Delay
    setTimeout(() => {
       const data = MOCK_TRACKING_DB[orderId.trim()];
       if (data) {
           setTrackingData(data);
       } else {
           setError("Order ID not found. Please check and try again.");
       }
       setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-400">
            Enter your Order ID (e.g., 10231) to see realtime status.
          </p>
        </div>

        {/* SEARCH FORM */}
        <form onSubmit={handleTrack} className="mb-12 animate-slide-up">
            <div className="relative flex items-center">
                <input 
                   type="text" 
                   value={orderId}
                   onChange={(e) => setOrderId(e.target.value)}
                   className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-5 pl-6 pr-32 text-white font-bold text-lg placeholder-gray-600 focus:outline-none focus:border-white transition shadow-xl"
                   placeholder="Enter Order ID"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition disabled:opacity-70"
                >
                    {loading ? "..." : "Track"}
                </button>
            </div>
            {error && (
                <div className="mt-4 flex items-center justify-center space-x-2 text-red-500 bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                    <AlertCircle size={18} />
                    <span className="font-bold text-sm">{error}</span>
                </div>
            )}
        </form>

        {/* RESULTS CARD */}
        {trackingData && (
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 animate-slide-up shadow-2xl">
                 <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-8">
                     <div>
                         <h2 className="text-2xl font-black uppercase text-white mb-2">Order #{orderId}</h2>
                         <p className="text-gray-400 text-sm">Contains: <span className="text-white">{trackingData.items}</span></p>
                     </div>
                     <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                         trackingData.status === "Delivered" ? "bg-green-500 text-black" : "bg-blue-500 text-white"
                     }`}>
                         {trackingData.status}
                     </span>
                 </div>

                 <div className="relative space-y-8">
                      {/* Vertical Line */}
                      <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-white/10"></div>

                      {trackingData.steps.map((step, index) => (
                           <div key={index} className="relative flex items-center gap-6">
                               {/* Icon/Dot */}
                               <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 relative z-10 transition-colors ${
                                   step.done ? "bg-white border-black text-black" : "bg-black border-zinc-800 text-gray-500"
                               }`}>
                                   {index === 0 && <Package size={18} />}
                                   {index === 1 && <MapPin size={18} />}
                                   {index === 2 && <Truck size={18} />}
                                   {index === 3 && <CheckCircle size={18} />}
                               </div>

                               {/* Info */}
                               <div>
                                   <h4 className={`font-bold text-lg ${step.done ? "text-white" : "text-gray-500"}`}>{step.status}</h4>
                                   <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{step.date}</p>
                               </div>
                           </div>
                      ))}
                 </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;
