"use client";

import { useState } from "react";
import { DishGlyph } from "./Glyphs";

const SKY = "#a8d4ff";

/* Glyph-only mock of the one switch the owner touches: Starlink app → Service. */

function Switch({
  on,
  onChange,
  label,
  color = SKY,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className="relative shrink-0 w-14 h-8 rounded-full border transition-colors"
      style={{
        background: on ? color : "#071a0e",
        borderColor: on ? color : "#1a4a2e",
        boxShadow: on ? `0 0 16px ${color}66` : "none",
      }}
    >
      <span
        className="absolute top-1 w-6 h-6 rounded-full transition-transform"
        style={{
          left: 3,
          transform: on ? "translateX(24px)" : "translateX(0)",
          background: on ? "#071a0e" : "rgba(255,255,255,0.5)",
        }}
      />
    </button>
  );
}

export function StarlinkServiceToggle() {
  const [on, setOn] = useState(false);
  return (
    <div className="w-full rounded-lg border border-[#1a4a2e] bg-[#071a0e] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a4a2e]">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: SKY }}>
          Starlink app · Service
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">Try it</span>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded border border-[#a8d4ff]/40 bg-[#0d2b18] flex items-center justify-center text-[#a8d4ff]">
            <DishGlyph size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-bold uppercase tracking-wider text-white/90">Service</div>
            <div
              className="text-[10px] font-bold uppercase tracking-[0.16em] mt-0.5"
              style={{ color: on ? SKY : "rgba(255,255,255,0.4)" }}
            >
              {on ? "On" : "Paused"}
            </div>
          </div>
          <Switch on={on} onChange={setOn} label="Toggle Starlink service" />
        </div>
        <div className="mt-4 rounded border border-dashed border-[#1a4a2e] p-3 text-[13px] leading-relaxed text-white/70">
          {on ? (
            <>
              <span className="text-[#a8d4ff] font-semibold">Service is on.</span> The house has internet
              from Starlink. Turn service off when the wired internet is back.
            </>
          ) : (
            <>
              <span className="text-white/90 font-semibold">Service is paused.</span> The dish stays
              powered and ready. Turn service on when the wired internet fails.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
