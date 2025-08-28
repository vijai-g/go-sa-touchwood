import { Role } from './types';

export const ACCESS = {
  admin: ['AdminDashboard', 'ManageProducts', 'ManageOrders'],
  customer: ['Shop', 'Cart', 'Checkout', 'MyOrders'],
  guest: ['Home', 'About', 'Contact', 'Shop']
} as const;

export const canAccess = (role: Role | 'guest', area: string) => {
  const allowed = (ACCESS as any)[role] ?? ACCESS.guest;
  return allowed.includes(area as any);
}