/**
 * ProductCard Component
 *
 * Displays a single product with its details and add to cart functionality.
 * The card shows different actions based on user role and login status:
 * - Admin users: No add to cart button
 * - Logged-in users: Add to cart button
 * - Non-logged-in users: Login to add button
 */

import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/store/store";
import Link from "next/link";

// Props interface for the ProductCard component
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // Get current user and check if they're an admin
  const currentUser = useStore((state) => state.currentUser);
  const isAdminUser = currentUser?.role === "admin";

  return (
    <div className="product-card group bg-background-light dark:bg-background-dark rounded-lg overflow-hidden border border-border-light dark:border-border-dark hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      {/* Product Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Image overlay that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-4 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Price and Action Section */}
        <div className="flex items-center justify-between mt-auto">
          {/* Price and Shipping Badge */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary-color">
              ${product.price.toFixed(2)}
            </span>
            <Badge variant="primary" size="sm">
              Free Shipping
            </Badge>
          </div>

          {/* Add to Cart Button (only shown for non-admin users) */}
          {!isAdminUser && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {currentUser ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onAddToCart(product.id, 1)}
                >
                  Add to Cart
                </Button>
              ) : (
                <Link href="/login">
                  <Button variant="primary" size="sm">
                    Login to Add
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
