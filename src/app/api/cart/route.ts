import { NextRequest, NextResponse } from "next/server";
import { useStore } from "@/store/store";
import { APIResponse, Cart } from "@/types";

// GET /api/cart - Get current cart
export async function GET() {
  try {
    const cart = useStore.getState().cart;
    return NextResponse.json(cart);
  } catch (err) {
    console.error("Error getting cart:", err);
    return NextResponse.json({ error: "Failed to get cart" }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();

    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID or quantity",
        },
        { status: 400 }
      );
    }

    const product = useStore.getState().getProduct(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    useStore.getState().addToCart(productId, quantity);

    const cart = useStore.getState().cart;

    const response: APIResponse<Cart> = {
      success: true,
      data: cart,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error adding to cart:", err);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid item ID",
        },
        { status: 400 }
      );
    }

    useStore.getState().removeFromCart(itemId);

    const cart = useStore.getState().cart;

    const response: APIResponse<Cart> = {
      success: true,
      data: cart,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Error removing from cart:", err);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
