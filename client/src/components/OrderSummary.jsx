import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import PaymentModal from "./PaymentModal";
import LoginModal from "./LoginModal";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const OrderSummary = ({ subtotal }) => {
  const shipping = 2500;
  const total = subtotal + shipping;
  const navigate = useNavigate();
  const { user } = useUser();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 shadow-xl h-fit">
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
        className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-white/10 transition-all mb-4 flex items-center justify-center gap-2"
      >
        {user ? "Checkout Now" : "Login to Checkout"}
      </button>

      <div className="flex items-center justify-center text-xs text-gray-500 space-x-2">
        <ShieldCheck size={14} />
        <span>Secure checkout with MIMA Wallet</span>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={total}
      />
      {isAuthModalOpen && (
        <LoginModal
          onClose={() => setIsAuthModalOpen(false)}
          onFundRequest={() => {
            // If they just registered/logged in via this flow, maybe duplicate logic?
            // But generally they might want to just pay. 
            // Currently AuthModal's "Fund Wallet" just closes and maybe we should open PaymentModal?
            // The prompt says "Would you like to fund".
            // If I pass a callback, I can open Wallet or PaymentModal.
            // For checkout flow, ideally we proceed to PaymentModal.
            setIsAuthModalOpen(false);
            setIsPaymentModalOpen(true);
          }}
        />
      )}
    </div>
  );
};

export default OrderSummary;
