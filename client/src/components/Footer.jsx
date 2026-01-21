import React from "react";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <img
              src="/MIMA-LOGO-PLACEHOLDER.png"
              alt="MIMA Logo"
              className="h-10 w-auto mb-6 filter invert brightness-0"
            />
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Premium footwear designed for comfort, style, and confidence. Slay
              on a budget without compromising on quality.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              Shop
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Heels"
                  className="hover:text-white transition"
                >
                  Heels
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Sneakers"
                  className="hover:text-white transition"
                >
                  Sneakers
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Flats"
                  className="hover:text-white transition"
                >
                  Flats
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li>
                <a href="#" className="hover:text-white transition">
                  My Wallet
                </a>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-white transition">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Returns Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li>Lagos, Nigeria</li>
              <li>hello@mima.store</li>
              <li>+234 800 123 4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} MIMA Footwear. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-white font-medium"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-white font-medium"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
