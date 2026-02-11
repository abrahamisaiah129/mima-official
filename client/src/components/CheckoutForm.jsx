import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Wallet, CreditCard, MapPin, Lock } from "lucide-react"; // Added Lock
import { useUser } from "../context/UserContext";
import { useShop } from "../context/ShopContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { PaystackButton } from "react-paystack"; // Import Paystack Button component

const CheckoutForm = () => {
  const { user, loading } = useUser();
  const { cartItems, processCheckout } = useShop();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      notify("error", "Access Denied", "Please login to checkout.");
      navigate("/login");
    }
  }, [loading, user, navigate, notify]);

  // Initialize form data with user details if available
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    phone: ""
  });

  useEffect(() => {
    if (user) {
      setShippingInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        city: "",
        state: "",
        phone: user.phone || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const walletBalance = user?.balance || 0;

  // Calculate Totals
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
  const shipping = Number(import.meta.env.VITE_SHIPPING_FEE) || 2500;
  const orderTotal = subtotal + shipping;

  // 1. Stable Transaction Reference
  const [transactionRef] = useState(`ORD-${Date.now()}-${Math.floor(Math.random() * 1000000)}`);

  // 2. Memoize Paystack Configuration
  const config = useMemo(() => ({
    reference: transactionRef,
    email: user?.email || "guest@example.com",
    amount: Math.round(orderTotal * 100), // Ensure integer for kobo
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
  }), [transactionRef, user?.email, orderTotal]);

  const initializePayment = usePaystackPayment(config);

  // 3. Memoize the Success Callback
  const onPaystackSuccess = useCallback(async (response) => {
    console.log("Paystack Order Success:", response);
    notify("info", "Processing", "Verifying your order with our server...");

    const isSuccess = response.status === "success" ||
      response.message === "Success" ||
      response.response === "Approved" ||
      response.status === "successful";

    const isPending = response.status === "pending" ||
      response.status === "processing";

    if (isSuccess) {
      setIsProcessing(true);
      try {
        await processCheckout({
          paymentMethod: 'paystack',
          reference: response.reference,
          shippingDetails: shippingInfo
        });
        navigate("/");
      } catch (err) {
        console.error("Order processing failed", err);
        setIsProcessing(false);
      }
    } else if (isPending) {
      notify("info", "Payment Pending", "Your payment is being processed. We will notify you once confirmed.");
      navigate("/");
    } else {
      notify("error", "Payment Failed", response.message || "Unable to complete payment.");
      setIsProcessing(false);
    }
  }, [processCheckout, shippingInfo, navigate, notify]);

  const onPaystackClose = useCallback(() => {
    setIsProcessing(false);
    notify("info", "Cancelled", "Payment session closed.");
  }, [notify]);

  const handlePay = async () => {
    if (cartItems.length === 0) {
      notify("error", "Cart is Empty", "Add items to cart before checkout");
      return;
    }

    // Validate Shipping Info
    if (!shippingInfo.address || !shippingInfo.phone || !shippingInfo.firstName || !shippingInfo.lastName) {
      notify("error", "Missing Details", "Please fill in all shipping details.");
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === "wallet") {
      if (walletBalance < orderTotal) {
        notify("error", "Insufficient Balance", "Please top up your wallet.");
        setIsProcessing(false);
        return;
      }

      try {
        await processCheckout({
          paymentMethod: 'wallet',
          reference: `WALLET-${Date.now()}`,
          shippingDetails: shippingInfo
        });

        notify("success", "Payment Successful", "Order placed successfully!");
        navigate("/");
      } catch (err) {
        setIsProcessing(false);
        // processCheckout handles errors
      }
    } else {
      // Trigger Paystack
      initializePayment(onPaystackSuccess, onPaystackClose);
    }
  };

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
            name="firstName"
            value={shippingInfo.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="text"
            name="lastName"
            value={shippingInfo.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="text"
            name="address"
            value={shippingInfo.address}
            onChange={handleChange}
            placeholder="Address Line"
            className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="text"
            name="city"
            value={shippingInfo.city}
            onChange={handleChange}
            placeholder="City"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="text"
            name="state"
            value={shippingInfo.state}
            onChange={handleChange}
            placeholder="State"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-slate-900"
          />
          <input
            type="tel"
            name="phone"
            value={shippingInfo.phone}
            onChange={handleChange}
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
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "wallet"
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

          {/* Paystack Option */}
          <label
            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "paystack"
              ? "border-red-600 bg-red-50"
              : "border-gray-100 hover:border-gray-200"
              }`}
          >
            <div className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="paystack"
                checked={paymentMethod === "paystack"}
                onChange={() => setPaymentMethod("paystack")}
                className="text-red-600 focus:ring-red-500"
              />
              <span className="ml-3 font-bold text-slate-900">
                Debit / Credit Card (via Paystack)
              </span>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-gray-200 rounded"></div>
              <div className="w-8 h-5 bg-gray-200 rounded"></div>
            </div>
          </label>
        </div>
      </div>

      {/* Pay Button / Paystack Action */}
      {paymentMethod === 'paystack' ? (
        <PaystackButton
          {...config}
          onSuccess={onPaystackSuccess}
          onClose={onPaystackClose}
          disabled={isProcessing || cartItems.length === 0}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          text={isProcessing ? "Processing..." : `Pay ₦${orderTotal.toLocaleString()}`}
        />
      ) : (
        <button
          onClick={handlePay}
          disabled={isProcessing || (paymentMethod === "wallet" && walletBalance < orderTotal) || cartItems.length === 0}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
          {isProcessing ? "Processing..." : `Pay ₦${orderTotal.toLocaleString()}`}
          {!isProcessing && <Lock size={16} />}
        </button>
      )}

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
