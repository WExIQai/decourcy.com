"use client";

import { useState } from "react";

const BLUE = "#5b9bd5";
const SKY = "#a8d4ff";
const RED = "#e0605a";

type Lamp = "on" | "off" | "warn" | "sky" | "idle";

type Step = {
  clock: string;
  title: string;
  who: "Automatic" | "You" | "Automatic + you";
  hard: Lamp;
  back: Lamp;
  home: Lamp;
  backText: string;
  hardText: string;
  body: string;
};

const STEPS: Step[] = [
  {
    clock: "T − 0",
    title: "Normal operation",
    who: "Automatic",
    hard: "on",
    hardText: "ONLINE",
    back: "idle",
    backText: "STANDBY",
    home: "on",
    body:
      "Everything rides the hardline. The Starlink dish is powered and the Starlink router is quietly broadcasting ScottBackup, but the Starlink plan is paused, so it sits there costing nothing.",
  },
  {
    clock: "T + 0",
    title: "The hardline drops",
    who: "Automatic",
    hard: "off",
    hardText: "OUTAGE",
    back: "idle",
    backText: "STANDBY",
    home: "on",
    body:
      "A cut cable, an ISP outage, a dead modem. The Eero gateway loses its upstream link. Every device is still connected to ScottHome; it just has nowhere to send traffic yet.",
  },
  {
    clock: "T + seconds",
    title: "Eero detects the loss",
    who: "Automatic",
    hard: "off",
    hardText: "OUTAGE",
    back: "warn",
    backText: "SEARCHING",
    home: "on",
    body:
      "Internet Backup wakes up. The gateway scans for the backup network you saved in the Eero app: ScottBackup.",
  },
  {
    clock: "T + ~1 min",
    title: "Gateway joins ScottBackup",
    who: "Automatic",
    hard: "off",
    hardText: "OUTAGE",
    back: "warn",
    backText: "JOINED · WAITING",
    home: "on",
    body:
      "The gateway connects to the Starlink router over Wi-Fi and waits for the satellite link to carry traffic. Nobody in the house has had to touch a device.",
  },
  {
    clock: "T + ~2 min",
    title: "You toggle Starlink on",
    who: "You",
    hard: "off",
    hardText: "OUTAGE",
    back: "sky",
    backText: "RESUMING",
    home: "on",
    body:
      "Open the Starlink app and resume service. The dish is already powered and locked onto the sky, so full speed arrives within about a minute of the toggle.",
  },
  {
    clock: "T + ~3 min",
    title: "Full satellite bandwidth",
    who: "Automatic",
    hard: "off",
    hardText: "OUTAGE",
    back: "sky",
    backText: "ACTIVE",
    home: "on",
    body:
      "Every device on ScottHome is online via satellite: calls, streaming, work. Traffic runs satellite → dish → ScottBackup → gateway → mesh.",
  },
  {
    clock: "Later",
    title: "The hardline returns",
    who: "Automatic + you",
    hard: "on",
    hardText: "ONLINE",
    back: "idle",
    backText: "STANDBY",
    home: "on",
    body:
      "Eero sees the primary link come back and switches home on its own. You pause Starlink in the app again until the next outage. Service is intermittent by design: on when needed, off when not.",
  },
];

export function OutageTimeline() {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const pct = (i / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-4 md:p-6">
      {/* Scrubber */}
      <div className="relative h-11">
        <div className="absolute left-[15px] right-[15px] top-1/2 -translate-y-1/2 h-1 rounded-full bg-[#071a0e] border border-[#1a4a2e]" />
        <div
          className="absolute left-[15px] top-1/2 -translate-y-1/2 h-1 rounded-full"
          style={{
            width: `calc(${pct}% - ${(pct / 100) * 30}px)`,
            background: `linear-gradient(90deg, ${BLUE}, ${SKY})`,
            boxShadow: "0 0 10px rgba(91,155,213,0.45)",
          }}
        />
        {STEPS.map((s, k) => {
          const p = (k / (STEPS.length - 1)) * 100;
          return (
            <span
              key={s.clock + k}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full border"
              style={{
                left: `calc(${p}% + ${15 - (p / 100) * 30}px)`,
                background: k <= i ? BLUE : "#071a0e",
                borderColor: k <= i ? BLUE : "#1a4a2e",
              }}
              aria-hidden
            />
          );
        })}
        <input
          type="range"
          min={0}
          max={STEPS.length - 1}
          step={1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          aria-label="Outage timeline scrubber"
          aria-valuetext={`${step.clock}: ${step.title}`}
          className="sf-range absolute inset-0"
        />
      </div>
      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.18em] text-white/35 mb-5">
        <span>Wire fails</span>
        <span>Scrub the timeline</span>
        <span>Wire returns</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-5 md:gap-8">
        {/* Event card */}
        <div className="min-h-[168px]">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-[11px] font-bold tracking-[0.12em] text-[#5b9bd5] whitespace-nowrap">{step.clock}</span>
            <span className="h-px flex-1 bg-[#1a4a2e]" aria-hidden />
            <WhoChip who={step.who} />
          </div>
          <h3 className="text-base md:text-lg font-bold uppercase tracking-wide text-white/90">{step.title}</h3>
          <p className="text-[13px] md:text-sm text-white/65 leading-relaxed mt-2">{step.body}</p>

          {/* step pips */}
          <div className="flex gap-1.5 mt-4" role="tablist" aria-label="Timeline steps">
            {STEPS.map((s, k) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={`${s.clock}: ${s.title}`}
                onClick={() => setI(k)}
                className="h-1.5 flex-1 rounded-full transition-colors"
                style={{ background: k === i ? SKY : k < i ? BLUE : "#1a4a2e" }}
              />
            ))}
          </div>
        </div>

        {/* Mini console */}
        <div className="rounded border border-[#1a4a2e] bg-[#071a0e] p-3 font-mono">
          <ConsoleRow lamp={step.hard} label="HARDLINE" value={step.hardText} />
          <ConsoleRow lamp={step.back} label="SCOTTBACKUP" value={step.backText} />
          <ConsoleRow lamp={step.home} label="SCOTTHOME" value="4 NODES · ONLINE" last />
          <div className="mt-3 pt-2 border-t border-[#1a4a2e] text-[9px] tracking-[0.12em] text-white/35">
            DEVICES RECONNECTED: <span className="text-white/80">0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhoChip({ who }: { who: Step["who"] }) {
  const you = who !== "Automatic";
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-[0.18em] rounded px-2 py-1 border whitespace-nowrap"
      style={{
        color: you ? SKY : BLUE,
        borderColor: you ? "rgba(168,212,255,0.5)" : "rgba(91,155,213,0.35)",
        background: you ? "rgba(168,212,255,0.08)" : "transparent",
      }}
    >
      {who}
    </span>
  );
}

function ConsoleRow({ lamp, label, value, last = false }: { lamp: Lamp; label: string; value: string; last?: boolean }) {
  const color =
    lamp === "off" ? RED : lamp === "warn" ? "#e6c36a" : lamp === "sky" ? SKY : lamp === "idle" ? "rgba(255,255,255,0.45)" : BLUE;
  const pulse = lamp === "off" ? "sf-pulse-red" : lamp === "on" || lamp === "sky" ? "sf-pulse" : "";
  return (
    <div className={`flex items-center gap-2.5 py-1.5 ${last ? "" : "border-b border-[#1a4a2e]/70"}`}>
      <span
        className={`shrink-0 inline-block w-2 h-2 rounded-full ${pulse}`}
        style={{
          background: lamp === "idle" ? "transparent" : color,
          border: lamp === "idle" ? `1.5px solid ${BLUE}` : undefined,
        }}
        aria-hidden
      />
      <span className="text-[10px] font-bold tracking-[0.12em] text-white/85 w-[92px]">{label}</span>
      <span className="text-[10px] font-bold tracking-[0.1em] text-right flex-1 truncate" style={{ color }}>
        {value}
      </span>
    </div>
  );
}
