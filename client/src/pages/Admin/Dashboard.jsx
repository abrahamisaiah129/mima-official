import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Plus,
  Search,
  Mail,
  Send,
  X,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  Edit2,
} from "lucide-react";
import { products as initialProducts } from "../../data/products";

// --- Mock Admin Data ---
const stats = [
  { label: "Total Revenue", value: "₦12,450,000", change: "+12%" },
  { label: "Active Orders", value: "24", change: "+4%" },
  { label: "Products", value: "156", change: "0%" },
  { label: "Customers", value: "1,203", change: "+18%" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form State
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    category: "",
    imageSrc: "",
    description: "",
  });

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: products.length + 1,
      ...productForm,
      price: Number(productForm.price),
      rating: 5,
    };

    if (editProduct) {
      setProducts(
        products.map((p) =>
          p.id === editProduct.id ? { ...newProduct, id: editProduct.id } : p,
        ),
      );
    } else {
      setProducts([newProduct, ...products]);
    }

    setIsProductModalOpen(false);
    setEditProduct(null);
    setProductForm({
      title: "",
      price: "",
      category: "",
      imageSrc: "",
      description: "",
    });
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setProductForm(product);
    setIsProductModalOpen(true);
  };

  // Mock Orders Data
  const orders = [
    {
      id: 10231,
      customer: "Sarah Jenkins",
      email: "sarah@gmail.com",
      items: 2,
      total: 45000,
      status: "Paid",
      date: "Oct 24, 2025",
    },
    {
      id: 10232,
      customer: "Mike Ross",
      email: "mike@suits.com",
      items: 1,
      total: 125000,
      status: "Pending",
      date: "Oct 24, 2025",
    },
    {
      id: 10233,
      customer: "Jessica Pearson",
      email: "jessica@pearson.com",
      items: 4,
      total: 280000,
      status: "Shipped",
      date: "Oct 23, 2025",
    },
    {
      id: 10234,
      customer: "Harvey Specter",
      email: "harvey@specter.com",
      items: 1,
      total: 500000,
      status: "Delivered",
      date: "Oct 22, 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex font-sans">
      {/* 1. Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col fixed h-full z-20 overflow-y-auto">
        <div className="p-8 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/MIMA-LOGO-PLACEHOLDER.png"
              alt="MIMA Logo"
              className="h-8 w-auto filter invert brightness-0"
            />
            <span className="font-bold text-xs tracking-[0.2em] text-gray-400">
              ADMIN
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {["dashboard", "products", "orders", "customers", "newsletter"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all capitalize ${activeTab === tab ? "bg-white text-black font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
              >
                {tab === "dashboard" && <LayoutDashboard size={20} />}
                {tab === "products" && <Package size={20} />}
                {tab === "orders" && <ShoppingBag size={20} />}
                {tab === "customers" && <Users size={20} />}
                {tab === "newsletter" && <Mail size={20} />}
                <span>{tab}</span>
              </button>
            ),
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">
              {activeTab}
            </h1>
            <p className="text-gray-500">Welcome back, Admin.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10">
              <Settings size={20} className="text-gray-400" />
            </div>
            <div className="w-10 h-10 rounded-full bg-white text-black font-bold flex items-center justify-center">
              AD
            </div>
          </div>
        </div>

        {/* Content Area Based on Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 border border-white/10 p-6 rounded-2xl"
                >
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-black text-white">
                    {stat.value}
                  </h3>
                  <span className="text-green-500 text-xs font-bold mt-2 block">
                    {stat.change} from last month
                  </span>
                </div>
              ))}
            </div>

            {/* Recent Activity Mockup */}
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Recent Orders</h3>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsOrderModalOpen(true);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items} items • ₦{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === "Paid"
                          ? "bg-green-500/10 text-green-500"
                          : order.status === "Pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-blue-500/10 text-blue-500"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-zinc-900 border border-white/10 rounded-full py-3 pl-10 pr-4 text-white w-64 focus:border-white transition-colors outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />
              </div>
              <button
                onClick={() => {
                  setEditProduct(null);
                  setProductForm({
                    title: "",
                    price: "",
                    category: "",
                    imageSrc: "",
                    description: "",
                  });
                  setIsProductModalOpen(true);
                }}
                className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-black/40 text-gray-400 font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-6">Product</th>
                    <th className="p-6">Category</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Stock</th>
                    <th className="p-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products
                    .filter((p) =>
                      p.title.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="p-6 flex items-center gap-4">
                          <img
                            src={product.imageSrc}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover bg-zinc-800"
                          />
                          <span className="font-bold text-white max-w-[200px] truncate">
                            {product.title}
                          </span>
                        </td>
                        <td className="p-6 text-gray-400">
                          {product.category || "Uncategorized"}
                        </td>
                        <td className="p-6 text-white font-mono">
                          ₦{product.price.toLocaleString()}
                        </td>
                        <td className="p-6">
                          <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold">
                            In Stock
                          </span>
                        </td>
                        <td className="p-6">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-gray-400 hover:text-white font-bold text-sm underline flex items-center gap-1"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="animate-fade-in space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-6 bg-zinc-900 border border-white/10 rounded-2xl cursor-pointer hover:border-white/30 transition"
                onClick={() => {
                  setSelectedOrder(order);
                  setIsOrderModalOpen(true);
                }}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white font-bold">
                    #{order.id.toString().slice(-3)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{order.customer}</h3>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-lg">
                    ₦{order.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{order.items} Items</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold ${
                    order.status === "Paid"
                      ? "bg-green-500/10 text-green-500"
                      : order.status === "Pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === "customers" && (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((customer, i) => (
              <div
                key={i}
                className="bg-zinc-900 border border-white/10 p-6 rounded-2xl flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold text-white">
                  {customer.customer.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {customer.customer}
                  </h4>
                  <p className="text-gray-400 text-sm">{customer.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">
                      VIP Tier
                    </span>
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NEWSLETTER TAB */}
        {activeTab === "newsletter" && (
          <div className="animate-fade-in max-w-4xl">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                Send Campaign
              </h2>
              <p className="text-gray-500 mb-8">
                Blast a new drop or promotion to all 1,203 subscribers.
              </p>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Campaign Sent Successfully!");
                }}
              >
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                    placeholder="e.g. FLASH SALE: 50% Off Everything!"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Message Content
                  </label>
                  <textarea
                    rows="6"
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                    placeholder="Write your email content here..."
                  ></textarea>
                </div>
                <button className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                  <Send size={18} /> Send Campaign
                </button>
              </form>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Recent Subscribers</h3>
              <div className="space-y-2">
                {[
                  "sarah.j@example.com",
                  "mike.shoes@test.com",
                  "fashion.lover@gmail.com",
                  "admin@mima.com",
                ].map((email, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5"
                  >
                    <span className="text-gray-300 font-mono">{email}</span>
                    <span className="text-xs text-gray-500">
                      Subscribed 2h ago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-white uppercase">
                {editProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Product Name
                  </label>
                  <input
                    required
                    value={productForm.title}
                    onChange={(e) =>
                      setProductForm({ ...productForm, title: e.target.value })
                    }
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                    placeholder="e.g. Velvet Stilettos"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                    Price (₦)
                  </label>
                  <input
                    required
                    type="number"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                    placeholder="50000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Category
                </label>
                <select
                  value={productForm.category}
                  onChange={(e) =>
                    setProductForm({ ...productForm, category: e.target.value })
                  }
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-white outline-none appearance-none"
                >
                  <option value="">Select Category</option>
                  <option value="Heels">Heels</option>
                  <option value="Sneakers">Sneakers</option>
                  <option value="Boots">Boots</option>
                  <option value="Flats">Flats</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Image URL
                </label>
                <input
                  required
                  value={productForm.imageSrc}
                  onChange={(e) =>
                    setProductForm({ ...productForm, imageSrc: e.target.value })
                  }
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:border-white outline-none"
                  placeholder="Product details..."
                ></textarea>
              </div>
              <button className="w-full bg-white text-black font-black uppercase py-4 rounded-xl hover:bg-gray-200 transition">
                {editProduct ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-3xl p-8 relative">
            <button
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white"
            >
              <X />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase">
                Order #{selectedOrder.id}
              </h2>
              <p className="text-gray-500">{selectedOrder.date}</p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl">
                <span className="text-gray-400 text-sm">Customer</span>
                <span className="font-bold text-white text-right">
                  {selectedOrder.customer}
                  <br />
                  <span className="text-xs text-gray-500 font-normal">
                    {selectedOrder.email}
                  </span>
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Order Summary
                </h4>
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span>₦{selectedOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Shipping</span>
                  <span>₦0.00</span>
                </div>
                <div className="border-t border-white/10 pt-2 flex justify-between text-white font-black text-lg">
                  <span>Total</span>
                  <span>₦{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 flex items-center justify-center gap-2">
                  <Truck size={18} /> Update Status
                </button>
                <button className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold hover:bg-zinc-700">
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
