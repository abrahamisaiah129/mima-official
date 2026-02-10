import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import api from "../api";
import {
  Star,
  Minus,
  Plus,
  Share2,
  Truck,
  ShieldCheck,
  Ruler,
  Info,
  MessageSquare,
} from "lucide-react";
import ProductReviews from "./ProductReviews";
import RelatedProducts from "./RelatedProducts";
import SizeGuide from "./SizeGuide";

const ProductDetails = () => {
  const { id } = useParams();
  const { products, addToCart, cartItems, removeFromCart, wishlistItems, toggleWishlist } = useShop();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      let productData = products.find((p) => p.id === parseInt(id));
      if (!productData) {
        try {
          const res = await api.get(`/products/${id}`);
          productData = res.data;
        } catch (error) {
          console.error("Failed to fetch product details", error);
        }
      }
      setProduct(productData);

      if (productData) {
        setSelectedImage(productData.imageSrc);
        setSelectedColor(productData.colors?.[0]?.hex);
        setSelectedSize(productData.sizes?.[0]);
        setQuantity(1);

        try {
          const res = await api.get(`/products/${id}/reviews`);
          setReviews(res.data);
        } catch (error) {
          console.error("Failed to fetch reviews", error);
        }
      }
    };

    fetchProductDetails();
  }, [id, products]);

  // Derived state
  const isWishlisted = product ? wishlistItems.some((item) => item.id === product.id) : false;
  const stockLevel = product?.stock || 0;

  // Check if item is in cart
  const isInCart = product ? cartItems.some(item =>
    item.id === product.id &&
    item.selectedSize === selectedSize &&
    item.selectedColor === selectedColor
  ) : false;

  if (!product) {
    return (
      <div className="text-center py-20 text-xl font-bold text-white">
        Product not found
      </div>
    );
  }

  const handleAction = () => {
    if (isInCart) {
      removeFromCart(product.id, selectedSize, selectedColor);
    } else {
      addToCart({ ...product, quantity, selectedSize, selectedColor });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* 1. Image Gallery Section */}
        <div className="space-y-4 animate-slide-up">
          <div className="aspect-[4/5] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
            <img
              src={selectedImage || product.imageSrc}
              alt={product.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            {/* Low Stock Badge */}
            {stockLevel < 5 && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-red-900/50">
                Only {stockLevel} Left
              </div>
            )}

            <div className="absolute top-4 right-4 flex flex-col space-y-3">
              <button
                onClick={() => toggleWishlist && toggleWishlist(product)}
                className={`w-10 h-10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 transition-all ${isWishlisted ? "bg-red-600 text-white border-red-600" : "bg-black/40 text-white hover:bg-white hover:text-black"}`}
              >
                <div className={isWishlisted ? "fill-current" : ""}>
                  {/* Heart Icon SVG manually to avoid import issues or use Lucide Heart if avail */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
              </button>
              <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-white hover:text-black transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Thumbnail Gallery (Conditional: show only if > 1 image) */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === img || (!selectedImage && idx === 0) ? "border-white scale-105" : "border-transparent opacity-50 hover:opacity-100"}`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Product Info Section */}
        <div className="flex flex-col justify-center animate-slide-up delay-100">
          <div className="mb-4 flex items-center space-x-3">
            <span className="bg-white/10 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
              New Arrival
            </span>
            <div className="flex items-center text-yellow-400 text-sm bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
              <Star size={14} fill="currentColor" />
              <span className="text-white font-bold ml-2">
                {product.rating}.0
              </span>
              <span className="text-gray-400 font-medium ml-1 text-xs">
                ({reviews.length} Reviews)
              </span>
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none mb-4 uppercase">
            {product.title}
          </h1>
          <p className="text-3xl font-light text-white/90 mb-6 tracking-tight">
            ₦{(product.price * quantity).toLocaleString()}
          </p>
          <p className="text-gray-400 leading-relaxed mb-8 font-medium">
            {product.description}
          </p>

          <div className="h-px bg-white/10 w-full mb-8" />

          {/* Selectors */}
          <div className="space-y-8 mb-10">
            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block">
                  Select Color
                </span>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color.hex)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-10 h-10 rounded-full transition-all relative ${selectedColor === color.hex
                        ? "ring-2 ring-offset-4 ring-offset-black ring-white scale-110"
                        : "hover:scale-110 opacity-70 hover:opacity-100"
                        }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block">
                  Select Size (EU)
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs font-bold text-white underline decoration-white/30 hover:decoration-white flex items-center gap-1"
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>
              <div className="relative">
                <select
                  value={selectedSize || ''}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/20 text-white text-sm font-bold uppercase tracking-wider rounded-xl py-4 px-4 focus:outline-none focus:border-white appearance-none cursor-pointer hover:border-white/40 transition"
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      Size {size}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 mb-8">
            {/* Quantity */}
            <div className="flex items-center bg-zinc-900/50 rounded-xl px-2 border border-white/10">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-14 flex items-center justify-center text-gray-400 hover:text-white transition"
              >
                <Minus size={18} />
              </button>
              <span className="w-8 text-center font-bold text-lg text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-14 flex items-center justify-center text-gray-400 hover:text-white transition"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Add to Cart / Remove Toggle */}
            <button
              onClick={handleAction}
              className={`flex-1 rounded-xl font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] py-4 shadow-xl ${isInCart
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-900/20"
                : "bg-white hover:bg-gray-200 text-black shadow-white/10"
                }`}
            >
              {isInCart ? (
                <span className="flex items-center justify-center gap-2">
                  <Minus size={18} /> Remove from Bag
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Plus size={18} /> Add to Bag
                </span>
              )}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-xs font-medium text-gray-400 border border-white/5 p-4 rounded-2xl bg-white/5">
              <Truck size={18} className="text-white" />
              <span>Express Delivery</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-medium text-gray-400 border border-white/5 p-4 rounded-2xl bg-white/5">
              <ShieldCheck size={18} className="text-white" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABS SECTION (Description, Reviews, Shipping) */}
      <div className="mt-20 max-w-4xl mx-auto">
        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === "description" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            Details
            {activeTab === "description" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === "reviews" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            Reviews ({reviews.length})
            {activeTab === "reviews" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`pb-4 px-6 text-sm font-bold uppercase tracking-widest transition-all relative ${activeTab === "shipping" ? "text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            Shipping
            {activeTab === "shipping" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "description" && (
            <div className="space-y-6 text-gray-400 leading-relaxed">
              <p>
                Elevate your style with the {product.title}. Meticulously
                crafted using premium materials, this piece embodies the perfect
                balance of luxury and comfort for the modern individual.
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-white">
                <li>Premium authentic materials</li>
                <li>Hand-finished details for superior quality</li>
                <li>Designed for maximum comfort and durability</li>
                <li>Includes signature MIMA dust bag and box</li>
              </ul>
            </div>
          )}

          {activeTab === "reviews" && <ProductReviews reviews={reviews} />}

          {activeTab === "shipping" && (
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                <strong className="text-white">Processing Time:</strong> 1-2
                Business Days
              </p>
              <p>
                <strong className="text-white">Standard Delivery:</strong> 3-5
                Business Days
              </p>
              <p>
                <strong className="text-white">Express Delivery:</strong> Next
                Day (Lagos Only)
              </p>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 mt-4">
                <p className="text-xs">
                  <span className="text-white font-bold">Free Returns:</span> We
                  offer a hassle-free 7-day return policy for all unworn items
                  in original packaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. RELATED PRODUCTS */}
      <div className="mt-20">
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />
      </div>

      <SizeGuide
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
};

export default ProductDetails;
