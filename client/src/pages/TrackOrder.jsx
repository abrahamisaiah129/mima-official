import React, { useState, useEffect } from "react";
import { Search, Package, MapPin, Truck, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useUser } from "../context/UserContext";
import api from "../api";

// Helper to generate steps based on status
const generateSteps = (order) => {
  const status = order.status;
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : new Date().toLocaleDateString();

  // Status Cycle: Pending -> Processing -> Shipped -> Delivered
  const steps = [
    { status: "Order Placed", date: date, done: true },
    { status: "Processing", date: status === "Pending" ? "Pending" : "In Progress", done: ["Processing", "Shipped", "Delivered"].includes(status) },
    { status: "Shipped", date: status === "Shipped" || status === "Delivered" ? "In Transit" : "Pending", done: ["Shipped", "Delivered"].includes(status) },
    { status: "Delivered", date: status === "Delivered" ? "Delivered" : "Pending", done: status === "Delivered" },
  ];
  return steps;
};

const TrackOrder = () => {
  const { user } = useUser();
  const [orderId, setOrderId] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  // Fetch User's Orders on Mount
  useEffect(() => {
    if (user?._id) {
      // Use the dedicated user orders endpoint
      api.get(`/orders/user/${user._id}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            // Sort by date desc
            setUserOrders(res.data);
          }
        })
        .catch((err) => console.error("Failed to load user orders", err));
    }
  }, [user]);

  const viewOrder = (order) => {
    setTrackingData({
      ...order,
      items: Array.isArray(order.items) ? `${order.items.length} item(s)` : "Items",
      steps: generateSteps(order)
    });
    setOrderId(order.id || order._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setTrackingData(null);
    setLoading(true);

    if (!orderId.trim()) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/orders/${orderId.trim()}`);
      const data = res.data;

      if (data) {
        setTrackingData({
          ...data,
          items: Array.isArray(data.items) ? `${data.items.length} item(s)` : "Items",
          steps: generateSteps(data)
        });
      } else {
        setError("Order ID not found.");
      }

    } catch (err) {
      console.error("Tracking error:", err);
      setError("Order ID not found. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            {user ? "Your Orders" : "Track Your Order"}
          </h1>
          {!user && (
            <p className="text-gray-400">
              Enter your Order ID to see realtime status.
            </p>
          )}
        </div>

        {/* User Orders List (If Logged In) */}
        {!trackingData && user && (
          <div className="mb-12 animate-slide-up">
            {userOrders.length > 0 ? (
              <div className="space-y-4">
                {userOrders.map((order) => (
                  <div
                    key={order._id || order.id}
                    onClick={() => viewOrder(order)}
                    className="bg-zinc-900 border border-white/10 p-6 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-zinc-800 transition group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center border border-white/10 group-hover:border-white/30 transition">
                        <Package size={20} className="text-gray-400 group-hover:text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Order #{order.id || order._id.slice(-6)}</h4>
                        <p className="text-gray-500 text-sm">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.status} • ₦{order.total?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-gray-500 group-hover:text-white transition group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-zinc-900 rounded-2xl border border-white/10">
                <p className="text-gray-400 mb-4">You have no orders yet.</p>
              </div>
            )}

            {/* Option to track manually even if logged in? Maybe hidden for simplicity as requested */}
          </div>
        )}

        {/* SEARCH FORM (Only if NOT logged in or explicitly requested via some UI toggle we don't have yet) */}
        {!user && !trackingData && (
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
        )}

        {/* RESULTS CARD */}
        {trackingData && (
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 animate-slide-up shadow-2xl">
            {/* Back Button */}
            <button
              onClick={() => { setTrackingData(null); setOrderId(""); }}
              className="mb-6 text-sm font-bold text-gray-400 hover:text-white flex items-center gap-2 uppercase tracking-wide transition"
            >
              <ArrowRight size={16} className="rotate-180" /> Back to {user ? "Orders" : "Search"}
            </button>

            <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-8">
              <div>
                <h2 className="text-2xl font-black uppercase text-white mb-2">Order #{orderId}</h2>
                <p className="text-gray-400 text-sm">Contains: <span className="text-white">{trackingData.items}</span></p>
                <p className="text-gray-400 text-sm mt-1">Total: <span className="text-white">₦{trackingData.total?.toLocaleString()}</span></p>
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${trackingData.status === "Delivered" ? "bg-green-500 text-black" : "bg-blue-500 text-white"
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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 relative z-10 transition-colors ${step.done ? "bg-white border-black text-black" : "bg-black border-zinc-800 text-gray-500"
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
