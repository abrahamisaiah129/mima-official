import React from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">JOIN MIMA</h2>
        <p className="text-sm text-gray-500">
          Create a wallet and start slaying on a budget.
        </p>
      </div>

      <form className="space-y-5">
        <div className="relative">
          <User
            className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Full Name"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-red-600 focus:bg-white transition"
          />
        </div>

        <div className="relative">
          <Mail
            className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"
            size={20}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-red-600 focus:bg-white transition"
          />
        </div>

        <div className="relative">
          <Lock
            className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"
            size={20}
          />
          <input
            type="password"
            placeholder="Create Password"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-red-600 focus:bg-white transition"
          />
        </div>

        <button className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center group transition shadow-lg">
          <span>Create Account</span>
          <ArrowRight
            className="ml-2 group-hover:translate-x-1 transition-transform"
            size={20}
          />
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-red-600 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
