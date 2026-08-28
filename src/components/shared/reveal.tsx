"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState, type ElementType } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in ms, applied to sibling items in a grid. */
  delay?: number;
  /** Rendered element. Sections pass their own semantic tag. */
  as?: ElementType;
};

/**
 * Fades content up as it scrolls into view.
 *
 * The hidden start state lives behind a `scripting: enabled` media query in
 * globals.css, so the markup renders fully visible when JS never runs, and the
 * global reduced-motion block drops the transition for users who ask for that.
 * The observer disconnects after the first intersection — this is an entrance,
 * not a scroll-linked effect.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;

    // Content already on screen at mount (the hero) should not wait for a
    // scroll event that may never come.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shown]);

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? "shown" : "pending"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </Tag>
  );
}
