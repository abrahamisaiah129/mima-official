import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
// import { ShoppingBag, User, Search, Menu, X, Wallet } from "lucide-react";
import LOGO from "../assets/MIMA(cropped).png";
import { products } from "../data/products";
// Inline icons to resolve "Objects are not valid as a React child" error caused by duplicate React instances
const IconWrapper = ({
  size = 24,
  strokeWidth = 2,
  className,
  children,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {children}
  </svg>
);

const ShoppingBag = (props) => (
  <IconWrapper {...props}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </IconWrapper>
);

const User = (props) => (
  <IconWrapper {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </IconWrapper>
);

const Search = (props) => (
  <IconWrapper {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </IconWrapper>
);

const Menu = (props) => (
  <IconWrapper {...props}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </IconWrapper>
);

const X = (props) => (
  <IconWrapper {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </IconWrapper>
);

const Wallet = (props) => (
  <IconWrapper {...props}>
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </IconWrapper>
);

const Home = (props) => (
  <IconWrapper {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </IconWrapper>
);

const Navbar = ({ cartCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(50000); // Example State: ₦50,000
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Derive unique categories from products data
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const isCategoryActive = (category) => {
    const currentCategory = searchParams.get("category");
    if (location.pathname !== "/shop") return false;
    if (category === "All")
      return !currentCategory || currentCategory === "All";
    return currentCategory === category;
  };

  return (
    <header className="fixed w-full top-0 z-50">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
      {/* 1. Top Bar - "Slay on a Budget" Tagline */}
      <div className="bg-red-600 text-white text-xs font-bold tracking-[0.2em] text-center py-2 uppercase">
        Slay on a Budget with MIMA
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-800 hover:text-red-600 transition"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Logo Area - Simplistic & Mature */}
            <Link
              to="/"
              className="shrink-0 flex flex-col items-center justify-center cursor-pointer"
            >
              {/* Replace this text with your generated Logo Image if preferred */}
              <img
                src={LOGO}
                alt="MIMA Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation Links - Centered & Elegant */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                to="/"
                className={`transition-colors ${
                  location.pathname === "/"
                    ? "text-red-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Home size={20} />
              </Link>
              {categories.map((item) => (
                <Link
                  key={item}
                  to={`/shop?category=${item}`}
                  className={`text-sm font-medium hover:underline underline-offset-4 decoration-red-500 transition-all duration-300 uppercase tracking-wide ${
                    isCategoryActive(item)
                      ? "text-red-600 font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Right Side Actions: Wallet, Search, Cart */}
            <div className="flex items-center space-x-6">
              {/* Search Icon (Hidden on very small mobile to save space) */}
              <form
                onSubmit={handleSearch}
                className="hidden sm:flex items-center relative"
              >
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-10 py-2 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-red-200 focus:ring-2 focus:ring-red-100 text-sm w-40 focus:w-64 transition-all duration-300 outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-3 text-slate-400 hover:text-red-600 transition"
                >
                  <Search size={18} strokeWidth={2} />
                </button>
              </form>

              {/* WALLET COMPONENT - The Key Feature */}
              <Link
                to="/wallet"
                className="hidden sm:flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:border-red-300 transition group"
              >
                <Wallet
                  size={16}
                  className="text-slate-400 group-hover:text-red-500 transition mr-2"
                />
                <span className="text-sm font-semibold text-slate-700">
                  ₦{walletBalance.toLocaleString()}
                </span>
              </Link>

              {/* Profile Icon */}
              <Link
                to="/profile"
                className="text-slate-600 hover:text-slate-900 transition"
              >
                <User size={22} strokeWidth={1.5} />
              </Link>

              {/* Cart Icon with Badge */}
              <Link to="/cart" className="relative cursor-pointer group">
                <ShoppingBag
                  size={22}
                  strokeWidth={1.5}
                  className="text-slate-600 group-hover:text-slate-900 transition"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu (Slide down) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-slide-down origin-top shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {/* Mobile Wallet View */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4 border border-gray-100">
                <span className="text-sm font-medium text-gray-500">
                  My Wallet Balance
                </span>
                <span className="text-base font-bold text-slate-900">
                  ₦{walletBalance.toLocaleString()}
                </span>
              </div>

              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-3 text-base font-medium rounded-md transition ${
                  location.pathname === "/"
                    ? "text-red-600 bg-red-50"
                    : "text-slate-600 hover:text-red-600 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>

              {categories.map((item) => (
                <Link
                  key={item}
                  to={`/shop?category=${item}`}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 text-base font-medium rounded-md transition ${
                    isCategoryActive(item)
                      ? "text-red-600 bg-red-50"
                      : "text-slate-600 hover:text-red-600 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
