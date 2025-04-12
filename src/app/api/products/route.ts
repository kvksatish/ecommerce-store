import { NextResponse } from "next/server";
import { useStore } from "@/store/store";
import { APIResponse, Product } from "@/types";

// GET /api/products - Get all products
export async function GET() {
  const products = useStore.getState().products;

  const response: APIResponse<Product[]> = {
    success: true,
    data: products,
  };

  return NextResponse.json(response);
}
