import React from "react";
import { X, Printer, CheckCircle, XCircle, Clock, ArrowDownLeft, ShoppingBag } from "lucide-react";

const TransactionDetailsModal = ({ transaction, onClose }) => {
    if (!transaction) return null;

    const handlePrint = () => {
        window.print();
    };

    const isDeposit = transaction.type === "DEPOSIT";

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in print:bg-white print:static print:p-0 print:block">

            {/* Print Styles */}
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #transaction-receipt, #transaction-receipt * {
            visibility: visible;
          }
          #transaction-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
            background: white;
            color: black;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

            <div
                id="transaction-receipt"
                className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
                {/* Header */}
                <div className="p-6 flex justify-between items-center border-b border-zinc-800 no-print">
                    <h3 className="text-white text-lg font-black uppercase tracking-wide">
                        Transaction Details
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 text-center print:text-black">
                    {/* Print-only Logo */}
                    <div className="hidden print:flex flex-col items-center justify-center mb-6">
                        <img src="/MIMA_New.png" alt="MIMA Logo" className="h-16 w-16 object-contain mb-2" />
                        <h1 className="text-xl font-black uppercase tracking-widest text-black">MIMA STORE</h1>
                    </div>

                    {/* Status Icon */}
                    <div className="flex justify-center mb-6 print:hidden">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${transaction.status === "FAILED"
                            ? "bg-red-500/10 text-red-500"
                            : transaction.status === "PENDING"
                                ? "bg-yellow-500/10 text-yellow-500"
                                : isDeposit
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-blue-500/10 text-blue-500"
                            }`}>
                            {transaction.status === "FAILED" ? (
                                <XCircle size={40} />
                            ) : transaction.status === "PENDING" ? (
                                <Clock size={40} />
                            ) : isDeposit ? (
                                <ArrowDownLeft size={40} />
                            ) : (
                                <ShoppingBag size={36} />
                            )}
                        </div>
                    </div>

                    <h2 className={`text-4xl font-black mb-2 tracking-tight ${transaction.status === "FAILED" ? "text-red-500" : "text-white print:text-black"
                        }`}>
                        {isDeposit ? "+" : "-"}₦{transaction.amount.toLocaleString()}
                    </h2>

                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">
                        {transaction.status}
                    </p>

                    <div className="space-y-4 bg-black/50 print:bg-gray-100/50 rounded-2xl p-6 text-left">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Description</span>
                            <span className="text-white print:text-black font-medium text-sm text-right px-2">{transaction.description || "N/A"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Reference</span>
                            <span className="text-white print:text-black font-mono text-sm">{transaction.reference || "N/A"}</span>
                            {/* Item Details Table */}
                            {transaction.items && transaction.items.length > 0 && (
                                <div className="mt-8 mb-6">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/20 print:border-black/20 text-xs text-gray-400 uppercase tracking-widest">
                                                <th className="py-2 print:text-black">Item</th>
                                                <th className="py-2 text-center print:text-black">Qty</th>
                                                <th className="py-2 text-right print:text-black">Price</th>
                                                <th className="py-2 text-right print:text-black">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-medium text-white print:text-black">
                                            {transaction.items.map((item, index) => (
                                                <tr key={index} className="border-b border-white/5 print:border-black/5">
                                                    <td className="py-3">{item.name}</td>
                                                    <td className="py-3 text-center">{item.qty}</td>
                                                    <td className="py-3 text-right">₦{item.price.toLocaleString()}</td>
                                                    <td className="py-3 text-right">₦{(item.price * item.qty).toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t-2 border-white/20 print:border-black/20 font-bold text-white print:text-black">
                                                <td colSpan="3" className="py-4 text-right pr-4 uppercase tracking-wider text-xs">Total Amount</td>
                                                <td className="py-4 text-right text-lg">₦{transaction.amount.toLocaleString()}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Transaction ID</span>
                            <span className="text-white print:text-black font-mono text-sm">#{transaction.id.toString().padStart(8, '0')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Date</span>
                            <span className="text-white print:text-black font-bold text-sm">{transaction.date}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">Type</span>
                            <span className="text-white print:text-black font-bold text-sm">{transaction.type}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-zinc-800 bg-black/30 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="w-full bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-black uppercase tracking-widest transition flex items-center justify-center gap-2"
                    >
                        <Printer size={18} />
                        Print Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailsModal;
