import React from "react";

const Newsletter = () => {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      {/* Decorative blurred blob in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-red-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
          Don't Miss the Drop
        </h2>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
          Join the MIMA community. Get exclusive access to new collections,
          flash sales, and wallet top-up bonuses.
        </p>

        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="grow px-6 py-4 rounded-full bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest transition shadow-lg shadow-red-900/50">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
