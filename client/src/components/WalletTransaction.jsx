import React from "react";
import { ArrowUpRight, ArrowDownLeft, ShoppingBag } from "lucide-react";

const WalletTransaction = ({ data }) => {
  const isDeposit = data.type === "DEPOSIT";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-black border border-zinc-800 hover:bg-zinc-800 hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-4">
        {/* Icon based on Type */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDeposit
              ? "bg-green-900/30 text-green-400"
              : "bg-red-900/30 text-red-400"
          }`}
        >
          {isDeposit ? <ArrowDownLeft size={20} /> : <ShoppingBag size={18} />}
        </div>

        <div>
          <p className="text-sm font-bold text-white">
            {isDeposit ? "Wallet Top-up" : "Purchase"}
          </p>
          <p className="text-xs text-gray-400">{data.date}</p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={`text-sm font-bold ${
            isDeposit ? "text-green-500" : "text-white"
          }`}
        >
          {isDeposit ? "+" : "-"} ₦{data.amount.toLocaleString()}
        </p>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-gray-400">
          {data.status}
        </span>
      </div>
    </div>
  );
};

export default WalletTransaction;
