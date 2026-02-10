import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Trash2, Heart } from "lucide-react";
import Card from "./Card";
import { useShop } from "../context/ShopContext";

const Wishlist = () => {
    const { wishlistItems, toggleWishlist, addToCart, cartItems, removeFromCart } = useShop();

    if (!wishlistItems || wishlistItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <Heart size={32} />
                </div>
                <h2 className="text-2xl font-black text-white mb-4">
                    Your Wishlist is Empty
                </h2>
                <p className="text-gray-500 mb-8">
                    Save items you love to buy them later.
                </p>
                <Link
                    to="/shop"
                    className="bg-white text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center space-x-2 mb-8">
                <Link to="/shop" className="text-gray-400 hover:text-white transition">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                    Your Wishlist ({wishlistItems.length})
                </h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-[2px] gap-y-6 sm:gap-6">
                {wishlistItems.map((item) => (
                    <Card
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        description={item.description}
                        imageSrc={item.imageSrc}
                        price={item.price}
                        rating={item.rating}
                        sizes={item.sizes}
                        colors={item.colors}
                        addToCart={addToCart}
                        cartItems={cartItems}
                        removeFromCart={removeFromCart}
                        isWishlisted={true}
                        toggleWishlist={() => toggleWishlist(item)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
