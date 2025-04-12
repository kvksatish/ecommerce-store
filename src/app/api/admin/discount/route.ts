import { NextResponse } from "next/server";
import { store } from "@/store/store";
import { APIResponse, DiscountCode } from "@/types";

// POST /api/admin/discount - Generate a new discount code
export async function POST() {
  try {
    const discountCode = store.getState().generateDiscountCode();
    return NextResponse.json({ code: discountCode });
  } catch (err) {
    console.error("Error generating discount code:", err);
    return NextResponse.json(
      { error: "Failed to generate discount code" },
      { status: 500 }
    );
  }
}

// GET /api/admin/discount - Get all discount codes
export async function GET() {
  try {
    const discountCodes = store.getState().discountCodes;
    const response: APIResponse<DiscountCode[]> = {
      success: true,
      data: discountCodes,
    };
    return NextResponse.json(response);
  } catch (err) {
    console.error("Error getting discount codes:", err);
    return NextResponse.json(
      { success: false, error: "Failed to get discount codes" },
      { status: 500 }
    );
  }
}
