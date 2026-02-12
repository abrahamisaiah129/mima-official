import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard, Clock, XCircle, AlertTriangle, CheckCircle } from "lucide-react";
import api from "../api";
import { useNotification } from "../context/NotificationContext";

const OrderDetails = () => {
    const { id } = useParams();
    const { notify } = useNotification();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data);
        } catch (err) {
            console.error("Failed to fetch order", err);
            notify("error", "Error", "Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")) return;

        setCancelling(true);
        try {
            await api.put(`/orders/${id}/cancel`);
            notify("success", "Cancelled", "Order cancelled successfully.");
            fetchOrder(); // Refresh data
        } catch (err) {
            console.error("Cancel failed", err);
            notify("error", "Error", err.response?.data?.error || "Failed to cancel order");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <AlertTriangle size={48} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Order Not Found</h1>
                <Link to="/shop" className="text-gray-400 hover:text-white underline">Return to Shop</Link>
            </div>
        );
    }

    const isCancellable = ['Pending', 'Processing', 'pending', 'processing'].includes(order.status);

    return (
        <div className="min-h-screen bg-black text-white pt-32 px-4 pb-20">
            <div className="max-w-3xl mx-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/track-order" className="p-2 bg-zinc-900 rounded-full text-gray-400 hover:text-white transition">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                            Order Details
                        </h1>
                        <p className="text-gray-500 text-sm">#{order._id}</p>
                    </div>
                    <div className="ml-auto">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === 'Delivered' ? 'bg-green-500 text-black' :
                                order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                    'bg-blue-500 text-white'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Items Card */}
                <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden mb-6">
                    <div className="p-6 border-b border-white/5 flex items-center gap-3">
                        <Package size={20} className="text-gray-400" />
                        <h2 className="font-bold text-lg">Items</h2>
                    </div>
                    <div className="divide-y divide-white/5">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-white">{item.title}</p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                                    </p>
                                </div>
                                <p className="font-bold text-white">₦{item.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 bg-black/20 flex justify-between items-center">
                        <span className="text-gray-400 font-bold uppercase text-sm tracking-wider">Total Amount</span>
                        <span className="text-xl font-black text-white">₦{order.total.toLocaleString()}</span>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Shipping */}
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                            <MapPin size={20} />
                            <h3 className="font-bold uppercase text-sm tracking-wider">Shipping Details</h3>
                        </div>
                        {order.shippingDetails ? (
                            <div className="text-sm space-y-1">
                                <p className="font-bold text-white">{order.shippingDetails.firstName} {order.shippingDetails.lastName}</p>
                                <p className="text-gray-400">{order.shippingDetails.address}</p>
                                <p className="text-gray-400">{order.shippingDetails.city}, {order.shippingDetails.state}</p>
                                <p className="text-gray-400">{order.shippingDetails.phone}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No shipping details provided (Digital/Pickup)</p>
                        )}
                    </div>

                    {/* Payment */}
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-3 mb-4 text-gray-400">
                            <CreditCard size={20} />
                            <h3 className="font-bold uppercase text-sm tracking-wider">Payment Info</h3>
                        </div>
                        <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Method</span>
                                <span className="text-white capitalize font-medium">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-500' : 'text-yellow-500'
                                    }`}>{order.paymentStatus}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Date</span>
                                <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {isCancellable && (
                    <div className="flex justify-end">
                        <button
                            onClick={handleCancelOrder}
                            disabled={cancelling}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl font-bold uppercase tracking-widest flex items-center gap-2 transition disabled:opacity-50"
                        >
                            {cancelling ? 'Processing...' : (
                                <>
                                    <XCircle size={18} /> Cancel Order
                                </>
                            )}
                        </button>
                    </div>
                )}

                {order.status === 'Cancelled' && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 text-red-400">
                        <AlertTriangle size={18} />
                        <span className="font-bold">This order has been cancelled.</span>
                        {order.paymentMethod === 'wallet' && <span className="text-xs ml-2">(Funds refunded to wallet)</span>}
                    </div>
                )}

            </div>
        </div>
    );
};

export default OrderDetails;
