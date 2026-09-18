import "server-only";

import { campusGearFetch } from "./server-client";
import type {
  CreateGearInput,
  GearCatalogQuery,
  GearDetail,
  GearItem,
  GearPriceRange,
  UpdateGearInput,
} from "@/lib/validations/types";

export function getGearPriceRange() {
  return campusGearFetch<GearPriceRange>("/gear/price-range", {
    next: {
      revalidate: 60,
      tags: ["gear"],
    },
    fallbackMessage: "The catalog price range couldn't be loaded.",
  });
}

export function listGear(query: GearCatalogQuery = {}) {
  return campusGearFetch<GearItem[]>("/gear", {
    query: {
      providerId: query.providerId,
      search: query.search,
      category: query.category,
      brand: query.brand,
      price: query.price,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      isAvailable: query.isAvailable,
      inStock: query.inStock,
      startDate: query.startDate,
      endDate: query.endDate,
      page: query.page ?? 1,
      limit: query.limit ?? 12,
    },
    next: {
      revalidate: 60,
      tags: ["gear"],
    },
    fallbackMessage: "The gear catalog is reconnecting. Try again shortly.",
  });
}

export function getGearItem(id: string) {
  return campusGearFetch<GearDetail>(`/gear/${id}`, {
    next: {
      revalidate: 60,
      tags: ["gear", `gear:${id}`],
    },
    fallbackMessage: "The gear listing couldn't be loaded. Try again shortly.",
  });
}

export function getGearItemForMutation(id: string) {
  return campusGearFetch<GearDetail>(`/gear/${id}`, {
    cache: "no-store",
    fallbackMessage:
      "The latest gallery could not be loaded. Refresh the page and try again.",
  });
}

export function createGearItem(input: CreateGearInput) {
  return campusGearFetch<GearItem>("/gear", {
    method: "POST",
    auth: true,
    cache: "no-store",
    json: input,
    fallbackMessage: "The gear listing couldn't be created. Try again shortly.",
  });
}

export function updateGearItem(id: string, input: UpdateGearInput) {
  return campusGearFetch<GearItem>(`/gear/${id}`, {
    method: "PATCH",
    auth: true,
    cache: "no-store",
    json: input,
    fallbackMessage: "The gear listing couldn't be updated. Try again shortly.",
  });
}

export function deleteGearItem(id: string) {
  return campusGearFetch<GearItem>(`/gear/${id}`, {
    method: "DELETE",
    auth: true,
    cache: "no-store",
    fallbackMessage: "The gear listing couldn't be deleted. Try again shortly.",
  });
}
