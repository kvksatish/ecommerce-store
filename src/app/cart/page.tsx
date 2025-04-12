"use client";

import { useState } from "react";
import { useStore } from "@/store/store";
import { Header } from "@/components/header";
import { Cart } from "@/components/cart";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CartPage() {
  const store = useStore();
  const [notification, setNotification] = useState<string | null>(null);

  const handleRemoveFromCart = (itemId: string) => {
    store.removeFromCart(itemId);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    store.updateCartItemQuantity(itemId, quantity);
  };

  const handleApplyDiscount = (code: string) => {
    const isApplied = store.applyDiscountCode(code);

    if (!isApplied) {
      setNotification("Invalid or already used discount code");

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setNotification("Order placed successfully!");
      } else {
        setNotification(`Checkout failed: ${data.error}`);
      }

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      setNotification("An error occurred during checkout");

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
          Your Cart
        </h1>

        {notification && (
          <div className="mb-6 rounded-md bg-blue-50 p-4 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            {notification}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Cart
              cart={store.cart}
              onRemoveItem={handleRemoveFromCart}
              onUpdateQuantity={handleUpdateQuantity}
              onApplyDiscount={handleApplyDiscount}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
