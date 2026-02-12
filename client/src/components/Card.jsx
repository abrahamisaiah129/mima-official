import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Minus, Plus, Check } from "lucide-react";

const DEFAULT_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

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
  cartItems = [],
  removeFromCart,
  preSelectedSize,
  isWishlisted,
  toggleWishlist,
}) => {
  // Determine if we should show all sizes or specific sizes
  const sizesToDisplay = sizes.includes("ALL") ? DEFAULT_SIZES : sizes;

  // Initial size logic: 
  // 1. If preSelectedSize is passed AND it is valid for this product, use it.
  // 2. Otherwise default to the first available size.
  const initialSize = (preSelectedSize && sizesToDisplay.includes(preSelectedSize))
    ? preSelectedSize
    : sizesToDisplay[0];

  // State for interactive elements
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedColor, setSelectedColor] = useState(colors[0]?.hex);

  // Update selected size if preSelectedSize changes (e.g. user changes filter while viewing)
  React.useEffect(() => {
    if (preSelectedSize && sizesToDisplay.includes(preSelectedSize)) {
      setSelectedSize(preSelectedSize);
    }
  }, [preSelectedSize, sizesToDisplay]);

  // Check if item is in cart
  const isInCart = cartItems.some(item =>
    item.id == id &&
    item.selectedSize === selectedSize &&
    item.selectedColor === selectedColor
  );

  // Handlers
  const handleDecrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAction = () => {
    if (isInCart) {
      if (removeFromCart) {
        removeFromCart(id, selectedSize, selectedColor);
      }
    } else {
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
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (toggleWishlist) {
      toggleWishlist();
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden w-full max-w-none sm:max-w-[190px] transition-transform hover:-translate-y-1 duration-300 border border-white/10 relative group mx-auto">
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
        <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
          <div className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center space-x-1 border border-white/10">
            <Star size={8} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[9px] font-bold text-white">{rating}.0</span>
          </div>

          <button
            onClick={handleWishlistClick}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${isWishlisted ? 'bg-red-600 border-red-600 text-white' : 'bg-black/40 border-white/10 text-white hover:bg-white hover:text-black'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>
      </Link>

      {/* Content Container - Compact & Clean */}
      <div className="p-3 flex flex-col gap-3">
        {/* Header */}
        <Link
          to={`/product/${id}`}
          className="block text-center hover:opacity-80 transition"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-0.5 truncate">
            {title}
          </h3>
          <p className="text-[10px] text-gray-500 font-medium leading-tight line-clamp-1">
            {description}
          </p>
        </Link>

        {/* Price - Centered & Elegant */}
        <div className="flex justify-center items-baseline space-x-0.5 border-b border-white/5 pb-2">
          <span className="text-[10px] text-gray-400 font-medium">NGN</span>
          <span className="text-base font-black text-white tracking-tight">
            {(price * quantity).toLocaleString()}
          </span>
        </div>

        {/* 4. Size & Quantity Row */}
        {/* Quantity Controls - Centered and Spaced */}
        <div className="flex justify-center py-1">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block text-center">
              Qty
            </span>
            <div className="flex items-center justify-center bg-white/5 rounded-full px-2 py-1 border border-white/10 w-fit mx-auto gap-2">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="p-1 hover:text-white text-gray-400 transition disabled:opacity-30 flex items-center justify-center"
              >
                <Minus size={14} />
              </button>
              <span className="text-[12px] font-bold text-white w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="p-1 hover:text-white text-gray-400 transition flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 6. Action Button */}
        {/* Action Button - Sleek */}
        <button
          onClick={handleAction}
          className={`w-full text-black text-[11px] font-black py-3 rounded-full uppercase tracking-[0.15em] transition-all active:scale-95 ${isInCart
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-white hover:bg-gray-200"
            }`}
        >
          {isInCart ? "Remove" : "Add to Bag"}
        </button>
      </div>
    </div>
  );
};

export default Card;
