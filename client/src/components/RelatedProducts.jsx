import React from "react";
import { Link } from "react-router-dom";
import Card from "./Card";

const RelatedProducts = ({ products, currentId, addToCart }) => {
  // Guard against undefined products
  if (!products || products.length === 0) return null;

  // Filter out current product and get random 3
  const related = products
    .filter((p) => p.id !== currentId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="py-16 border-t border-white/5">
      <div className="flex items-end justify-between mb-10">
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
          You May Also Like
        </h2>
        <Link
          to="/shop"
          className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest underline decoration-white/20 hover:decoration-white transition-all"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {related.map((product) => (
          <Card key={product.id} {...product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
