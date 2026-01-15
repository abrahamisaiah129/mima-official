import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send, Smile } from "lucide-react";

const WhatsAppButton = () => {
  // --- CONFIGURATION ---
  const PHONE_NUMBER = "2348000000000"; // Your WhatsApp number (No +)
  const BRAND_NAME = "MIMA Footwear";
  const AVATAR_URL =
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=100&auto=format&fit=crop"; // Your logo
  const WELCOME_MESSAGE =
    "Hi, welcome to MIMA! How can we help you slay on a budget today? 🙂";
  // ---------------------

  const [isOpen, setIsOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsTyping(true);
      setShowWelcome(false);
      const timer = setTimeout(() => {
        setIsTyping(false);
        setShowWelcome(true);
      }, 1500); // 1.5s typing delay
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      setShowWelcome(false);
    }
  }, [isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    // Open WhatsApp with the user's message
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
      userMessage
    )}`;
    window.open(url, "_blank");
    setUserMessage(""); // Clear input
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* --- THE CHAT BOX (Only shows when open) --- */}
      {isOpen && (
        <div className="mb-4 w-[350px] bg-[#E5DDD5] rounded-[20px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 border border-gray-100">
          {/* Header */}
          <div className="bg-red-700 p-4 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={AVATAR_URL}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-red-700 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">
                  {BRAND_NAME}
                </h3>
                <p className="text-[10px] text-white/80">
                  Typically replies within 10 minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Body (Background Pattern) */}
          <div className="h-64 p-4 overflow-y-auto bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-90">
            {/* Admin Message Bubble */}
            <div className="bg-white p-3 rounded-r-lg rounded-bl-lg shadow-sm max-w-[85%] relative text-sm text-slate-800 leading-relaxed min-h-[50px]">
              <span className="absolute top-0 left-0 -ml-2 text-white">
                <svg
                  viewBox="0 0 8 13"
                  width="8"
                  height="13"
                  className="fill-current"
                >
                  <path
                    opacity=".13"
                    d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
                  ></path>
                  <path
                    fill="currentColor"
                    d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
                  ></path>
                </svg>
              </span>
              <p className="font-bold text-[10px] text-orange-400 mb-1">
                {BRAND_NAME}
              </p>
              
              {isTyping ? (
                <div className="flex space-x-1 items-center h-5 px-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  {WELCOME_MESSAGE}
                  <div className="text-[9px] text-gray-400 text-right mt-1">
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer (Input) */}
          <form
            onSubmit={handleSendMessage}
            className="bg-[#F0F2F5] p-3 flex items-center space-x-2"
          >
            <button type="button" className="text-gray-400 hover:text-gray-600">
              <Smile size={24} />
            </button>
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type a message.."
              className="flex-grow bg-white text-sm text-slate-900 rounded-full px-4 py-2 border-none focus:ring-0 focus:outline-none placeholder-gray-400"
            />
            <button
              type="submit"
              className={`p-2 rounded-full transition-all ${
                userMessage.trim() ? "text-red-600" : "text-gray-400"
              }`}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}

      {/* --- FLOATING TOGGLE BUTTON --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center group relative"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="white" />}

        {/* Tooltip */}
        {!isOpen && (
          <span className="absolute right-full mr-3 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Chat with us
          </span>
        )}
      </button>
    </div>
  );
};

export default WhatsAppButton;
