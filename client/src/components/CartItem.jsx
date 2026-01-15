import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = ({ item, removeFromCart, updateQuantity }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
        <img
          src={item.imageSrc}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-grow sm:ml-6 text-center sm:text-left">
        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {item.selectedColor} / Size {item.selectedSize}
        </p>
        <p className="text-red-600 font-bold">
          ₦{(item.price * item.quantity).toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-6 mt-4 sm:mt-0">
        {/* Quantity Controls */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1">
          <button
            onClick={() =>
              updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)
            }
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-slate-900"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-bold text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)
            }
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-slate-900"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Delete */}
        <button
          onClick={() =>
            removeFromCart(item.id, item.selectedSize, item.selectedColor)
          }
          className="text-gray-300 hover:text-red-600 transition"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
