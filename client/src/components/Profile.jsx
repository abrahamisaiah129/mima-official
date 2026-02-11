import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Save, Globe, Check, Lock } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useNotification } from "../context/NotificationContext";
import LoginModal from "./LoginModal";
import { parsePhoneNumber } from "libphonenumber-js";

const Profile = () => {
  const { user, updateProfile } = useUser();
  const { notify } = useNotification();
  const [country, setCountry] = useState("Loading...");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    isSubscribed: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: user.address || "",
        isSubscribed: user.isSubscribed || false
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await updateProfile(formData);
    setIsSaving(false);

    if (res.success) {
      notify("success", "Saved", "Profile updated successfully");
    } else {
      notify("error", "Error", res.message);
    }
  };

  useEffect(() => {
    if (user && user.phone) {
      try {
        // Defaulting to NG for parsing if not international format, assuming user base
        const phoneNumber = parsePhoneNumber(user.phone, "NG");
        if (phoneNumber && phoneNumber.country) {
          // Convert country code (e.g., 'NG') to full name (e.g., 'Nigeria')
          const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
          setCountry(regionNames.of(phoneNumber.country));
        } else {
          setCountry("Nigeria"); // Fallback
        }
      } catch (error) {
        // If parsing fails, fall back to default
        setCountry("Nigeria");
      }
    } else {
      setCountry("Not Set");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 py-20 animate-fade-in text-center">
        <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <Lock size={40} />
        </div>
        <h1 className="text-3xl font-black text-white mb-4">Account Access Restricted</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Please log in or register to view your profile and manage your account settings.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-white text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition"
        >
          Login / Register
        </button>
        {isAuthModalOpen && <LoginModal onClose={() => setIsAuthModalOpen(false)} />}
      </div>
    )
  }

  const memberSince = user.id && !isNaN(user.id) ? new Date(parseInt(user.id)).getFullYear() : "2024";

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-black text-white mb-8 uppercase tracking-tight">
        Account Settings
      </h1>

      <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10 shadow-xl">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black font-bold text-2xl overflow-hidden">
            {(user.firstName?.[0] || "U").toUpperCase()}{(user.lastName?.[0] || "").toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-400 text-sm">Member since {memberSince}</p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleUpdate}>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              First Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Last Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="email"
                value={user.email}
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
                readOnly
                title="Email cannot be changed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Phone
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Country
            </label>
            <div className="relative">
              <Globe
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={country}
                className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Default Address
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Newsletter
            </label>
            <div className="relative">
              <div
                onClick={() => setFormData({ ...formData, isSubscribed: !formData.isSubscribed })}
                className="flex items-center space-x-3 w-full pl-4 pr-4 py-3 bg-black border border-white/10 rounded-xl cursor-pointer hover:bg-zinc-900 transition-colors select-none"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isSubscribed ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                  {formData.isSubscribed && <Check size={14} className="text-black stroke-3" />}
                </div>
                <span className="text-white font-bold">
                  {formData.isSubscribed ? "Subscribed to Don't Miss the Drop" : "Not Subscribed"}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center transition shadow-lg shadow-white/10 disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {isSaving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
