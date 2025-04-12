import { NextResponse } from "next/server";
import { useStore } from "@/store/store";
import { APIResponse } from "@/types";

// GET /api/admin/stats - Get store statistics
export async function GET() {
  try {
    const store = useStore.getState();

    const stats = {
      totalItems: store.getTotalItemsPurchased(),
      totalAmount: store.getTotalPurchaseAmount(),
      discountCodes: store.discountCodes,
      totalDiscountAmount: store.getTotalDiscountAmount(),
      orderCount: store.getOrderCount(),
    };

    const response: APIResponse<typeof stats> = {
      success: true,
      data: stats,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get store statistics",
      },
      { status: 500 }
    );
  }
}
