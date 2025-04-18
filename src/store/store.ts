import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { Cart, CartItem, DiscountCode, Order, Product, User } from "@/types";
import { persist } from "zustand/middleware";

interface StoreState {
  // Authentication
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => User | null;
  logout: () => void;

  // Products
  products: Product[];
  getProduct: (id: string) => Product | undefined;

  // Cart
  cart: Cart;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscountCode: (code: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: () => Order | null;
  getOrderCount: () => number;
  getUserOrderCount: (userId: string) => number;

  // Discount codes
  discountCodes: DiscountCode[];
  generateDiscountCode: () => string | null;
  getDiscountCode: (code: string) => DiscountCode | undefined;
  markDiscountCodeAsUsed: (code: string) => void;
  getUserDiscountCodes: (userId: string) => DiscountCode[];
  toggleDiscountCode: (code: string) => void;

  // Discount settings
  discountInterval: number;
  setDiscountInterval: (interval: number) => void;
  getDiscountInterval: () => number;

  // Admin stats
  getTotalPurchaseAmount: () => number;
  getTotalItemsPurchased: () => number;
  getTotalDiscountAmount: () => number;

  useDiscountCode: (code: string) => boolean;
}

// Configuration
const ORDER_DISCOUNT_FREQUENCY = 3;
const DISCOUNT_PERCENTAGE = 10;

// Sample products
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone",
    price: 699.99,
    description: "Latest model smartphone with high-resolution camera",
    image:
      "https://cdn.pixabay.com/photo/2017/01/22/12/07/imac-1999636_1280.png",
  },
  {
    id: "2",
    name: "Laptop",
    price: 1299.99,
    description: "Powerful laptop for work and gaming",
    image:
      "https://cdn.pixabay.com/photo/2014/05/02/21/50/home-office-336378_1280.jpg",
  },
  {
    id: "3",
    name: "Headphones",
    price: 199.99,
    description: "Noise-cancelling wireless headphones",
    image:
      "https://cdn.pixabay.com/photo/2016/12/19/08/39/mobile-phone-1917737_1280.jpg",
  },
  {
    id: "4",
    name: "Smartwatch",
    price: 249.99,
    description: "Fitness tracking smartwatch with heart rate monitor",
    image:
      "https://cdn.pixabay.com/photo/2017/01/22/12/07/imac-1999636_1280.png",
  },
  {
    id: "5",
    name: "Tablet",
    price: 499.99,
    description: "10-inch tablet with high-resolution display",
    image:
      "https://cdn.pixabay.com/photo/2014/05/02/21/50/home-office-336378_1280.jpg",
  },
];

// Sample users
const sampleUsers: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "client@example.com",
    password: "client123",
    name: "Regular User",
    role: "user",
  },
];

export const store = create<StoreState>()(
  persist(
    (set, get) => ({
      // Authentication
      currentUser: null,
      users: sampleUsers,

      login: (email: string, password: string) => {
        console.log("Attempting login with:", { email, password });
        const user = sampleUsers.find(
          (u) => u.email === email && u.password === password
        );
        console.log("Found user:", user);
        if (user) {
          set({ currentUser: user });
          // Store user in cookie
          document.cookie = `currentUser=${JSON.stringify(
            user
          )}; path=/; max-age=86400`; // 24 hours
          return user;
        }
        return null;
      },

      logout: () => {
        set({ currentUser: null });
        // Clear user cookie
        document.cookie =
          "currentUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      },

      // Products
      products: sampleProducts,
      getProduct: (id: string) => {
        return get().products.find((product) => product.id === id);
      },

      // Cart
      cart: {
        items: [],
        total: 0,
        discountAmount: 0,
        finalTotal: 0,
      },

      addToCart: (productId: string, quantity: number) => {
        const product = get().getProduct(productId);
        if (!product) return;

        const cart = get().cart;
        const existingItem = cart.items.find(
          (item) => item.productId === productId
        );

        if (existingItem) {
          // Update quantity if item already exists
          set({
            cart: {
              ...cart,
              items: cart.items.map((item) =>
                item.id === existingItem.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            },
          });
        } else {
          // Add new item
          const newItem: CartItem = {
            id: uuidv4(),
            productId,
            quantity,
            product,
          };

          set({
            cart: {
              ...cart,
              items: [...cart.items, newItem],
            },
          });
        }

        // Recalculate totals
        const updatedCart = get().cart;
        const total = updatedCart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        const discountAmount = updatedCart.discountCode
          ? (total *
              (get().getDiscountCode(updatedCart.discountCode)?.percentage ||
                10)) /
            100
          : 0;

        set({
          cart: {
            ...updatedCart,
            total,
            discountAmount,
            finalTotal: total - discountAmount,
          },
        });
      },

      removeFromCart: (itemId: string) => {
        const cart = get().cart;

        set({
          cart: {
            ...cart,
            items: cart.items.filter((item) => item.id !== itemId),
          },
        });

        // Recalculate totals
        const updatedCart = get().cart;
        const total = updatedCart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        const discountAmount = updatedCart.discountCode
          ? (total *
              (get().getDiscountCode(updatedCart.discountCode)?.percentage ||
                10)) /
            100
          : 0;

        set({
          cart: {
            ...updatedCart,
            total,
            discountAmount,
            finalTotal: total - discountAmount,
          },
        });
      },

      updateCartItemQuantity: (itemId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        const cart = get().cart;

        set({
          cart: {
            ...cart,
            items: cart.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          },
        });

        // Recalculate totals
        const updatedCart = get().cart;
        const total = updatedCart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        const discountAmount = updatedCart.discountCode
          ? (total *
              (get().getDiscountCode(updatedCart.discountCode)?.percentage ||
                10)) /
            100
          : 0;

        set({
          cart: {
            ...updatedCart,
            total,
            discountAmount,
            finalTotal: total - discountAmount,
          },
        });
      },

      clearCart: () => {
        set({
          cart: {
            items: [],
            total: 0,
            discountAmount: 0,
            finalTotal: 0,
            discountCode: undefined,
          },
        });
      },

      applyDiscountCode: (code: string) => {
        const discountCode = get().getDiscountCode(code);
        if (!discountCode || discountCode.isUsed) {
          return false;
        }

        // Check if this discount code belongs to the current user or is a general code
        const currentUser = get().currentUser;
        if (discountCode.userId && currentUser?.id !== discountCode.userId) {
          return false; // This code belongs to another user
        }

        const cart = get().cart;
        const discountAmount = (cart.total * discountCode.percentage) / 100;

        set({
          cart: {
            ...cart,
            discountCode: code,
            discountAmount,
            finalTotal: cart.total - discountAmount,
          },
        });

        get().markDiscountCodeAsUsed(code);

        return true;
      },

      // Orders
      orders: [],

      createOrder: () => {
        const cart = get().cart;
        const currentUser = get().currentUser;

        if (cart.items.length === 0) {
          return null;
        }

        const orderId = uuidv4();
        const items = [...cart.items];
        const discountCode = cart.discountCode;
        const discountAmount = cart.discountAmount;
        const total = cart.total;
        const finalTotal = cart.finalTotal;
        const userId = currentUser?.id;

        const order: Order = {
          id: orderId,
          items,
          discountCode,
          discountAmount,
          total,
          finalTotal,
          createdAt: new Date(),
          userId,
        };

        // Add new order
        set((state) => ({
          orders: [...state.orders, order],
        }));

        // If user is logged in, check if they qualify for a discount code
        if (currentUser) {
          const userOrderCount = get().getUserOrderCount(currentUser.id);
          const discountInterval = get().discountInterval;

          if (discountInterval > 0 && userOrderCount % discountInterval === 0) {
            // Generate new discount code for this customer
            const newDiscountCode = get().generateDiscountCode();

            console.log(
              `Generated discount code for user ${currentUser.name}: ${newDiscountCode}`
            );
          }
        }

        // Clear cart after order is created
        get().clearCart();

        return order;
      },

      getOrderCount: () => {
        return get().orders.length;
      },

      getUserOrderCount: (userId: string) => {
        return get().orders.filter((order) => order.userId === userId).length;
      },

      // Discount codes
      discountCodes: [],

      generateDiscountCode: () => {
        const state = get();
        const orderCount = state.orders.length;

        if (orderCount % ORDER_DISCOUNT_FREQUENCY === 0) {
          const code = `DISCOUNT${Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()}`;
          set((state) => ({
            discountCodes: [
              ...state.discountCodes,
              {
                code,
                percentage: DISCOUNT_PERCENTAGE,
                isUsed: false,
                isDisabled: false,
              },
            ],
          }));
          return code;
        }
        return null;
      },

      getDiscountCode: (code: string) => {
        return get().discountCodes.find(
          (discountCode) =>
            discountCode.code === code && !discountCode.isDisabled
        );
      },

      markDiscountCodeAsUsed: (code: string) => {
        set((state) => ({
          discountCodes: state.discountCodes.map((discountCode) =>
            discountCode.code === code
              ? { ...discountCode, isUsed: true }
              : discountCode
          ),
        }));
      },

      getUserDiscountCodes: (userId: string) => {
        return get().discountCodes.filter((code) => code.userId === userId);
      },

      toggleDiscountCode: (code: string) => {
        set((state) => ({
          discountCodes: state.discountCodes.map((discountCode) =>
            discountCode.code === code
              ? { ...discountCode, isDisabled: !discountCode.isDisabled }
              : discountCode
          ),
        }));
      },

      // Discount settings
      discountInterval: 2, // Default: every 2nd order gets a discount

      setDiscountInterval: (interval: number) => {
        set({ discountInterval: interval });
      },

      getDiscountInterval: () => {
        return get().discountInterval;
      },

      // Admin stats
      getTotalPurchaseAmount: () => {
        return get().orders.reduce(
          (total, order) => total + order.finalTotal,
          0
        );
      },

      getTotalItemsPurchased: () => {
        return get().orders.reduce(
          (total, order) =>
            total + order.items.reduce((sum, item) => sum + item.quantity, 0),
          0
        );
      },

      getTotalDiscountAmount: () => {
        return get().orders.reduce(
          (total, order) => total + (order.discountAmount || 0),
          0
        );
      },

      useDiscountCode: (code: string) => {
        const discountCode = get().discountCodes.find(
          (dc) => dc.code === code && !dc.isUsed
        );
        if (discountCode) {
          set((state) => ({
            discountCodes: state.discountCodes.map((dc) =>
              dc.code === code ? { ...dc, isUsed: true } : dc
            ),
          }));
          return true;
        }
        return false;
      },
    }),
    {
      name: "ecommerce-store",
    }
  )
);

export const useStore = store;
