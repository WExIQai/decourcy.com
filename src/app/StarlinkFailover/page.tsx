"use client";

import type { ReactNode } from "react";
import { FadeIn } from "@/components/FadeIn";
import { FailoverSimulator } from "./components/FailoverSimulator";
import { StarlinkServiceToggle } from "./components/AppToggles";
import { Arrow, ArrowUp, BranchArrows, FlowBox, GroupBox, SectionHeader } from "./components/Flow";
import {
  BoltGlyph,
  CableGlyph,
  CheckGlyph,
  CrossGlyph,
  DishGlyph,
  EyeGlyph,
  MeshNodeGlyph,
  RouterGlyph,
  SatelliteGlyph,
  TagGlyph,
  WifiGlyph,
} from "./components/Glyphs";

const BLUE = "#5b9bd5";
const SKY = "#a8d4ff";
const RED = "#e0605a";

export default function StarlinkFailoverPage() {
  return (
    <div
      className="min-h-screen bg-[#071a0e] text-white"
      style={{ fontFamily: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* ── Hero ── */}
      <header className="px-5 pt-14 md:pt-20 pb-10 flex flex-col items-center text-center">
        <FadeIn className="flex flex-col items-center w-full max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-wide text-white/95 leading-none">
            Starlink Failover
          </h1>
          <p className="mt-3 text-[11px] md:text-sm font-bold uppercase tracking-[0.22em] text-[#5b9bd5]/90">
            Backup internet for the house
          </p>
          <p className="mt-7 max-w-md text-[17px] md:text-xl text-white/90 leading-snug font-medium">
            If the wired internet fails, the house switches to Starlink by itself.
          </p>

          {/* The two Wi-Fi networks */}
          <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <NetworkCard name="ScottHome" kind="Everyday Wi-Fi" color={BLUE}>
              Every phone, laptop and TV uses it. It never changes.
            </NetworkCard>
            <NetworkCard name="ScottBackup" kind="Starlink Wi-Fi" color={SKY}>
              The backup. The house uses it only while the wire is down.
            </NetworkCard>
          </div>

          {/* Two terms */}
          <div className="mt-4 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-left text-[12px] md:text-[13px] text-white/60 leading-snug">
            <Term icon={<MeshNodeGlyph size={16} />} word="Eero">
              The Wi-Fi system in the house.
            </Term>
            <Term icon={<SatelliteGlyph size={16} />} word="Starlink">
              Satellite internet. A dish on the roof.
            </Term>
          </div>
        </FadeIn>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-24 flex flex-col gap-20 md:gap-24">
        {/* ── Simulator ── */}
        <section aria-labelledby="sim-heading">
          <FadeIn className="w-full">
            <h2 id="sim-heading" className="sr-only">
              Normal and backup operation
            </h2>
            <FailoverSimulator />
          </FadeIn>
        </section>

        {/* ── How it works ── */}
        <section>
          <FadeIn className="w-full">
            <SectionHeader kicker="In three steps" title="How it works" />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FadeIn className="w-full">
              <StepCard n="1" title="Normal" icon={<CableGlyph size={20} />}>
                Internet comes through the wire. Starlink is paused.
              </StepCard>
            </FadeIn>
            <FadeIn className="w-full">
              <StepCard n="2" title="The wire fails" icon={<DishGlyph size={20} />} accent={SKY}>
                The house switches to Starlink by itself.
              </StepCard>
            </FadeIn>
            <FadeIn className="w-full">
              <StepCard n="3" title="The wire is back" icon={<CheckGlyph size={20} />}>
                The house switches back by itself.
              </StepCard>
            </FadeIn>
          </div>
        </section>

        {/* ── What you do ── */}
        <section>
          <FadeIn className="w-full">
            <SectionHeader kicker="During an outage" title="One switch" />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="flex flex-col gap-3">
              <FadeIn className="w-full">
                <ActionRow state="On" color={SKY}>
                  The internet stops. Open the Starlink app. Turn <b className="text-white">Service</b> on.
                </ActionRow>
              </FadeIn>
              <FadeIn className="w-full">
                <ActionRow state="Off" color={BLUE}>
                  The Eero app says the wire is back. Turn <b className="text-white">Service</b> off.
                </ActionRow>
              </FadeIn>
              <FadeIn className="w-full">
                <p className="text-[14px] text-white/70 leading-relaxed px-1 pt-1">
                  Everything else is automatic.
                </p>
              </FadeIn>
            </div>
            <FadeIn className="w-full">
              <StarlinkServiceToggle />
            </FadeIn>
          </div>
        </section>

        {/* ── Requirements ── */}
        <section>
          <FadeIn className="w-full">
            <SectionHeader kicker="What this needs" title="Three things" />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FadeIn className="w-full">
              <Tile icon={<MeshNodeGlyph size={20} />} title="Eero Plus">
                A subscription. It includes the automatic switch.
              </Tile>
            </FadeIn>
            <FadeIn className="w-full">
              <Tile icon={<DishGlyph size={20} />} title="Starlink Roam plan">
                It can be paused and resumed in the app.
              </Tile>
            </FadeIn>
            <FadeIn className="w-full">
              <Tile icon={<BoltGlyph size={20} />} title="Low running cost">
                Starlink is paused between outages. The dish stays powered.
              </Tile>
            </FadeIn>
          </div>
        </section>

        {/* ── Installer ── */}
        <section id="installer">
          <FadeIn className="w-full">
            <SectionHeader
              kicker="For the installer"
              title="Installation steps"
              blurb="You can skip this section. It is for the person who installs the equipment. Do the steps in order. Each step ends with a check."
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <FadeIn className="w-full">
              <ListCard title="Equipment">
                <li>Starlink kit: dish, cable, router, power supply</li>
                <li>Mount for the roof type</li>
                <li>Phone with the Starlink app, signed in to the owner&apos;s Starlink account</li>
                <li>Phone with the Eero app, signed in to the owner&apos;s Eero account</li>
                <li>Label maker or marker</li>
              </ListCard>
            </FadeIn>
            <FadeIn className="w-full">
              <ListCard title="Names used in these steps">
                <li>
                  <Name>ScottHome</Name> is the everyday Wi-Fi network (Eero). It exists. Do not change it.
                </li>
                <li>
                  <Name>ScottBackup</Name> is the Starlink Wi-Fi network. You create it in step 4.
                </li>
                <li>
                  <Name>Eero gateway</Name> is Eero unit 1, the one connected to the modem.
                </li>
                <li>
                  <Name>Utility room</Name> is where the modem and the Eero gateway are.
                </li>
              </ListCard>
            </FadeIn>
          </div>

          <div className="w-full max-w-2xl mx-auto pl-10 md:pl-12 pr-1 flex flex-col items-center">
            <FadeIn className="w-full">
              <FlowBox step={1} label="Check the sky" sublabel="Starlink app" icon={<EyeGlyph size={18} />}>
                <Do>Go to the planned dish location.</Do>
                <Do>In the Starlink app, run <Name>Check for obstructions</Name>.</Do>
                <Check>The app shows a clear view of the sky. If not, choose another location.</Check>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={2} label="Mount the dish" sublabel="Roof, pole or ground mount" icon={<DishGlyph size={18} />}>
                <Do>Install the mount and the dish. Follow the Starlink instructions for the dish model.</Do>
                <Do>Route the Starlink cable to the utility room.</Do>
                <Do>Seal the hole where the cable enters the house.</Do>
                <Do>Keep the Starlink cable away from the wired internet cable.</Do>
                <Check>The cable reaches the utility room with slack to spare.</Check>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={3} label="Connect power" sublabel="Utility room" icon={<BoltGlyph size={18} />}>
                <Do>Connect the Starlink cable to the Starlink router.</Do>
                <Do>
                  Plug the Starlink router into an outlet that is always on. If the modem is on a
                  battery backup, use the same one.
                </Do>
                <Check>The Starlink app shows the dish is online.</Check>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={4} label="Create the ScottBackup Wi-Fi" sublabel="Starlink app" icon={<RouterGlyph size={18} />}>
                <Do>In the Starlink app, set the Wi-Fi name to <Name>ScottBackup</Name>.</Do>
                <Do>Set a strong password. Give it to the owner.</Do>
                <Do>
                  Place the Starlink router within 10 feet of the Eero gateway, with nothing large
                  between them.
                </Do>
                <Do warn>Do not turn on Bypass Mode.</Do>
                <Do warn>Do not connect a network cable from the Starlink router to the Eero.</Do>
                <Check>A phone can join the ScottBackup Wi-Fi and load a web page.</Check>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={5} label="Set up the Eero" sublabel="Eero app" icon={<MeshNodeGlyph size={18} />}>
                <Do>Confirm the Eero Plus subscription is active.</Do>
                <Do>
                  In the Eero app: <Name>Settings</Name> → <Name>Internet Backup</Name> → turn on →{" "}
                  <Name>Add network</Name> → select <Name>ScottBackup</Name> → enter the password → Save.
                </Do>
                <Check>Internet Backup lists ScottBackup as ready.</Check>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={6} label="Test the failover" sublabel="Modem off" variant="accent" icon={<WifiGlyph size={18} />}>
                <Do>Confirm Starlink service is on, not paused.</Do>
                <Do>Unplug the modem power. Wait up to 2 minutes.</Do>
                <Check>
                  The Eero app says it is using Internet Backup. A phone on the ScottHome Wi-Fi loads
                  a web page.
                </Check>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full">
              <BranchArrows leftLabel="Pass" rightLabel="Fail" />
            </FadeIn>

            <FadeIn className="w-full">
              <div className="grid grid-cols-2 gap-4 md:gap-8 w-full items-start">
                <div className="flex flex-col items-center">
                  <FlowBox label="Go to step 7" sublabel="Test passed" />
                </div>
                <div className="flex flex-col items-center">
                  <GroupBox title="If the test fails">
                    <ul className="space-y-2 text-[12px] md:text-[13px] text-white/75 leading-relaxed">
                      <li className="flex gap-2"><Tick />Move the Starlink router closer to the Eero gateway.</li>
                      <li className="flex gap-2"><Tick />Enter the ScottBackup password again in the Eero app.</li>
                      <li className="flex gap-2"><Tick />Confirm Starlink service is on.</li>
                      <li className="flex gap-2"><Tick />Confirm Eero Plus is active.</li>
                    </ul>
                  </GroupBox>
                  <ArrowUp label="Repeat step 6" />
                </div>
              </div>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={7} label="Restore" sublabel="Modem on" icon={<CableGlyph size={18} />}>
                <Do>Plug the modem back in. Wait up to 3 minutes.</Do>
                <Check>The Eero app says it is back on the main connection.</Check>
                <Do>Then, in the Starlink app, pause Starlink service.</Do>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={8} label="Hand over" sublabel="Owner" variant="accent" icon={<TagGlyph size={18} />}>
                <Do>
                  Put a label on the Starlink router and its power supply:{" "}
                  <Name>SCOTTBACKUP WI-FI – DO NOT UNPLUG</Name>.
                </Do>
                <Do>Show the owner the Service switch in the Starlink app.</Do>
                <Do>Confirm the owner has the ScottBackup Wi-Fi password.</Do>
                <Check>The owner can turn Starlink service on and off in the app.</Check>
              </FlowBox>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <FadeIn className="w-full">
              <div className="h-full rounded-md border p-5" style={{ borderColor: `${RED}66`, background: "#0d2b18" }}>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: RED }}>
                  <CrossGlyph size={14} />
                  Do not
                </div>
                <ul className="mt-3 space-y-2 text-[13px] text-white/80 leading-relaxed">
                  <li className="flex gap-2"><Dash color={RED} />Do not change the ScottHome Wi-Fi.</li>
                  <li className="flex gap-2"><Dash color={RED} />Do not turn on Bypass Mode on the Starlink router.</li>
                  <li className="flex gap-2"><Dash color={RED} />Do not connect the Starlink router to the Eero with a cable.</li>
                  <li className="flex gap-2"><Dash color={RED} />Do not power the dish from a switched outlet.</li>
                </ul>
              </div>
            </FadeIn>
            <FadeIn className="w-full">
              <div className="h-full rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-5">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#5b9bd5]">
                  <CheckGlyph size={14} />
                  Installation record
                </div>
                <dl className="mt-3 space-y-3 text-[13px]">
                  <Field label="Test passed on" />
                  <Field label="Installer" />
                  <Field label="ScottBackup Wi-Fi password given to owner" box />
                  <Field label="Starlink service paused after the test" box />
                  <Field label="Label on router and power supply" box />
                </dl>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ── Local presentational pieces ── */

function NetworkCard({
  name,
  kind,
  color,
  children,
}: {
  name: string;
  kind: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border bg-[#0d2b18] p-4 flex gap-3" style={{ borderColor: `${color}66` }}>
      <div
        className="shrink-0 w-10 h-10 rounded border bg-[#071a0e] flex items-center justify-center"
        style={{ color, borderColor: `${color}66` }}
      >
        <WifiGlyph size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color }}>
          Wi-Fi network · {kind}
        </div>
        <div className="mt-0.5 text-base md:text-lg font-bold text-white leading-tight">{name}</div>
        <p className="mt-1 text-[13px] text-white/70 leading-snug">{children}</p>
      </div>
    </div>
  );
}

function Term({ icon, word, children }: { icon: ReactNode; word: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="shrink-0 mt-[1px] text-[#5b9bd5]">{icon}</span>
      <p>
        <b className="text-white/90 font-bold">{word}</b>
        <span className="text-white/35"> · </span>
        {children}
      </p>
    </div>
  );
}

function ActionRow({ state, color, children }: { state: string; color: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-4 flex items-center gap-4">
      <span
        className="shrink-0 w-14 h-9 rounded-full border flex items-center justify-center text-[12px] font-bold uppercase tracking-[0.18em]"
        style={{ color, borderColor: `${color}88`, background: "#071a0e", boxShadow: `0 0 14px ${color}33` }}
      >
        {state}
      </span>
      <p className="text-[14px] md:text-[15px] text-white/80 leading-snug">{children}</p>
    </div>
  );
}

function Name({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[12px] text-[#a8d4ff] tracking-wide">{children}</span>;
}

function Tick() {
  return <span className="shrink-0 mt-[5px] w-2 h-2 rounded-sm border border-[#5b9bd5]/60" aria-hidden />;
}

function Dash({ color }: { color: string }) {
  return <span className="shrink-0 mt-[9px] w-2 h-px" style={{ background: color }} aria-hidden />;
}

function Do({ children, warn = false }: { children: ReactNode; warn?: boolean }) {
  return (
    <p className={`flex gap-2.5 ${warn ? "text-white/90" : ""}`}>
      <span
        className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full"
        style={{ background: warn ? RED : BLUE }}
        aria-hidden
      />
      <span>{children}</span>
    </p>
  );
}

function Check({ children }: { children: ReactNode }) {
  return (
    <p className="flex gap-2.5 rounded border border-[#5b9bd5]/30 bg-[#071a0e] px-3 py-2 text-white/85">
      <CheckGlyph size={16} className="shrink-0 mt-0.5 text-[#5b9bd5]" />
      <span>
        <span className="font-bold uppercase tracking-wider text-[11px] text-[#5b9bd5] mr-1.5">Check</span>
        {children}
      </span>
    </p>
  );
}

function StepCard({
  n,
  title,
  icon,
  accent = BLUE,
  children,
}: {
  n: string;
  title: string;
  icon: ReactNode;
  accent?: string;
  children: ReactNode;
}) {
  return (
    <div className="h-full rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-5">
      <div className="flex items-center gap-3">
        <span
          className="w-9 h-9 rounded-full border bg-[#071a0e] flex items-center justify-center text-[13px] font-bold"
          style={{ color: accent, borderColor: `${accent}77` }}
        >
          {n}
        </span>
        <span style={{ color: accent }}>{icon}</span>
        <h3 className="text-sm md:text-base font-bold uppercase tracking-wide text-white/90">{title}</h3>
      </div>
      <p className="mt-3 text-[15px] md:text-base text-white/80 leading-snug">{children}</p>
    </div>
  );
}

function Tile({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="h-full rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-5">
      <div className="flex items-start gap-3">
        <span className="shrink-0 mt-0.5 text-[#5b9bd5]">{icon}</span>
        <h3 className="text-[13px] md:text-sm font-bold uppercase tracking-wider text-white/90 leading-snug">{title}</h3>
      </div>
      <p className="mt-3 text-[14px] text-white/75 leading-snug">{children}</p>
    </div>
  );
}

function ListCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="h-full rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-5">
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#5b9bd5]">{title}</div>
      <ul className="mt-3 space-y-2 text-[13px] text-white/80 leading-relaxed [&>li]:flex [&>li]:gap-2 [&>li]:before:content-[''] [&>li]:before:shrink-0 [&>li]:before:mt-[8px] [&>li]:before:w-1.5 [&>li]:before:h-1.5 [&>li]:before:rounded-full [&>li]:before:bg-[#5b9bd5]">
        {children}
      </ul>
    </div>
  );
}

function Field({ label, box = false }: { label: string; box?: boolean }) {
  return (
    <div className="flex items-end gap-3">
      <dt className="text-white/70">{label}</dt>
      <dd className="flex-1 min-w-0 flex justify-end">
        {box ? (
          <span className="w-5 h-5 rounded-sm border border-[#5b9bd5]/60" aria-label="checkbox" />
        ) : (
          <span className="w-full border-b border-dashed border-[#5b9bd5]/40 h-4" aria-hidden />
        )}
      </dd>
    </div>
  );
}
