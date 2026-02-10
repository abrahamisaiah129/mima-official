import React from "react";
import { ArrowUpRight, ArrowDownLeft, ShoppingBag, XCircle, Clock, FileText } from "lucide-react";

const WalletTransaction = ({ data, onClick }) => {
  const isDeposit = data.type === "DEPOSIT";

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 rounded-xl bg-black border border-zinc-800 hover:bg-zinc-800 hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center space-x-4">
        {/* Icon based on Type & Status */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${data.status === "FAILED"
            ? "bg-red-900/30 text-red-500"
            : data.status === "PENDING"
              ? "bg-yellow-900/30 text-yellow-500"
              : isDeposit
                ? "bg-green-900/30 text-green-400"
                : "bg-blue-900/30 text-blue-400"
            }`}
        >
          {data.status === "FAILED" ? (
            <XCircle size={20} />
          ) : data.status === "PENDING" ? (
            <Clock size={18} />
          ) : isDeposit ? (
            <ArrowDownLeft size={20} />
          ) : (
            <ShoppingBag size={18} />
          )}
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
          className={`text-sm font-bold ${data.status === "FAILED"
            ? "text-red-500 line-through decoration-red-500/50"
            : data.status === "PENDING"
              ? "text-yellow-500"
              : isDeposit
                ? "text-green-500"
                : "text-white"
            }`}
        >
          {isDeposit ? "+" : "-"} ₦{data.amount.toLocaleString()}
        </p>

        <div className="flex items-center justify-end gap-2 mt-1">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${data.status === "FAILED"
              ? "bg-red-500/10 text-red-500"
              : data.status === "PENDING"
                ? "bg-yellow-500/10 text-yellow-500"
                : "bg-zinc-800 text-gray-400"
              }`}
          >
            {data.status}
          </span>
          {data.status === "SUCCESS" && (
            <button className="text-gray-500 hover:text-white transition" title="View Receipt">
              <FileText size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletTransaction;
