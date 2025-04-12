/**
 * Header Component
 *
 * The main navigation header of the application.
 * Contains:
 * - Logo
 * - Navigation links (Products, Admin, My Coupons)
 * - Cart icon (hidden for admin users)
 * - Login/Logout button
 * - Theme toggle
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const router = useRouter();
  const { currentUser, logout, cart } = useStore();
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const isAdminUser = currentUser?.role === "admin";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-color to-secondary-color bg-clip-text text-transparent">
              Ecommerce Store
            </span>
          </Link>

          {/* All Navigation Items */}
          <div className="flex items-center gap-4">
            {/* Main Navigation Links */}
            {!isAdminUser && (
              <Link href="/">
                <Button variant="ghost" className="h-9">
                  Products
                </Button>
              </Link>
            )}
            {currentUser && !isAdminUser && (
              <Link href="/my-coupons">
                <Button variant="ghost" className="h-9">
                  My Coupons
                </Button>
              </Link>
            )}
            {isAdminUser && (
              <Link href="/admin">
                <Button variant="ghost" className="h-9">
                  Admin
                </Button>
              </Link>
            )}

            {/* Cart Icon */}
            {currentUser && !isAdminUser && (
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Login/Logout Button */}
            {currentUser ? (
              <Button variant="outline" onClick={handleLogout} className="h-9">
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="h-9">
                  Login
                </Button>
              </Link>
            )}

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
