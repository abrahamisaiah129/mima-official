import React from "react";
import Card from "./Card"; // Updated import based on your list

const ProductGrid = ({ products, addToCart, cartItems, removeFromCart, className = "", preSelectedSize, wishlistItems = [], toggleWishlist }) => {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center ${className}`}
    >
      {products.map((product, index) => (
        <div
          key={product.id || product._id || index}
          className="w-full flex justify-center animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Card
            title={product.title}
            description={product.description}
            id={product.id}
            imageSrc={product.imageSrc}
            price={product.price}
            rating={product.rating}
            sizes={product.sizes}
            colors={product.colors}
            addToCart={addToCart}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            preSelectedSize={preSelectedSize}
            isWishlisted={wishlistItems.some(item =>
              (item.id && item.id === product.id) ||
              (item._id && item._id === product._id) ||
              (item._id === product.id) ||
              (item.id === product._id)
            )}
            toggleWishlist={() => toggleWishlist(product)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
