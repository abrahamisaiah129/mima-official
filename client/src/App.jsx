import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Wallet from "./components/Wallet";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import Loader from "./components/Loader";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ForgotPassword from "./components/ForgotPassword";
import ProductDetails from "./components/ProductDetails";
import CheckoutForm from "./components/CheckoutForm";
import WhatsAppButton from "./components/WhatsAppButton"; // Updated import name
import ScrollToTop from "./components/ScrollToTop";
import Wishlist from "./components/Wishlist";
import Home from "./pages/Home";
import Shop from "./pages/Shop";

import TrackOrder from "./pages/TrackOrder";
import APIDocs from "./pages/APIDocs";

// import { profile } from "./data/profile"; // Import profile data

// import { products } from "./data/products"; // Import products data
import { NotificationProvider } from "./context/NotificationContext";
import { UserProvider } from "./context/UserContext";
import { ShopProvider } from "./context/ShopContext";

function App() {




  return (
    <NotificationProvider>
      <UserProvider>
        <ShopProvider>
          <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-black font-sans text-white">
              <Navbar />

              <main className="grow pt-48 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route
                    path="/product/:id"
                    element={<ProductDetails />}
                  />
                  <Route
                    path="/cart"
                    element={<Cart />}
                  />
                  <Route path="/checkout" element={<CheckoutForm />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/api-docs" element={<APIDocs />} />


                </Routes>
              </main>

              <WhatsAppButton />

              <Footer />
            </div>
          </Router>
        </ShopProvider>
      </UserProvider>
    </NotificationProvider>
  );
}

export default App;
