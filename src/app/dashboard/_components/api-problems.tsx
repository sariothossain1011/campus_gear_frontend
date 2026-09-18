import { TriangleAlert } from "lucide-react";

import type { ApiProblem } from "@/lib/validations/types";

/**
 * Persistent notice for data that failed to load. Counts it affects render as
 * dashes, so a failure never masquerades as "you have nothing".
 */
export function ApiProblems({ problems }: { problems: ApiProblem[] }) {
  if (problems.length === 0) return null;

  return (
    <div
      role="alert"
      className="mt-8 flex items-start gap-3 border border-destructive/40 bg-destructive/8 px-5 py-4 text-sm leading-6 text-destructive"
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-4.5 shrink-0" />
      <div>
        <p className="font-bold">Some of your dashboard couldn&apos;t be loaded.</p>
        <ul className="mt-1 list-disc pl-5">
          {problems.map((problem) => (
            <li key={problem.message}>{problem.message}</li>
          ))}
        </ul>
        <p className="mt-1 text-destructive/80">Refresh the page to try again.</p>
      </div>
    </div>
  );
}
