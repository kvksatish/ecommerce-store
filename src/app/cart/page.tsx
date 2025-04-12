"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/store";
import { Cart } from "@/components/cart";
import { Header } from "@/components/header";

export default function CartPage() {
  const store = useStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemoveFromCart = (itemId: string) => {
    store.removeFromCart(itemId);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    store.updateCartItemQuantity(itemId, quantity);
  };

  const handleApplyDiscount = (code: string) => {
    return store.applyDiscountCode(code);
  };

  const handleCheckout = async () => {
    const order = store.createOrder();
    if (!order) {
      throw new Error("Failed to create order");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
      </div>
    </div>
  );
}
