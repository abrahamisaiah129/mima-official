import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import Features from "../components/Features";
import CategorySection from "../components/CategorySection";
import PaginatedSection from "../components/PaginatedSection";
import SearchFilter from "../components/SearchFilter";
import InstagramFeed from "../components/InstagramFeed";
import Newsletter from "../components/Newsletter";
import api from "../api";

// Local data imports removed

const Home = () => {
  const { products: shopProducts, addToCart, cartItems, removeFromCart, wishlistItems = [], toggleWishlist } = useShop();
  // Pass ALL products to let the component handle pagination
  const allLatest = shopProducts || [];
  // Products for "Trending Now" - derived from context (randomized or slice)
  const allTrending = shopProducts ? [...shopProducts].slice(0, 8) : [];

  const [mostSearched, setMostSearched] = useState([]);

  useEffect(() => {
    api.get('/most-searched')
      .then(res => setMostSearched(res.data))
      .catch(err => console.error("Failed to load most searched", err));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <HeroSlider />

      {/* SEARCH & FILTER (Pills) */}
      <SearchFilter />

      {/* LATEST DROPS */}
      <PaginatedSection
        title="Latest Drops"
        products={allLatest}
        addToCart={addToCart}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        wishlistItems={wishlistItems}
        toggleWishlist={toggleWishlist}
        viewAllLink={
          <Link
            to="/shop"
            className="text-sm font-bold text-white hover:text-gray-300 uppercase tracking-wider underline underline-offset-4 decoration-2 decoration-white/50"
          >
            Show All
          </Link>
        }
      />

      {/* CATEGORIES SECTION (New) */}
      <div className="animate-slide-up delay-200">
        <CategorySection />
      </div>

      {/* TRENDING NOW */}
      <PaginatedSection
        title="Trending Now"
        subtitle="Top picks from the community this week."
        products={allTrending}
        addToCart={addToCart}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        wishlistItems={wishlistItems}
        toggleWishlist={toggleWishlist}
        viewAllLink={
          <Link
            to="/shop"
            className="text-sm font-bold text-white hover:text-gray-300 uppercase tracking-wider underline underline-offset-4 decoration-2 decoration-white/50"
          >
            Show All
          </Link>
        }
      />

      {/* MOST SEARCHED (Real-time) */}
      {mostSearched.length > 0 && (
        <PaginatedSection
          title="Most Searched"
          subtitle="What everyone is looking for right now."
          products={mostSearched}
          addToCart={addToCart}
          cartItems={cartItems}
          removeFromCart={removeFromCart}
          wishlistItems={wishlistItems}
          toggleWishlist={toggleWishlist}
        />
      )}

      {/* FEATURES (Moved to Bottom) */}
      <div className="mb-20 animate-slide-up delay-300">
        <Features />
      </div>

      {/* INSTAGRAM FEED */}
      <div className="animate-slide-up delay-300">
        <InstagramFeed />
      </div>

      {/* NEWSLETTER */}
      <Newsletter />


    </div>
  );
};

export default Home;
