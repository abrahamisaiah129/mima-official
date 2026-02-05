import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = ({ item, removeFromCart, updateQuantity }) => {
  return (
    <div className="flex flex-row sm:flex-row items-center bg-transparent sm:bg-white p-0 sm:p-4 rounded-none sm:rounded-2xl border-b border-gray-100 sm:border sm:border-gray-100 sm:shadow-sm relative gap-4 sm:gap-0">
      {/* Product Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 mb-0 sm:mb-0">
        <img
          src={item.imageSrc}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-grow sm:ml-6 text-left">
        <h3 className="text-sm sm:text-lg font-bold text-slate-900 truncate pr-6 sm:pr-0">{item.title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-start gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-200" style={{ backgroundColor: item.selectedColor }} title={item.selectedColor} />
            <span>Count: {item.quantity}</span>
          </div>
          <span className="hidden sm:inline">/</span>
          <span>Size {item.selectedSize}</span>
        </div>
        <p className="text-red-600 font-bold text-sm sm:text-base">
          ₦{(item.price * item.quantity).toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mt-0 sm:mt-0">
        {/* Quantity Controls - Mobile optimized (smaller) or hidden? Keeping it but compact */}
        <div className="flex items-center bg-gray-50 rounded-lg p-1 sm:p-1 gap-3">
          <button
            onClick={() =>
              updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)
            }
            className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-slate-900 active:bg-gray-200 rounded-md transition"
          >
            <Minus size={16} className="sm:w-[14px] sm:h-[14px]" />
          </button>
          <span className="w-8 sm:w-8 text-center font-bold text-sm sm:text-sm">
            {item.quantity}
          </span>
          <button
            onClick={() =>
              updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)
            }
            className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center text-gray-400 hover:text-slate-900 active:bg-gray-200 rounded-md transition"
          >
            <Plus size={16} className="sm:w-[14px] sm:h-[14px]" />
          </button>
        </div>

        {/* Delete */}
        <button
          onClick={() =>
            removeFromCart(item.id, item.selectedSize, item.selectedColor)
          }
          className="text-gray-300 hover:text-red-600 transition absolute top-2 right-2 p-2 sm:p-0 sm:static sm:block"
        >
          <Trash2 size={20} className="sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
