/**
 * Route group for the authentication screens.
 *
 * Grouped so `/login` and `/signup` keep their top-level URLs while opting out
 * of the marketing header and footer — a form page should not offer the whole
 * site nav as competing exits.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-100 focus-visible:bg-ink focus-visible:px-5 focus-visible:py-3 focus-visible:font-mono focus-visible:text-xs focus-visible:font-bold focus-visible:uppercase focus-visible:tracking-[0.16em] focus-visible:text-paper"
      >
        Skip to form
      </a>
      {children}
    </>
  );
}
