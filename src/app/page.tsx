"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/store";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { Cart } from "@/components/cart";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const store = useStore();
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<
    "info" | "success" | "error"
  >("info");
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  const handleAddToCart = (productId: string, quantity: number) => {
    store.addToCart(productId, quantity);
    setNotification("Item added to cart");
    setNotificationType("success");

    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

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
      setNotificationType("error");

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } else {
      setNotification("Discount code applied successfully!");
      setNotificationType("success");

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const handleCheckout = async () => {
    try {
      const currentUser = store.currentUser;

      // Check if user is logged in
      if (!currentUser) {
        setNotification("Please login to checkout");
        setNotificationType("info");

        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);

        return;
      }

      // Create the order
      const order = store.createOrder();

      if (order) {
        const userOrderCount = store.getUserOrderCount(currentUser.id);
        const discountInterval = store.getDiscountInterval();

        // Check if this order qualifies for a discount code
        if (discountInterval > 0 && userOrderCount % discountInterval === 0) {
          // Get the most recently created discount code for this user
          const userCodes = store.getUserDiscountCodes(currentUser.id);
          const newestCode = userCodes.find((code) => !code.isUsed);

          if (newestCode) {
            setNotification(
              `Order placed successfully! You've earned a discount code: ${newestCode.code} for ${newestCode.percentage}% off your next order! View it in "My Coupons".`
            );
            setNotificationType("success");
          } else {
            setNotification("Order placed successfully!");
            setNotificationType("success");
          }
        } else {
          const ordersUntilDiscount =
            discountInterval - (userOrderCount % discountInterval);
          setNotification(
            `Order placed successfully! Place ${ordersUntilDiscount} more order${
              ordersUntilDiscount > 1 ? "s" : ""
            } to earn a discount code.`
          );
          setNotificationType("success");
        }
      } else {
        setNotification("Checkout failed: Empty cart");
        setNotificationType("error");
      }

      // Clear notification after 5 seconds (longer to read the discount code)
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      setNotification("An error occurred during checkout");
      setNotificationType("error");

      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const getNotificationClasses = () => {
    const baseClasses =
      "fixed top-6 right-6 z-50 rounded-lg shadow-lg p-4 max-w-sm transition-all duration-500 transform";

    if (!notification) {
      return `${baseClasses} opacity-0 translate-y-[-20px] pointer-events-none`;
    }

    const typeClasses = {
      info: "bg-primary-color/10 text-primary-color border-l-4 border-primary-color",
      success:
        "bg-success-color/10 text-success-color border-l-4 border-success-color",
      error:
        "bg-danger-color/10 text-danger-color border-l-4 border-danger-color",
    };

    return `${baseClasses} opacity-100 translate-y-0 ${typeClasses[notificationType]}`;
  };

  return (
    <div
      className={`min-h-screen transition-opacity duration-500 ${
        isPageLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <Header />

      <main className="main">
        <div className="container px-4 md:px-6">
          {/* Notification */}
          <div className={getNotificationClasses()}>
            <div className="flex items-center gap-2">
              {notificationType === "success" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              {notificationType === "error" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
              {notificationType === "info" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              )}
              {notification}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Products Section - Takes up 3/4 on large screens */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-8">
                <h1 className="section-title">Products</h1>
                <Badge variant="primary" size="lg" className="animate-pulse">
                  New Collection
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {store.products.map((product, index) => (
                  <div
                    key={product.id}
                    className="transition-all duration-500"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "forwards",
                      opacity: isPageLoaded ? 1 : 0,
                      transform: isPageLoaded
                        ? "translateY(0)"
                        : "translateY(20px)",
                      transition: `opacity 500ms ease ${
                        index * 100
                      }ms, transform 500ms ease ${index * 100}ms`,
                    }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Section - Takes up 1/4 on large screens */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
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
      </main>
    </div>
  );
}
