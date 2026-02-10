import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import api from "../api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.get("/admins");
            const admins = res.data;

            const user = admins.find(u => u.email === email && u.password === password);

            if (user) {
                // Ideally set token/session, but for now just navigate
                navigate("/dashboard");
            } else {
                // For demo purposes, hint the credentials if failed
                alert("Invalid Credentials. (Try: admin@mima.store / password123)");
            }
        } catch (error) {
            console.error("Login Error", error);
            alert("Login Failed. Is the server running?");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="bg-zinc-900 border border-white/10 p-10 rounded-3xl w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <img
                        src="/MIMA_New.png"
                        alt="MIMA Logo"
                        className="h-12 w-12 object-contain mx-auto mb-6"
                    />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                        Admin Portal
                    </h2>
                    <p className="text-gray-500 mt-2">Restricted Access Only</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-white transition-colors outline-none"
                                placeholder="admin@mima.store"
                            />
                            <User
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:border-white transition-colors outline-none"
                                placeholder="••••••••"
                            />
                            <Lock
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Login to Dashboard
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a
                        href="http://localhost:5173"
                        className="text-sm text-gray-500 hover:text-white transition"
                    >
                        ← Back to Store
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
