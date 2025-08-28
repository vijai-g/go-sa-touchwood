export type Role = 'admin' | 'customer';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  available: boolean;
};

export type CartItem = { product: Product; quantity: number };

export type OrderItem = { id: string; name: string; price: number; quantity: number };

export type Order = {
  orderId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  createdAt: string;
};

export type User = { userId: string; email: string; passwordHash: string; role: Role };