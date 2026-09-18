<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Backend API integration

All data comes from the GearUp Express API (Postgres + Prisma). Its source is checked out at `backend/` (a separate git repo, git-ignored here). **Never invent endpoints, fields, or response shapes. Take them from the backend.**

Before wiring any feature to data:

1. Read `docs/backend-api.md`: endpoints, auth flow, response shapes, enums, the order/payment lifecycle, and how existing UI maps to the API.
2. If `backend/` is present, confirm the contract in the source. It wins over the doc:
   - routes + role guards: `backend/src/modules/<module>/<module>.routes.ts`
   - request rules: `backend/src/modules/<module>/<module>.validation.ts`
   - response shape: the `select`/`include` in `backend/src/modules/<module>/<module>.service.ts`
   - enums/models: `backend/prisma/schema/*.prisma`
3. If the backend is missing something the UI needs (a field, filter, or endpoint), don't fake it on the frontend. Say so, and ask whether to change the backend or the design.
4. Don't edit `backend/` unless asked. If you do change the contract, update `docs/backend-api.md` in the same change.

## Rules for calling the API

- **One client:** every request goes through `gearUpFetch` in `src/services/server-client.ts` (`server-only`). Put one function per endpoint in `src/services/<resource>.ts` (e.g. `src/services/gear.ts`), returning `ApiResult<T>`.
- **Paths, not URLs:** pass `"/auth/login"`, `"/gear/" + id`, and so on. The base URL comes from `GEARUP_API_URL` (includes `/api`, e.g. `http://localhost:8080/api`) in `.env.local`. `gearUpFetch` rejects absolute URLs, so never hard-code a host.
- **Where it runs:** read data in Server Components; do mutations in Server Actions (`"use server"`). Client components never call the backend directly and never see tokens. Pass results down as props, or call a Server Action.
- **Auth (implemented, reuse it):**
  - `src/lib/auth/actions.ts` has the login, signup and logout Server Actions.
  - `src/lib/auth/session.ts` handles cookies, `getSessionHint()` for page chrome, and the `requireUser()` / `requireRole()` page guards.
  - `src/lib/auth/routes.ts` has `safeReturnTo`, `ROLE_HOME` and the protected prefixes.
  - `src/proxy.ts` does optimistic redirects only; `src/app/auth/refresh/route.ts` renews tokens.
  - Protected API calls pass `auth: true`.
  - Every new private page or layout must call `requireUser`/`requireRole`.
- **Dashboards:** each role lands on its own overview: `/dashboard/customer`, `/dashboard/provider`, `/dashboard/admin` (`ROLE_HOME`). They share the shell in `src/app/dashboard/_components/`.
  - Add sidebar links in `src/app/dashboard/_config/navigation.ts`, and only for pages that exist.
  - Restrict a new role-only area with `ROLE_RESTRICTED_PREFIXES` in `src/lib/auth/routes.ts` plus `requireRole` on the page.
  - Counts come from `meta.total` of `limit: 1` list calls (`_utils/results.ts`). There is no stats endpoint. To protect a new top-level area, add its prefix to `PROTECTED_PREFIXES` and to the `matcher` in `src/proxy.ts`.
- **Types:** put API response types in `src/lib/validations/types.ts`, mirroring the backend exactly. Decimal fields (`pricePerDay`, `totalPrice`, `amount`, `rating`) arrive as strings: type them `DecimalValue` and convert with `Number()`. Dates are ISO strings; date inputs are `YYYY-MM-DD`; IDs are UUIDs.
- **Forms:** frontend Zod schemas in `src/lib/` must be at least as strict as the backend validation. Map form fields to backend field names when sending. Map `error.fieldErrors` (keyed by backend field name) back onto form fields with `setError`, and show everything else on `root`.
- **Caching:** use `cache: "no-store"` for user-specific or auth'd data and for all mutations. Public catalogue reads (categories, gear lists) may use `next: { revalidate, tags }`. Never combine `no-store` with `revalidate`, because `gearUpFetch` rejects it. After a mutation, `revalidateTag`/`revalidatePath` the affected data.
- **Errors:** always branch on `result.ok`. Show `error.message` (already user-safe), and never throw raw backend errors into the UI.
- **Roles:** `CUSTOMER` rents, `PROVIDER` lists gear and fulfils orders, `ADMIN` manages everything. Gate UI by the role from `GET /auth/me`, but treat the backend's 401/403 as the real authority.
- **Payments:** only the Stripe webhook sets `PAID`. The frontend redirects to `checkoutUrl` and must provide `/payment/success` and `/payment/cancel` pages.
- **Mock data:** `src/lib/landing-data.ts` is placeholder content. When a section gets wired to the API, keep only presentation data (icons, tones, copy) there and fetch the rest.

# Reference frontend (`frontend/`)

`frontend/` is **GearUp Frontend**, an earlier complete Next.js 16 app for the same backend. It already implements auth/session cookies, token refresh, `proxy.ts` guards, role dashboards, the catalog and filters, orders, reviews, Stripe returns, Cloudinary uploads, and loading/error states. It shares this app's design tokens. **When coding any frontend feature, first check how `frontend/` did it and take inspiration from it.** Then write the Campus Gear version so it fits this repo.

- Read `docs/frontend-reference.md` first. It maps each feature to reference files and lists what to take, adapt, and never copy.
- `frontend/` is a separate git repo, git-ignored here, and its working tree may be empty. Read it with `git -C frontend ls-files` / `git -C frontend show HEAD:<path>`. Never modify anything inside it.
- Take its architecture and logic: the fetch/action/error patterns, session and refresh flow, role guards, status rules, checkout flow, and cache policy.
- Adapt the rest to this repo:
  - brand and copy: **Campus Gear**, not GearUp;
  - existing UI components and look;
  - routes: `/login`, `/signup`;
  - file locations: types in `src/lib/validations/types.ts`;
  - forms: react-hook-form on the client plus Zod re-validation in the Server Action.
- Precedence when they conflict: user request → `backend/` source → `docs/backend-api.md` → this repo's existing code → `frontend/`. Parts of the reference's own `AGENTS.md` are stale about backend capabilities.
- Never copy its demo credentials, deployed URLs, or env values. Don't add its extra dependencies (`cloudinary`, `date-fns`, `motion`, `react-day-picker`) unless the feature needs them.
