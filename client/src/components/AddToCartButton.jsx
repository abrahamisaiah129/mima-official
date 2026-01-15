import React, { useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";

const AddToCartButton = ({ onClick }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center transition-all shadow-lg shadow-red-200 active:scale-95"
    >
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <>
          <span className="mr-2">Add to Cart</span>
          <ShoppingBag size={18} />
        </>
      )}
    </button>
  );
};

export default AddToCartButton;
