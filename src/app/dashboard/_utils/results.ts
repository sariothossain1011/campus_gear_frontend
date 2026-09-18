import type { ApiProblem, ApiResult } from "@/lib/validations/types";

/** `meta.total` of a paginated call, or null when it failed. */
export function totalOf(result: ApiResult<unknown>): number | null {
  return result.ok ? (result.meta?.total ?? null) : null;
}

/** Sum of several totals; null if any of them is unknown. */
export function sumTotals(...totals: (number | null)[]): number | null {
  return totals.some((total) => total === null)
    ? null
    : totals.reduce<number>((sum, total) => sum + (total ?? 0), 0);
}

/** Distinct failures across the calls a page made, for one banner. */
export function problemsOf(...results: ApiResult<unknown>[]): ApiProblem[] {
  const seen = new Set<string>();
  const problems: ApiProblem[] = [];

  for (const result of results) {
    if (result.ok || seen.has(result.error.message)) continue;
    seen.add(result.error.message);
    problems.push(result.error);
  }

  return problems;
}
