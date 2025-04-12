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
import Image from "next/image";

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
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={500}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
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
