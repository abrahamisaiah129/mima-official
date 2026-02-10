import React, { useState } from "react";
import { CreditCard, Lock } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { useUser } from "../context/UserContext";
import { usePaystackPayment } from "react-paystack";

/**
 * Add Funds Component
 * -------------------
 * This is where you integrate Paystack/Flutterwave.
 * 
 * TO CONFIGURE PAYMENT:
 * 1. Get your Public Key from Paystack Dashboard.
 * 2. Install paystack lib: `npm install react-paystack`
 * 3. Use the hook: `usePaystackPayment(config)`
 * 4. On the `onSuccess` callback, call your backend API to credit the user's wallet.
 */

const AddFundsForm = () => {
  const [amount, setAmount] = useState("");
  const { notify } = useNotification();
  const { user, addFunds } = useUser();

  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || "user@example.com",
    amount: amount * 100, // Paystack uses kobo (100 kobo = 1 Naira)
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference) => {
    notify("info", "Payment Verified", "Adding funds to your wallet...");
    const numAmount = parseInt(amount);
    const res = await addFunds(numAmount);

    if (res.success) {
      notify("success", "Top Up Successful", `₦${numAmount.toLocaleString()} added to wallet.`);
      setAmount("");
    } else {
      notify("error", "Transaction Failed", res.message);
    }
  };

  const onClose = () => {
    notify("info", "Transaction Cancelled", "You cancelled the payment.");
  }

  const handlePayment = () => {
    if (!amount) return;
    initializePayment(onSuccess, onClose);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white mx-auto mb-4 border border-white/20">
          <CreditCard size={24} />
        </div>
        <h3 className="text-xl font-black text-white uppercase tracking-tight">
          Fund Your Wallet
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          Enter an amount to top up securely.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Amount (₦)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full px-4 py-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition font-bold text-lg text-center"
            />
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition shadow-lg shadow-white/10 active:scale-[0.98]"
        >
          <Lock size={16} />
          <span>Pay Securely</span>
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4 bg-white/5 py-2 rounded-lg">
          <Lock size={12} />
          <span>Secured by Paystack / Flutterwave</span>
        </div>
      </div>
    </div>
  );
};

export default AddFundsForm;
