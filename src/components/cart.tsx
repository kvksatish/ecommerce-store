/**
 * Cart Component
 *
 * Displays the user's shopping cart with:
 * - List of items with quantities
 * - Total price calculation
 * - Checkout button (only for logged-in users)
 * - Empty cart message
 */

"use client";

import { Cart as CartType, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useStore } from "@/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartProps {
  cart: CartType;
  onRemoveItem: (itemId: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onApplyDiscount: (code: string) => void;
  onCheckout: () => void;
}

function AvailableDiscountCodes({
  onApply,
}: {
  onApply: (code: string) => void;
}) {
  const [availableCodes, setAvailableCodes] = useState<
    Array<{ code: string; percentage: number }>
  >([]);
  const store = useStore();

  useEffect(() => {
    const unusedCodes = store.discountCodes.filter((code) => !code.isUsed);
    setAvailableCodes(unusedCodes);
  }, [store.discountCodes]);

  if (availableCodes.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark">
      <h4 className="font-medium mb-2">Available Discount Codes</h4>
      <div className="space-y-2">
        {availableCodes.map((code) => (
          <div
            key={code.code}
            className="flex items-center justify-between p-2 bg-background-light-secondary dark:bg-background-dark rounded-md"
          >
            <div>
              <span className="text-sm font-medium text-primary-color">
                {code.code}
              </span>
              <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                {code.percentage}% off your order
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onApply(code.code)}
            >
              Apply
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Cart() {
  const store = useStore();
  const router = useRouter();
  const [discountCode, setDiscountCode] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (!store.currentUser) {
      router.push("/login");
      return;
    }

    setIsCheckingOut(true);
    try {
      if (discountCode) {
        const success = await handleApplyDiscount(discountCode);
        if (!success) {
          setIsCheckingOut(false);
          return;
        }
      }
      const order = store.createOrder();
      if (order) {
        setOrderPlaced(true);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleApplyDiscount = (code: string) => {
    if (appliedDiscount) {
      setError("Only one coupon can be applied per order");
      return;
    }

    const discountCode = store.getDiscountCode(code);
    if (discountCode && !discountCode.isUsed) {
      setAppliedDiscount(code);
      const discountAmount = (store.cart.total * discountCode.percentage) / 100;
      store.cart.discountAmount = discountAmount;
      store.cart.finalTotal = store.cart.total - discountAmount;
      setError(null);
      setDiscountAmount(discountAmount);
      return true;
    } else {
      setError("Invalid or already used discount code");
      return false;
    }
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    store.cart.discountAmount = 0;
    store.cart.finalTotal = store.cart.total;
    setError(null);
    setDiscountAmount(0);
  };

  if (orderPlaced) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
          Order Placed Successfully!
        </h2>
        <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              setOrderPlaced(false);
              store.clearCart();
            }}
          >
            Start New Order
          </Button>
        </div>
      </div>
    );
  }

  if (store.cart.items.length === 0) {
    return (
      <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-text-light-secondary dark:text-text-dark-secondary mb-6">
          Add some products to your cart to get started.
        </p>
        <Link href="/">
          <Button variant="primary">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const subtotal = store.cart.total;
  const total = store.cart.finalTotal;

  return (
    <div className="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">
          Shopping Cart ({store.cart.items.length} items)
        </h2>
        <Button variant="outline" onClick={store.clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {store.cart.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-background-light-secondary dark:bg-background-dark-secondary rounded-lg"
          >
            <img
              src={item.product.image || "/fallback.jpg"}
              alt={item.product.name || "Product Image"}
              style={{
                width: "10rem",
                height: "10rem",
                objectFit: "cover",
                borderRadius: "0.375rem", // approx rounded-md
                border: "1px solid #e5e7eb", // light border (you can adjust this)
              }}
              // className="w-16 h-16 object-cover rounded border border-border-light dark:border-border-dark"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                ${item.product.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  store.updateCartItemQuantity(item.id, item.quantity - 1)
                }
              >
                -
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  store.updateCartItemQuantity(item.id, item.quantity + 1)
                }
              >
                +
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => store.removeFromCart(item.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Discount Code Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Discount Code</h3>
            <div className="space-y-2">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  disabled={appliedDiscount !== null}
                />
                {appliedDiscount ? (
                  <Button variant="danger" onClick={handleRemoveDiscount}>
                    Remove
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleApplyDiscount(discountCode);
                      setDiscountCode("");
                    }}
                    disabled={!discountCode.trim()}
                  >
                    Apply
                  </Button>
                )}
              </div>
              {error && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  {error}
                </p>
              )}
              {appliedDiscount && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Discount code applied successfully!
                </p>
              )}
            </div>

            {!appliedDiscount && (
              <AvailableDiscountCodes onApply={handleApplyDiscount} />
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountCode && (
                <>
                  <div className="flex justify-between">
                    <span>Discount Code</span>
                    <span>{discountCode}</span>
                  </div>
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount Amount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="border-t border-border-light dark:border-border-dark pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Single Checkout Button */}
            <div className="mt-6">
              {store.currentUser ? (
                <Button
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </Button>
              ) : (
                <Link href="/login" className="w-full">
                  <Button className="w-full">Login to Checkout</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
