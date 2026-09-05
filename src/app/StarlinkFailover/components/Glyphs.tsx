import type { CSSProperties } from "react";

/* Small inline glyphs used in HTML cards (no photos, no icon libraries). */

type P = { className?: string; size?: number; style?: CSSProperties };

const base = (size?: number) => ({
  width: size ?? 20,
  height: size ?? 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export function SatelliteGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <rect x="9.5" y="9" width="5" height="6" />
      <path d="M3 10h5M16 10h5M3 14h5M16 14h5" />
      <rect x="3" y="9" width="5" height="6" />
      <rect x="16" y="9" width="5" height="6" />
      <path d="M12 15v3M9.5 20a2.5 2.5 0 0 1 5 0" />
    </svg>
  );
}

export function DishGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M5 11 17 4a1 1 0 0 1 1.4 1.3L11 15z" />
      <path d="M11 15v6M8 21h6" />
      <path d="M17.5 8.5c1.2 1.4 1.7 3 1.5 4.5" />
    </svg>
  );
}

export function RouterGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <rect x="3" y="13" width="18" height="6" rx="1" />
      <path d="M7 16h.01M10 16h.01" />
      <path d="M12 13V7" />
      <path d="M8.5 6.5a5 5 0 0 1 7 0M6 4a8.5 8.5 0 0 1 12 0" />
    </svg>
  );
}

export function MeshNodeGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <circle cx="12" cy="12" r="3" />
      <circle cx="4.5" cy="5" r="1.8" />
      <circle cx="19.5" cy="5" r="1.8" />
      <circle cx="4.5" cy="19" r="1.8" />
      <circle cx="19.5" cy="19" r="1.8" />
      <path d="M6 6.3 9.8 9.8M18 6.3l-3.8 3.5M6 17.7l3.8-3.5M18 17.7l-3.8-3.5" />
    </svg>
  );
}

export function PhoneGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

export function WifiGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

export function CableGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M3 12h4M17 12h4" />
      <rect x="7" y="8" width="10" height="8" rx="1.5" />
      <path d="M10 8V6M14 8V6" />
    </svg>
  );
}

export function CheckGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}

export function CrossGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function WrenchGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M14.5 6.5a4 4 0 0 0 4.6 4.6L21 13l-8 8-3-3 8-8-1.9-1.9a4 4 0 0 0-4.6-4.6L14.5 6.5z" />
      <path d="M3 21l6-6" />
    </svg>
  );
}

export function EyeGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

export function BoltGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  );
}

export function HouseGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function ToggleGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <rect x="2" y="7" width="20" height="10" rx="5" />
      <circle cx="16" cy="12" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TagGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M3 12V4h8l10 10-8 8L3 12z" />
      <circle cx="7.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PlayGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ClockGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function LayersGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M12 3 3 8l9 5 9-5-9-5z" />
      <path d="M3 12l9 5 9-5M3 16l9 5 9-5" />
    </svg>
  );
}

export function LinkGlyph({ className, size, style }: P) {
  return (
    <svg {...base(size)} className={className} style={style}>
      <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2" />
      <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2" />
    </svg>
  );
}
