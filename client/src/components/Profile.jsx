import React from "react";
import { User, Mail, Phone, MapPin, Save } from "lucide-react";

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight">
        Account Settings
      </h1>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            AB
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Abraham Isaiah</h2>
            <p className="text-gray-500 text-sm">Member since 2025</p>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Full Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                defaultValue="Abraham Isaiah"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-slate-900 focus:outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                defaultValue="abraham@example.com"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-slate-900 focus:outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Phone
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="tel"
                defaultValue="0913 226 0101"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-slate-900 focus:outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Default Address
            </label>
            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                defaultValue="Lagos, Nigeria"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-slate-900 focus:outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="md:col-span-2 pt-4">
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest flex items-center transition shadow-lg">
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
