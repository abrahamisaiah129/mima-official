import React from "react";
import Card from "./Card"; // Updated import based on your list

const ProductGrid = ({ products, addToCart, className = "" }) => {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center ${className}`}
    >
      {products.map((product, index) => (
        <div
          key={product.id}
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
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
