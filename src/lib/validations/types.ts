
export type DecimalValue = string | number;

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type RefreshedAccessToken = Pick<AuthTokens, "accessToken">;

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

/** Public sign-up can only create these; admins are created by other admins. */
export type RegistrableRole = Exclude<Role, "ADMIN">;

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: RegistrableRole;
};

/** `GET /auth/me` — the backend omits the password hash. */
export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
};

/**
 * What the header and other chrome know about the visitor without a network
 * call: claims decoded from the session cookie. Unverified — good for choosing
 * which links to show, never for authorizing anything.
 */
export type SessionHint = {
  name: string | null;
  role: Role | null;
};

/**
 * Result the auth Server Actions hand back to the forms. Success redirects, so
 * only failures are ever returned.
 */
export type AuthActionResult = {
  ok: false;
  message: string;
  fieldErrors?: FieldErrors;
};

export type ApiResult<T> =
  | {
      ok: true;
      status: number;
      message: string;
      data: T;
      meta?: ApiMeta;
    }
  | {
      ok: false;
      error: ApiProblem;
    };



export type FieldErrors = Record<string, string[]>;

export type ApiProblem = {
  status: number | null;
  code: "configuration" | "network" | "http" | "invalid-response";
  message: string;
  fieldErrors?: FieldErrors;
  retryable: boolean;
};