import { redirect } from "next/navigation";

import { ROLE_HOME } from "@/lib/auth/routes";
import { requireUser } from "@/lib/auth/session";

/** `/dashboard` is a doorway: send each role to its own overview. */
export default async function DashboardIndexPage() {
  const user = await requireUser();
  redirect(ROLE_HOME[user.role]);
}
