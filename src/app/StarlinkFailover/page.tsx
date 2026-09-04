"use client";

import type { ReactNode } from "react";
import { FadeIn } from "@/components/FadeIn";
import { FailoverSimulator } from "./components/FailoverSimulator";
import { OutageTimeline } from "./components/OutageTimeline";
import { EeroBackupToggle, StarlinkServiceToggle } from "./components/AppToggles";
import { Arrow, ArrowUp, BranchArrows, FlowBox, GroupBox, SectionHeader } from "./components/Flow";
import {
  BoltGlyph,
  CableGlyph,
  CheckGlyph,
  DishGlyph,
  EyeGlyph,
  HouseGlyph,
  MeshNodeGlyph,
  RouterGlyph,
  SatelliteGlyph,
  TagGlyph,
  ToggleGlyph,
  WifiGlyph,
  WrenchGlyph,
} from "./components/Glyphs";

export default function StarlinkFailoverPage() {
  return (
    <div
      className="min-h-screen bg-[#071a0e] text-white"
      style={{ fontFamily: "var(--font-poppins), ui-sans-serif, system-ui, sans-serif" }}
    >
      {/* ── Hero ── */}
      <header className="px-5 pt-14 md:pt-20 pb-10 flex flex-col items-center text-center">
        <FadeIn className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#5b9bd5]/80">
            <SatelliteGlyph size={14} className="shrink-0" />
            <span>Eero Pro 7 · 4 nodes · Starlink standby</span>
          </div>
          <h1 className="mt-5 text-3xl md:text-5xl font-bold uppercase tracking-wide text-white/95 leading-none">
            Starlink Failover
          </h1>
          <p className="mt-3 text-[11px] md:text-sm font-bold uppercase tracking-[0.22em] text-white/45">
            How ScottHome stays online when the wire goes dark
          </p>
          <p className="mt-6 max-w-xl text-[13px] md:text-[15px] text-white/65 leading-relaxed">
            One Wi-Fi name for the whole house. Two ways to reach the internet. The Eero mesh
            watches the hardline; when it fails, the gateway quietly switches to a Starlink dish on
            the roof, and switches back when the wire returns. Starlink service itself is turned on
            only when it is needed.
          </p>
        </FadeIn>
      </header>

      <main className="w-full max-w-5xl mx-auto px-4 md:px-6 pb-24 flex flex-col gap-20 md:gap-28">
        {/* ── Simulator ── */}
        <section aria-labelledby="sim-heading">
          <FadeIn className="w-full">
            <h2 id="sim-heading" className="sr-only">
              Normal versus backup operation
            </h2>
            <FailoverSimulator />
          </FadeIn>
        </section>

        {/* ── Three layers ── */}
        <section>
          <FadeIn className="w-full">
            <SectionHeader
              kicker="The idea"
              title="Three layers, one network name"
              blurb="Devices join ScottHome and never think about it again. Underneath, the gateway chooses between two upstream connections."
            />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FadeIn className="w-full">
              <LayerCard
                icon={<MeshNodeGlyph size={22} />}
                tag="Layer 1 · What devices see"
                title="ScottHome"
                accent="#5b9bd5"
              >
                An Eero Pro 7 mesh: four nodes, one Wi-Fi name, whole-house coverage. Phones,
                laptops and TVs connect here and stay here. They never learn which pipe is feeding
                the house.
              </LayerCard>
            </FadeIn>
            <FadeIn className="w-full">
              <LayerCard
                icon={<CableGlyph size={22} />}
                tag="Layer 2 · Primary WAN"
                title="The hardline"
                accent="#5b9bd5"
              >
                Fiber or cable from the street into the modem, then a short Ethernet run to Eero
                node 1, the gateway. Fast, cheap, and the default almost all of the time.
              </LayerCard>
            </FadeIn>
            <FadeIn className="w-full">
              <LayerCard
                icon={<DishGlyph size={22} />}
                tag="Layer 3 · Backup WAN"
                title="ScottBackup"
                accent="#a8d4ff"
              >
                A Starlink dish on the roof, a Starlink router in the utility room, and its own
                Wi-Fi network: ScottBackup. The gateway joins it only when the hardline fails. The
                Starlink plan stays paused between outages.
              </LayerCard>
            </FadeIn>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section>
          <FadeIn className="w-full">
            <SectionHeader
              kicker="An outage, minute by minute"
              title="What happens, and who does it"
              blurb="Almost everything is automatic. The one human step is turning Starlink service on in the Starlink app, because the plan is paused when it is not needed."
            />
          </FadeIn>
          <FadeIn className="w-full">
            <OutageTimeline />
          </FadeIn>
        </section>

        {/* ── Owner's playbook ── */}
        <section>
          <FadeIn className="w-full">
            <SectionHeader
              kicker="Owner's playbook"
              title="When the internet goes out"
              blurb="Three moves. None of them involve touching a device on ScottHome."
            />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FadeIn className="w-full">
              <PlayCard n="1" icon={<EyeGlyph size={20} />} title="Check the Eero app">
                Look for the Internet Backup banner. It should say the network is connected through
                ScottBackup. If it does not, make sure the Starlink router and dish have power.
              </PlayCard>
            </FadeIn>
            <FadeIn className="w-full">
              <PlayCard n="2" icon={<ToggleGlyph size={20} />} title="Resume Starlink" accent="#a8d4ff">
                Open the Starlink app and toggle service on. The dish is already tracking the sky,
                so the house is at full satellite speed about a minute later.
              </PlayCard>
            </FadeIn>
            <FadeIn className="w-full">
              <PlayCard n="3" icon={<CheckGlyph size={20} />} title="Carry on. Then pause.">
                Nothing to change anywhere else. When the Eero app reports the hardline is back, it
                has already switched home; pause Starlink service again.
              </PlayCard>
            </FadeIn>
          </div>

          <FadeIn className="w-full">
            <div className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">
              The two switches that matter
            </div>
          </FadeIn>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FadeIn className="w-full">
              <StarlinkServiceToggle />
            </FadeIn>
            <FadeIn className="w-full">
              <EeroBackupToggle />
            </FadeIn>
          </div>
          <FadeIn className="w-full">
            <p className="mt-4 text-center text-[11px] text-white/40 leading-relaxed max-w-xl mx-auto">
              Interactive mock-ups, not live controls. Starlink billing and pause terms depend on the
              plan; Roam-class plans can be paused and resumed from the app.
            </p>
          </FadeIn>
        </section>

        {/* ── Installer ── */}
        <section>
          <FadeIn className="w-full">
            <SectionHeader
              kicker="For the installer"
              title="Installation sequence"
              blurb="Top to bottom, in order. The Starlink network has to exist before the Eero can be pointed at it, and the failover has to be tested before anyone calls it done."
            />
          </FadeIn>

          <div className="w-full max-w-2xl mx-auto pl-10 md:pl-12 pr-1 flex flex-col items-center">
            <FadeIn className="w-full">
              <FlowBox step={1} label="Site survey" sublabel="Starlink app · obstruction check" icon={<EyeGlyph size={18} />}>
                <p>
                  Stand where the dish will live and run the obstruction check in the Starlink app.
                  It wants a clear view of the sky; the tree that looks harmless costs you drops
                  later.
                </p>
                <p>
                  Confirm the cable run from the mount to the utility room where the modem and the
                  Eero gateway (node 1) live. Stay within the length of the Starlink cable on hand;
                  longer cables are available from Starlink.
                </p>
                <p>
                  Confirm the Starlink plan can be paused and resumed from the app. Roam-class plans
                  support this; standard Residential generally does not.
                </p>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={2} label="Mount the dish" sublabel="Roof, mast or ground mount" icon={<DishGlyph size={18} />}>
                <p>
                  Use the Starlink mount for the roof type and follow the app&apos;s alignment guidance
                  for the dish generation in the box.
                </p>
                <p>
                  Bring the cable indoors through a sealed penetration with a drip loop. Keep it
                  away from the hardline&apos;s point of entry so one accident cannot cut both.
                </p>
                <p>
                  Power the dish from a circuit that stays on, ideally the same UPS as the modem
                  and gateway, so a brief power blip does not take out the backup you were counting
                  on.
                </p>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={3} label="Starlink router" sublabel="Create ScottBackup" icon={<RouterGlyph size={18} />}>
                <p>
                  Finish Starlink app setup. Name the Wi-Fi network <Mono>ScottBackup</Mono>, set a
                  strong password, and store it in the owner&apos;s password manager.
                </p>
                <p>
                  Place the Starlink router in the utility room within a few feet, and line of
                  sight, of the Eero gateway. The gateway talks to it over Wi-Fi; distance costs
                  speed.
                </p>
                <p className="text-white/85">
                  Do not enable Bypass Mode and do not run an Ethernet cable from the Starlink
                  router into the Eero. Eero&apos;s Internet Backup joins a Wi-Fi network; the
                  ScottBackup Wi-Fi is the handoff.
                </p>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={4} label="Eero app" sublabel="Settings → Internet Backup" icon={<MeshNodeGlyph size={18} />}>
                <p>
                  Internet Backup is an Eero Plus feature. Confirm the subscription is active on the
                  owner&apos;s account before you start.
                </p>
                <p>
                  In the Eero app: <Mono>Settings</Mono> → <Mono>Internet Backup</Mono> → turn it on →
                  add a backup network → choose <Mono>ScottBackup</Mono> → enter the password → save.
                </p>
                <p>Leave Starlink service active for the test in the next step.</p>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={5} label="Test the failover" sublabel="Pull the plug on purpose" variant="accent" icon={<BoltGlyph size={18} />}>
                <p>
                  Power down the modem or unplug its line from the street. Watch the Eero app: within
                  about a minute it should report that it is connected through Internet Backup on
                  ScottBackup.
                </p>
                <p>
                  From any device already on ScottHome, load a page and run a speed test. Nobody
                  should have to re-join Wi-Fi.
                </p>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full">
              <BranchArrows leftLabel="Passed" rightLabel="Not yet" />
            </FadeIn>

            <FadeIn className="w-full">
              <div className="grid grid-cols-2 gap-4 md:gap-8 w-full items-start">
                <div className="flex flex-col items-center">
                  <FlowBox label="Continue" sublabel="On to restore" />
                </div>
                <div className="flex flex-col items-center">
                  <GroupBox title="Troubleshoot">
                    <ul className="space-y-2 text-[12px] md:text-[13px] text-white/70 leading-relaxed">
                      <li className="flex gap-2"><Tick />Move the Starlink router closer to the gateway.</li>
                      <li className="flex gap-2"><Tick />Re-enter the ScottBackup password in the Eero app.</li>
                      <li className="flex gap-2"><Tick />Confirm Starlink service is not paused.</li>
                      <li className="flex gap-2"><Tick />Confirm Eero Plus is active and the gateway is up to date.</li>
                    </ul>
                  </GroupBox>
                  <ArrowUp />
                </div>
              </div>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={6} label="Restore & verify" sublabel="Confirm the way back" icon={<CableGlyph size={18} />}>
                <p>
                  Power the modem back up. Within a couple of minutes the Eero app should switch back
                  to the primary connection on its own.
                </p>
                <p>
                  Then pause Starlink service in the Starlink app. The dish stays powered; only the
                  plan sleeps.
                </p>
              </FlowBox>
            </FadeIn>
            <FadeIn className="w-full"><Arrow /></FadeIn>

            <FadeIn className="w-full">
              <FlowBox step={7} label="Hand-off" sublabel="Leave it obvious" variant="accent" icon={<TagGlyph size={18} />}>
                <p>
                  Label the Starlink router and the dish power supply <Mono>SCOTTBACKUP · LEAVE ON</Mono>.
                </p>
                <p>
                  Walk the owner through the two switches: Starlink app → Service (resume / pause)
                  and Eero app → Internet Backup (stays on).
                </p>
                <p>
                  Record the ScottBackup password, the Starlink account login, and the date of the
                  successful test.
                </p>
              </FlowBox>
            </FadeIn>
          </div>
        </section>

        {/* ── Good to know ── */}
        <section>
          <FadeIn className="w-full">
            <SectionHeader kicker="Good to know" title="Questions people ask" />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FadeIn className="w-full">
              <Fact icon={<WifiGlyph size={18} />} q="Do devices have to reconnect?">
                No. The switch happens one hop upstream of ScottHome. Devices stay where they are;
                only the gateway&apos;s internet source changes.
              </Fact>
            </FadeIn>
            <FadeIn className="w-full">
              <Fact icon={<RouterGlyph size={18} />} q="Why Wi-Fi between Starlink and the Eero, not a cable?">
                Eero&apos;s Internet Backup is built around joining a backup Wi-Fi network: a hotspot, a
                neighbor, or here, ScottBackup. Eero does not do dual-WAN over Ethernet, so the
                Starlink router&apos;s Wi-Fi is the handoff.
              </Fact>
            </FadeIn>
            <FadeIn className="w-full">
              <Fact icon={<BoltGlyph size={18} />} q="Does the dish need to stay powered?">
                Yes, leave it on. That keeps ScottBackup on the air so the gateway can switch at
                once. A paused plan costs nothing while the dish idles. A smart plug is an option if
                you accept a few minutes of boot time during an outage.
              </Fact>
            </FadeIn>
            <FadeIn className="w-full">
              <Fact icon={<SatelliteGlyph size={18} />} q="What will it feel like on backup?">
                Comfortable. Satellite bandwidth handles video calls, streaming and work. Expect a
                little more latency than fiber and some sensitivity to heavy weather.
              </Fact>
            </FadeIn>
            <FadeIn className="w-full">
              <Fact icon={<WrenchGlyph size={18} />} q="What does the setup require?">
                An Eero Plus subscription (Internet Backup is a Plus feature), a Starlink kit on a
                plan that can be paused and resumed from the app, and a mount with a clear view of
                the sky.
              </Fact>
            </FadeIn>
            <FadeIn className="w-full">
              <Fact icon={<HouseGlyph size={18} />} q="How do I know which mode I'm in?">
                The Eero app shows an Internet Backup banner and sends a notification when it
                switches in either direction. The Starlink app shows whether service is active or
                paused.
              </Fact>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ── Local presentational pieces ── */

function Mono({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[12px] text-[#a8d4ff] tracking-wide">{children}</span>
  );
}

function Tick() {
  return (
    <span className="shrink-0 mt-[5px] w-2 h-2 rounded-sm border border-[#5b9bd5]/60" aria-hidden />
  );
}

function LayerCard({
  icon,
  tag,
  title,
  accent,
  children,
}: {
  icon: ReactNode;
  tag: string;
  title: string;
  accent: string;
  children: ReactNode;
}) {
  return (
    <div className="h-full rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-5 flex flex-col">
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded border bg-[#071a0e] flex items-center justify-center"
          style={{ color: accent, borderColor: `${accent}55` }}
        >
          {icon}
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/35">{tag}</span>
      </div>
      <h3 className="mt-4 text-base font-bold uppercase tracking-wide" style={{ color: accent }}>
        {title}
      </h3>
      <p className="mt-2 text-[13px] text-white/65 leading-relaxed">{children}</p>
    </div>
  );
}

function PlayCard({
  n,
  icon,
  title,
  accent = "#5b9bd5",
  children,
}: {
  n: string;
  icon: ReactNode;
  title: string;
  accent?: string;
  children: ReactNode;
}) {
  return (
    <div className="h-full rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-5">
      <div className="flex items-center gap-3">
        <span
          className="w-8 h-8 rounded-full border bg-[#071a0e] flex items-center justify-center text-[12px] font-bold"
          style={{ color: accent, borderColor: `${accent}77` }}
        >
          {n}
        </span>
        <span style={{ color: accent }}>{icon}</span>
        <h3 className="text-sm font-bold uppercase tracking-wide text-white/90">{title}</h3>
      </div>
      <p className="mt-3 text-[13px] text-white/65 leading-relaxed">{children}</p>
    </div>
  );
}

function Fact({ icon, q, children }: { icon: ReactNode; q: ReactNode; children: ReactNode }) {
  return (
    <div className="h-full rounded-md border border-[#1a4a2e] bg-[#0d2b18] p-5">
      <div className="flex items-start gap-3">
        <span className="shrink-0 mt-0.5 text-[#5b9bd5]">{icon}</span>
        <h3 className="text-[12px] md:text-[13px] font-bold uppercase tracking-wider text-white/90 leading-snug">{q}</h3>
      </div>
      <p className="mt-3 text-[13px] text-white/65 leading-relaxed">{children}</p>
    </div>
  );
}
