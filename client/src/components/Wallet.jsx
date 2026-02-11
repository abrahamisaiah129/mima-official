import React, { useState } from "react";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
} from "lucide-react";
import WalletTransaction from "./WalletTransaction";
import AddFundsForm from "./AddFundsForm";
import TransactionDetailsModal from "./TransactionDetailsModal";
import LoginModal from "./LoginModal";

import { useUser } from "../context/UserContext";

const Wallet = () => {
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white border border-gray-200 rounded-2xl shadow-xl">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <WalletIcon size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">Wallet Locked</h2>
        <p className="text-gray-500 mb-8 max-w-xs mx-auto">
          Please log in to access your funds, transaction history, and top-up features.
        </p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-zinc-800 transition shadow-lg"
        >
          Login to Wallet
        </button>
        {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
    );
  }

  // Get recent transactions from user context, sorted by date (descending)
  const transactions = user.transactions
    ? [...user.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
    : [];

  return (
    <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
      {/* 1. Wallet Balance Card */}
      <div className="bg-black p-8 text-white relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">
                Total Balance
              </p>
              <h2 className="text-4xl font-black tracking-tight">₦{user.balance.toLocaleString()}</h2>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white">
              <WalletIcon size={24} />
            </div>
          </div>

          <button
            onClick={() => setShowAddFunds(true)}
            className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center transition shadow-lg shadow-white/10"
          >
            <Plus size={18} className="mr-2" />
            Top Up Wallet
          </button>
        </div>
      </div>

      {/* 2. Transaction History */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          Recent Transactions
        </h3>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <WalletTransaction
                key={txn._id || txn.reference}
                data={txn}
                onClick={() => setSelectedTransaction(txn)}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No transactions yet.</p>
          )}

        </div>
      </div>

      {/* 3. Add Funds Modal (Conditional) */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-md relative border border-zinc-800">
            <button
              onClick={() => setShowAddFunds(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <AddFundsForm onSuccess={() => setShowAddFunds(false)} />
          </div>
        </div>
      )}
      {/* 4. Transaction Details Modal */}
      <TransactionDetailsModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
};

export default Wallet;
