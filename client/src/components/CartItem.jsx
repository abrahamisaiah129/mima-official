import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = ({ item, removeFromCart, updateQuantity }) => {
  return (
    <div className="flex flex-row items-start bg-transparent sm:bg-white p-0 sm:p-4 rounded-none sm:rounded-2xl border-b border-gray-100 sm:border sm:border-gray-100 sm:shadow-sm relative gap-4 transition-all">
      {/* Product Image - Clickable */}
      <Link to={`/product/${item.id}`} className="block flex-shrink-0">
        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
          <img
            src={item.imageSrc}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Content Container */}
      <div className="flex flex-col flex-1 h-full min-h-[6rem] justify-between">

        {/* Top: Title & Price */}
        <div className="flex justify-between items-start w-full mb-1">
          <div className="pr-2">
            <h3 className="text-sm sm:text-lg font-bold text-white sm:text-slate-900 line-clamp-2 leading-tight">
              {item.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm text-gray-500 font-medium">
              <span className="bg-gray-100 px-2 py-0.5 rounded text-slate-700">Size: {item.selectedSize}</span>
              {item.selectedColor && (
                <div className="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded">
                  <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: item.selectedColor }} />
                  <span className="capitalize">{item.selectedColor}</span>
                </div>
              )}
            </div>
            <p className="text-red-600 font-bold text-sm sm:text-base mt-1">
              ₦{((Number(item.price) || 0) * (Number(item.quantity) || 0)).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Bottom: Actions (Under Content) */}
        <div className="flex flex-row items-center gap-4 mt-2">

          {/* Quantity Controls */}
          <div className="flex items-center bg-gray-50 rounded-lg p-1 gap-1 border border-gray-200">
            <button
              onClick={() =>
                updateQuantity(item.id, Math.max(1, item.quantity - 1), item.selectedSize, item.selectedColor)
              }
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center text-slate-900 hover:bg-white hover:shadow-sm rounded-md transition font-bold disabled:opacity-30"
            >
              <Minus size={16} strokeWidth={2.5} />
            </button>
            <span className="w-8 text-center font-bold text-slate-900 text-sm">
              {item.quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(item.id, item.quantity + 1, item.selectedSize, item.selectedColor)
              }
              className="w-8 h-8 flex items-center justify-center text-slate-900 hover:bg-white hover:shadow-sm rounded-md transition font-bold"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Delete Button */}
          <button
            onClick={() =>
              removeFromCart(item.id || item._id, item.selectedSize, item.selectedColor)
            }
            className="group flex items-center gap-1 text-gray-400 hover:text-red-600 transition px-2 py-1 rounded-md hover:bg-red-50 text-sm font-medium"
          >
            <span className="hidden sm:inline group-hover:block">Remove</span>
            <Trash2 size={18} strokeWidth={2.5} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CartItem;
