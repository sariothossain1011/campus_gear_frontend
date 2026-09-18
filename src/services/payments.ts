import "server-only";

import type { Payment, PaymentListQuery } from "@/lib/validations/types";
import { campusGearFetch } from "./server-client";

export function listPayments(query: PaymentListQuery = {}) {
  return campusGearFetch<Payment[]>("/payments", {
    auth: true,
    cache: "no-store",
    query: {
      search: query.search,
      status: query.status,
      orderStatus: query.orderStatus,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    },
    fallbackMessage:
      "Payment activity couldn't be loaded. Try again shortly.",
  });
}

/**
 * The backend scopes this by role and returns `404` when the payment exists but
 * the caller may not see it, so the page treats 403/404 the same way.
 */
export function getPayment(id: string) {
  return campusGearFetch<Payment>(`/payments/${id}`, {
    auth: true,
    cache: "no-store",
    fallbackMessage: "This payment couldn't be loaded. Try again shortly.",
  });
}
