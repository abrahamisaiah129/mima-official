import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Save, Globe, Check } from "lucide-react";
import { profile } from "../data/profile";
import { parsePhoneNumber } from "libphonenumber-js";

const Profile = () => {
  const [country, setCountry] = useState("Loading...");
  const [isSubscribed, setIsSubscribed] = useState(profile.subscribed);

  useEffect(() => {
    try {
      // Defaulting to NG for parsing if not international format, assuming user base
      const phoneNumber = parsePhoneNumber(profile.phone, "NG");
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
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-black text-white mb-8 uppercase tracking-tight">
        Account Settings
      </h1>

      <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10 shadow-xl">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black font-bold text-2xl overflow-hidden">
            {profile.firstname[0].toUpperCase()}{profile.lastname[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{profile.firstname} {profile.lastname}</h2>
            <p className="text-gray-400 text-sm">Member since {profile.memberSince}</p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                defaultValue={`${profile.firstname} ${profile.lastname}`}
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
                readOnly
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
                defaultValue={profile.email}
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
                readOnly
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
                defaultValue={profile.phone}
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
                readOnly
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
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
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
                defaultValue={profile.address}
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Newsletter
            </label>
            <div className="relative">
              <div
                onClick={() => setIsSubscribed(!isSubscribed)}
                className="flex items-center space-x-3 w-full pl-4 pr-4 py-3 bg-black border border-white/10 rounded-xl cursor-pointer hover:bg-zinc-900 transition-colors select-none"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSubscribed ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                  {isSubscribed && <Check size={14} className="text-black stroke-3" />}
                </div>
                <span className="text-white font-bold">
                  {isSubscribed ? "Subscribed to Don't Miss the Drop" : "Not Subscribed"}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center transition shadow-lg shadow-white/10">
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div >
    </div >
  );
};

export default Profile;
