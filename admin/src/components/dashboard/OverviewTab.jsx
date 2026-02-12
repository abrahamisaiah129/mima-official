import React from "react";
// forcing re-render
import { Package, ShoppingBag, TrendingUp } from "lucide-react";

const OverviewTab = ({ stats, orders, products, users, setActiveTab }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="p-8 bg-zinc-900 border border-white/10 rounded-3xl relative overflow-hidden group hover:border-white/30 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                            {index === 0 && <TrendingUp size={64} />}
                            {index === 1 && <ShoppingBag size={64} />}
                            {index === 2 && <Package size={64} />}
                        </div>
                        <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-2">
                            {stat.label}
                        </p>
                        <h3 className="text-4xl font-black text-white mb-2 tracking-tighter">
                            {stat.value}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-green-400 text-sm font-bold bg-green-400/10 px-2 py-1 rounded-md">
                                {stat.change}
                            </span>
                            <span className="text-gray-600 text-xs font-medium uppercase tracking-wide">
                                vs last month
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="p-8 bg-zinc-900 border border-white/10 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white tracking-tight">Recent Orders</h3>
                        <button className="text-sm text-gray-400 hover:text-white transition font-bold uppercase tracking-wider" onClick={() => setActiveTab('orders')}>
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {orders.slice(0, 4).map((order) => {
                            const orderUser = users.find(u =>
                                (order.user_id && u.id == order.user_id) ||
                                (order.email && u.email === order.email)
                            );
                            const customerName = orderUser ? (orderUser.name || `${orderUser.firstName} ${orderUser.lastName}`) : order.customer;

                            return (
                                <div
                                    key={order._id || order.id}
                                    className="flex items-center justify-between p-4 bg-black/40 rounded-xl hover:bg-black/60 transition cursor-pointer group"
                                >
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-white font-bold group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                                            #{(order.id || order._id || "").toString().slice(-3)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-white truncate">{customerName}</p>
                                            <p className="text-xs text-gray-500">{order.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <p className="font-bold text-white">₦{order.total.toLocaleString()}</p>
                                        <span
                                            className={`text-[10px] font-bold px-2 py-1 rounded-full ${order.status === "Delivered" ? "bg-green-500/10 text-green-500" :
                                                order.status === "Pending" ? "bg-yellow-500/10 text-yellow-500" : "bg-blue-500/10 text-blue-500"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className="p-8 bg-zinc-900 border border-white/10 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white tracking-tight">Top Products</h3>
                        <button className="text-sm text-gray-400 hover:text-white transition font-bold uppercase tracking-wider" onClick={() => setActiveTab('products')}>
                            View Inventory
                        </button>
                    </div>
                    <div className="space-y-4">
                        {products.slice(0, 4).map((product) => (
                            <div
                                key={product._id || product.id}
                                className="flex items-center gap-4 p-4 bg-black/40 rounded-xl hover:bg-black/60 transition cursor-pointer"
                            >
                                <img
                                    src={product.imageSrc}
                                    alt={product.title}
                                    className="w-12 h-12 rounded-lg object-cover bg-gray-800 shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white truncate">{product.title}</p>
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-white">₦{product.price.toLocaleString()}</p>
                                    <p className="text-xs text-gray-500">{product.stock || 15} Stock</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default OverviewTab;
