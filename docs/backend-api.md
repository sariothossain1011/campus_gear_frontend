# Campus Gear backend API — frontend integration reference

The contract the Campus Gear frontend codes against. It is derived from the
Express backend in `backend/` (repo `AbulBashar38/ph-backend-assignment`).

**Source of truth:** when `backend/` exists locally, the code there wins over
this file. Before wiring an endpoint, confirm it in:

| What | Where |
| --- | --- |
| Mount paths | `backend/src/app.ts` |
| Routes + role guards | `backend/src/modules/<module>/<module>.routes.ts` |
| Request body / query / params rules | `backend/src/modules/<module>/<module>.validation.ts` |
| Response shape (`select` / `include`) | `backend/src/modules/<module>/<module>.service.ts` |
| Data model + enums | `backend/prisma/schema/*.prisma` |
| Example requests | `backend/GearUp Backend - Complete Assignment Scenarios.postman_collection.json` |

If the backend and this file disagree, update this file in the same change.

---

## 1. Connection

- Base URL env var: `CAMPUS_GEAR_API_URL`, **including `/api`**, no trailing slash.
  - Local: `CAMPUS_GEAR_API_URL=http://localhost:8080/api` (backend `npm run dev` in `backend/`)
  - Deployed: `CAMPUS_GEAR_API_URL=https://campus-gear-backend-1.onrender.com/api`
  - Put it in `.env.local` (git-ignored). It is server-only — never prefix it with `NEXT_PUBLIC_`.
- Backend CORS allows only `APP_URL` (`http://localhost:3000`). This does not
  matter for calls made from the Next.js server, which is how this app calls the API.

## 2. Response envelope

Every endpoint responds with:

```jsonc
// success
{ "success": true, "statusCode": 200, "message": "…", "data": <T>, "meta": { "page": 1, "limit": 10, "total": 42 } }
// meta is present only on paginated list endpoints

// error
{ "success": false, "statusCode": 400, "name": "…", "message": "Validation failed",
  "errorDetails": [{ "path": "body.email", "message": "Invalid email address" }] }
```

- `errorDetails` is an array of `{ path, message }` **only for Zod validation
  errors (400)**. For other errors it is an arbitrary object — ignore it.
- `path` is prefixed with `body.` / `query.` / `params.`; `mapValidationDetails`
  in `src/services/errors.ts` strips the prefix, leaving the backend field name.
- Common statuses: `400` validation, `401` missing/invalid/expired token or bad
  credentials, `403` wrong role / suspended / inactive account, `404` not found
  (also for records outside the caller's scope), `409` conflict (duplicate
  email/phone, illegal status transition, role-change guard).

`campusGearFetch` already unwraps this into `ApiResult<T>`
(`{ ok: true, data, meta?, message, status } | { ok: false, error: ApiProblem }`).

## 3. Serialization rules

- IDs are UUID strings. Any `:id` param or `*Id` field must be a valid UUID or the backend returns 400.
- Prisma `Decimal` fields are serialized as **strings** (for example `"25.5"`):
  `pricePerDay`, `totalPrice`, `amount`, `rating`. Type them as `DecimalValue`
  (`string | number`) and convert with `Number()` before any maths or formatting.
- `DateTime` fields are ISO 8601 strings.
- Date inputs (`startDate`, `endDate`) must be `YYYY-MM-DD`.
- Query booleans must be the literal strings `"true"` / `"false"`.
- Paginated lists take `page` (default 1) and `limit` (default 10, **max 100**).

## 4. Enums

```ts
type Role = "ADMIN" | "PROVIDER" | "CUSTOMER";
type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
type RentalOrderStatus = "PLACED" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED";
type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";
```

## 5. Models (as returned in JSON)

```ts
type User = {
  id: string; name: string; email: string; phone: string;
  role: Role; status: UserStatus; createdAt: string; updatedAt: string;
}; // password is never returned

type Category = { id: string; name: string; createdAt: string; updatedAt: string };
// No description, icon, slug or item count. Keep presentation (icon, tone, copy)
// in a frontend map keyed by category name.

type GearItem = {
  id: string; categoryId: string; providerId: string;
  name: string; description: string; stock: number; isAvailable: boolean;
  pricePerDay: DecimalValue;
  imageUrl: string | null;   // primary image, mirrors imageUrls[0]
  imageUrls: string[];       // ordered gallery, max 4
  brand: string | null;
  createdAt: string; updatedAt: string;
};
// No rating, reviewCount, campus or slug. Rating must be derived from reviews.

type RentalOrder = {
  id: string; gearItemId: string; customerId: string;
  startDate: string; endDate: string; totalPrice: DecimalValue; quantity: number;
  status: RentalOrderStatus; createdAt: string; updatedAt: string;
};

type Payment = {
  id: string; rentalOrderId: string; amount: DecimalValue;
  stripePaymentIntentId: string | null; stripeSessionId: string | null;
  status: PaymentStatus; createdAt: string; updatedAt: string;
};

type Review = {
  id: string; rentalOrderId: string; gearItemId: string; customerId: string;
  rating: DecimalValue; comment: string | null; createdAt: string; updatedAt: string;
};
```

## 6. Authentication

The backend issues a JWT **access token** (lifetime `JWT_ACCESS_EXPIRES_IN`, 1h
in the example config) and **refresh token** (7d). It also sets httpOnly cookies,
but those are set on the *backend's* domain and responses to server-side fetches
never reach the browser. So the frontend owns its session:

1. A Server Action calls `/auth/login` or `/auth/register` through `campusGearFetch`.
2. It stores `data.accessToken` and `data.refreshToken` in cookies named
   **`accessToken`** and **`refreshToken`** on the frontend domain via
   `(await cookies()).set(...)` — `httpOnly: true`, `sameSite: "lax"`,
   `secure` in production, `path: "/"`.
3. Authenticated calls pass `auth: true` to `campusGearFetch`, which reads the
   `accessToken` cookie and sends `Authorization: Bearer <token>`.
4. On `401` with a `refreshToken` cookie present, call `/auth/refresh-token`
   with `{ refreshToken }` in the body, overwrite the `accessToken` cookie, and
   retry once. If the refresh fails, clear both cookies and send the user to `/login`.
5. Logout: call `/auth/logout` (harmless) **and** delete both frontend cookies.

The JWT payload is `{ id, name, email, role }`. Use `GET /auth/me` for the
current user rather than decoding the token for anything security-relevant.
Route protection in `src/proxy.ts` (Next 16's replacement for middleware) is an
optimistic check only; the backend's role guard is the real authority.

## 7. Endpoints

Access: **Public**, **Auth** (any signed-in role), or the listed roles.
`403` is returned when the role does not match.

### Auth — `/auth`

| Method | Path | Access | Body / query | `data` |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Public | `{ name, email, password, phone, role? }` | `{ accessToken, refreshToken }` (201) |
| POST | `/auth/login` | Public | `{ email, password }` | `{ accessToken, refreshToken }` |
| POST | `/auth/logout` | Public | — | `null` |
| POST | `/auth/refresh-token` | Public | `{ refreshToken }` | `{ accessToken }` |
| GET | `/auth/me` | Auth | — | `User` |
| PATCH | `/auth/me` | Auth | non-empty subset of `{ name, phone }` | `User` |

Validation:
- `name` trimmed, min 1 char (register) / 2–255 (`PATCH /auth/me`).
- `email` valid email; lowercased by the backend.
- `password` min 6 chars (the frontend signup schema is stricter — fine).
- `phone` **required** on register, regex `^\+?[0-9\s-]{7,20}$`, unique.
- `role` is `"CUSTOMER"` (default) or `"PROVIDER"`. `"ADMIN"` → 403.

Errors: duplicate email → 409 `"User already exists with this email"`;
duplicate phone → 409 `"User already exists with this phone number"`;
wrong credentials → 401 `"Invalid Credentials. Please try again."`;
suspended/inactive → 403.

### Categories — `/categories`

| Method | Path | Access | Body / query | `data` |
| --- | --- | --- | --- | --- |
| GET | `/categories` | Public | `?search` (1–100 chars, case-insensitive) | `Category[]` sorted by name, **not paginated** |
| POST | `/categories` | ADMIN | `{ name }` (2–255) | `Category` |
| PATCH | `/categories/:id` | ADMIN | `{ name }` | `Category` |
| DELETE | `/categories/:id` | ADMIN | — | `Category` (fails if gear still uses it) |

### Gear — `/gear`

| Method | Path | Access | Body / query | `data` |
| --- | --- | --- | --- | --- |
| GET | `/gear` | Public | see filters below | `GearListItem[]` + `meta` |
| GET | `/gear/price-range` | Public | — | `{ minPrice: DecimalValue \| null, maxPrice: DecimalValue \| null }` |
| GET | `/gear/:id` | Public | — | `GearDetail` |
| POST | `/gear` | PROVIDER, ADMIN | create body below | `GearItem` + `category` + `provider` |
| PATCH | `/gear/:id` | PROVIDER (own), ADMIN | non-empty partial of create body (no `providerId`) | same as POST |
| DELETE | `/gear/:id` | PROVIDER (own), ADMIN | — | `GearItem` |

```ts
type GearListItem = GearItem & { category: Category; provider: { id: string; name: string } };
type GearDetail = GearItem & {
  category: Category;
  provider: { id: string; name: string; email: string };
  reviews: (Review & { customer: { id: string; name: string } })[]; // newest first
};
```

`GET /gear` filters (all optional):
`search` (name, description, brand, category name, provider name),
`category` (category **UUID or exact name**, case-insensitive), `brand` (exact,
case-insensitive), `providerId`, `price`, `minPrice`, `maxPrice`
(`minPrice <= maxPrice`), `isAvailable` / `inStock` (`"true"|"false"`),
`startDate` + `endDate` (**both or neither**, `YYYY-MM-DD`, start <= end —
returns only items with at least one unit free for those dates), `page`, `limit`.
Sorted newest first.

Create body: `categoryId` (UUID, required), `name` (2–255, required),
`description` (min 10, required), `pricePerDay` (number > 0, required),
`stock` (int >= 0), `isAvailable` (bool), `imageUrl` (URL | null),
`imageUrls` (URL[] max 4), `brand` (1–255 | null), `providerId` (ADMIN only).
Send numbers as JSON numbers, not strings. There is **no upload endpoint** —
images are URLs the frontend already has.

### Rental orders — `/orders`

| Method | Path | Access | Body / query | `data` |
| --- | --- | --- | --- | --- |
| GET | `/orders` | Auth (role-scoped) | `?search&status&paymentStatus&page&limit` | `OrderDetail[]` + `meta` |
| POST | `/orders` | CUSTOMER | `{ gearItemId, startDate, endDate, quantity? }` | `CreatedOrder` (201) |
| GET | `/orders/:id` | Auth (role-scoped) | — | `OrderDetail` |
| PATCH | `/orders/:id/status` | Auth (role-scoped) | `{ status }` | `OrderDetail` |
| POST | `/orders/:id/checkout-session` | CUSTOMER | — | `CheckoutSession` |
| POST | `/orders/webhook` | Stripe only | — | **never call from the frontend** |

```ts
type OrderDetail = RentalOrder & {
  gearItem: GearItem & { category: Category; provider: { id: string; name: string; email: string } };
  customer: { id: string; name: string; email: string; phone: string };
  payment: Payment | null;
};
type CreatedOrder = {
  orderId: string; status: "PLACED"; startDate: string; endDate: string;
  rentalDays: number; quantity: number; totalPrice: DecimalValue; paymentStatus: PaymentStatus;
};
type CheckoutSession = {
  orderId: string; paymentId: string; paymentStatus: PaymentStatus;
  stripeSessionId: string; checkoutUrl: string; reused: boolean;
};
```

Scoping: customers see their own orders, providers see orders for their gear,
admins see all. Out-of-scope IDs return 404. The backend calculates the price and
rental days; never send or trust a client-side total. Dates are inclusive.

Order lifecycle:

```text
PLACED ──(provider/admin: CONFIRMED)──▶ CONFIRMED ──(customer pays via Stripe; webhook)──▶ PAID
PAID ──(provider/admin: PICKED_UP)──▶ PICKED_UP ──(provider/admin: RETURNED)──▶ RETURNED
PLACED or CONFIRMED ──(anyone in scope: CANCELLED)──▶ CANCELLED
```

- Customers may only send `status: "CANCELLED"`.
- `PAID` is never sent by the frontend — only the Stripe webhook sets it.
- An illegal transition → 409 `"Order status cannot change from X to Y"`.
- Stock is reserved only by `CONFIRMED`, `PAID` and `PICKED_UP` orders, so
  confirming can fail with 409 if stock ran out.

Checkout flow:
1. The order must be `CONFIRMED` with a `PENDING` payment.
2. `POST /orders/:id/checkout-session` → redirect the browser to `data.checkoutUrl`
   (from a Server Action, `redirect(checkoutUrl)`). Calling it again while a session
   is open returns the same URL with `reused: true`.
3. Stripe returns the user to pages **the frontend must implement**:
   - `/payment/success?session_id=<id>`
   - `/payment/cancel?order_id=<id>`
4. The webhook may land after the redirect. On the success page, re-fetch the
   order and show a "confirming payment" state until it becomes `PAID`.

### Payments — `/payments`

| Method | Path | Access | Query | `data` |
| --- | --- | --- | --- | --- |
| GET | `/payments` | Auth (role-scoped) | `search, status (PaymentStatus), orderStatus (RentalOrderStatus), page, limit` | `PaymentDetail[]` + `meta` |
| GET | `/payments/:id` | Auth (role-scoped) | — | `PaymentDetail` |

```ts
type PaymentDetail = Payment & {
  rentalOrder: RentalOrder & {
    gearItem: GearItem & { provider: { id: string; name: string; email: string } };
    customer: { id: string; name: string; email: string; phone: string };
  };
};
```

### Reviews — `/reviews`

| Method | Path | Access | Body / query | `data` |
| --- | --- | --- | --- | --- |
| GET | `/reviews` | Public | `?search&gearItemId&rating&page&limit` | `ReviewDetail[]` + `meta` |
| GET | `/reviews/:id` | Public | — | `ReviewDetail` |
| POST | `/reviews` | CUSTOMER | `{ orderId, rating, comment? }` | `ReviewDetail` |
| PATCH | `/reviews/:id` | CUSTOMER (own) | non-empty subset of `{ rating, comment \| null }` | `ReviewDetail` |
| DELETE | `/reviews/:id` | CUSTOMER (own), ADMIN | — | `ReviewDetail` |

```ts
type ReviewDetail = Review & {
  gearItem: { id: string; name: string; imageUrl: string | null };
  customer: { id: string; name: string };
  rentalOrder: { id: string; status: RentalOrderStatus; startDate: string; endDate: string };
};
```

- `rating` is a number from 1 to 5 with at most one decimal (4.5 ok, 4.55 → 400).
- `comment` is 3–2000 chars.
- Only an order that is `RETURNED` can be reviewed, once per order. The body takes
  **`orderId`**, not `gearItemId`.

### Users (admin) — `/users` (every route is ADMIN)

| Method | Path | Body / query | `data` |
| --- | --- | --- | --- |
| GET | `/users` | `?search&role&status&page&limit` | `AdminUser[]` + `meta` |
| POST | `/users/admins` | `{ name, email, phone, password }` | `AdminUser` |
| GET | `/users/:id` | — | `AdminUser` |
| PATCH | `/users/:id/status` | `{ status: UserStatus }` | `AdminUser` |
| PATCH | `/users/:id` | non-empty subset of `{ name, email, phone, role }` | `AdminUser` |

```ts
type AdminUser = User & { _count: { gearItems: number; rentalOrders: number; reviews: number } };
```

409 guards: an admin cannot change their own role or status; a provider who
still owns gear cannot change role; a customer with active orders cannot change role.

## 8. Mapping existing frontend features

| Frontend | Backend | Notes |
| --- | --- | --- |
| `LoginForm` (`src/components/auth/login-form.tsx`) | `POST /auth/login` | `rememberMe` is frontend-only: it controls whether the cookies get a `maxAge` (persistent) or are session cookies. |
| `SignupForm` (`src/components/auth/signup-form.tsx`) | `POST /auth/register` | Map `fullName → name`, `accountType: "renter" → "CUSTOMER"`, `"provider" → "PROVIDER"`. Drop `confirmPassword` and `acceptTerms`. The form **needs a new `phone` field** (required by the backend). Map 400 `errorDetails` field `name → fullName`, and 409 duplicate email/phone to their fields. |
| Landing `categories` (`src/lib/landing-data.ts`) | `GET /categories` | Merge by name with a local presentation map (icon, tone, description). For the item count, use `meta.total` from `GET /gear?category=<id>&limit=1`. |
| Landing `featuredItems` | `GET /gear?limit=6&isAvailable=true&inStock=true` | `rating`/`reviewCount` aren't in list responses. Omit them, or compute them from `GET /reviews?gearItemId=` (or from `GearDetail.reviews`). `campus` doesn't exist in the backend. |
| Gear links (`/gear/<slug>`) | `GET /gear/:id` | There are no slugs. Detail routes must use the UUID: `/gear/[id]`. Category browse uses `/gear?category=<id or name>`. |
