import React, { useState } from "react";
import { Wallet, CreditCard, Lock, X } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useShop } from "../context/ShopContext";
import { usePaystackPayment } from "react-paystack";

const PaymentModal = ({ isOpen, onClose, total }) => {
    if (!isOpen) return null;

    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [isProcessing, setIsProcessing] = useState(false);

    const { user } = useUser();
    const { processCheckout } = useShop();
    const { notify } = useNotification();
    const navigate = useNavigate();

    const config = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || "guest@example.com",
        amount: total * 100, // Amount in kobo
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = async (reference) => {
        console.log("Paystack success:", reference);
        try {
            await processCheckout({
                paymentMethod: 'paystack',
                reference: reference.reference
            });
            notify("success", "Payment Successful", `Ref: ${reference.reference}`);
            onClose();
            navigate("/");
        } catch (err) {
            // processCheckout already shows error notification
            setIsProcessing(false);
        }
    };

    const onClosePaystack = () => {
        console.log('Paystack dialog closed');
        setIsProcessing(false);
    };

    const handlePay = async () => {
        if (paymentMethod === "wallet") {
            // Wallet payment — let the backend handle balance check & deduction
            if (user.balance < total) {
                notify("error", "Insufficient Balance", "Please top up your wallet or use Paystack.");
                return;
            }

            setIsProcessing(true);
            try {
                await processCheckout({
                    paymentMethod: 'wallet',
                    reference: `WALLET-${Date.now()}`
                });
                notify("success", "Payment Successful", `Receipt sent to ${user.email}`);
                onClose();
                navigate("/");
            } catch (err) {
                // processCheckout already shows error notification
                setIsProcessing(false);
            }
        } else {
            // PAYSTACK FLOW
            setIsProcessing(true);
            initializePayment(onSuccess, onClosePaystack);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
                {/* Header */}
                <div className="bg-zinc-900 p-6 flex justify-between items-center">
                    <h3 className="text-white text-lg font-black uppercase tracking-wide">
                        Secure Checkout
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
                        Total to Pay: <span className="text-slate-900 text-lg">₦{total.toLocaleString()}</span>
                    </p>

                    {/* Wallet Option */}
                    <div
                        onClick={() => setPaymentMethod("wallet")}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "wallet"
                            ? "border-black bg-gray-50"
                            : "border-gray-100 hover:border-gray-200"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="wallet"
                                    checked={paymentMethod === "wallet"}
                                    onChange={() => setPaymentMethod("wallet")}
                                    className="text-black focus:ring-black"
                                />
                                <span className="ml-3 font-bold text-slate-900 flex items-center gap-2">
                                    <Wallet size={18} /> MIMA Wallet
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="block text-xs text-gray-500">Available</span>
                                <span className={`font-bold ${user?.balance >= total ? 'text-green-600' : 'text-red-500'}`}>
                                    ₦{user?.balance?.toLocaleString() || 0}
                                </span>
                            </div>
                        </div>
                        {paymentMethod === "wallet" && user?.balance < total && (
                            <p className="text-red-500 text-xs font-bold mt-2 ml-8">
                                Insufficient balance. Please top up or use Paystack.
                            </p>
                        )}
                    </div>

                    {/* Card Option */}
                    <label
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "card"
                            ? "border-black bg-gray-50"
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
                                className="text-black focus:ring-black"
                            />
                            <span className="ml-3 font-bold text-slate-900 flex items-center gap-2">
                                <CreditCard size={18} /> Pay with Paystack
                            </span>
                        </div>
                    </label>

                    {/* Action Button */}
                    <button
                        onClick={handlePay}
                        disabled={isProcessing || (paymentMethod === "wallet" && user?.balance < total)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
                        <Lock size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
