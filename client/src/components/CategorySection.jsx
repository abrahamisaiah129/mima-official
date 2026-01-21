import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    id: "heels",
    title: "Luxury Heels",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    count: "24 Items",
  },
  {
    id: "sneakers",
    title: "Street Sneakers",
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
    count: "42 Items",
  },
  {
    id: "boots",
    title: "Premium Boots",
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop",
    count: "18 Items",
  },
  {
    id: "flats",
    title: "Comfort Flats",
    image:
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=800&auto=format&fit=crop",
    count: "12 Items",
  },
];

const CategorySection = () => {
  return (
    <section className="mb-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">
            Most Searched
          </h2>
          <p className="text-gray-400 mt-2 font-medium">
            Find your perfect pair by style.
          </p>
        </div>
        <Link
          to="/shop"
          className="hidden sm:block text-sm font-bold text-white hover:text-gray-300 uppercase tracking-wider underline underline-offset-4 decoration-2 decoration-white/50"
        >
          All Categories
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="group relative h-96 rounded-[2rem] overflow-hidden block border border-white/10"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.7] grayscale group-hover:grayscale-0 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-500" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start justify-end h-full">
              <span className="text-xs font-bold text-white/60 mb-2 uppercase tracking-widest">
                {cat.count}
              </span>
              <div className="flex items-center justify-between w-full">
                <h3 className="text-2xl font-black text-white italic">
                  {cat.title}
                </h3>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
