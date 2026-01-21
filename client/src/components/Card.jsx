import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Minus, Plus, Check } from "lucide-react";

const Card = ({
  id,
  title = "Women Blouse",
  description = "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  imageSrc = "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
  price = 125000,
  rating = 5,
  sizes = ["XS", "S", "M", "L", "XL"],
  colors = [
    { name: "Red", hex: "#DC2626" },
    { name: "Yellow", hex: "#FBBF24" },
    { name: "Black", hex: "#111827" },
  ],
  addToCart,
}) => {
  // State for interactive elements
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.hex);

  // Handlers
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({
        id,
        title,
        price,
        imageSrc,
        quantity,
        selectedSize,
        selectedColor,
      });
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden w-full max-w-[280px] transition-transform hover:-translate-y-1 duration-300 border border-white/10 relative group mx-auto">
      {/* Top Decorative Arc (Matches the card style) */}

      <Link
        to={`/product/${id}`}
        className="relative block w-full aspect-[4/5] overflow-hidden bg-zinc-800"
      >
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
        />
        {/* Rating Badge - Absolute Top Right */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center space-x-1 border border-white/10">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-bold text-white">{rating}.0</span>
        </div>
      </Link>

      {/* Content Container - Compact & Clean */}
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <Link
          to={`/product/${id}`}
          className="block text-center hover:opacity-80 transition"
        >
          <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1 truncate">
            {title}
          </h3>
          <p className="text-[10px] text-gray-500 font-medium leading-tight line-clamp-1 px-4">
            {description}
          </p>
        </Link>

        {/* Price - Centered & Elegant */}
        <div className="flex justify-center items-baseline space-x-1 border-b border-white/5 pb-4">
          <span className="text-xs text-gray-400 font-medium">NGN</span>
          <span className="text-xl font-black text-white tracking-tight">
            {(price * quantity).toLocaleString()}
          </span>
        </div>

        {/* 4. Size & Quantity Row */}
        {/* Size & Qty - Grid Layout */}
        <div className="grid grid-cols-2 gap-4">
          {/* Size Dropdown-like */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block text-center">
              Size
            </span>
            <div className="flex flex-wrap justify-center gap-1">
              {sizes.slice(0, 3).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-6 w-6 flex items-center justify-center text-[10px] font-bold rounded-full transition-all border ${
                    selectedSize === size
                      ? "bg-white text-black border-white"
                      : "text-gray-400 border-white/10 hover:border-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block text-center">
              Qty
            </span>
            <div className="flex items-center justify-center bg-white/5 rounded-full px-2 py-1 border border-white/10 w-fit mx-auto">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="p-1 hover:text-white text-gray-400 transition disabled:opacity-30"
              >
                <Minus size={10} />
              </button>
              <span className="text-[10px] font-bold text-white w-4 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="p-1 hover:text-white text-gray-400 transition"
              >
                <Plus size={10} />
              </button>
            </div>
          </div>
        </div>

        {/* 6. Action Button */}
        {/* Action Button - Sleek */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-white hover:bg-gray-200 text-black text-xs font-black py-3 rounded-full uppercase tracking-[0.15em] transition-all active:scale-95"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
};

export default Card;
