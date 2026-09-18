import "server-only";

import type {
  CheckoutSession,
  CreatedRentalOrder,
  CreateRentalOrderInput,
  OrderListQuery,
  RentalOrder,
  RentalOrderStatus,
} from "@/lib/validations/types";
import { campusGearFetch } from "./server-client";

export function listOrders(query: OrderListQuery = {}) {
  return campusGearFetch<RentalOrder[]>("/orders", {
    auth: true,
    cache: "no-store",
    query: {
      search: query.search,
      status: query.status,
      paymentStatus: query.paymentStatus,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    },
    fallbackMessage:
      "Your rental orders couldn't be loaded. Try again shortly.",
  });
}

export function getOrder(id: string) {
  return campusGearFetch<RentalOrder>(`/orders/${id}`, {
    auth: true,
    cache: "no-store",
    fallbackMessage: "This order couldn't be loaded. Try again shortly.",
  });
}

export function createRentalOrder(input: CreateRentalOrderInput) {
  return campusGearFetch<CreatedRentalOrder>("/orders", {
    method: "POST",
    auth: true,
    cache: "no-store",
    json: input,
    fallbackMessage:
      "Your rental request couldn't be placed. Check the dates and try again.",
  });
}

export function createCheckoutSession(id: string) {
  return campusGearFetch<CheckoutSession>(`/orders/${id}/checkout-session`, {
    method: "POST",
    auth: true,
    cache: "no-store",
    fallbackMessage:
      "Checkout couldn't be started. Confirm the order is ready to pay and try again.",
  });
}

export function updateOrderStatus(id: string, status: RentalOrderStatus) {
  return campusGearFetch<RentalOrder>(`/orders/${id}/status`, {
    method: "PATCH",
    auth: true,
    cache: "no-store",
    json: { status },
    fallbackMessage: "The order status couldn't be updated. Try again shortly.",
  });
}
