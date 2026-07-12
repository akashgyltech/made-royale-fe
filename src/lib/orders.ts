// Client-side order store (localStorage). Swap for a real API when the backend
// is ready — shapes mirror a typical order contract.

export interface OrderItem {
  productId: string; name: string; slug: string; sku: string; color?: string; price: number; qty: number;
}
export interface OrderAddress {
  name: string; phone: string; line1: string; line2?: string; city: string; state: string; pincode: string;
}
export type OrderStatus = 'placed' | 'confirmed' | 'crafting' | 'shipped' | 'out-for-delivery' | 'delivered';

export const ORDER_STAGES: { key: OrderStatus; label: string; note: string }[] = [
  { key: 'placed', label: 'Order Placed', note: 'We have received your order' },
  { key: 'confirmed', label: 'Confirmed', note: 'Payment confirmed & order accepted' },
  { key: 'crafting', label: 'In the Atelier', note: 'Your piece is being crafted & quality-checked' },
  { key: 'shipped', label: 'Shipped', note: 'Dispatched from our warehouse' },
  { key: 'out-for-delivery', label: 'Out for Delivery', note: 'Arriving today with white-glove service' },
  { key: 'delivered', label: 'Delivered', note: 'Installed & enjoyed' },
];

export interface Order {
  orderNumber: string; createdAt: string; status: OrderStatus; items: OrderItem[]; address: OrderAddress;
  paymentMethod: string; paymentLabel: string; subtotal: number; discount: number; couponCode?: string;
  shipping: number; gstInvoice?: { gstin: string; businessName: string }; total: number; estimatedDelivery: string;
}

const KEY = 'mr_orders';

function read(): Order[] {
  if (typeof window === 'undefined') return [];
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function write(orders: Order[]) { try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch { /* ignore */ } }

export function generateOrderNumber(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `SZ${new Date().getFullYear().toString().slice(-2)}${rand}`;
}
export function saveOrder(order: Order): void { write([order, ...read()]); }
export function getOrders(): Order[] { return read(); }
export function getOrderByNumber(n: string): Order | undefined { return read().find((o) => o.orderNumber.toLowerCase() === n.toLowerCase()); }

export function computeStageIndex(order: Order): number {
  const hoursSince = (Date.now() - new Date(order.createdAt).getTime()) / 3600000;
  if (order.status === 'delivered') return ORDER_STAGES.length - 1;
  if (hoursSince < 1) return 0;
  if (hoursSince < 6) return 1;
  if (hoursSince < 24) return 2;
  if (hoursSince < 72) return 3;
  if (hoursSince < 120) return 4;
  return 5;
}
