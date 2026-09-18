import "server-only";

import type {
  AdminUser,
  PageQuery,
  Role,
  UserStatus,
} from "@/lib/validations/types";
import { gearUpFetch } from "./server-client";

export type UserListQuery = PageQuery & {
  search?: string;
  role?: Role;
  status?: UserStatus;
};

/** Admin only. */
export function listUsers(query: UserListQuery = {}) {
  return gearUpFetch<AdminUser[]>("/users", {
    auth: true,
    cache: "no-store",
    query: {
      search: query.search,
      role: query.role,
      status: query.status,
      page: query.page ?? 1,
      limit: query.limit ?? 10,
    },
    fallbackMessage: "Users couldn't be loaded. Try again shortly.",
  });
}
