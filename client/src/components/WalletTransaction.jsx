import React from "react";
import { ArrowUpRight, ArrowDownLeft, ShoppingBag } from "lucide-react";

const WalletTransaction = ({ data }) => {
  const isDeposit = data.type === "DEPOSIT";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-4">
        {/* Icon based on Type */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDeposit
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {isDeposit ? <ArrowDownLeft size={20} /> : <ShoppingBag size={18} />}
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {isDeposit ? "Wallet Top-up" : "Purchase"}
          </p>
          <p className="text-xs text-gray-500">{data.date}</p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={`text-sm font-bold ${
            isDeposit ? "text-green-600" : "text-slate-900"
          }`}
        >
          {isDeposit ? "+" : "-"} ₦{data.amount.toLocaleString()}
        </p>
        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-200 text-gray-600">
          {data.status}
        </span>
      </div>
    </div>
  );
};

export default WalletTransaction;
