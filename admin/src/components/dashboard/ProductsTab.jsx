import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, X, UploadCloud } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { uploadToCloudinary } from "../../utils/upload";
import api from "../../api";

const STANDARD_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];

const ProductsTab = ({ products, setProducts }) => {
    const { notify } = useNotification();
    // --- State ---
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const [productForm, setProductForm] = useState({
        title: "",
        price: "",
        category: "",
        imageSrc: "",
        description: "",
        sizes: "",
        hasAllSizes: false,
        images: [],
        colors: [],
    });

    const [tempImage, setTempImage] = useState("");
    const [tempColorName, setTempColorName] = useState("");
    const [tempColorHex, setTempColorHex] = useState("#000000");

    // --- Pagination Helper ---
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

    // --- Actions ---
    const handleAddProduct = async (e) => {
        e.preventDefault();

        let finalSizes = [];
        if (productForm.hasAllSizes) {
            finalSizes = STANDARD_SIZES;
        } else {
            finalSizes = productForm.sizes
                .split(",")
                .map(s => s.trim())
                .filter(s => s !== "");

            if (finalSizes.length === 0) {
                finalSizes = ["38", "39", "40", "41", "42"];
            }
        }

        const productToSave = {
            id: editProduct ? editProduct.id : undefined,
            title: productForm.title,
            price: Number(productForm.price),
            category: productForm.category,
            imageSrc: productForm.imageSrc,
            description: productForm.description,
            rating: editProduct ? editProduct.rating : 5,
            sizes: finalSizes,
            colors: productForm.colors,
            images: productForm.images.length > 0 ? productForm.images : [productForm.imageSrc],
            reviews: editProduct ? editProduct.reviews : [],
            comments: editProduct ? editProduct.comments : [],
            stock: 15 // Default stock
        };

        try {
            let savedProduct;
            if (editProduct) {
                // Update
                const res = await api.put(`/products/${editProduct.id}`, productToSave);
                savedProduct = res.data;
                setProducts(products.map((p) => (p.id === savedProduct.id ? savedProduct : p)));
                notify("success", "Success", "Product updated successfully!");
            } else {
                // Create
                const res = await api.post("/products", productToSave);
                savedProduct = res.data;
                setProducts([savedProduct, ...products]);
                notify("success", "Success", "Product added successfully!");
            }
        } catch (error) {
            console.error("Failed to save product", error);
            notify("error", "Error", "Failed to save product");
            return;
        }

        setIsModalOpen(false);
        setEditProduct(null);
        resetForm();
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            notify("info", "Deleted", "Product deleted.");
        } catch (error) {
            console.error("Failed to delete product", error);
            notify("error", "Error", "Failed to delete product");
        }
    };

    const openEditModal = (product) => {
        setEditProduct(product);
        const hasAll = product.sizes && product.sizes.length === STANDARD_SIZES.length && product.sizes.every((val, index) => val === STANDARD_SIZES[index]);
        // Simple check for "All Sizes" might be tricky if order differs, but for now checking includes is safer or just checking length
        // The original code used a flag. Let's just join them.

        setProductForm({
            ...product,
            sizes: product.sizes ? product.sizes.join(", ") : "",
            hasAllSizes: false, // Default to false to show the input
            images: product.images || [product.imageSrc],
            colors: product.colors || []
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setProductForm({
            title: "",
            price: "",
            category: "",
            imageSrc: "",
            description: "",
            sizes: "",
            hasAllSizes: false,
            images: [],
            colors: [],
        });
        setTempImage("");
        setTempColorName("");
        setTempColorHex("#000000");
    };

    // --- Render ---
    return (
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
                    type="button"
                    onClick={() => {
                        setEditProduct(null);
                        resetForm();
                        setIsModalOpen(true);
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
                        {paginate(products.filter((p) =>
                            p.title.toLowerCase().includes(searchTerm.toLowerCase()),
                        ), currentPage).map((product) => (
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
                                <td className="p-6 flex gap-4">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="text-gray-400 hover:text-white font-bold text-sm underline flex items-center gap-1"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="text-red-500 hover:text-red-400 font-bold text-sm flex items-center gap-1"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <PaginationControls
                totalItems={products.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())).length}
                currentPage={currentPage}
                setPage={setCurrentPage}
            />

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                {editProduct ? "Edit Product" : "New Product"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddProduct} className="p-8 space-y-6">
                            {/* Image Upload */}
                            <div className="flex justify-center">
                                <div className="relative group cursor-pointer w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-gray-600 hover:border-white transition-colors">
                                    {productForm.imageSrc ? (
                                        <img src={productForm.imageSrc} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                            <UploadCloud size={24} />
                                            <span className="text-xs mt-2">Main Image</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const url = await uploadToCloudinary(file);
                                                if (url) setProductForm({ ...productForm, imageSrc: url });
                                            }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                                        value={productForm.title}
                                        onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Price (₦)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                                    <select
                                        className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                                        value={productForm.category}
                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Heels">Heels</option>
                                        <option value="Sneakers">Sneakers</option>
                                        <option value="Flats">Flats</option>
                                        <option value="Sandals">Sandals</option>
                                        <option value="Boots">Boots</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex justify-between">
                                        <span>Sizes</span>
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={productForm.hasAllSizes}
                                                onChange={(e) => setProductForm({ ...productForm, hasAllSizes: e.target.checked })}
                                                className="form-checkbox text-white bg-transparent border-gray-500 rounded focus:ring-0"
                                            />
                                            <span className="normal-case text-[10px] text-green-400">All Sizes (36-46)</span>
                                        </label>
                                    </label>
                                    <input
                                        type="text"
                                        disabled={productForm.hasAllSizes}
                                        className={`w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition ${productForm.hasAllSizes ? "opacity-50 cursor-not-allowed" : ""}`}
                                        placeholder="e.g. 38, 39, 40"
                                        value={productForm.hasAllSizes ? "All Sizes (36-46)" : productForm.sizes}
                                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition"
                                    rows="3"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                ></textarea>
                            </div>

                            {/* Colors Builder */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Colors</label>
                                <div className="flex gap-2 mb-2">
                                    <div className="flex-1 flex gap-2 items-center">
                                        <input
                                            type="text"
                                            placeholder="Color Name (e.g. Midnight Blue)"
                                            className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white flex-1"
                                            value={tempColorName}
                                            onChange={(e) => setTempColorName(e.target.value)}
                                        />
                                        <input
                                            type="color"
                                            className="w-10 h-10 cursor-pointer rounded-lg border border-white/20"
                                            value={/^#[0-9A-Fa-f]{6}$/.test(tempColorHex) ? tempColorHex : "#000000"}
                                            onInput={(e) => setTempColorHex(e.target.value)}
                                            onChange={(e) => setTempColorHex(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="#FF0000"
                                            className="bg-black border border-white/10 rounded-lg px-2 py-1.5 text-xs text-gray-300 w-20 font-mono"
                                            value={tempColorHex}
                                            onChange={(e) => setTempColorHex(e.target.value)}
                                            onBlur={(e) => {
                                                const val = e.target.value.toUpperCase();
                                                if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                                                    setTempColorHex(val);
                                                } else if (/^[0-9A-Fa-f]{6}$/.test(val)) {
                                                    setTempColorHex('#' + val);
                                                } else {
                                                    setTempColorHex('#000000');
                                                }
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (tempColorName) {
                                                setProductForm({
                                                    ...productForm,
                                                    colors: [...productForm.colors, { name: tempColorName, hex: tempColorHex }]
                                                });
                                                setTempColorName("");
                                                setTempColorHex("#000000");
                                            }
                                        }}
                                        className="bg-zinc-800 text-white px-4 rounded-lg text-xs font-bold hover:bg-zinc-700"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {productForm.colors?.map((color, idx) => (
                                        <span key={idx} className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full text-xs text-white">
                                            <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: color.hex }}></span>
                                            {color.name}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newColors = [...productForm.colors];
                                                    newColors.splice(idx, 1);
                                                    setProductForm({ ...productForm, colors: newColors });
                                                }}
                                                className="text-gray-500 hover:text-red-500 ml-1"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Images Gallery */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Gallery Images (Max 4)</label>
                                <div className="flex flex-wrap gap-4">
                                    {productForm.images?.filter(img => img !== productForm.imageSrc).map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newImages = productForm.images.filter(i => i !== img);
                                                    setProductForm({ ...productForm, images: newImages });
                                                }}
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    {(!productForm.images || productForm.images.length < 5) && (
                                        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-700 hover:border-white transition-colors flex flex-col items-center justify-center text-gray-500 cursor-pointer">
                                            <Plus size={20} />
                                            <span className="text-[10px] mt-1">Add</span>
                                            <input
                                                type="file"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const url = await uploadToCloudinary(file);
                                                        if (url) {
                                                            setProductForm({ ...productForm, images: [...productForm.images, url] });
                                                        }
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>


                            <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-white text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-gray-200 transition transform hover:scale-105"
                                >
                                    {editProduct ? "Update Product" : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsTab;
