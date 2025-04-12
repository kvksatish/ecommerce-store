import { NextRequest, NextResponse } from "next/server";
import { useStore } from "@/store/store";
import { APIResponse, Cart } from "@/types";

// POST /api/cart/discount - Apply discount code to cart
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: "Discount code is required",
        },
        { status: 400 }
      );
    }

    const isApplied = useStore.getState().applyDiscountCode(code);

    if (!isApplied) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or already used discount code",
        },
        { status: 400 }
      );
    }

    const cart = useStore.getState().cart;

    const response: APIResponse<Cart> = {
      success: true,
      data: cart,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to apply discount code",
      },
      { status: 500 }
    );
  }
}
