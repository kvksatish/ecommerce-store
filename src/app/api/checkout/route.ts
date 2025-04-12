import { NextRequest, NextResponse } from "next/server";
import { useStore } from "@/store/store";
import { APIResponse, Order } from "@/types";

// POST /api/checkout - Process checkout and create order
export async function POST(request: NextRequest) {
  try {
    const cart = useStore.getState().cart;

    if (cart.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Cart is empty",
        },
        { status: 400 }
      );
    }

    const order = useStore.getState().createOrder();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create order",
        },
        { status: 500 }
      );
    }

    const response: APIResponse<Order> = {
      success: true,
      data: order,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Checkout failed",
      },
      { status: 500 }
    );
  }
}
