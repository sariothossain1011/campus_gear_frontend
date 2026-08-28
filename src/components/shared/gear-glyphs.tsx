import type { ComponentProps } from "react";

/**
 * Two sports glyphs lucide does not ship. Drawn on lucide's own grid — 24×24
 * viewBox, currentColor stroke, round caps and joins — so they sit beside the
 * icon set without reading as a different family.
 *
 * Each shape is drawn axis-aligned inside a rotated <g>, which keeps the path
 * data readable and the proportions easy to adjust.
 */

type GlyphProps = ComponentProps<"svg"> & { strokeWidth?: number };

function Glyph({ strokeWidth = 2, children, ...props }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CricketBatGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <g transform="rotate(-40 12 12)">
        {/* Blade */}
        <rect x="8" y="8.5" width="8" height="12" rx="2" />
        {/* Splice and handle */}
        <path d="M12 8.5V3" />
        <path d="M9.8 3h4.4" />
      </g>
    </Glyph>
  );
}

export function TennisRacketGlyph(props: GlyphProps) {
  return (
    <Glyph {...props}>
      <g transform="rotate(35 12 12)">
        {/* Head */}
        <ellipse cx="12" cy="7.5" rx="6" ry="6.5" />
        {/* Strings */}
        <path d="M12 1v13" />
        <path d="M6 7.5h12" />
        {/* Throat and grip */}
        <path d="M10.4 13.6 12 21" />
        <path d="M13.6 13.6 12 21" />
        <path d="M10.4 21h3.2" />
      </g>
    </Glyph>
  );
}
