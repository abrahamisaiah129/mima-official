import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { Mail, ArrowRight, Check } from "lucide-react";
import api from "../api";

const Newsletter = () => {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success
  const [isVisible, setIsVisible] = useState(true);

  // Check if already subscribed
  React.useEffect(() => {
    if (user?.email) {
      api.get("/newsletters")
        .then((res) => {
          const data = res.data;
          if (Array.isArray(data) && data.includes(user.email)) {
            setIsVisible(false);
          }
        })
        .catch((err) => console.error("Failed to check subscription", err));
    }
  }, [user]);

  if (!isVisible) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      await api.post("/newsletter", { email });
      setStatus("success");
      setEmail("");
    } catch (error) {
      const errorMsg = error.response?.data?.error;
      if (errorMsg === "Already subscribed") {
        setStatus("success"); // Treat as success to the user for a better experience
      } else {
        console.error("Subscription error", error);
        alert(errorMsg || "Subscription failed");
        setStatus("idle");
      }
    }
  };

  return (
    <div className="py-24 border-t border-white/5">
      <div className="relative bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden p-8 md:p-16 text-center">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-white/10">
            <Mail size={32} className="text-black" />
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            Don't Miss the Drop
          </h2>
          <p className="text-gray-400 font-medium leading-relaxed mb-10">
            Join the MIMA community. Get exclusive access to new collections,
            flash sales, and wallet top-up bonuses.
          </p>

          {status === "success" ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 animate-fade-in flex flex-col items-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black mb-3">
                <Check size={20} strokeWidth={3} />
              </div>
              <h3 className="text-white font-bold text-lg">
                You're on the list!
              </h3>
              <p className="text-green-400 text-sm">
                Keep an eye on your inbox for exclusive drops.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-black border border-white/20 rounded-xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-medium"
                required
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Joining..." : "Subscribe"}
                {!status === "loading" && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          <p className="text-xs text-gray-600 mt-6">
            By subscribing, you agree to our Terms & Privacy Policy. No spam,
            just fashion.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
