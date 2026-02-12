import React, { useState, useMemo } from "react";
import { ShoppingBag, Printer, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../api";
import { useNotification } from "../../context/NotificationContext";

const OrdersTab = ({ orders, users, products, setOrders }) => {
    const { notify } = useNotification();
    // --- State ---
    const [orderTab, setOrderTab] = useState("All"); // All, Pending, Delivered
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [statusUpdateOrder, setStatusUpdateOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    // --- Helpers ---
    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-yellow-500/10 text-yellow-500";
            case "Processing": return "bg-blue-500/10 text-blue-500";
            case "Shipped": return "bg-purple-500/10 text-purple-500";
            case "Delivered": return "bg-green-500/10 text-green-500";
            case "Cancelled": return "bg-red-500/10 text-red-500";
            default: return "bg-gray-500/10 text-gray-500";
        }
    };

    const handleStatusUpdate = async (orderId, status) => {
        try {
            const res = await api.patch(`/orders/${orderId}/status`, { status });
            const updatedOrder = res.data || { ...orders.find(o => o._id === orderId), status };
            const newOrders = orders.map(order =>
                order._id === orderId ? updatedOrder : order
            );
            setOrders(newOrders);
            notify("success", "Updated", `Order status set to ${status}`);
        } catch (error) {
            console.error("Failed to update status", error);
            notify("error", "Error", "Failed to update order status");
        }
    };

    const confirmStatusUpdate = () => {
        if (statusUpdateOrder && newStatus) {
            handleStatusUpdate(statusUpdateOrder._id, newStatus);
            setIsStatusModalOpen(false);
            setStatusUpdateOrder(null);
        }
    };

    // --- Pagination ---
    const filteredOrders = useMemo(() => {
        if (orderTab === "All") return orders;
        if (orderTab === "Pending") return orders.filter(o => ["Pending", "Processing", "pending", "processing"].includes(o.status));
        if (orderTab === "Delivered") return orders.filter(o => ["Delivered", "Cancelled", "delivered", "cancelled", "shipped", "Shipped"].includes(o.status));
        return orders;
    }, [orders, orderTab]);

    const paginate = (data, page) => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const PaginationControls = ({ totalItems, currentPage, setPage }) => {
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (totalPages <= 1) return null;

        return (
            <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-zinc-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-zinc-700 transition"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-500">
                    Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
                </span>
                <button
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-zinc-800 rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-zinc-700 transition"
                >
                    Next
                </button>
            </div>
        );
    };

    // --- Receipt Generator ---
    const generateReceipt = (order) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.text("MIMA Store Receipt", 105, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text("Official Receipt", 105, 30, { align: "center" });

        // Resolve User
        // Resolve User
        const orderUser = users.find(u =>
            (order.user && (u._id === order.user || u._id === order.user.toString())) ||
            (order.email && u.email === order.email)
        );

        // Priority: Shipping Details -> User Profile -> Email/Guest
        const shippingName = order.shippingDetails?.firstName ? `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}` : null;
        const customerName = shippingName || (orderUser ? (orderUser.name || `${orderUser.firstName || ''} ${orderUser.lastName || ''}`.trim()) : (order.email || 'Guest'));

        const customerEmail = orderUser ? orderUser.email : order.email;
        const customerPhone = order.shippingDetails?.phone || (orderUser ? orderUser.phone : '');
        const customerAddress = order.shippingDetails?.address ?
            `${order.shippingDetails.address}, ${order.shippingDetails.city || ''} ${order.shippingDetails.state || ''}` :
            (orderUser?.address || "N/A");

        // Metadata
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Customer: ${customerName}`, 14, 40);
        doc.text(`Email: ${customerEmail}`, 14, 45);
        doc.text(`Phone: ${customerPhone || "N/A"}`, 14, 50);
        doc.text(`Address: ${customerAddress}`, 14, 55);
        doc.text(`Order ID: #${order._id}`, 14, 62);
        doc.text(`Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}`, 14, 67);

        // Table
        const tableColumn = ["Item", "Quantity", "Price"];
        const tableRows = [];

        // Handle both legacy items array and new product_id array
        if (order.product_id && Array.isArray(order.product_id)) {
            order.product_id.forEach((pid, index) => {
                const product = products.find(p => p.id == pid);
                const qty = order.quantity ? order.quantity[index] : 1;
                const price = order.price ? order.price[index] : (product ? product.price : 0);
                tableRows.push([
                    product ? product.title : `Product #${pid}`,
                    String(qty),
                    `₦${price.toLocaleString()}`
                ]);
            });
        } else if (Array.isArray(order.items) && order.items.length > 0) {
            order.items.forEach(item => {
                tableRows.push([
                    item.title,
                    "1",
                    `₦${item.price ? item.price.toLocaleString() : "0"}`
                ]);
            });
        } else {
            tableRows.push(["Order Item", "x ITEMS", `₦${order.total.toLocaleString()}`]);
        }


        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 65,
            theme: 'striped',
            headStyles: { fillColor: [0, 0, 0] },
        });

        // Total
        const finalY = doc.lastAutoTable.finalY || 65;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Total: ₦${order.total.toLocaleString()}`, 140, finalY + 20);

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Thank you for shopping with MIMA!", 105, 280, { align: "center" });

        doc.save(`receipt-order-${order._id}.pdf`);
    };

    return (
        <div className="animate-fade-in space-y-4">
            {/* Order Tabs */}
            <div className="flex gap-4 mb-6">
                {["All", "Pending", "Delivered"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setOrderTab(tab);
                            setCurrentPage(1); // Reset page on tab change
                        }}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${orderTab === tab
                            ? "bg-white text-black"
                            : "bg-zinc-900 text-gray-400 hover:text-white border border-white/10"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {paginate(filteredOrders, currentPage).map((order) => {
                const orderUser = users.find(u =>
                    (order.user && (u._id === order.user || u._id === order.user?.toString())) ||
                    (order.email && u.email === order.email)
                );

                const customerName = orderUser ? (orderUser.name || orderUser.fullName || `${orderUser.firstName || ""} ${orderUser.lastName || ""}`.trim() || "Unknown User") : (order.email || "Guest");
                const displayEmail = orderUser ? orderUser.email : (order.email || (order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''));

                return (
                    <div
                        key={order._id}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 bg-zinc-900 border border-white/10 rounded-2xl cursor-pointer hover:border-white/30 transition gap-4 md:gap-0"
                        onClick={() => {
                            setSelectedOrder(order);
                            setIsOrderModalOpen(true);
                        }}
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                #{order._id.toString().slice(-4)}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{customerName}</h3>
                                <p className="text-sm text-gray-500">{displayEmail}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-white text-lg">
                                ₦{(order.total || 0).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">{Array.isArray(order.items) ? order.items.length : 1} Items</p>
                        </div>
                        <span
                            className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(order.status)} hover:opacity-80`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setStatusUpdateOrder(order);
                                setNewStatus(order.status);
                                setIsStatusModalOpen(true);
                            }}
                        >
                            {order.status}
                        </span>
                    </div>
                );
            })}
            <PaginationControls
                totalItems={filteredOrders.length}
                currentPage={currentPage}
                setPage={setCurrentPage}
            />

            {/* STATUS UPDATE MODAL */}
            {isStatusModalOpen && statusUpdateOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 w-full max-w-sm rounded-3xl p-8">
                        <h2 className="text-xl font-black text-white uppercase mb-4">Update Order Status</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Change status for Order #{statusUpdateOrder._id?.toString().slice(-6)}
                        </p>

                        <div className="space-y-2 mb-8">
                            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setNewStatus(status)}
                                    className={`w-full p-3 rounded-xl text-left font-bold transition-all border ${newStatus === status
                                        ? "bg-white text-black border-white"
                                        : "bg-black/40 text-gray-400 border-white/5 hover:bg-white/5"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                                className="flex-1 px-4 py-3 bg-zinc-800 rounded-xl font-bold text-gray-400 hover:text-white transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmStatusUpdate}
                                className="flex-1 px-4 py-3 bg-white text-black rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ORDER DETAILS MODAL (Receipt Style) */}
            {isOrderModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:block print:bg-white print:static">

                    {/* Print Styles */}
                    <style>{`
                        @media print {
                            body * { visibility: hidden; }
                            #admin-receipt, #admin-receipt * { visibility: visible; }
                            #admin-receipt { 
                                position: absolute; left: 0; top: 0; width: 100%; 
                                border: none; box-shadow: none; background: white; color: black; 
                            }
                            .no-print { display: none !important; }
                        }
                    `}</style>

                    <div id="admin-receipt" className="bg-zinc-900 border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">

                        {/* Header */}
                        <div className="p-6 flex justify-between items-center border-b border-white/10 no-print">
                            <h3 className="text-white text-lg font-black uppercase tracking-wide">
                                Order Details
                            </h3>
                            <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-400 hover:text-white transition">
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
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${selectedOrder.status === "Paid" || selectedOrder.status === "Delivered" ? "bg-green-500/10 text-green-500" :
                                    selectedOrder.status === "Pending" ? "bg-yellow-500/10 text-yellow-500" : "bg-blue-500/10 text-blue-500"
                                    }`}>
                                    <ShoppingBag size={36} />
                                </div>
                            </div>

                            <h2 className="text-4xl font-black text-white mb-2 tracking-tight print:text-black">
                                ₦{selectedOrder.total.toLocaleString()}
                            </h2>
                            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-8">
                                {selectedOrder.status}
                            </p>

                            <div className="space-y-4 bg-black/50 print:bg-gray-100/50 rounded-2xl p-6 text-left">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-500 text-sm">Customer</span>
                                    <span className="text-white print:text-black font-medium text-sm text-right">{selectedOrder.shippingDetails?.firstName ? `${selectedOrder.shippingDetails.firstName} ${selectedOrder.shippingDetails.lastName}` : (selectedOrder.email || 'Guest')}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-500 text-sm">Email</span>
                                    <span className="text-white print:text-black font-mono text-sm">{selectedOrder.email}</span>
                                </div>
                                {(() => {
                                    // Resolve User for Fallback
                                    const orderUser = users.find(u =>
                                        (selectedOrder.user && (u._id === selectedOrder.user || u._id === selectedOrder.user.toString())) ||
                                        (selectedOrder.email && u.email === selectedOrder.email)
                                    );
                                    const phone = selectedOrder.shippingDetails?.phone || (orderUser ? orderUser.phone : 'N/A');
                                    const address = selectedOrder.shippingDetails?.address ?
                                        `${selectedOrder.shippingDetails.address}, ${selectedOrder.shippingDetails.city || ''}, ${selectedOrder.shippingDetails.state || ''}`
                                        : (orderUser?.address || "N/A");

                                    return (
                                        <>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-gray-500 text-sm">Phone</span>
                                                <span className="text-white print:text-black font-mono text-sm">{phone}</span>
                                            </div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-gray-500 text-sm">Address</span>
                                                <span className="text-white print:text-black font-medium text-sm text-right px-2 max-w-[200px]">
                                                    {address}
                                                </span>
                                            </div>
                                        </>
                                    );
                                })()}

                                {/* Items Table */}
                                <div className="mt-6 mb-4">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/20 print:border-black/20 text-xs text-gray-400 uppercase tracking-widest">
                                                <th className="py-2 print:text-black">Item</th>
                                                <th className="py-2 text-center print:text-black">Qty</th>
                                                <th className="py-2 text-right print:text-black">Price</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-medium text-white print:text-black">
                                            {selectedOrder.product_id && Array.isArray(selectedOrder.product_id) ? (
                                                selectedOrder.product_id.map((pid, index) => {
                                                    const product = products.find(p => p.id == pid);
                                                    const qty = selectedOrder.quantity ? selectedOrder.quantity[index] : 1;
                                                    const price = selectedOrder.price ? selectedOrder.price[index] : (product ? product.price : 0);

                                                    return (
                                                        <tr key={index} className="border-b border-white/5 print:border-black/5">
                                                            <td className="py-3 flex items-center gap-3">
                                                                {product && <img src={product.imageSrc} alt="" className="w-10 h-10 rounded object-cover bg-gray-800" />}
                                                                <span className="truncate max-w-[150px]">{product ? product.title : `Product #${pid}`}</span>
                                                            </td>
                                                            <td className="py-3 text-center">{qty}</td>
                                                            <td className="py-3 text-right">₦{price.toLocaleString()}</td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                Array.isArray(selectedOrder.items) && selectedOrder.items.map((item, index) => (
                                                    <tr key={index} className="border-b border-white/5 print:border-black/5">
                                                        <td className="py-3 max-w-[120px] truncate">{item.title}</td>
                                                        <td className="py-3 text-center">1</td>
                                                        <td className="py-3 text-right">₦{item.price ? item.price.toLocaleString() : "0"}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                    <span className="text-gray-500 text-sm">Order ID</span>
                                    <span className="text-white print:text-black font-mono text-xs">#{selectedOrder._id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 text-sm">Date</span>
                                    <span className="text-white print:text-black font-bold text-sm">{selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-white/10 bg-black/30 print:hidden flex gap-2">
                            <button
                                onClick={() => {
                                    setStatusUpdateOrder(selectedOrder);
                                    setNewStatus(selectedOrder.status);
                                    setIsStatusModalOpen(true);
                                    setIsOrderModalOpen(false);
                                }}
                                className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700 transition"
                            >
                                Change Status
                            </button>
                            <button
                                onClick={() => generateReceipt(selectedOrder)}
                                className="flex-1 bg-white hover:bg-gray-200 text-black py-3 rounded-xl font-black uppercase tracking-widest transition flex items-center justify-center gap-2"
                            >
                                <Printer size={18} /> PDF Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersTab;
