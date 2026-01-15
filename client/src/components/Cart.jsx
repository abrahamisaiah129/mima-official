import React from "react";
import CartItem from "./CartItem";
import OrderSummary from "./OrderSummary";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = ({ cartItems, removeFromCart, updateQuantity }) => {
  // Calculate Subtotal dynamically
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">
          Your Bag is Empty
        </h2>
        <p className="text-gray-500 mb-8">
          Looks like you haven't added any items yet.
        </p>
        <Link
          to="/shop"
          className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center space-x-2 mb-8">
        <Link
          to="/shop"
          className="text-gray-400 hover:text-slate-900 transition"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          Your Bag ({cartItems.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <CartItem
              key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
              item={item}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>

        {/* Order Summary & Checkout */}
        <div className="lg:col-span-1">
          <OrderSummary subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
};

export default Cart;
