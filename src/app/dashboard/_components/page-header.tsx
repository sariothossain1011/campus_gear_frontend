type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-6 border-b border-ink/15 pb-10 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="flex items-center gap-3 font-mono text-[0.65rem] font-bold uppercase tracking-[0.22em] text-signal">
          <span aria-hidden="true" className="h-px w-6 bg-signal/50" />
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,4.5rem)] font-black uppercase leading-[0.88] tracking-[-0.05em] text-balance">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-ink/65 sm:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
