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

    // Helper to normalize cart data (Flatten populated product)
    const normalizeCart = (cartData) => {
        if (!cartData) return [];
        return cartData.map(item => {
            if (item.product && typeof item.product === 'object') {
                return {
                    ...item.product,
                    // Ensure we have both ID types for compatibility
                    id: item.product.id,
                    _id: item.product._id,
                    quantity: item.quantity,
                    selectedSize: item.selectedSize,
                    selectedColor: item.selectedColor
                };
            }
            return null;
        }).filter(Boolean);
    };

    useEffect(() => {
        if (user) {
            setCartItems(normalizeCart(user.cart || []));
            setWishlistItems(user.wishlist || []);
        } else {
            setCartItems([]);
            setWishlistItems([]);
        }
    }, [user]);

    // Wishlist Logic
    const toggleWishlist = async (product) => {
        if (!user) {
            notify("error", "Login Required", "Please login to use Wishlist.");
            return;
        }

        const productId = product._id || product.id;
        const exists = wishlistItems.some(item => (item._id || item) === productId || item.id === productId);

        try {
            if (exists) {
                const res = await api.delete(`/auth/${user._id}/wishlist/${productId}`);
                setWishlistItems(res.data);
                notify("info", "Removed from Wishlist", "Item removed.");
            } else {
                const res = await api.post(`/auth/${user._id}/wishlist/${productId}`);
                setWishlistItems(res.data);
                notify("success", "Added to Wishlist", "Saved for later.");
            }
        } catch (error) {
            console.error("Failed to toggle wishlist", error);
            notify("error", "Error", "Failed to update wishlist.");
        }
    };

    // Enhanced Add to Cart
    const addToCart = async (product) => {
        if (!user) {
            notify("error", "Login Required", "Please login to add items to cart.");
            return;
        }

        const productId = product._id || product.id;

        try {
            const res = await api.post(`/auth/${user._id}/cart/${productId}`, {
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

    const removeFromCart = async (productId, selectedSize, selectedColor) => {
        if (!user) return;

        try {
            // Build query params for specific removal if provided
            let url = `/auth/${user._id}/cart/${productId}`;
            if (selectedSize && selectedColor) {
                url += `?selectedSize=${selectedSize}&selectedColor=${encodeURIComponent(selectedColor)}`;
            }

            const res = await api.delete(url);
            setCartItems(normalizeCart(res.data));
            notify("info", "Item Removed", "Item removed from your cart.");
        } catch (error) {
            console.error("Failed to remove from cart", error);
            notify("error", "Error", "Failed to remove from cart.");
        }
    };

    const updateQuantity = async (productId, quantity, selectedSize, selectedColor) => {
        if (!user) return;
        try {
            const res = await api.put(`/auth/${user._id}/cart/${productId}`, {
                quantity,
                selectedSize,
                selectedColor
            });
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

    // ... (addFunds removed - handled by UserContext)

    return (
        <ShopContext.Provider value={{
            products,
            cartItems,
            wishlistItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleWishlist,
            processCheckout
        }}>
            {children}
        </ShopContext.Provider>
    );
};
