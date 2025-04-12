import { NextRequest, NextResponse } from "next/server";
import { useStore } from "@/store/store";
import { APIResponse, DiscountCode } from "@/types";

// POST /api/admin/discount - Generate a new discount code
export async function POST(request: NextRequest) {
  try {
    const discountCode = useStore.getState().generateDiscountCode();

    if (!discountCode) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate discount code",
        },
        { status: 500 }
      );
    }

    const response: APIResponse<DiscountCode> = {
      success: true,
      data: discountCode,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate discount code",
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/discount - Get all discount codes
export async function GET() {
  try {
    const discountCodes = useStore.getState().discountCodes;

    const response: APIResponse<DiscountCode[]> = {
      success: true,
      data: discountCodes,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get discount codes",
      },
      { status: 500 }
    );
  }
}
