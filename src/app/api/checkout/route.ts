import { NextResponse } from "next/server";
import { store } from "@/store/store";

// POST /api/checkout - Process checkout and create order
export async function POST() {
  try {
    const order = store.getState().createOrder();
    if (!order) {
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
