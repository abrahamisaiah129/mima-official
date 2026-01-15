import React, { useState } from "react";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
} from "lucide-react";
import WalletTransaction from "./WalletTransaction";
import AddFundsForm from "./AddFundsForm";

const Wallet = () => {
  const [showAddFunds, setShowAddFunds] = useState(false);

  // Mock Data
  const transactions = [
    {
      id: 1,
      type: "DEPOSIT",
      amount: 50000,
      date: "Oct 24, 2025",
      status: "Success",
    },
    {
      id: 2,
      type: "PURCHASE",
      amount: 12500,
      date: "Oct 22, 2025",
      status: "Success",
    },
    {
      id: 3,
      type: "PURCHASE",
      amount: 8500,
      date: "Oct 20, 2025",
      status: "Success",
    },
    {
      id: 4,
      type: "DEPOSIT",
      amount: 20000,
      date: "Oct 15, 2025",
      status: "Success",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 1. Wallet Balance Card */}
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                Total Balance
              </p>
              <h2 className="text-4xl font-black tracking-tight">₦50,000.00</h2>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-red-500">
              <WalletIcon size={24} />
            </div>
          </div>

          <button
            onClick={() => setShowAddFunds(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center transition shadow-lg shadow-red-900/50"
          >
            <Plus size={18} className="mr-2" />
            Top Up Wallet
          </button>
        </div>
      </div>

      {/* 2. Transaction History */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-4">
          {transactions.map((txn) => (
            <WalletTransaction key={txn.id} data={txn} />
          ))}
        </div>
      </div>

      {/* 3. Add Funds Modal (Conditional) */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowAddFunds(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
            >
              ✕
            </button>
            <AddFundsForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
