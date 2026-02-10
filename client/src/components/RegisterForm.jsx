import React, { useState } from "react";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const RegisterForm = () => {
  const { register } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await register(formData);
    if (res.success) {
      navigate("/"); // Redirect to Home on success
    } else {
      setError(res.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">JOIN MIMA</h2>
        <p className="text-sm text-gray-500">
          Create a wallet and start slaying on a budget.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <User
            className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"
            size={20}
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-red-600 focus:bg-white transition text-black placeholder:text-gray-400"
          />
        </div>

        <div className="relative">
          <Mail
            className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"
            size={20}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-red-600 focus:bg-white transition text-black placeholder:text-gray-400"
          />
        </div>

        <div className="relative">
          <Lock
            className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400"
            size={20}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create Password"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-red-600 focus:bg-white transition text-black placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center group transition shadow-lg disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Account"}
          {!loading && (
            <ArrowRight
              className="ml-2 group-hover:translate-x-1 transition-transform"
              size={20}
            />
          )}
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
