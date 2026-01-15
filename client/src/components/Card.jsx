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
    <div className="bg-white rounded-4xl shadow-xl overflow-hidden max-w-sm w-full transition-transform hover:-translate-y-2 duration-300 border border-gray-100 relative group">
      {/* Top Decorative Arc (Matches the card style) */}
      <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />

      <div className="p-6 pb-8 flex flex-col space-y-6">
        {/* 1. Header Text */}
        <Link
          to={`/product/${id}`}
          className="text-center space-y-2 mt-2 block hover:opacity-80 transition"
        >
          <h3 className="text-xl font-black text-red-600 uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed px-2 line-clamp-2">
            {description}
          </p>
        </Link>

        {/* 2. Product Image */}
        <Link
          to={`/product/${id}`}
          className="relative h-48 w-full overflow-hidden rounded-2xl bg-gray-50 group-hover:shadow-inner transition-shadow block"
        >
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover object-center mix-blend-multiply"
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-xl flex items-center space-x-0.5 shadow-sm border border-gray-100">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-200 fill-gray-200"
                }
              />
            ))}
          </div>
        </Link>

        {/* 3. Price */}
        <div className="flex items-center px-1">
          <span className="text-3xl font-black text-slate-900">
            ₦{(price * quantity).toLocaleString()}
          </span>
        </div>

        {/* 4. Size & Quantity Row */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          {/* Size Selector */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Size
            </span>
            <div className="flex items-center space-x-1">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded transition-all
                    ${
                      selectedSize === size
                        ? "bg-slate-900 text-white shadow-md"
                        : "text-gray-400 hover:text-slate-700 hover:bg-gray-100"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Counter */}
          <div className="space-y-2 flex flex-col items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Qty
            </span>
            <div className="flex items-center bg-gray-50 rounded-lg p-1">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 disabled:opacity-50 transition"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="w-6 text-center text-sm font-bold text-slate-900">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-600 transition"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>

        {/* 5. Color Selector */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Colors
          </span>
          <div className="flex items-center space-x-3">
            {colors.map((color) => (
              <button
                key={color.hex}
                onClick={() => setSelectedColor(color.hex)}
                style={{ backgroundColor: color.hex }}
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform shadow-sm
                  ${
                    selectedColor === color.hex
                      ? "ring-2 ring-offset-2 ring-gray-300 scale-110"
                      : "hover:scale-110"
                  }`}
                title={color.name}
              >
                {selectedColor === color.hex && (
                  <Check
                    size={12}
                    className="text-white drop-shadow-md"
                    strokeWidth={4}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 6. Action Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-4 rounded-xl uppercase tracking-widest shadow-lg shadow-red-200 hover:shadow-red-300 transition-all active:scale-95 mt-2"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;
