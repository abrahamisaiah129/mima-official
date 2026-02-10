import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useUser } from "../context/UserContext"; // Import useUser

const LoginForm = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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

    const res = await login(formData.email, formData.password);
    if (res.success) {
      navigate("/"); // Redirect to Home
    } else {
      setError(res.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          WELCOME BACK
        </h2>
        <p className="text-sm text-gray-500">
          Sign in to access your wallet and orders.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm font-bold rounded-xl text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-red-600 focus:bg-white transition text-black placeholder:text-gray-400"
          />
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-xs font-bold text-red-600 hover:text-red-700"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center group transition shadow-lg shadow-red-200 disabled:opacity-50">
          {loading ? "Signing In..." : "Sign In"}
          {!loading && (
            <ArrowRight
              className="ml-2 group-hover:translate-x-1 transition-transform"
              size={20}
            />
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-slate-900 font-bold hover:underline"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
