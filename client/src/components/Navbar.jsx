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
import { smartSearch } from "../utils/search"; // Import smart search util
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

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = React.useRef(0);

  // Smart Scroll Logic - Optimized
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine direction
      // If scrolling DOWN and we are past the 100px mark -> Hide
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        // Scrolling UP -> Show
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
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
      <div className="bg-zinc-900 text-white/80 text-xs font-bold tracking-[0.2em] text-center py-2 uppercase border-b border-zinc-800">
        Slay on a Budget with MIMA
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="bg-black/90 backdrop-blur-md border-b border-zinc-800 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-300 transition"
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
                src="/MIMA-LOGO-PLACEHOLDER.png"
                alt="MIMA Logo"
                className="h-12 w-auto object-contain filter invert brightness-0"
              />
            </Link>

            {/* Desktop Navigation Links - Centered & Elegant */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link
                to="/"
                className={`transition-colors ${
                  location.pathname === "/"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Home size={20} />
              </Link>
              {categories.map((item) => (
                <Link
                  key={item}
                  to={`/shop?category=${item}`}
                  className={`text-sm font-medium hover:underline underline-offset-4 decoration-white/50 transition-all duration-300 uppercase tracking-wide ${
                    isCategoryActive(item)
                      ? "text-white font-bold"
                      : "text-gray-400 hover:text-white"
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
                  className="pl-4 pr-10 py-2 rounded-full bg-white/5 border-white/10 border focus:bg-black focus:border-white/30 focus:ring-1 focus:ring-white/30 text-sm w-40 focus:w-64 transition-all duration-300 outline-none text-white placeholder-gray-500 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="absolute right-3 text-slate-400 hover:text-white transition"
                >
                  <Search size={18} strokeWidth={2} />
                </button>
                {/* Live Search Results */}
                {searchQuery && (
                  <div className="absolute top-full left-0 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl mt-4 overflow-hidden z-50 animate-slide-up">
                    <div className="p-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                        Products
                      </h4>
                      {smartSearch(products, searchQuery).length > 0 ? (
                        <div className="space-y-3">
                          {smartSearch(products, searchQuery)
                            .slice(0, 3)
                            .map((product) => (
                              <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                onClick={() => setSearchQuery("")} // Close on click
                                className="flex items-center gap-3 group hover:bg-white/5 p-2 rounded-xl transition"
                              >
                                <img
                                  src={product.imageSrc}
                                  alt={product.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <span className="text-sm font-bold text-white block group-hover:text-gray-300 transition">
                                    {product.title}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ₦{product.price.toLocaleString()}
                                  </span>
                                </div>
                              </Link>
                            ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm italic py-2">
                          No items found.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>

              {/* WALLET COMPONENT - The Key Feature */}
              <Link
                to="/wallet"
                className="hidden sm:flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10 cursor-pointer hover:bg-white/10 transition group backdrop-blur-sm"
              >
                <Wallet
                  size={16}
                  className="text-gray-400 group-hover:text-white transition mr-2"
                />
                <span className="text-sm font-semibold text-white">
                  ₦{walletBalance.toLocaleString()}
                </span>
              </Link>

              {/* Profile Icon */}
              <Link
                to="/profile"
                className="text-gray-400 hover:text-white transition"
              >
                <User size={22} strokeWidth={1.5} />
              </Link>

              {/* Cart Icon with Badge */}
              <Link to="/cart" className="relative cursor-pointer group">
                <ShoppingBag
                  size={22}
                  strokeWidth={1.5}
                  className="text-gray-400 group-hover:text-white transition"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu (Slide down) */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-zinc-800 animate-slide-down origin-top shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {/* Mobile Wallet View */}
              <div className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg mb-4 border border-zinc-800">
                <span className="text-sm font-medium text-gray-500">
                  My Wallet Balance
                </span>
                <span className="text-base font-bold text-white">
                  ₦{walletBalance.toLocaleString()}
                </span>
              </div>

              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-3 text-base font-medium rounded-md transition ${
                  location.pathname === "/"
                    ? "text-white bg-zinc-900"
                    : "text-gray-400 hover:text-white hover:bg-zinc-900"
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
                      ? "text-white bg-zinc-900"
                      : "text-gray-400 hover:text-white hover:bg-zinc-900"
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
