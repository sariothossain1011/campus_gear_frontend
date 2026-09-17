import { AuthTokens, LoginInput } from "@/lib/validations/types";
import { gearUpFetch } from "./server-client";


export function loginRequest(input: LoginInput) {
  return gearUpFetch<AuthTokens>("https://campus-gear-backend-1.onrender.com/login", {
    method: "POST",
    json: input,
    cache: "no-store",
    fallbackMessage: "We couldn't reach the sign-in desk. Try again shortly.",
  });
}