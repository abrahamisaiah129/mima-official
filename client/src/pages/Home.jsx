import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BlobCanvas from "../components/BlobCanvas";
import Features from "../components/Features";
import ProductGrid from "../components/ProductGrid";
import { products } from "../data/products";

const Home = ({ addToCart }) => {
  // Limited products for the "Latest Drops" section
  const latestDrops = products.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <section className="mb-20 animate-slide-up">
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px] relative">
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center items-start text-white relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-red-600/20 text-red-400 text-xs font-bold tracking-widest uppercase mb-4 border border-red-500/30">
              New Collection
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              STEP UP <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600">
                YOUR GAME
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-md font-light">
              Discover the latest arrivals in luxury footwear. From the
              boardroom to the dance floor, MIMA has you covered.
            </p>
            <Link
              to="/shop"
              className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center transition-all group shadow-lg shadow-white/10"
            >
              Shop Now
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </Link>
          </div>
          <div className="md:w-1/2 bg-gray-800 relative h-80 md:h-auto flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 w-full h-full scale-150 opacity-60">
              <BlobCanvas />
            </div>
            <img
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop"
              alt="MIMA Hero Shoe"
              className="relative z-10 w-[85%] md:w-[90%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-700 -rotate-12"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-slate-900/40 pointer-events-none z-20"></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <div className="mb-20 animate-slide-up delay-100">
        <Features />
      </div>

      {/* LATEST DROPS */}
      <section className="mb-24 animate-slide-up delay-200">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              LATEST DROPS
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Exclusive footwear for the modern woman.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:block text-sm font-bold text-red-600 hover:text-red-700 uppercase tracking-wider underline underline-offset-4 decoration-2"
          >
            View All Products
          </Link>
        </div>
        <ProductGrid products={latestDrops} addToCart={addToCart} />
      </section>
    </div>
  );
};

export default Home;
