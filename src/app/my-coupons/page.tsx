"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/store";
import { Header } from "@/components/header";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiscountCode } from "@/types";

export default function MyCouponsPage() {
  const router = useRouter();
  const store = useStore();
  const currentUser = store.currentUser;
  const [coupons, setCoupons] = useState<DiscountCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // If not logged in, redirect to login page
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else {
      // Fetch user's discount codes
      const userDiscountCodes = currentUser
        ? store.getUserDiscountCodes(currentUser.id)
        : [];
      setCoupons(userDiscountCodes);
      setIsLoading(false);
    }
  }, [currentUser, router, store]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="main">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="section-title mb-8">My Coupons</h1>

            <Card variant="default">
              <CardHeader className="border-b border-border-light dark:border-border-dark pb-3">
                <CardTitle>Available Discount Codes</CardTitle>
              </CardHeader>
              <CardContent className="py-6">
                {isLoading ? (
                  <div className="py-8 text-center text-text-light-secondary dark:text-text-dark-secondary">
                    Loading your coupons...
                  </div>
                ) : coupons.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mb-4 text-text-light-secondary dark:text-text-dark-secondary opacity-50"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                      </svg>
                      <p className="text-text-light-secondary dark:text-text-dark-secondary mb-4">
                        You don&apos;t have any discount codes yet.
                      </p>
                      <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                        Place an order to earn discount codes!
                      </p>
                      <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-2">
                        Every{" "}
                        <span className="font-bold">
                          {store.getDiscountInterval()}
                        </span>{" "}
                        order(s) earns you a 10% discount code.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/")}
                        className="mt-6"
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coupons
                      .filter((code) => !code.isUsed)
                      .map((coupon) => (
                        <div
                          key={coupon.code}
                          className="flex items-center justify-between p-4 bg-background-light-secondary dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{coupon.code}</h3>
                              <Badge variant="success">Active</Badge>
                            </div>
                            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                              {coupon.percentage}% off your next order
                            </p>
                          </div>
                          <Button
                            onClick={() => router.push("/cart")}
                            variant="primary"
                            size="sm"
                          >
                            Use Now
                          </Button>
                        </div>
                      ))}

                    {coupons.some((code) => code.isUsed) && (
                      <div className="mt-8 pt-4 border-t border-border-light dark:border-border-dark">
                        <h3 className="font-medium mb-4 text-text-light-secondary dark:text-text-dark-secondary">
                          Used Coupons
                        </h3>
                        {coupons
                          .filter((code) => code.isUsed)
                          .map((coupon) => (
                            <div
                              key={coupon.code}
                              className="flex items-center justify-between p-4 bg-background-light-secondary/50 dark:bg-background-dark/50 rounded-lg border border-border-light dark:border-border-dark mb-3"
                            >
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-text-light-secondary dark:text-text-dark-secondary">
                                    {coupon.code}
                                  </h3>
                                  <Badge variant="danger">Used</Badge>
                                </div>
                                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                                  {coupon.percentage}% off (already applied)
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
