import React from "react";
import { ShieldCheck } from "lucide-react";

const OrderSummary = ({ subtotal }) => {
  const shipping = 2500;
  const total = subtotal + shipping;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
      <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-wide">
        Order Summary
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Subtotal</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Shipping</span>
          <span>₦{shipping.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
          <span className="font-bold text-slate-900">Total</span>
          <span className="font-black text-xl text-slate-900">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg transition-all mb-4">
        Checkout Now
      </button>

      <div className="flex items-center justify-center text-xs text-gray-400 space-x-2">
        <ShieldCheck size={14} />
        <span>Secure checkout with MIMA Wallet</span>
      </div>
    </div>
  );
};

export default OrderSummary;
