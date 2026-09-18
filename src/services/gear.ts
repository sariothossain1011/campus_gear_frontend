import "server-only";

import type { GearListItem, PageQuery } from "@/lib/validations/types";
import { gearUpFetch } from "./server-client";

export type GearListQuery = PageQuery & {
  providerId?: string;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  inStock?: boolean;
  startDate?: string;
  endDate?: string;
};

export function listGear(query: GearListQuery = {}) {
  return gearUpFetch<GearListItem[]>("/gear", {
    query: {
      providerId: query.providerId,
      search: query.search,
      category: query.category,
      brand: query.brand,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      isAvailable: query.isAvailable,
      inStock: query.inStock,
      startDate: query.startDate,
      endDate: query.endDate,
      page: query.page ?? 1,
      limit: query.limit ?? 12,
    },
    // Stock and availability change often; keep the window short.
    next: { revalidate: 60, tags: ["gear"] },
    fallbackMessage: "The gear catalog is reconnecting. Try again shortly.",
  });
}
