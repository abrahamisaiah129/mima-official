import React, { useState } from "react";
import { Wallet, CreditCard, MapPin } from "lucide-react";

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const walletBalance = 50000;
  const orderTotal = 29500;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">
        Shipping & Payment
      </h2>

      {/* 1. Shipping Address */}
      <div className="mb-10">
        <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
          <MapPin size={18} className="mr-2 text-red-600" />
          Delivery Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="text"
            placeholder="Address Line"
            className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="text"
            placeholder="City"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="text"
            placeholder="State"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
        </div>
      </div>

      {/* 2. Payment Method */}
      <div className="mb-10">
        <h3 className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
          <CreditCard size={18} className="mr-2 text-red-600" />
          Payment Method
        </h3>

        <div className="space-y-3">
          {/* Wallet Option */}
          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === "wallet"
                ? "border-red-600 bg-red-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="wallet"
                checked={paymentMethod === "wallet"}
                onChange={() => setPaymentMethod("wallet")}
                className="text-red-600 focus:ring-red-500"
              />
              <span className="ml-3 font-bold text-slate-900">MIMA Wallet</span>
            </div>
            <div className="text-right">
              <span className="block text-xs text-gray-500">Balance</span>
              <span className="font-bold text-slate-900">
                ₦{walletBalance.toLocaleString()}
              </span>
            </div>
          </label>

          {/* Card Option (Disabled visual) */}
          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === "card"
                ? "border-red-600 bg-red-50"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
                className="text-red-600 focus:ring-red-500"
              />
              <span className="ml-3 font-bold text-slate-900">
                Debit / Credit Card
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-gray-200 rounded"></div>
              <div className="w-8 h-5 bg-gray-200 rounded"></div>
            </div>
          </label>
        </div>
      </div>

      {/* Pay Button */}
      <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all">
        Pay ₦{orderTotal.toLocaleString()}
      </button>

      {/* Wallet Balance Warning */}
      {paymentMethod === "wallet" && walletBalance < orderTotal && (
        <p className="text-center text-red-600 text-xs font-bold mt-4">
          Insufficient Wallet Balance. Please top up first.
        </p>
      )}
    </div>
  );
};

export default CheckoutForm;
