export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  discountCode?: string;
  discountAmount: number;
  finalTotal: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  discountCode?: string;
  discountAmount: number;
  finalTotal: number;
  createdAt: Date;
  userId?: string;
}

export interface DiscountCode {
  code: string;
  percentage: number;
  isUsed: boolean;
  isDisabled?: boolean;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "user";
  name: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
