import type { ReactNode } from "react";

/* ── Top-to-bottom process-flow primitives (site style guide) ── */

export function StepIcon({ step }: { step: number | string }) {
  return (
    <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-[#5b9bd5]/40 bg-[#071a0e] flex items-center justify-center">
      <span className="text-[11px] font-bold text-[#5b9bd5]/80">{step}</span>
    </div>
  );
}

export function FlowBox({
  label,
  sublabel,
  children,
  variant = "default",
  step,
  icon,
}: {
  label: string;
  sublabel?: string;
  children?: ReactNode;
  variant?: "default" | "accent";
  step?: number | string;
  icon?: ReactNode;
}) {
  const border =
    variant === "accent" ? "border-[#5b9bd5]/50" : "border-[#1a4a2e]";
  return (
    <div className={`relative w-full border ${border} bg-[#0d2b18] rounded px-5 py-4 md:px-7 md:py-5`}>
      {step !== undefined && <StepIcon step={step} />}
      <div className="flex items-start gap-3">
        {icon && (
          <div className="shrink-0 mt-0.5 w-9 h-9 rounded border border-[#5b9bd5]/30 bg-[#071a0e] flex items-center justify-center text-[#5b9bd5]">
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-bold uppercase tracking-wide text-sm md:text-base text-white/90 leading-snug">
            {label}
          </div>
          {sublabel && (
            <div className="uppercase font-bold tracking-wider text-[10px] md:text-xs text-[#5b9bd5]/80 mt-1">
              {sublabel}
            </div>
          )}
          {children && (
            <div className="text-[13px] md:text-sm text-white/70 leading-relaxed mt-3 space-y-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function GroupBox({ step, title, children }: { step?: number | string; title?: string; children: ReactNode }) {
  return (
    <div className="relative w-full border border-[#5b9bd5]/20 border-dashed rounded-md bg-[#0a2314] p-4">
      {step !== undefined && <StepIcon step={step} />}
      {title && (
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b9bd5]/70 mb-3">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-8 bg-[#5b9bd5]/60" />
      <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60" aria-hidden>
        <path d="M6 8L0 0h12z" fill="currentColor" />
      </svg>
      {label && (
        <span className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-wider">{label}</span>
      )}
    </div>
  );
}

export function ArrowUp() {
  return (
    <div className="flex flex-col items-center py-1">
      <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60 rotate-180" aria-hidden>
        <path d="M6 8L0 0h12z" fill="currentColor" />
      </svg>
      <div className="w-px h-6 bg-[#5b9bd5]/60" />
      <span className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-wider">Re-test</span>
    </div>
  );
}

export function BranchArrows({ leftLabel, rightLabel }: { leftLabel: string; rightLabel: string }) {
  return (
    <div className="relative w-full py-1" aria-hidden>
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-4 bg-[#5b9bd5]/60" />
      <div className="absolute top-4 left-1/4 right-1/4 h-px bg-[#5b9bd5]/60" />
      <div className="absolute top-4 left-1/4 -translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-4 bg-[#5b9bd5]/60" />
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60">
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="text-[10px] text-white/40 mt-0.5 uppercase font-bold tracking-wider">{leftLabel}</span>
      </div>
      <div className="absolute top-4 right-1/4 translate-x-1/2 flex flex-col items-center">
        <div className="w-px h-4 bg-[#5b9bd5]/60" />
        <svg width="12" height="8" viewBox="0 0 12 8" className="text-[#5b9bd5]/60">
          <path d="M6 8L0 0h12z" fill="currentColor" />
        </svg>
        <span className="text-[10px] text-white/40 mt-0.5 uppercase font-bold tracking-wider">{rightLabel}</span>
      </div>
      <div className="h-16" />
    </div>
  );
}

/* ── Section chrome ── */

export function SectionHeader({
  kicker,
  title,
  blurb,
}: {
  kicker: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="w-full flex flex-col items-center text-center mb-8">
      <div className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.28em] text-[#5b9bd5]/80">
        {kicker}
      </div>
      <div className="h-px w-16 my-3 bg-[#5b9bd5]/40" aria-hidden />
      <h2 className="text-lg md:text-2xl font-bold uppercase tracking-wide text-white/90">{title}</h2>
      {blurb && (
        <p className="text-[13px] md:text-sm text-white/60 leading-relaxed max-w-xl mt-3">{blurb}</p>
      )}
    </div>
  );
}
