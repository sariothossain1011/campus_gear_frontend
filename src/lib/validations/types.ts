
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

export type LoginInput = {
  email: string;
  password: string;
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