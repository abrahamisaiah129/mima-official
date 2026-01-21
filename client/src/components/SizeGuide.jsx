import React from "react";
import { X, Ruler } from "lucide-react";

const SizeGuide = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full animate-slide-up shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
            <Ruler size={24} />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Size Guide</h2>
          <p className="text-gray-400 text-sm mt-2">Find your perfect fit across all regions.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-white/5 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-l-lg">EU (MIMA Standard)</th>
                <th className="px-6 py-4">US Women</th>
                <th className="px-6 py-4">UK</th>
                <th className="px-6 py-4 rounded-r-lg">Foot Length (cm)</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4 font-bold text-white">36</td>
                <td className="px-6 py-4">6</td>
                <td className="px-6 py-4">3.5</td>
                <td className="px-6 py-4">23.0</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4 font-bold text-white">37</td>
                <td className="px-6 py-4">6.5</td>
                <td className="px-6 py-4">4</td>
                <td className="px-6 py-4">23.5</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4 font-bold text-white">38</td>
                <td className="px-6 py-4">7.5</td>
                <td className="px-6 py-4">5</td>
                <td className="px-6 py-4">24.0</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4 font-bold text-white">39</td>
                <td className="px-6 py-4">8.5</td>
                <td className="px-6 py-4">6</td>
                <td className="px-6 py-4">25.0</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4 font-bold text-white">40</td>
                <td className="px-6 py-4">9</td>
                <td className="px-6 py-4">6.5</td>
                <td className="px-6 py-4">25.5</td>
              </tr>
              <tr className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4 font-bold text-white">41</td>
                <td className="px-6 py-4">9.5</td>
                <td className="px-6 py-4">7</td>
                <td className="px-6 py-4">26.0</td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="px-6 py-4 font-bold text-white">42</td>
                <td className="px-6 py-4">10</td>
                <td className="px-6 py-4">7.5</td>
                <td className="px-6 py-4">26.5</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-xs text-gray-500 text-center">
            <p>Tip: If you are between sizes, we recommend sizing up for maximum comfort.</p>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
