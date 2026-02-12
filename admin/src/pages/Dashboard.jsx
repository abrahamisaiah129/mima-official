import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { uploadToCloudinary } from "../utils/upload";
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
    Menu,
    Image, // Added for Banners
    UploadCloud, // Added for Cloudinary
    Printer, // Added for Order Receipt
    Instagram, // Added for Social Tab
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import OverviewTab from "../components/dashboard/OverviewTab";
import ProductsTab from "../components/dashboard/ProductsTab";
import OrdersTab from "../components/dashboard/OrdersTab";
import CustomersTab from "../components/dashboard/CustomersTab";
import BannersTab from "../components/dashboard/BannersTab";
import NewsletterTab from "../components/dashboard/NewsletterTab";
import SocialTab from "../components/dashboard/SocialTab";
import SearchTab from "../components/dashboard/SearchTab";
const STANDARD_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

// Stat calculation moved inside component for real-time updates

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
    const [products, setProducts] = useState([]); // Initialize empty
    const [users, setUsers] = useState([]); // Added users state
    const [subscribers, setSubscribers] = useState([]); // Added subscribers state

    // Fetch data function
    const fetchData = async () => {
        try {
            const [authRes, prodRes, subRes, ordRes] = await Promise.all([
                api.get("/users"),
                api.get("/products"),
                api.get("/newsletters"),
                api.get("/orders")
            ]);

            const usersData = authRes.data;
            const productsData = prodRes.data;
            const subData = subRes.data;
            const ordersData = ordRes.data;

            setUsers(usersData);
            setProducts(productsData);
            setSubscribers(Array.isArray(subData) ? subData : []);
            setOrders(Array.isArray(ordersData) ? ordersData : []);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    // Initial Fetch & Polling
    React.useEffect(() => {
        fetchData(); // Initial load
        const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // --- Cloudinary Config ---
    // REPLACE WITH YOUR DETAILS
    const CLOUD_NAME = "ddzpchp5x";
    const UPLOAD_PRESET = "mima_uploads";

    const handleLogout = () => {
        navigate("/login");
    };

    // --- Orders State ---
    const [orders, setOrders] = useState([]);




    const ITEMS_PER_PAGE = 5;

    // --- Real-time Stats Calculation ---
    const stats = useMemo(() => {
        // 1. Total Revenue
        const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

        // 2. Active Orders (Pending, Processing, Shipped)
        const activeOrdersCount = orders.filter(o =>
            ["Pending", "Processing", "Shipped"].includes(o.status)
        ).length;

        // 3. Products In Stock (Sum of all product stock)
        const totalStock = products.reduce((acc, p) => acc + (parseInt(p.stock) || 0), 0);

        // Mocking "Last Month" for percentage calculation
        const calculateChange = (current, baseline) => {
            if (baseline === 0) return "+100%";
            const change = ((current - baseline) / baseline) * 100;
            return `${change >= 0 ? "+" : ""}${change.toFixed(0)}%`;
        };

        return [
            {
                label: "Total Revenue",
                value: `₦${totalRevenue.toLocaleString()}`,
                change: "+12%" // Keeping static market trend
            },
            {
                label: "Active Orders",
                value: activeOrdersCount,
                change: calculateChange(activeOrdersCount, Math.max(0, activeOrdersCount - 2))
            },
            {
                label: "Products In Stock",
                value: totalStock,
                change: "+5%" // Static inventory growth
            }
        ];
    }, [orders, products]);

    // --- Pagination Helper ---
    const paginate = (data, page) => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    return (
        <div className="min-h-screen bg-black text-white flex font-sans">
            {/* 1. Sidebar */}
            {/* 1. Sidebar (Responsive) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-white/10 flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 md:static md:h-screen md:shrink-0`}
            >
                <div className="p-8 border-b border-white/10 flex justify-between items-center">
                    <a href="http://localhost:5173" className="flex items-center gap-2">
                        <img
                            src="/MIMA_New.png"
                            alt="MIMA Logo"
                            className="h-8 w-8 object-contain"
                        />
                        <span className="font-bold text-xs tracking-[0.2em] text-gray-400">
                            ADMIN
                        </span>
                    </a>
                    {/* Close Sidebar on Mobile */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {["dashboard", "products", "orders", "customers", "banners", "newsletter", "social", "search"].map(
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
                                {tab === "banners" && <Image size={20} />}
                                {tab === "newsletter" && <Mail size={20} />}
                                {tab === "social" && <Instagram size={20} />}
                                {tab === "search" && <Search size={20} />}
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
            <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden h-screen overflow-y-auto relative">
                {/* Header with Hamburger */}
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 bg-zinc-900 rounded-lg text-white border border-white/10"
                        >
                            <Menu size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight">
                                {activeTab}
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
                                Welcome back, Admin.
                            </p>
                        </div>
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
                    <OverviewTab stats={stats} orders={orders} products={products} users={users} setActiveTab={setActiveTab} />
                )}

                {/* Banners Tab */}
                {activeTab === "banners" && (
                    <BannersTab />
                )}
                {activeTab === "products" && (
                    <ProductsTab products={products} setProducts={setProducts} />
                )}

                {activeTab === "orders" && (
                    <OrdersTab orders={orders} users={users} products={products} setOrders={setOrders} />
                )}

                {/* CUSTOMERS TAB */}
                {
                    activeTab === "customers" && (
                        <CustomersTab users={users} subscribers={subscribers} refreshData={fetchData} />
                    )
                }

                {/* NEWSLETTER TAB */}
                {activeTab === "newsletter" && (
                    <NewsletterTab subscribers={subscribers} />
                )}
                {/* SOCIAL / INSTAGRAM TAB */}
                {activeTab === "social" && (
                    <SocialTab />
                )}

                {/* SEARCH TAB */}
                {activeTab === "search" && (
                    <SearchTab />
                )}
            </main >

            {/* Remaining Modals can be added here if needed, but currently fully extracted */}
        </div >
    );
};

export default Dashboard;
