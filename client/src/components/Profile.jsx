import React from "react";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-black text-white mb-8 uppercase tracking-tight">
        Account Settings
      </h1>

      <div className="bg-zinc-900 rounded-3xl p-8 border border-white/10 shadow-xl">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-black font-bold text-2xl">
            AB
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Abraham Isaiah</h2>
            <p className="text-gray-400 text-sm">Member since 2025</p>
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
                defaultValue="Abraham Isaiah"
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
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
                defaultValue="abraham@example.com"
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
                defaultValue="0913 226 0101"
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
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
                defaultValue="Lagos, Nigeria"
                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:outline-none font-bold text-white transition-colors"
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center transition shadow-lg shadow-white/10">
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
