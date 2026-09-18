# Reference frontend (`frontend/`): how to borrow from it

`frontend/` holds **GearUp Frontend**, an earlier, complete Next.js 16 frontend
for the *same* backend (`backend/`). It already solves most of what Campus Gear
still has to build: auth/session cookies, token refresh, role-based dashboards,
the catalog with filters, order and review flows, Stripe returns, and Cloudinary
image uploads. It uses the same design tokens (`--pine`, `--lime`, `--gear-*`,
`surface-accent`, …) as `src/app/globals.css`.

**Status:** its integration layer, auth guard, dashboard, payment returns and
public catalog have been ported. See the "Ported" note below. For those areas,
change the Campus Gear copy in `src/`, not the reference.

Treat it as a **pattern library, not a template**. Before building any feature,
check whether the reference already solved it, read that code, then write the
Campus Gear version so it fits this repo.

## Reading it

`frontend/` is its own git repo and is git-ignored here. Its working tree may be
empty (files deleted locally) while its history is intact, so read through git:

```bash
git -C frontend ls-files                               # list every file
git -C frontend ls-files 'src/app/(dashboard)/*'       # narrow by path
git -C frontend show HEAD:src/services/orders.ts       # read one file
git -C frontend grep -n "checkoutUrl" HEAD -- src      # search
```

If the files do exist on disk, read them directly. **Never edit, restore, commit
to or delete anything inside `frontend/`** unless the user asks.

Useful docs inside it: `AGENTS.md` (its full agent guide: auth architecture,
lifecycle rules, error mapping, cache policy, a11y bar), `API_INTEGRATION.md`
(consumer → endpoint map), `README.md`.

## Where to look, by feature

| Building in Campus Gear | Look at in `frontend/` |
| --- | --- |
| Fetch client, error normalization | `src/services/server-client.ts`, `src/services/errors.ts`. **Already ported** to `src/services/`; keep them in sync rather than re-copying. |
| Endpoint functions | `src/services/{auth,categories,gear,orders,payments,reviews,users}.ts` (cache policy + tags + friendly `fallbackMessage` per call) |
| Wire types / enums | `src/lib/types.ts` → port only what you need into `src/lib/validations/types.ts` |
| Login / register Server Actions, session cookies | `src/app/(auth)/_actions/authActions.ts` |
| Auth form schemas | `src/app/(auth)/validation/auth.schema.ts`, `src/lib/validations/zod-errors.ts` |
| Route protection | `src/proxy.ts`, `src/lib/auth/session-token.ts`, `src/lib/auth/dashboard-routes.ts` |
| Token refresh from Server Components | `src/app/auth/refresh/route.ts`, `src/app/(dashboard)/_utils/dashboard-access.ts` (`requireDashboardUser` / `requireDashboardRole`) |
| Client-side session context | `src/components/providers/auth-session-provider.tsx` |
| Logout | `src/app/(dashboard)/_actions/logout-action.ts` |
| Dashboard shell + role nav | `src/app/(dashboard)/_components/dashboard-shell.tsx`, `_config/dashboard-navigation.ts`, `dashboard/layout.tsx` |
| Dashboard metrics from `meta.total` | `src/app/(dashboard)/dashboard/{admin,provider,customer}/page.tsx`, `_components/dashboard-metric-card.tsx` |
| Paginated registers + URL filters | `_components/dashboard-register-page.tsx`, `dashboard-register-filters.tsx`, `dashboard-pagination.tsx`, `_utils/dashboard-query.ts` |
| Order detail + status transitions | `_components/order-detail.tsx`, `order-status-actions.tsx`, `_actions/order-actions.ts`, `validation/order.schema.ts` |
| Rental request form | `src/app/(public)/_components/gear/rental-request-card.tsx`, `src/app/(dashboard)/_components/customer-order-form.tsx` |
| Stripe checkout + returns | `src/lib/checkout.ts`, `_actions/checkout-actions.ts`, `_components/pay-now-button.tsx`, `src/app/payment/{success,cancel,failed}/`, `payment/success/_components/payment-success-poller.tsx` |
| Reviews | `_actions/review-actions.ts`, `_components/order-review-card.tsx`, `validation/review.schema.ts` |
| Gear catalog, filters, price slider | `src/app/(public)/gear/page.tsx`, `src/app/(public)/_components/gear/catalog-*.tsx`, `src/app/(public)/_components/gear/price-range-slider.tsx`, `src/app/(public)/_utils/catalog-query.ts` |
| Gear detail + gallery | `src/app/(public)/gear/[id]/page.tsx`, `src/app/(public)/_components/gear/gear-detail.tsx`, `src/app/(public)/_components/gear/gear-gallery.tsx`, `src/app/(public)/_utils/gear-image.ts` |
| Gear create/edit + image upload | `_components/admin-gear-form.tsx`, `src/components/shared/photo-upload.tsx`, `src/services/cloudinary.ts`, `src/lib/image-upload.ts` |
| Admin users / categories / admins | `_components/admin-*.tsx`, `_actions/admin-actions.ts`, `validation/{admin,user}.schema.ts` |
| Profile edit | `_actions/profile-actions.ts`, `_components/profile-edit-form.tsx` |
| Loading / error / not-found / outage | `src/app/**/loading.tsx`, `src/app/**/error.tsx`, `src/app/(public)/gear/[id]/not-found.tsx`, `src/app/(public)/service-unavailable/page.tsx`, `src/app/(dashboard)/_components/dashboard-loading.tsx`, `src/app/(public)/_components/gear/*-skeleton.tsx` |
| Shadcn primitives not yet here | `src/components/ui/{badge,card,alert,calendar,date-picker,date-range-picker,popover,select,native-select,pagination,sheet,skeleton,slider,textarea,separator}.tsx`. Check the primitive exists first; the reference `components.json` shows the shadcn setup (`style: "radix-nova"`). |

Paths that don't start with `src/` are under `src/app/(dashboard)/`.

## Ported, and how it was adapted

- `src/app/(dashboard)/**`, `src/app/payment/**`, `src/app/(public)/gear/**` (+ `_components/gear`, `_utils`, `validation`), `src/app/service-unavailable`, `src/services/*`, `src/lib/{checkout,image-upload}.ts`, `src/lib/validations/zod-errors.ts`, the auth-session provider, and the shadcn primitives they use.
- Imports: `@/lib/types` → `@/lib/validations/types`, `brand-mark` → `barnd-mark`, `dashboard-routes` → `@/lib/auth/routes`, logout → `@/lib/auth/actions`.
- Not ported: the reference landing page and `motion` animations (Campus Gear has its own landing; gear detail uses `@/components/shared/reveal`), `site-header`/`site-footer` (the catalog uses the landing `Header`/`Footer`), and `demo-credentials.ts`.

## What to take and what to leave

**Take (logic and architecture):**
- Server-only fetch → typed `ApiResult<T>` → Server Action → `useActionState`/toast.
- HttpOnly `accessToken`/`refreshToken` cookies, set only in Server Actions / Route Handlers.
- Proxy does optimistic redirects only; real checks happen with `/auth/me` near the data.
- `returnTo` sanitizing, the refresh Route Handler with its loop guard, the service-unavailable redirect.
- Role-aware shared dashboard routes and typed navigation config.
- Status transition rules, the checkout pending-context cookie, the Stripe URL allowlist, and bounded polling on `/payment/success`.
- Cache policy (`no-store` for private data, short `revalidate` + tags for public), `updateTag`/`revalidateTag` after mutations.
- Error-state handling: distinct empty vs. failed states, skeletons, and `error.tsx` retry.

**Adapt, don't copy verbatim:**
- **Brand + copy:** reference says “GearUp”, this app is **Campus Gear** (students/campus framing, `BrandMark` in `src/components/shared/barnd-mark.tsx`). Rewrite user-facing text, metadata and toasts.
- **Visual design:** reuse tokens and layout ideas, but match the components that already exist here (`src/components/ui/*`, `src/components/landing/*`, `src/components/auth/*`) and the landing page's look. Don't bring in a second button/input/card style.
- **Routes:** keep Campus Gear's URLs: `/login` and `/signup` (reference uses `/register`). Update any ported `returnTo`, proxy matcher and links.
- **File layout:**
  - Types live in `src/lib/validations/types.ts` (not `src/lib/types.ts`).
  - Services stay in `src/services/`.
  - Existing auth schemas are in `src/lib/auth-schemas.ts`.
  - For new route-specific actions/components/schemas, the reference's route-group layout is fine: `src/app/(group)/_actions`, `_components`, `validation/`. Shared components go in `src/components/<feature>/`.
- **Forms:** this repo already uses `react-hook-form` + `zodResolver` on the client (see `src/components/auth/login-form.tsx`). Keep that. Submit to a Server Action that **re-validates with the same Zod schema** and returns field errors, as the reference actions do.
- **Dependencies:** the reference also uses `cloudinary`, `date-fns`, `motion` and `react-day-picker`, which aren't installed here. Add one only when you port the feature that needs it, and tell the user.
- **Next.js version:** the reference is on 16.2, this repo on 16.3. Verify framework APIs (`proxy.ts`, `cookies()`, `updateTag`, `revalidateTag(tag, profile)`, `error.tsx` props) against `node_modules/next/dist/docs/` here.

**Never copy:**
- `src/lib/demo-credentials.ts`, the credentials or deployed URLs in its README, or its `.env`/`.env.example` values. Campus Gear's backend URL and accounts are different.
- Anything that contradicts `docs/backend-api.md`. That doc (and `backend/` source) is the API contract. Parts of the reference `AGENTS.md` are stale. For example, it says `GET /gear` has no search or date filters, but the backend now supports `search`, `inStock`, `startDate`/`endDate` and `imageUrls`.
- Code you haven't read and understood. Port a file only after reading its imports, and bring over only the parts this feature needs.
