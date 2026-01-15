import React from "react";
import { Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">
              MIMA
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Premium footwear designed for comfort, style, and confidence. Slay
              on a budget without compromising on quality.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-all"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-all"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-red-600 hover:text-white transition-all"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">
              Shop
            </h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li>
                <a href="#" className="hover:text-red-600 transition">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition">
                  Heels
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition">
                  Sneakers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition">
                  Flats
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">
              Support
            </h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li>
                <a href="#" className="hover:text-red-600 transition">
                  My Wallet
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition">
                  Returns Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-600 transition">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">
              Contact
            </h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li>Lagos, Nigeria</li>
              <li>hello@mima.store</li>
              <li>+234 800 123 4567</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} MIMA Footwear. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-slate-900 font-medium"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-gray-400 hover:text-slate-900 font-medium"
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
