import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);



export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("MIMA_TOKEN"));

    const loadUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (err) {
            logout();
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    // Login Function
    const login = async (email, password) => {
        const body = JSON.stringify({ email, password });

        try {
            const res = await api.post("/auth/login", body);
            localStorage.setItem("MIMA_TOKEN", res.data.token);
            setToken(res.data.token);
            await loadUser();
            return { success: true };
        } catch (error) {
            console.error("Login Error", error);
            const message = error.response?.data?.message || "Unable to login. Please check your connection and try again.";
            return { success: false, message };
        }
    };

    // Register Function
    const register = async (userData) => {
        const body = JSON.stringify(userData);

        try {
            const res = await api.post("/auth/register", body);
            localStorage.setItem("MIMA_TOKEN", res.data.token);
            setToken(res.data.token);
            await loadUser();
            return { success: true };
        } catch (error) {
            console.error("Register Error", error);
            const message = error.response?.data?.message || "Registration failed. Please try again.";
            return { success: false, message };
        }
    };

    // Request OTP
    const requestOTP = async (email) => {
        try {
            await api.post("/password/send-otp", { email });
            return { success: true, message: "OTP sent to your email" };
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Could not send OTP. Please check your email and try again.";
            return { success: false, message };
        }
    };

    // Reset Password
    const resetPassword = async (email, otp, newPassword) => {
        try {
            await api.post("/password/reset-password", { email, otp, newPassword });
            return { success: true };
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Password reset failed. Please check your OTP and try again.";
            return { success: false, message };
        }
    };

    // Logout Function
    const logout = () => {
        setUser(null);
        localStorage.removeItem("MIMA_TOKEN");
        setToken(null);
    };

    const updateProfile = async (userData) => {
        if (!user) return { success: false, message: "Not logged in" };
        try {
            const res = await api.patch(`/users/${user._id}`, userData);
            setUser(res.data);
            return { success: true, message: "Profile updated successfully" };
        } catch (error) {
            console.error("Update Profile Error", error);
            return { success: false, message: "Server error" };
        }
    };

    const addFunds = async (amount) => {
        if (!user) return { success: false, message: "Not logged in" };
        try {
            const res = await api.patch(`/users/${user._id}/add-funds`, { amount });
            setUser(res.data);
            return { success: true, message: "Funds added successfully" };
        } catch (error) {
            console.error("Add Funds Error", error);
            return { success: false, message: error.response?.data?.message || "Failed to add funds" };
        }
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <UserContext.Provider value={{ user, token, login, register, requestOTP, resetPassword, logout, updateProfile, addFunds, updateUser, loadUser }}>
            {children}
        </UserContext.Provider>
    );
};
