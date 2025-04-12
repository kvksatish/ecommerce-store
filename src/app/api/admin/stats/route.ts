import { NextResponse } from "next/server";
import { store } from "@/store/store";

// GET /api/admin/stats - Get store statistics
export async function GET() {
  try {
    const stats = {
      totalSales: store.getState().getTotalPurchaseAmount(),
      totalItems: store.getState().getTotalItemsPurchased(),
      totalDiscounts: store.getState().getTotalDiscountAmount(),
      totalOrders: store.getState().getOrderCount(),
    };
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Error getting stats:", err);
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
