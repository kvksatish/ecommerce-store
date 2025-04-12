# E-Commerce Store

A simple e-commerce store application that allows users to browse products, add items to cart, and checkout orders. Every nth order gets a coupon code for 10% discount.

## Features

- Browse products
- Add products to cart
- Apply discount codes
- Checkout and place orders
- Automatic discount code generation (every 3rd order)
- Admin dashboard with stats and discount code management

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Zustand for state management
- In-memory store for data persistence

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ecommerce-store.git
   cd ecommerce-store
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### Cart API

- `GET /api/cart` - Get current cart
- `POST /api/cart` - Add item to cart
  - Request body: `{ productId: string, quantity: number }`
- `DELETE /api/cart` - Remove item from cart
  - Request body: `{ itemId: string }`

### Discount API

- `POST /api/cart/discount` - Apply discount code to cart
  - Request body: `{ code: string }`

### Checkout API

- `POST /api/checkout` - Process checkout and create order

### Admin APIs

- `GET /api/admin/stats` - Get store statistics
- `GET /api/admin/discount` - Get all discount codes
- `POST /api/admin/discount` - Generate a new discount code

## Discount Code Rules

- Discount codes are generated automatically after every 3rd order
- Each discount code can only be used once
- Discount codes provide 10% off the entire order
