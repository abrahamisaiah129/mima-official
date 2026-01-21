import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import Wallet from "./components/Wallet";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPassword from "./components/ForgotPassword";
import ProductDetails from "./components/ProductDetails";
import CheckoutForm from "./components/CheckoutForm";
import WhatsAppButton from "./components/WhatsAppButton"; // Updated import name
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import TrackOrder from "./pages/TrackOrder";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Wishlist Logic
  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Enhanced Add to Cart (Checks for duplicates with same ID + Size + Color)
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === product.selectedSize &&
          item.selectedColor === product.selectedColor
      );
      if (existing) {
        return prev.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prev, product];
    });
  };

  const removeFromCart = (id, size, color) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );
  };

  const updateQuantity = (id, size, color, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.id === id &&
          item.selectedSize === size &&
          item.selectedColor === color
        ) {
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
      })
    );
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-black font-sans text-white">
        <Navbar
          cartCount={cartItems.length}
          wishlistCount={wishlistItems.length}
        />

        <main className="grow pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/shop" element={<Shop addToCart={addToCart} />} />
            <Route
              path="/product/:id"
              element={
                <ProductDetails
                  addToCart={addToCart}
                  wishlistItems={wishlistItems}
                  toggleWishlist={toggleWishlist}
                />
              }
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              }
            />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/track-order" element={<TrackOrder />} />

            {/* ADMIN ROUTES */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>

        <WhatsAppButton />
        <Newsletter />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
