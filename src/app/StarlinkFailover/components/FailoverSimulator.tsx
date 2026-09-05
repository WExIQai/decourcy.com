"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HouseDiagram } from "./HouseDiagram";
import { PlayGlyph } from "./Glyphs";

const BLUE = "#5b9bd5";
const RED = "#e0605a";

function easeInOut(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * The state slider + live status readout + house diagram.
 * `t` is continuous while dragging and snaps (animated) to 0 or 1 on release.
 */
export function FailoverSimulator() {
  const [t, setT] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [drill, setDrill] = useState(false);
  const raf = useRef<number | null>(null);
  const timers = useRef<number[]>([]);
  const tRef = useRef(0);

  // Single writer for `t`: keeps the ref (read inside animations) in sync
  // without touching it during render.
  const update = useCallback((v: number) => {
    tRef.current = v;
    setT(v);
  }, []);

  const cancelAnim = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
  }, []);

  const animateTo = useCallback(
    (target: number, ms = 600) =>
      new Promise<void>((resolve) => {
        cancelAnim();
        const from = tRef.current;
        const start = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - start) / ms);
          const v = from + (target - from) * easeInOut(k);
          update(v);
          if (k < 1) raf.current = requestAnimationFrame(step);
          else {
            raf.current = null;
            resolve();
          }
        };
        raf.current = requestAnimationFrame(step);
      }),
    [cancelAnim, update],
  );

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => () => {
    cancelAnim();
    clearTimers();
  }, [cancelAnim]);

  const snap = () => {
    setDragging(false);
    void animateTo(tRef.current >= 0.5 ? 1 : 0, 350);
  };

  const runDrill = async () => {
    if (drill) return;
    setDrill(true);
    clearTimers();
    await animateTo(0, 300);
    await new Promise<void>((r) => timers.current.push(window.setTimeout(r, 400)));
    await animateTo(1, 1400);
    await new Promise<void>((r) => timers.current.push(window.setTimeout(r, 3600)));
    await animateTo(0, 1400);
    setDrill(false);
  };

  const backup = t >= 0.5;
  const pct = Math.round(t * 100);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start">
      {/* ── Diagram ── */}
      <div className="w-full rounded-md border border-[#1a4a2e] bg-[#071a0e] sf-grid overflow-hidden">
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">Live cross-section</span>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.22em] transition-colors"
            style={{ color: backup ? "#a8d4ff" : BLUE }}
          >
            {backup ? "Backup operation" : "Normal operation"}
          </span>
        </div>
        <HouseDiagram t={t} />
      </div>

      {/* ── Controls + readout ── */}
      <div className="w-full flex flex-col gap-4">
        {/* Slider */}
        <div className="rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-4">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
            <button
              type="button"
              onClick={() => void animateTo(0)}
              className={`py-1 transition-colors ${!backup ? "text-white" : "text-white/40 hover:text-white/70"}`}
            >
              Normal
            </button>
            <span className="text-white/25 tracking-[0.1em]">drag</span>
            <button
              type="button"
              onClick={() => void animateTo(1)}
              className={`py-1 transition-colors ${backup ? "text-[#a8d4ff]" : "text-white/40 hover:text-white/70"}`}
            >
              Backup
            </button>
          </div>

          <div className="relative h-11">
            {/* track */}
            <div className="absolute left-[15px] right-[15px] top-1/2 -translate-y-1/2 h-1.5 rounded-full bg-[#071a0e] border border-[#1a4a2e]" />
            <div
              className="absolute left-[15px] top-1/2 -translate-y-1/2 h-1.5 rounded-full"
              style={{
                width: `calc(${pct}% - ${(pct / 100) * 30}px)`,
                background: `linear-gradient(90deg, ${BLUE}, #a8d4ff)`,
                boxShadow: "0 0 12px rgba(91,155,213,0.5)",
              }}
            />
            {/* end ticks */}
            <div className="absolute left-[15px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#5b9bd5]" />
            <div className="absolute right-[15px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#a8d4ff]/70" />
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={pct}
              aria-label="Operating state: slide left for normal operation, right for backup operation"
              aria-valuetext={backup ? "Backup operation" : "Normal operation"}
              className="sf-range absolute inset-0"
              onPointerDown={() => {
                cancelAnim();
                setDragging(true);
              }}
              onChange={(e) => {
                cancelAnim();
                update(Number(e.target.value) / 100);
              }}
              onPointerUp={snap}
              onPointerCancel={snap}
              onBlur={() => dragging && snap()}
              onKeyUp={(e) => {
                if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(e.key)) snap();
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-white/35">
            <span>Hardline</span>
            <span>Starlink</span>
          </div>

          <button
            type="button"
            onClick={() => void runDrill()}
            disabled={drill}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded border border-[#5b9bd5]/40 bg-[#071a0e] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b9bd5] hover:border-[#5b9bd5]/80 hover:text-[#a8d4ff] disabled:opacity-50 transition-colors"
          >
            <PlayGlyph size={14} />
            {drill ? "Drill running…" : "Run outage drill"}
          </button>
        </div>

        {/* Status console */}
        <div className="rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-4 font-mono">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40 mb-3 font-sans">Network status</div>
          <StatusRow
            label="Hardline"
            sub="Primary WAN"
            state={backup ? "down" : "up"}
            text={backup ? "OUTAGE" : "ONLINE"}
          />
          <StatusRow
            label="ScottBackup"
            sub="Starlink · Backup WAN"
            state={backup ? "up-sky" : "idle"}
            text={backup ? "ACTIVE" : "STANDBY"}
          />
          <StatusRow label="ScottHome" sub="Eero Pro 7 · 4 nodes" state="up" text="ALL DEVICES ONLINE" last />

          <div className="mt-4 pt-3 border-t border-[#1a4a2e]">
            <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35 mb-1.5 font-sans">Data path</div>
            <div className="text-[11px] leading-relaxed" style={{ color: backup ? "#a8d4ff" : BLUE }}>
              {backup ? "SATELLITE → DISH → SCOTTBACKUP →(WI-FI)→ GATEWAY → MESH" : "STREET → MODEM → GATEWAY → MESH"}
            </div>
          </div>
        </div>

        <p className="text-[12px] leading-relaxed text-white/55 px-1">
          Notice what does <span className="text-white/85 font-semibold">not</span> change: every phone, laptop and TV stays on{" "}
          <span className="text-white/85 font-semibold">ScottHome</span>. Only the gateway&apos;s upstream swaps.
        </p>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  sub,
  state,
  text,
  last = false,
}: {
  label: string;
  sub: string;
  state: "up" | "up-sky" | "idle" | "down";
  text: string;
  last?: boolean;
}) {
  const dot =
    state === "down"
      ? { bg: RED, cls: "sf-pulse-red", ring: "" }
      : state === "idle"
        ? { bg: "transparent", cls: "", ring: `1.5px solid ${BLUE}` }
        : { bg: state === "up-sky" ? "#a8d4ff" : BLUE, cls: "sf-pulse", ring: "" };
  const color = state === "down" ? RED : state === "idle" ? "rgba(255,255,255,0.45)" : state === "up-sky" ? "#a8d4ff" : BLUE;

  return (
    <div className={`flex items-center gap-3 py-2 ${last ? "" : "border-b border-[#1a4a2e]/70"}`}>
      <span
        className={`shrink-0 inline-block w-2.5 h-2.5 rounded-full ${dot.cls}`}
        style={{ background: dot.bg, border: dot.ring || undefined }}
        aria-hidden
      />
      <div className="min-w-0 flex-1 font-sans">
        <div className="text-[12px] font-bold uppercase tracking-wider text-white/90 leading-tight">{label}</div>
        <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/35 leading-tight mt-0.5 whitespace-nowrap">{sub}</div>
      </div>
      <div className="text-[10px] font-bold tracking-[0.14em] text-right leading-tight max-w-[104px]" style={{ color }}>
        {text}
      </div>
    </div>
  );
}
