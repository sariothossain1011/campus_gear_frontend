import "server-only";

import type { Category } from "@/lib/validations/types";
import { gearUpFetch } from "./server-client";

/** Every category, sorted by name. Not paginated. */
export function listCategories() {
  return gearUpFetch<Category[]>("/categories", {
    next: { revalidate: 300, tags: ["categories"] },
    fallbackMessage: "Categories couldn't be loaded. Try again shortly.",
  });
}
