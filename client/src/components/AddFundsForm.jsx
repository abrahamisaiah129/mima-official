import React, { useState, useMemo, useCallback } from "react";
import { CreditCard, Lock } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { useUser } from "../context/UserContext";
import { PaystackButton } from "react-paystack";

const AddFundsForm = ({ onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { notify } = useNotification();
  const { user, verifyPayment } = useUser();

  // 1. Stable reference for the transaction
  const [transactionRef] = useState(`TOPUP-${Date.now()}-${Math.floor(Math.random() * 1000000)}`);

  // 2. Configuration for PaystackButton
  const componentProps = useMemo(() => ({
    reference: transactionRef,
    email: user?.email || "user@example.com",
    amount: (Number(amount) || 0) * 100, // kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
    text: isProcessing ? "Processing..." : "Pay Securely",
    onSuccess: (response) => {
      console.log("Paystack Success Captured by Button Component", response);
      handleSuccess(response);
    },
    onClose: () => {
      notify("info", "Cancelled", "Transaction stopped.");
    },
  }), [transactionRef, user?.email, amount, isProcessing]);

  // 3. Success Handler
  const handleSuccess = async (response) => {
    setIsProcessing(true);
    notify("info", "Payment Confirmed", "Updating your wallet balance...");

    try {
      const numAmount = Number(amount);
      console.log("Verifying with Backend:", { amount: numAmount, reference: response.reference });

      const res = await verifyPayment(numAmount, response.reference);

      if (res.success) {
        notify("success", "Success", `₦${numAmount.toLocaleString()} added to your wallet.`);
        setAmount("");
        if (onSuccess) onSuccess();
      } else {
        notify("error", "Sync Error", res.message);
      }
    } catch (error) {
      console.error("Critical Verification Error", error);
      notify("error", "System Error", "Connection lost during verification.");
    } finally {
      setIsProcessing(false);
    }
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
          Payments are instant and secured via Paystack.
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
              placeholder="e.g. 5000"
              className="w-full px-4 py-4 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition font-bold text-lg text-center"
            />
          </div>
        </div>

        {/* Using the Official PaystackButton for better event handling */}
        <PaystackButton
          {...componentProps}
          disabled={isProcessing || !amount}
          className={`w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center space-x-2 transition shadow-lg shadow-white/10 active:scale-[0.98] disabled:opacity-50`}
        />

        <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4 bg-white/5 py-2 rounded-lg">
          <Lock size={12} />
          <span>Secured Encryption (PCI-DSS)</span>
        </div>
      </div>
    </div>
  );
};

export default AddFundsForm;
