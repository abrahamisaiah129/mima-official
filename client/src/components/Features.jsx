import React from "react";
import { Truck, ShieldCheck, RefreshCw, CreditCard } from "lucide-react";

export const features = [
  {
    icon: "Truck",
    title: "Fast Delivery",
    text: "Nationwide shipping within 3-5 days.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure Wallet",
    text: "Safe & seamless payments via your MIMA Wallet.",
  },
  {
    icon: "RefreshCw",
    title: "Easy Returns",
    text: "Hassle-free 7-day return policy.",
  },
  {
    icon: "CreditCard",
    title: "Budget Friendly",
    text: "Luxury looks at prices that make sense.",
  },
];

const iconMap = {
  Truck: <Truck size={32} />,
  ShieldCheck: <ShieldCheck size={32} />,
  RefreshCw: <RefreshCw size={32} />,
  CreditCard: <CreditCard size={32} />,
};

const Features = () => {
  return (
    <section className="py-16 bg-black border-t border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-white shadow-sm mb-4 group-hover:bg-white group-hover:text-black transition-colors">
                {iconMap[feature.icon]}
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
