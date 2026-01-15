import React, { useState } from "react";
import { CreditCard } from "lucide-react";

const AddFundsForm = () => {
  const [amount, setAmount] = useState("");

  return (
    <div className="p-8">
      <h3 className="text-xl font-black text-slate-900 mb-2">
        Fund Your Wallet
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Enter an amount to top up using your secure payment method.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
            Amount (₦)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 10000"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition font-bold text-lg"
          />
        </div>

        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition shadow-lg mt-4">
          <CreditCard size={18} />
          <span>Pay Securely</span>
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          Secured by Paystack. Your card details are never stored on our
          servers.
        </p>
      </div>
    </div>
  );
};

export default AddFundsForm;
