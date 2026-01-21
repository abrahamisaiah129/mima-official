import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import Features from "../components/Features";
import ProductGrid from "../components/ProductGrid";
import SearchFilter from "../components/SearchFilter";
import CategorySection from "../components/CategorySection";
import CountdownTimer from "../components/CountdownTimer";
import InstagramFeed from "../components/InstagramFeed";
import Newsletter from "../components/Newsletter";
import { products } from "../data/products";

const Home = ({ addToCart }) => {
  // Limited products for the "Latest Drops" section
  const latestDrops = products.slice(0, 3);
  // Products for "Trending Now"
  const trendingProducts = products.slice(3, 7);

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <HeroSlider />

      {/* SEARCH & FILTER (Pills) */}
      <SearchFilter />

      {/* LATEST DROPS (Moved Up as requested "take goods and products up") */}
      <section className="mb-24 animate-slide-up delay-100">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded animate-pulse">
                LIVE DROP
              </span>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">
                Ends In:
              </span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase mb-6 md:mb-0">
              Latest Drops
            </h2>
          </div>

          <CountdownTimer
            targetDate={
              new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000)
            }
          />

          <Link
            to="/shop"
            className="hidden sm:block text-sm font-bold text-white hover:text-gray-300 uppercase tracking-wider underline underline-offset-4 decoration-2 decoration-white/50"
          >
            Show All
          </Link>
        </div>
        <ProductGrid products={latestDrops} addToCart={addToCart} />
      </section>

      {/* CATEGORIES SECTION (New) */}
      <div className="animate-slide-up delay-200">
        <CategorySection />
      </div>

      {/* TRENDING NOW (New Section "Another Section Too") */}
      <section className="mb-24 animate-slide-up delay-200">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white uppercase mb-2">
              Trending Now
            </h2>
            <p className="text-gray-400 font-medium">
              Top picks from the community this week.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:block text-sm font-bold text-white hover:text-gray-300 uppercase tracking-wider underline underline-offset-4 decoration-2 decoration-white/50"
          >
            Show All
          </Link>
        </div>
        <ProductGrid products={trendingProducts} addToCart={addToCart} />
      </section>

      {/* FEATURES (Moved to Bottom) */}
      <div className="mb-20 animate-slide-up delay-300">
        <Features />
      </div>

      {/* INSTAGRAM FEED */}
      <div className="animate-slide-up delay-300">
        <InstagramFeed />
      </div>

      {/* NEWSLETTER */}
      <div className="animate-slide-up delay-300">
        <Newsletter />
      </div>
    </div>
  );
};

export default Home;
