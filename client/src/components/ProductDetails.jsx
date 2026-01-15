import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { products } from "../data/products";
import {
  Star,
  Minus,
  Plus,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
} from "lucide-react";

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.hex);

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-bold">
        Product not found
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, selectedSize, selectedColor });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* 1. Image Gallery Section */}
        <div className="space-y-4 animate-slide-up">
          <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden shadow-lg relative">
            <img
              src={product.imageSrc}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 flex flex-col space-y-3">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 shadow-md transition">
                <Heart size={20} />
              </button>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-slate-900 shadow-md transition">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Product Info Section */}
        <div className="flex flex-col justify-center animate-slide-up delay-100">
          <div className="mb-2 flex items-center space-x-2">
            <span className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              New Arrival
            </span>
            <div className="flex items-center text-yellow-400 text-sm">
              <Star size={16} fill="currentColor" />
              <span className="text-slate-900 font-bold ml-1">
                {product.rating}.0
              </span>
              <span className="text-gray-400 font-medium ml-1">
                (128 reviews)
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            {product.title}
          </h1>
          <p className="text-3xl font-bold text-slate-900 mb-6">
            ₦{(product.price * quantity).toLocaleString()}
          </p>
          <p className="text-gray-500 leading-relaxed mb-8">
            {product.description}
          </p>

          <hr className="border-gray-100 mb-8" />

          {/* Selectors */}
          <div className="space-y-6 mb-8">
            {/* Colors */}
            <div>
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 block">
                Select Color
              </span>
              <div className="flex space-x-3">
                {product.colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color.hex
                        ? "border-gray-400 ring-2 ring-gray-200 ring-offset-2"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 block">
                Select Size (EU)
              </span>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                      selectedSize === size
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/30"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-slate-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mb-8">
            {/* Quantity */}
            <div className="flex items-center border border-gray-200 rounded-xl px-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-slate-900"
              >
                <Minus size={18} />
              </button>
              <span className="w-8 text-center font-bold text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-12 flex items-center justify-center text-gray-400 hover:text-slate-900"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-widest shadow-xl shadow-red-200 transition-all active:scale-[0.98]"
            >
              Add to Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <Truck size={20} className="text-slate-900" />
              <span>Free Delivery on orders over ₦50k</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              <ShieldCheck size={20} className="text-slate-900" />
              <span>Secure Wallet Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
