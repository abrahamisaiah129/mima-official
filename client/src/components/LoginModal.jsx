import React, { useState } from "react";
import { Mail, Lock, ArrowRight, X, User, MapPin, Phone, AlertCircle, Key } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useNotification } from "../context/NotificationContext";

const AuthModal = ({ onClose, onFundRequest }) => {
    const { login, register, requestOTP, resetPassword } = useUser();
    const { notify } = useNotification();
    const [mode, setMode] = useState("LOGIN"); // LOGIN | REGISTER | WELCOME | FORGOT | RESET
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form States
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Register Extra Fields
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    // Reset Fields
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await login(email, password);
        if (res.success) {
            setMode("WELCOME");
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const userData = { email, password, firstname, lastname, address, phone };
        const res = await register(userData);

        if (res.success) {
            setMode("WELCOME");
            notify("success", "Welcome to MIMA!", "Account created successfully.");
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await requestOTP(email);
        if (res.success) {
            setMode("RESET");
            notify("success", "OTP Sent", res.message);
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await resetPassword(email, otp, newPassword);
        if (res.success) {
            notify("success", "Password Reset", "Please login with new password.");
            setMode("LOGIN");
            setPassword("");
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    if (mode === "WELCOME") {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
                <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center animate-slide-up">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                        <X size={20} />
                    </button>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <User size={32} />
                    </div>
                    <h2 className="text-2xl font-black mb-2">Welcome!</h2>
                    <p className="text-gray-500 mb-6">You are now logged in.</p>

                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                onClose();
                                if (onFundRequest) onFundRequest();
                            }}
                            className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-wide hover:bg-zinc-800 transition"
                        >
                            Fund Wallet Now
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    {/* Tabs (Only show for Login/Register) */}
                    {(mode === "LOGIN" || mode === "REGISTER") && (
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                            {["LOGIN", "REGISTER"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => { setMode(m); setError(""); }}
                                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${mode === m ? "bg-white shadow text-black" : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="text-center mb-6">
                        <h2 className="text-xl font-black text-slate-900 mb-1">
                            {mode === "LOGIN" ? "WELCOME BACK" :
                                mode === "REGISTER" ? "CREATE ACCOUNT" :
                                    mode === "FORGOT" ? "RESET PASSWORD" :
                                        "NEW PASSWORD"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {mode === "LOGIN" ? "Sign in to access your wallet." :
                                mode === "REGISTER" ? "Join MIMA for exclusive benefits." :
                                    mode === "FORGOT" ? "Enter email to receive OTP." :
                                        "Enter OTP and new password."}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    {/* FORGOT PASSWORD FORM */}
                    {mode === "FORGOT" && (
                        <form onSubmit={handleRequestOTP} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input
                                    type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm text-black placeholder:text-gray-400"
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                            <button onClick={() => setMode("LOGIN")} type="button" className="text-xs text-gray-500 hover:text-black font-bold w-full mt-2">
                                Back to Login
                            </button>
                        </form>
                    )}

                    {/* RESET PASSWORD FORM */}
                    {mode === "RESET" && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="relative">
                                <Key className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input
                                    type="text" required placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm text-black placeholder:text-gray-400"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input
                                    type="password" required placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm text-black placeholder:text-gray-400"
                                />
                            </div>
                            <button
                                type="submit" disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition"
                            >
                                {loading ? "Resetting..." : "Update Password"}
                            </button>
                        </form>
                    )}

                    {/* LOGIN / REGISTER FORM */}
                    {(mode === "LOGIN" || mode === "REGISTER") && (
                        <form onSubmit={mode === "LOGIN" ? handleLogin : handleRegister} className="space-y-4">

                            {mode === "REGISTER" && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <User className="absolute top-3 left-3 text-gray-400" size={18} />
                                            <input
                                                type="text" required placeholder="First Name" value={firstname} onChange={e => setFirstname(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm text-black placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div className="relative">
                                            <User className="absolute top-3 left-3 text-gray-400" size={18} />
                                            <input
                                                type="text" required placeholder="Last Name" value={lastname} onChange={e => setLastname(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm text-black placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <MapPin className="absolute top-3 left-3 text-gray-400" size={18} />
                                        <input
                                            type="text" required placeholder="Address" value={address} onChange={e => setAddress(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm text-black placeholder:text-gray-400"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone className="absolute top-3 left-3 text-gray-400" size={18} />
                                        <input
                                            type="tel" required placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm text-black placeholder:text-gray-400"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="relative">
                                <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input
                                    type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm text-black placeholder:text-gray-400"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
                                <input
                                    type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-black text-sm text-black placeholder:text-gray-400"
                                />
                            </div>

                            {mode === "LOGIN" && (
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setMode("FORGOT")}
                                        className="text-xs font-bold text-gray-400 hover:text-black"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black hover:bg-zinc-800 text-white py-4 rounded-xl font-bold uppercase tracking-widest flex items-center justify-center group transition shadow-lg disabled:opacity-50 mt-4"
                            >
                                {loading ? "Processing..." : (
                                    <>
                                        <span>{mode === "LOGIN" ? "Sign In" : "Create Account"}</span>
                                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
