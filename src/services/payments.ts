import "server-only";

import type {
  PageQuery,
  Payment,
  PaymentStatus,
  RentalOrderStatus,
} from "@/lib/validations/types";
import { gearUpFetch } from "./server-client";

export type PaymentListQuery = PageQuery & {
  search?: string;
  status?: PaymentStatus;
  orderStatus?: RentalOrderStatus;
};

/** Role-scoped by the backend, like orders. */
export function listPayments(query: PaymentListQuery = {}) {
  return gearUpFetch<Payment[]>("/payments", {
    auth: true,
    cache: "no-store",
    query: {
      search: query.search,
      status: query.status,
      orderStatus: query.orderStatus,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    },
    fallbackMessage: "Payments couldn't be loaded. Try again shortly.",
  });
}
