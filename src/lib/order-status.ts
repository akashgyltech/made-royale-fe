// Display metadata for BackendOrderStatus (see src/types/backend.ts). The backend has
// no separate "UI stage" concept — just BackendOrder.status — so this is the frontend's
// single mapping from that real value to labels/notes/progress-stepper position, shared
// by the track-order timeline, account dashboard order rows, and order confirmation page.
import type { BackendOrderStatus } from '@/types/backend';

export interface OrderStage {
  key: BackendOrderStatus;
  label: string;
  note: string;
}

// The linear "happy path" a normal (non-cancelled/returned) order moves through.
export const ORDER_STAGES: OrderStage[] = [
  { key: 'pending', label: 'Order Placed', note: 'We have received your order' },
  { key: 'confirmed', label: 'Confirmed', note: 'Payment confirmed & order accepted' },
  { key: 'processing', label: 'Processing', note: 'Your order is being prepared' },
  { key: 'ready_to_ship', label: 'Ready to Ship', note: 'Packed and ready for dispatch' },
  { key: 'shipped', label: 'Shipped', note: 'Dispatched from our warehouse' },
  { key: 'out_for_delivery', label: 'Out for Delivery', note: 'Arriving today' },
  { key: 'delivered', label: 'Delivered', note: 'Installed & enjoyed' },
];

export const STATUS_LABELS: Record<BackendOrderStatus, string> = {
  pending: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  ready_to_ship: 'Ready to Ship',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  return_requested: 'Return Requested',
  returned: 'Returned',
  refunded: 'Refunded',
};

// Statuses that fall outside the linear happy-path progression.
export function isTerminalException(status: BackendOrderStatus): boolean {
  return status === 'cancelled' || status === 'return_requested' || status === 'returned' || status === 'refunded';
}

export function stageIndex(status: BackendOrderStatus): number {
  const i = ORDER_STAGES.findIndex((s) => s.key === status);
  return i === -1 ? 0 : i;
}

export function exceptionNote(status: BackendOrderStatus): string {
  switch (status) {
    case 'cancelled': return 'This order has been cancelled.';
    case 'return_requested': return 'A return has been requested for this order.';
    case 'returned': return 'This order has been returned.';
    case 'refunded': return 'This order has been refunded.';
    default: return '';
  }
}
