import React, { useState } from "react";
import PaginationControls from "../common/PaginationControls";
import { X, Trash2, Phone, MapPin, Mail, CreditCard, Shield } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import api from "../../api";

const CustomersTab = ({ users, subscribers, refreshData }) => {
    const { notify } = useNotification();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const ITEMS_PER_PAGE = 5;

    const paginate = (data, page) => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setIsDeleting(true);
        try {
            await api.delete(`/users/${selectedUser._id}`);
            notify("success", "User Deleted", `${selectedUser.firstName || "User"} has been deleted.`);
            setShowDeleteConfirm(false);
            setSelectedUser(null);
            if (refreshData) refreshData();
        } catch (error) {
            console.error("Delete failed", error);
            notify("error", "Error", error.response?.data?.message || "An error occurred while deleting.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="animate-fade-in relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginate(users, currentPage).map((user, i) => (
                    <div
                        key={i}
                        onClick={() => setSelectedUser(user)}
                        className="bg-zinc-900 border border-white/10 p-6 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-zinc-800 transition group"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-white uppercase group-hover:scale-105 transition-transform">
                            {(user.name || user.fullName || user.firstName || user.email || "?").charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-white capitalize">
                                {user.name || user.fullName || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Unknown User")}
                            </h4>
                            <p className="text-gray-400 text-sm mb-1">{user.email}</p>
                            <p className="text-gray-500 text-xs mb-2 truncate max-w-[200px]">
                                {user.phone || "No Phone"} • {user.address || "No Address"}
                            </p>
                            <div className="flex gap-2">
                                {Array.isArray(subscribers) && subscribers.includes(user.email) && (
                                    <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20 shadow-sm shadow-purple-500/10">
                                        VIP Tier
                                    </span>
                                )}
                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">
                                    Member
                                </span>
                                {user.balance > 0 && (
                                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                                        Balance: ₦{user.balance.toLocaleString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <PaginationControls
                totalItems={users.length}
                currentPage={currentPage}
                setPage={setCurrentPage}
                itemsPerPage={ITEMS_PER_PAGE}
            />

            {/* Lightbox / Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-slide-up">
                        <button
                            onClick={() => { setSelectedUser(null); setShowDeleteConfirm(false); }}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-white hover:text-black rounded-full transition z-10 text-white"
                        >
                            <X size={20} />
                        </button>

                        {/* Header / Avatar */}
                        <div className="h-32 bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative">
                            <div className="absolute -bottom-10 left-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-zinc-900 shadow-xl">
                                    {(selectedUser.name || selectedUser.fullName || selectedUser.firstName || selectedUser.email || "?").charAt(0)}
                                </div>
                            </div>
                        </div>

                        <div className="pt-14 px-8 pb-8 space-y-6">
                            {/* User Info */}
                            <div>
                                <h2 className="text-2xl font-bold text-white capitalize">
                                    {selectedUser.name || selectedUser.fullName || (selectedUser.firstName && selectedUser.lastName ? `${selectedUser.firstName} ${selectedUser.lastName}` : "Unknown User")}
                                </h2>
                                <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                                    <Mail size={14} />
                                    {selectedUser.email}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-xl">
                                    <Phone size={18} className="text-gray-500" />
                                    <span className="text-sm">{selectedUser.phone || "No Phone Number"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-xl">
                                    <MapPin size={18} className="text-gray-500" />
                                    <span className="text-sm">{selectedUser.address || "No Address Provided"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-xl">
                                    <CreditCard size={18} className="text-gray-500" />
                                    <span className="text-sm font-bold">Balance: ₦{(selectedUser.balance || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300 bg-white/5 p-3 rounded-xl">
                                    <Shield size={18} className="text-gray-500" />
                                    <span className="text-sm capitalize">Role: {selectedUser.role || "User"}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-white/10">
                                {!showDeleteConfirm ? (
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="w-full py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Delete User
                                    </button>
                                ) : (
                                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-3 animate-fade-in">
                                        <p className="text-red-400 text-sm font-bold text-center">
                                            Are you sure? This action cannot be undone.
                                        </p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowDeleteConfirm(false)}
                                                className="flex-1 py-2 bg-black/50 text-white rounded-lg text-sm font-bold hover:bg-white/10 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDeleteUser}
                                                disabled={isDeleting}
                                                className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition disabled:opacity-50"
                                            >
                                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersTab;
