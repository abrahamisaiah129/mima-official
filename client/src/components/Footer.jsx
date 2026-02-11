import React, { useState, useEffect } from "react";
import { Instagram, Twitter, Facebook, Mail, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { useUser } from "../context/UserContext";
import api from "../api";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { notify } = useNotification();
  const { user } = useUser();
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Check if logged-in user is already subscribed
  useEffect(() => {
    if (user?.email) {
      api.get("/newsletters")
        .then((res) => {
          const data = res.data;
          if (Array.isArray(data) && data.includes(user.email)) {
            setIsSubscribed(true);
          }
        })
        .catch((err) => console.error("Failed to check subscription", err));
    }
  }, [user]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await api.post("/newsletter", { email });
        notify("success", "Subscribed!", "You've successfully joined the MIMA community.");
        setEmail("");
        setIsSubscribed(true);
      } catch (error) {
        const errorMsg = error.response?.data?.error;
        if (errorMsg === "Already subscribed") {
          notify("info", "Already Subscribed", "You are already on the list!");
          setEmail("");
          setIsSubscribed(true);
        } else {
          notify("error", "Subscription Failed", errorMsg || "Please try again.");
        }
      }
    }
  };
  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <img
              src="/MIMA_New.png"
              alt="MIMA Logo"
              className="h-12 w-12 object-contain mb-6"
            />
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Premium footwear designed for comfort, style, and confidence. Slay
              on a budget without compromising on quality.
            </p>

            {/* Newsletter Form / Subscribed State */}
            {isSubscribed ? (
              <div className="mb-6">
                <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Don't Miss the Drop</h5>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} strokeWidth={3} className="text-black" />
                  </div>
                  <span className="text-green-400 text-xs font-medium">You're subscribed!</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mb-6">
                <h5 className="text-white text-xs font-bold uppercase tracking-widest mb-2">Don't Miss the Drop</h5>
                <p className="text-gray-500 text-xs mb-3">Join the community for exclusive access.</p>
                <div className="flex bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 focus-within:border-white transition-colors">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent text-white text-sm px-4 py-2 w-full focus:outline-none placeholder-gray-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="bg-white text-black px-4 py-2 hover:bg-gray-200 transition">
                    <Mail size={16} />
                  </button>
                </div>
              </form>
            )}

            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              Shop
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Heels"
                  className="hover:text-white transition"
                >
                  Heels
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Sneakers"
                  className="hover:text-white transition"
                >
                  Sneakers
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Flats"
                  className="hover:text-white transition"
                >
                  Flats
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li>
                <a href="#" className="hover:text-white transition">
                  My Wallet
                </a>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-white transition">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Returns Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li>Lagos, Nigeria</li>
              <li>hello@mima.store</li>
              <li>+234 800 123 4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} MIMA Footwear. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-white font-medium"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-white font-medium"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
