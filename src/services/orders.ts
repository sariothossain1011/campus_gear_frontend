import "server-only";

import type {
  OrderDetail,
  PageQuery,
  PaymentStatus,
  RentalOrderStatus,
} from "@/lib/validations/types";
import { gearUpFetch } from "./server-client";

export type OrderListQuery = PageQuery & {
  search?: string;
  status?: RentalOrderStatus;
  paymentStatus?: PaymentStatus;
};

/** Role-scoped by the backend: customers see theirs, providers their gear's, admins all. */
export function listOrders(query: OrderListQuery = {}) {
  return gearUpFetch<OrderDetail[]>("/orders", {
    auth: true,
    cache: "no-store",
    query: {
      search: query.search,
      status: query.status,
      paymentStatus: query.paymentStatus,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    },
    fallbackMessage: "Rental orders couldn't be loaded. Try again shortly.",
  });
}
