/**
 * Admin Dashboard Page
 *
 * This page provides admin users with:
 * - Store statistics and analytics with charts
 * - Overview of all discount codes
 * - Ability to view and manage discount settings
 */

"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/store";
import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, BarChart } from "@/components/charts";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const {
    getTotalPurchaseAmount,
    getTotalItemsPurchased,
    getTotalDiscountAmount,
    getOrderCount,
    discountCodes,
    toggleDiscountCode,
    getDiscountInterval,
    setDiscountInterval,
  } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [intervalInput, setIntervalInput] = useState("");

  // Calculate discount code statistics
  const totalDiscountCodes = discountCodes.length;
  const usedDiscountCodes = discountCodes.filter((code) => code.isUsed).length;
  const availableDiscountCodes = discountCodes.filter(
    (code) => !code.isUsed && !code.isDisabled
  ).length;
  const disabledDiscountCodes = discountCodes.filter(
    (code) => code.isDisabled
  ).length;

  // Initialize interval input with current value
  useEffect(() => {
    setIntervalInput(getDiscountInterval().toString());
  }, [getDiscountInterval]);

  // Fix hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleIntervalChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setIntervalInput(value);
      setDiscountInterval(numValue);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${getTotalPurchaseAmount().toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Items Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getTotalItemsPurchased()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Discounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${getTotalDiscountAmount().toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{getOrderCount()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Discount Settings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Discount Settings</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <div>
                  <label className="block text-lg font-medium mb-4">
                    Generate discount code every N orders
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={intervalInput}
                    onChange={(e) => handleIntervalChange(e.target.value)}
                    className="w-40 h-16 text-2xl text-center font-semibold"
                  />
                </div>
                <p className="text-lg mt-12 text-text-light-secondary dark:text-text-dark-secondary">
                  {intervalInput === "0"
                    ? "Automatic discount codes disabled"
                    : intervalInput === "1"
                    ? "Every order earns a discount code"
                    : `Every ${intervalInput} orders earn a discount code`}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Discount Codes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Discount Codes</h2>
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Total: {totalDiscountCodes}
              </div>
              <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Used: {usedDiscountCodes}
              </div>
              <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Available: {availableDiscountCodes}
              </div>
              <div className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Disabled: {disabledDiscountCodes}
              </div>
            </div>
          </div>

          {/* Discount Codes Table */}
          {discountCodes.length === 0 ? (
            <Card variant="default" className="p-12 text-center">
              <CardContent className="flex flex-col items-center justify-center text-text-light-secondary dark:text-text-dark-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-4 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
                <p>No discount codes generated yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark-secondary">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light dark:border-border-dark">
                    <th className="px-6 py-4 text-left text-lg">Code</th>
                    <th className="px-6 py-4 text-left text-lg">Discount</th>
                    <th className="px-6 py-4 text-left text-lg">Status</th>
                    <th className="px-6 py-4 text-left text-lg">User</th>
                    <th className="px-6 py-4 text-left text-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {discountCodes.map((code) => (
                    <tr
                      key={code.code}
                      className="border-b border-border-light dark:border-border-dark"
                    >
                      <td className="px-6 py-4 text-lg font-medium">
                        {code.code}
                      </td>
                      <td className="px-6 py-4 text-lg">{code.percentage}%</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            code.isDisabled
                              ? "danger"
                              : code.isUsed
                              ? "secondary"
                              : "success"
                          }
                          className="text-base px-4 py-1"
                        >
                          {code.isDisabled
                            ? "Disabled"
                            : code.isUsed
                            ? "Used"
                            : "Available"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-lg">
                        {code.userId || "System Generated"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Button
                            variant={code.isDisabled ? "outline" : "danger"}
                            size="lg"
                            onClick={() => toggleDiscountCode(code.code)}
                            disabled={code.isUsed}
                            className="min-w-[120px]"
                          >
                            {code.isDisabled ? "Enable" : "Disable"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
