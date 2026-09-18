/** Shown inside the shell while a dashboard page fetches its counts. */
export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Loading your dashboard"
      className="animate-pulse px-5 py-10 sm:px-8 sm:py-14 lg:px-12"
    >
      <div className="border-b border-ink/15 pb-10">
        <div className="h-3 w-40 bg-ink/10" />
        <div className="mt-5 h-14 w-full max-w-md bg-ink/10" />
        <div className="mt-5 h-4 w-full max-w-xl bg-ink/10" />
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="min-h-44 border border-ink/10 bg-ink/5" />
        ))}
      </div>
      <div className="mt-14 h-64 border border-ink/10 bg-ink/5" />
    </div>
  );
}
