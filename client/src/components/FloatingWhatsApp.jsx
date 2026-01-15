import React from "react";
import { MessageCircle } from "lucide-react";

const FloatingWhatsApp = () => {
  const phoneNumber = "2348000000000"; // Replace with your actual WhatsApp number
  const message = "Hello MIMA! I'm interested in your products.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all z-50 hover:scale-110 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={32} fill="white" className="text-white" />
    </a>
  );
};

export default FloatingWhatsApp;
