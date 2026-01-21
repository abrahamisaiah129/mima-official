import React, { useState } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSummary = ({ subtotal }) => {
  const shipping = 2500;
  const total = subtotal + shipping;
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setIsProcessing(true);

    // Simulate Backend Processing & Email Sending
    setTimeout(() => {
      setIsProcessing(false);
      // In a real app, this would trigger a backend endpoint that uses SendGrid/Nodemailer
      alert(
        `Order Placed Successfully! 📧 Confirmaton email sent to your registered email.`,
      );
      window.location.href = "/"; // Reset/Redirect
    }, 2000);
  };

  return (
    <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 shadow-xl sticky top-28">
      <h3 className="text-lg font-black text-white mb-6 uppercase tracking-wider">
        Order Summary
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Shipping</span>
          <span>₦{shipping.toLocaleString()}</span>
        </div>
        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <span className="font-bold text-white">Total</span>
          <span className="font-black text-xl text-white">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-white/10 transition-all mb-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? <Loader2 className="animate-spin" /> : "Checkout Now"}
      </button>

      <div className="flex items-center justify-center text-xs text-gray-500 space-x-2">
        <ShieldCheck size={14} />
        <span>Secure checkout with MIMA Wallet</span>
      </div>
    </div>
  );
};

export default OrderSummary;
