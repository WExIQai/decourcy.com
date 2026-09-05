"use client";

import { useState } from "react";
import { DishGlyph, MeshNodeGlyph, CheckGlyph, WifiGlyph } from "./Glyphs";

const BLUE = "#5b9bd5";
const SKY = "#a8d4ff";

/* Glyph-only mock of the two in-app switches the owner touches. */

function Switch({
  on,
  onChange,
  label,
  color = BLUE,
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

function PhoneFrame({ title, tint, children }: { title: string; tint: string; children: React.ReactNode }) {
  return (
    <div className="w-full rounded-lg border border-[#1a4a2e] bg-[#071a0e] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a4a2e]">
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: tint }}>
          {title}
        </span>
        <span className="flex gap-1" aria-hidden>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span className="w-1 h-1 rounded-full bg-white/30" />
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function StarlinkServiceToggle() {
  const [on, setOn] = useState(false);
  return (
    <PhoneFrame title="Starlink app · Service" tint={SKY}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded border border-[#a8d4ff]/40 bg-[#0d2b18] flex items-center justify-center text-[#a8d4ff]">
          <DishGlyph size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-bold uppercase tracking-wider text-white/90">Starlink service</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] mt-0.5" style={{ color: on ? SKY : "rgba(255,255,255,0.4)" }}>
            {on ? "Active · full speed" : "Paused · standing by"}
          </div>
        </div>
        <Switch on={on} onChange={setOn} label="Toggle Starlink service" color={SKY} />
      </div>
      <div className="mt-4 rounded border border-dashed border-[#1a4a2e] p-3 text-[12px] leading-relaxed text-white/60">
        {on ? (
          <>
            <span className="text-[#a8d4ff] font-semibold">Resumed.</span> The dish is already tracking satellites, so the Eero gateway
            starts moving traffic over ScottBackup within about a minute. Pause again once the hardline is back.
          </>
        ) : (
          <>
            <span className="text-white/85 font-semibold">Paused.</span> The dish stays powered and ScottBackup stays on the air, but you
            are not paying for a plan you aren&apos;t using. Flip this on when the wire goes dark.
          </>
        )}
      </div>
    </PhoneFrame>
  );
}

export function EeroBackupToggle() {
  const [on, setOn] = useState(true);
  return (
    <PhoneFrame title="Eero app · Internet Backup" tint={BLUE}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded border border-[#5b9bd5]/40 bg-[#0d2b18] flex items-center justify-center text-[#5b9bd5]">
          <MeshNodeGlyph size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-bold uppercase tracking-wider text-white/90">Internet Backup</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] mt-0.5" style={{ color: on ? BLUE : "#e0605a" }}>
            {on ? "Armed · auto failover" : "Off · no failover"}
          </div>
        </div>
        <Switch on={on} onChange={setOn} label="Toggle Eero Internet Backup" />
      </div>
      <div className="mt-4 rounded border border-[#1a4a2e] bg-[#0d2b18] divide-y divide-[#1a4a2e]">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <WifiGlyph size={16} className="text-[#5b9bd5] shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold tracking-wider text-white/90 uppercase">ScottBackup</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35">Saved backup network</div>
          </div>
          <CheckGlyph size={16} className="text-[#5b9bd5] shrink-0" style={{ opacity: on ? 1 : 0.25 }} />
        </div>
        <div className="px-3 py-2.5 text-[11px] leading-relaxed text-white/55">
          {on
            ? "Leave this on. The gateway will switch to ScottBackup by itself the moment the hardline fails, and back again when it returns."
            : "With this off, an outage is just an outage. Keep it on."}
        </div>
      </div>
    </PhoneFrame>
  );
}
