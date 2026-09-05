"use client";

import { useEffect, useRef, useState } from "react";
import { HouseDiagram } from "./HouseDiagram";

const BLUE = "#5b9bd5";
const SKY = "#a8d4ff";
const RED = "#e0605a";

/* Timing of the automatic loop. */
const HOLD_MS = 5200; // time spent in each state
const FADE_MS = 1500; // cross-fade between states
const CYCLE_MS = 2 * (HOLD_MS + FADE_MS);

function easeInOut(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Non-interactive: the house cycles Normal → Backup → Normal on its own.
 * Both states are named on screen; the current one is highlighted.
 * The loop only runs while the diagram is on screen.
 */
export function FailoverSimulator() {
  const [t, setT] = useState(0);
  const [backup, setBackup] = useState(false);
  const [cycle, setCycle] = useState(0); // increments on every state change; restarts the progress bar
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const elapsedRef = useRef(0); // position inside the cycle, kept across pauses
  const tRef = useRef(0);
  const backupRef = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const origin = performance.now() - elapsedRef.current;
    const tick = (now: number) => {
      const e = (now - origin) % CYCLE_MS;
      elapsedRef.current = e;
      let next: number;
      if (e < HOLD_MS) next = 0;
      else if (e < HOLD_MS + FADE_MS) next = easeInOut((e - HOLD_MS) / FADE_MS);
      else if (e < 2 * HOLD_MS + FADE_MS) next = 1;
      else next = 1 - easeInOut((e - 2 * HOLD_MS - FADE_MS) / FADE_MS);

      if (next !== tRef.current) {
        tRef.current = next;
        setT(next);
      }
      const isBackup = next >= 0.5;
      if (isBackup !== backupRef.current) {
        backupRef.current = isBackup;
        setBackup(isBackup);
        setCycle((c) => c + 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div ref={rootRef} className="w-full flex flex-col gap-4">
      {/* ── The two states, both always named ── */}
      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Operating state">
        <StateCard
          active={!backup}
          color={BLUE}
          title="Normal"
          line="Internet from the wired connection"
          cycleKey={cycle}
        />
        <StateCard
          active={backup}
          color={SKY}
          title="Backup"
          line="Internet from Starlink"
          cycleKey={cycle}
        />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 lg:gap-6 items-start">
        {/* ── Diagram ── */}
        <div className="w-full rounded-md border border-[#1a4a2e] bg-[#071a0e] sf-grid overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">The house</span>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.22em] transition-colors"
              style={{ color: backup ? SKY : BLUE }}
            >
              {backup ? "Backup operation" : "Normal operation"}
            </span>
          </div>
          <HouseDiagram t={t} />
        </div>

        {/* ── Status console ── */}
        <div className="w-full flex flex-col gap-4">
          <div className="rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-4 font-mono">
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40 mb-3 font-sans">Network status</div>
            <StatusRow
              label="Wired internet"
              sub="Main connection"
              state={backup ? "down" : "up"}
              text={backup ? "DOWN" : "ONLINE"}
            />
            <StatusRow
              label="Starlink"
              sub="PerryBackup Wi-Fi"
              state={backup ? "up-sky" : "idle"}
              text={backup ? "ON" : "PAUSED"}
            />
            <StatusRow label="PerryHome Wi-Fi" sub="Everyday Wi-Fi · Eero" state="up" text="ALL DEVICES CONNECTED" last />

            <div className="mt-4 pt-3 border-t border-[#1a4a2e]">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35 mb-1.5 font-sans">Internet source</div>
              <div className="text-[12px] font-bold tracking-[0.14em]" style={{ color: backup ? SKY : BLUE }}>
                {backup ? "STARLINK (SATELLITE)" : "WIRED (STREET)"}
              </div>
            </div>
          </div>

          <p className="text-[13px] leading-relaxed text-white/60 px-1">
            The picture switches between the two states by itself. Phones, laptops and TVs stay on the{" "}
            <span className="text-white/85 font-semibold">PerryHome Wi-Fi</span> the whole time. Only the
            internet source changes.
          </p>
        </div>
      </div>
    </div>
  );
}

function StateCard({
  active,
  color,
  title,
  line,
  cycleKey,
}: {
  active: boolean;
  color: string;
  title: string;
  line: string;
  cycleKey: number;
}) {
  return (
    <div
      className="relative rounded-md border bg-[#0d2b18] px-4 py-3 overflow-hidden transition-colors duration-500"
      style={{
        borderColor: active ? color : "#1a4a2e",
        boxShadow: active ? `0 0 18px ${color}33` : "none",
      }}
      aria-current={active ? "true" : undefined}
    >
      <div className="flex items-center gap-2">
        <span
          className={`shrink-0 inline-block w-2.5 h-2.5 rounded-full transition-colors duration-500 ${active ? "sf-pulse" : ""}`}
          style={{
            background: active ? color : "transparent",
            border: active ? "none" : "1.5px solid rgba(255,255,255,0.3)",
          }}
          aria-hidden
        />
        <span
          className="text-[12px] md:text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-500"
          style={{ color: active ? "#fff" : "rgba(255,255,255,0.45)" }}
        >
          {title}
        </span>
      </div>
      <div
        className="mt-1 text-[11px] md:text-[12px] leading-snug transition-colors duration-500"
        style={{ color: active ? color : "rgba(255,255,255,0.35)" }}
      >
        {line}
      </div>
      {/* time-in-state bar, restarts on every switch */}
      {active && (
        <span
          key={cycleKey}
          className="absolute left-0 bottom-0 h-[3px] sf-progress"
          style={{ background: color, animationDuration: `${HOLD_MS + FADE_MS}ms` }}
          aria-hidden
        />
      )}
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
        : { bg: state === "up-sky" ? SKY : BLUE, cls: "sf-pulse", ring: "" };
  const color = state === "down" ? RED : state === "idle" ? "rgba(255,255,255,0.45)" : state === "up-sky" ? SKY : BLUE;

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
