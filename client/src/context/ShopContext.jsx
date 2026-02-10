import React, { createContext, useContext, useState, useEffect } from "react";
import { useNotification } from "./NotificationContext";
import { useUser } from "./UserContext";
import api from "../api";

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const { notify } = useNotification();
    const { user, token, updateUser, loadUser } = useUser();

    // Initialize products state as empty
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get("/products");
                const data = res.data;
                if (data && Array.isArray(data)) {
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
                // Silent fail or notify user? Ideally show a global error state
            }
        };
        fetchProducts();
    }, []);

    // Initialize cart/wishlist from User Context
    const [cartItems, setCartItems] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);

    // Helper to normalize cart data
    const normalizeCart = (cartData) => {
        if (!cartData) return [];
        return cartData.map(item => {
            // Check if product is populated (object) or just ID
            if (item.product && typeof item.product === 'object' && item.product.title) {
                return {
                    ...item.product,
                    quantity: item.quantity,
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor
                };
            }
            // If it's just ID, try to find in local products
            if (products.length > 0) {
                const found = products.find(p => p.id === item.product || p._id === item.product);
                if (found) {
                    return {
                        ...found,
                        quantity: item.quantity,
                        selectedSize: item.selectedSize,
                        selectedColor: item.selectedColor
                    };
                }
            }
            return item;
        }).filter(item => item && item.title);
    };

    useEffect(() => {
        if (user) {
            const formattedCart = normalizeCart(user.cart || []);
            setCartItems(formattedCart);
            setWishlistItems(user.wishlist || []);
        } else {
            setCartItems([]);
            setWishlistItems([]);
        }
    }, [user, products]); // Re-run when products load to hydrate cart

    // Helper to find product _id from numeric id (if needed)
    const getProductId = (id) => {
        const found = products.find(p => p.id === id || p._id === id);
        return found ? found._id : id;
    };

    // Wishlist Logic
    const toggleWishlist = async (product) => {
        if (!user) {
            notify("error", "Login Required", "Please login to use Wishlist.");
            return;
        }

        const realId = getProductId(product.id);
        const exists = wishlistItems.find((item) => item._id === realId || item.id === product.id);

        // Optimistic update could be tricky with IDs, so let's rely on server response or careful state manip
        // But for now, let's just make the API call work.

        // Actually, the wishlist items in user context might be full objects or just IDs depending on population.
        // auth.js: returns user.wishlist (array of IDs usually, but let's check auth.js)
        // auth.js /:userId/wishlist/:productId returns user.wishlist (IDs)
        // ShopContext useEffect: setWishlistItems(user.wishlist || [])

        // Wait, if user.wishlist is just IDs, finding `item._id` won't work in `exists`.
        // Let's check how user is loaded. UserContext likely fetches /auth/me which might populate?
        // auth.js /me: `User.findOne...` (no populate). So user.wishlist is likely IDs (Strings/ObjectIds).

        if (exists || (wishlistItems.includes(realId) || wishlistItems.some(i => i._id === realId))) {
            try {
                await api.delete(`/auth/${user._id}/wishlist/${realId}`);
                setWishlistItems((prev) => prev.filter((item) => (item._id || item) !== realId));
                notify("info", "Removed from Wishlist", "Item removed.");
            } catch (error) {
                console.error("Failed to remove from wishlist", error);
                notify("error", "Error", "Failed to remove from wishlist.");
            }
        } else {
            try {
                await api.post(`/auth/${user._id}/wishlist/${realId}`);
                // We need to add the full product to state if we want to display it
                // But if wishlistState is just IDs, we add ID.
                // Let's assume for now it's mixed or we re-fetch user.
                // Simpler: Just refresh user or add what we have.
                setWishlistItems((prev) => [...prev, product]);
                notify("success", "Added to Wishlist", "Saved for later.");
            } catch (error) {
                console.error("Failed to add to wishlist", error);
                notify("error", "Error", "Failed to add to wishlist.");
            }
        }
    };

    // Enhanced Add to Cart
    const addToCart = async (product) => {
        if (!user) {
            notify("error", "Login Required", "Please login to add items to cart.");
            return;
        }

        const realId = getProductId(product.id);

        // Check live stock before adding
        const currentProduct = products.find(p => p.id === product.id || p._id === realId);
        if (currentProduct && currentProduct.stock <= 0) {
            notify("error", "Out of Stock", "Sorry, this item is currently unavailable.");
            return;
        }

        try {
            const res = await api.post(`/auth/${user._id}/cart/${realId}`, {
                quantity: product.quantity || 1,
                selectedSize: product.selectedSize,
                selectedColor: product.selectedColor
            });

            setCartItems(normalizeCart(res.data));
            notify("success", "Added to Cart", `${product.title || "Item"} added to your bag.`);
        } catch (error) {
            console.error("Failed to add to cart", error);
            notify("error", "Error", "Failed to add to cart.");
        }
    };

    const removeFromCart = async (productId) => {
        if (!user) return;
        const realId = getProductId(productId);

        try {
            const res = await api.delete(`/auth/${user._id}/cart/${realId}`);
            setCartItems(normalizeCart(res.data));
            notify("info", "Item Removed", "Item removed from your cart.");
        } catch (error) {
            console.error("Failed to remove from cart", error);
            notify("error", "Error", "Failed to remove from cart.");
        }
    };

    const updateQuantity = async (productId, quantity, selectedSize, selectedColor) => {
        if (!user) return;
        const realId = getProductId(productId);
        try {
            const res = await api.put(`/auth/${user._id}/cart/${realId}`, { quantity, selectedSize, selectedColor });
            setCartItems(normalizeCart(res.data));
        } catch (error) {
            console.error("Failed to update quantity", error);
            notify("error", "Error", "Failed to update quantity.");
        }
    };

    // Process Checkout Logic
    const processCheckout = async (paymentData = {}) => {
        try {
            const res = await api.post('/orders/cart', {
                userId: user._id,
                ...paymentData
            });
            if (res.status === 200 || res.status === 201) {
                setCartItems([]);
                notify("success", "Checkout Successful", "Your order has been placed.");
                // Refresh user data (balance, transactions, empty cart)
                await loadUser();
            } else {
                notify("error", "Checkout Failed", "An error occurred.");
            }
            return res.data;
        } catch (error) {
            console.error("Failed to process checkout", error);
            notify("error", "Error", error.response?.data?.error || "Failed to process checkout.");
            throw error;
        }
    };

    // ADD FUNDS
    const addFunds = async (amount) => {
        try {
            const res = await api.patch(`/users/${user._id}/add-funds`, { amount });
            if (res.status === 200) {
                updateUser(res.data);
                notify("success", "Funds Added", `Successfully added $${amount} to your account.`);
            } else {
                notify("error", "Failed to Add Funds", "An error occurred.");
            }
        } catch (error) {
            console.error("Failed to add funds", error);
            notify("error", "Error", error.response?.data?.message || "Failed to add funds.");
        }
    };

    return (
        <ShopContext.Provider value={{
            products,
            cartItems,
            wishlistItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleWishlist,
            processCheckout,
            addFunds
        }}>
            {children}
        </ShopContext.Provider>
    );
};
