"use client";

/*
  Animated cross-section of the house.
  `t` runs 0 → 1:  0 = NORMAL OPERATION (hardline), 1 = BACKUP OPERATION (Starlink).
  Everything that differs between states cross-fades on `t`; the mesh itself
  (ScottHome) never changes — that is the point of the diagram.

  ViewBox 600 × 640. Inputs live on the LEFT (street conduit + dish cable), the
  Eero gateway sits in the utility room, and the mesh fans out to the right.
*/

const BLUE = "#5b9bd5";
const SKY = "#a8d4ff";
const RED = "#e0605a";
const WALL = "#1a4a2e";
const FILL = "#0d2b18";
const FILL_ALT = "#0a2314";

/* Motion paths (direction = data direction). */
const P_CONDUIT = "M -10 590 L 106 590 L 106 536";
const P_MODEM_TO_GW = "M 124 521 L 168 504";
const P_BEAM = "M 505 74 L 160 198";
const P_DISH_CABLE = "M 150 246 L 150 290 L 82 290 L 82 471 L 88 471";
const P_HOP = "M 124 466 Q 146 434 170 488";
const P_MESH_1_3 = "M 185 478 L 185 368";
const P_MESH_1_2 = "M 202 493 L 368 482";
const P_MESH_2_4 = "M 388 463 L 417 368";
const P_MESH_3_4 = "M 202 350 L 403 350";

const STARS: Array<[number, number, number, number]> = [
  // x, y, r, delay(s)
  [40, 40, 1.4, 0], [95, 110, 1, 1.1], [180, 60, 1.2, 0.4], [250, 30, 1, 2.2],
  [330, 95, 1.3, 1.6], [400, 40, 1, 0.8], [470, 130, 1.1, 2.6], [560, 150, 1, 1.9],
  [580, 60, 1.3, 0.2], [130, 150, 0.9, 2.9], [300, 130, 1, 1.3], [520, 190, 0.9, 0.6],
  [60, 200, 1, 2.4], [440, 200, 0.9, 1.0], [580, 240, 1, 2.0], [20, 260, 0.9, 1.5],
];

function Packets({
  path,
  count,
  dur,
  color,
  r = 3.2,
}: {
  path: string;
  count: number;
  dur: number;
  color: string;
  r?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <circle key={i} r={r} fill={color}>
          <animateMotion
            dur={`${dur}s`}
            repeatCount="indefinite"
            begin={`${-(dur / count) * i}s`}
            path={path}
          />
        </circle>
      ))}
    </>
  );
}

function Node({
  x,
  y,
  label,
  gateway = false,
}: {
  x: number;
  y: number;
  label: string;
  gateway?: boolean;
}) {
  const s = gateway ? 19 : 16;
  return (
    <g>
      {/* coverage field */}
      <circle cx={x} cy={y} r={gateway ? 70 : 58} fill={BLUE} opacity={0.045} />
      <circle cx={x} cy={y} r={s + 6} fill="none" stroke={BLUE} strokeWidth={1} opacity={0.35} className="sf-ring" />
      <rect x={x - s} y={y - s} width={s * 2} height={s * 2} rx={5} fill={gateway ? "#143d24" : FILL} stroke={BLUE} strokeWidth={gateway ? 1.8 : 1.4} />
      {/* eero-ish status light */}
      <circle cx={x} cy={y - s + 6} r={1.8} fill={SKY} className="sf-breathe" />
      <text x={x} y={y + 6} textAnchor="middle" fontSize={gateway ? 15 : 14} fontWeight={700} fill="#fff" opacity={0.92}>
        {label}
      </text>
    </g>
  );
}

function WifiArcs({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <g stroke={BLUE} strokeWidth={1.4} fill="none" strokeLinecap="round" className="sf-breathe" style={{ animationDelay: `${delay}s` }}>
      <path d={`M ${x - 5} ${y - 4} a 7 7 0 0 1 10 0`} />
      <path d={`M ${x - 9.5} ${y - 8.5} a 13.5 13.5 0 0 1 19 0`} />
      <circle cx={x} cy={y} r={1.2} fill={BLUE} stroke="none" />
    </g>
  );
}

export function HouseDiagram({ t }: { t: number }) {
  const b = Math.min(1, Math.max(0, t));
  const n = 1 - b;
  const backupOn = b > 0.5;

  return (
    <svg
      viewBox="0 0 600 640"
      className="w-full h-auto block select-none"
      role="img"
      aria-label={
        backupOn
          ? "House diagram in backup operation: the wired internet is down. The Starlink dish receives from a satellite and feeds the Eero gateway over the ScottBackup Wi-Fi network. All four Eero nodes and every device stay connected to ScottHome."
          : "House diagram in normal operation: the wired internet feeds the modem and the Eero gateway, which distributes internet to three more Eero nodes and every device on ScottHome. Starlink is paused."
      }
    >
      <defs>
        <linearGradient id="sf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#030b06" />
          <stop offset="1" stopColor="#071a0e" />
        </linearGradient>
        <linearGradient id="sf-beam-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={SKY} stopOpacity="0.15" />
          <stop offset="1" stopColor={SKY} stopOpacity="0.9" />
        </linearGradient>
        <filter id="sf-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Sky & ground ── */}
      <rect x="0" y="0" width="600" height="560" fill="url(#sf-sky)" />
      {STARS.map(([x, y, r, d], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" className="sf-twinkle" style={{ animationDelay: `${d}s` }} />
      ))}
      <rect x="0" y="560" width="600" height="80" fill="#04120a" />
      <line x1="0" y1="560" x2="600" y2="560" stroke={WALL} strokeWidth="2" />
      <text x="14" y="618" fontSize="12" fontWeight={700} fill="#fff" opacity="0.45" letterSpacing="1.5">STREET</text>

      {/* ── Satellite ── */}
      <g className="sf-drift">
        <g transform="translate(515 62)">
          <rect x="-33" y="-22" width="22" height="9" fill="#0f3320" stroke={SKY} strokeWidth="1.2" opacity={0.6 + 0.4 * b} />
          <rect x="11" y="-22" width="22" height="9" fill="#0f3320" stroke={SKY} strokeWidth="1.2" opacity={0.6 + 0.4 * b} />
          <path d="M-26 -22v9M-19 -22v9M18 -22v9M25 -22v9" stroke={SKY} strokeWidth="0.8" opacity={0.5} />
          <rect x="-9" y="-25" width="18" height="15" rx="2" fill="#143d24" stroke={SKY} strokeWidth="1.4" />
          <path d="M0 -10v5" stroke={SKY} strokeWidth="1.4" />
          <path d="M-6 -1a6 6 0 0 0 12 0z" fill="#143d24" stroke={SKY} strokeWidth="1.2" />
          <circle cx="0" cy="-17" r="1.6" fill={SKY} className="sf-breathe" />
          <text x="0" y="-32" textAnchor="middle" fontSize="12" fontWeight={700} fill={SKY} opacity={0.55 + 0.45 * b} letterSpacing="1.5">STARLINK</text>
        </g>
      </g>

      {/* ── Beam: satellite → dish (faint on standby, bright on backup) ── */}
      <g>
        <line x1="505" y1="74" x2="160" y2="198" stroke={SKY} strokeWidth="1" opacity={0.12 * n} strokeDasharray="2 8" />
        <g opacity={b}>
          <path d={P_BEAM} stroke="url(#sf-beam-grad)" strokeWidth="6" opacity="0.35" />
          <path d={P_BEAM} stroke={SKY} strokeWidth="1.6" className="sf-flow-beam" />
          <Packets path={P_BEAM} count={4} dur={2.2} color={SKY} r={3.6} />
        </g>
        {/* standby / active tag at mid-beam */}
        <g transform="translate(280 98)">
          <rect x="-52" y="-11" width="104" height="22" rx="4" fill="#071a0e" stroke={backupOn ? SKY : BLUE} strokeOpacity={backupOn ? 0.7 : 0.3} />
          <text textAnchor="middle" y="4.5" fontSize="11" fontWeight={700} letterSpacing="1.5" fill={backupOn ? SKY : "#fff"} opacity={backupOn ? 1 : 0.5}>
            {backupOn ? "STARLINK ON" : "STARLINK PAUSED"}
          </text>
        </g>
      </g>

      {/* ── House shell ── */}
      {/* attic */}
      <polygon points="40,300 300,175 560,300" fill="#0b2416" stroke={BLUE} strokeOpacity="0.35" strokeWidth="1.6" strokeLinejoin="round" />
      {/* walls */}
      <rect x="70" y="300" width="460" height="260" fill={FILL} stroke={WALL} strokeWidth="1.6" />
      {/* utility room shading */}
      <rect x="70" y="430" width="165" height="130" fill={FILL_ALT} />
      {/* floor slab + interior walls */}
      <line x1="70" y1="430" x2="530" y2="430" stroke={WALL} strokeWidth="1.6" />
      <line x1="300" y1="300" x2="300" y2="430" stroke={WALL} strokeWidth="1.2" strokeDasharray="4 4" />
      <line x1="235" y1="430" x2="235" y2="560" stroke={WALL} strokeWidth="1.2" strokeDasharray="4 4" />
      {/* windows */}
      <rect x="95" y="332" width="34" height="26" rx="2" fill="#0f3320" stroke={BLUE} strokeOpacity="0.35" />
      <rect x="470" y="332" width="34" height="26" rx="2" fill="#0f3320" stroke={BLUE} strokeOpacity="0.35" />
      <rect x="255" y="460" width="34" height="26" rx="2" fill="#0f3320" stroke={BLUE} strokeOpacity="0.35" />
      {/* door */}
      <rect x="486" y="506" width="34" height="54" rx="2" fill="#0f3320" stroke={BLUE} strokeOpacity="0.35" />
      <circle cx="513" cy="534" r="1.6" fill={BLUE} opacity="0.6" />
      {/* room labels */}
      <text x="165" y="446" fontSize="10" fontWeight={700} fill="#fff" opacity="0.32" letterSpacing="1.4">UTILITY</text>
      <text x="252" y="446" fontSize="10" fontWeight={700} fill="#fff" opacity="0.32" letterSpacing="1.4">MAIN FLOOR</text>
      <text x="88" y="316" fontSize="10" fontWeight={700} fill="#fff" opacity="0.32" letterSpacing="1.4">UPSTAIRS</text>
      <text x="316" y="316" fontSize="10" fontWeight={700} fill="#fff" opacity="0.32" letterSpacing="1.4">OFFICE</text>

      {/* ── Dish on the roof ── */}
      <line x1="150" y1="247" x2="150" y2="214" stroke={BLUE} strokeWidth="3" strokeOpacity="0.8" />
      <g transform="translate(150 206) rotate(-30)">
        <rect x="-19" y="-6" width="38" height="11" rx="3" fill="#1a4a2e" stroke={SKY} strokeWidth="1.5" />
        <line x1="-12" y1="-6" x2="-12" y2="5" stroke={SKY} strokeOpacity="0.35" />
        <line x1="0" y1="-6" x2="0" y2="5" stroke={SKY} strokeOpacity="0.35" />
        <line x1="12" y1="-6" x2="12" y2="5" stroke={SKY} strokeOpacity="0.35" />
      </g>
      <g opacity={b}>
        <circle cx="150" cy="206" r="20" fill="none" stroke={SKY} strokeWidth="1.2" className="sf-ring" />
        <circle cx="150" cy="206" r="20" fill="none" stroke={SKY} strokeWidth="1.2" className="sf-ring" style={{ animationDelay: "1.2s" }} />
      </g>
      <text x="176" y="230" fontSize="11" fontWeight={700} fill={SKY} opacity={0.6 + 0.4 * b} letterSpacing="1.4">DISH</text>

      {/* Dish cable → Starlink router (inside the wall) */}
      <path d={P_DISH_CABLE} fill="none" stroke={SKY} strokeWidth="1.4" opacity={0.25 + 0.15 * b} />
      <g opacity={b}>
        <path d={P_DISH_CABLE} fill="none" stroke={SKY} strokeWidth="1.4" className="sf-flow" />
        <Packets path={P_DISH_CABLE} count={3} dur={2.6} color={SKY} r={2.8} />
      </g>

      {/* ── Utility room gear ── */}
      {/* Starlink router */}
      <g>
        <rect x="88" y="458" width="36" height="26" rx="3" fill="#143d24" stroke={SKY} strokeWidth="1.3" opacity={0.75 + 0.25 * b} />
        <circle cx="96" cy="471" r="1.8" fill={backupOn ? SKY : "#fff"} opacity={backupOn ? 1 : 0.3} className={backupOn ? "sf-breathe" : undefined} />
        <line x1="103" y1="466" x2="118" y2="466" stroke={SKY} strokeOpacity="0.5" />
        <line x1="103" y1="471" x2="118" y2="471" stroke={SKY} strokeOpacity="0.5" />
        <line x1="103" y1="476" x2="118" y2="476" stroke={SKY} strokeOpacity="0.5" />
        <text x="106" y="452" textAnchor="middle" fontSize="9" fontWeight={700} fill={SKY} opacity={0.6 + 0.4 * b} letterSpacing="1">SCOTTBACKUP WI-FI</text>
      </g>
      {/* Modem */}
      <g>
        <rect x="88" y="512" width="36" height="22" rx="3" fill="#143d24" stroke={BLUE} strokeWidth="1.3" />
        <circle cx="96" cy="523" r="1.8" fill={backupOn ? RED : BLUE} className={backupOn ? "sf-flicker" : "sf-breathe"} />
        <line x1="103" y1="520" x2="118" y2="520" stroke={BLUE} strokeOpacity="0.5" />
        <line x1="103" y1="526" x2="118" y2="526" stroke={BLUE} strokeOpacity="0.5" />
        <text x="106" y="548" textAnchor="middle" fontSize="10" fontWeight={700} fill="#fff" opacity="0.5" letterSpacing="1.2">MODEM</text>
      </g>

      {/* ── Hardline (normal) ── */}
      <g opacity={n}>
        <path d={P_CONDUIT} fill="none" stroke={BLUE} strokeWidth="2.2" opacity="0.35" />
        <path d={P_CONDUIT} fill="none" stroke={BLUE} strokeWidth="2" className="sf-flow" />
        <Packets path={P_CONDUIT} count={3} dur={2.4} color={BLUE} />
        <path d={P_MODEM_TO_GW} fill="none" stroke={BLUE} strokeWidth="1.8" className="sf-flow" />
        <Packets path={P_MODEM_TO_GW} count={2} dur={1.2} color={BLUE} r={2.6} />
      </g>
      {/* ── Hardline (dead) ── */}
      <g opacity={b}>
        <path d="M -10 590 L 42 590" fill="none" stroke={RED} strokeWidth="2" opacity="0.55" className="sf-flicker" />
        <path d="M 60 590 L 106 590 L 106 536" fill="none" stroke={RED} strokeWidth="2" opacity="0.3" strokeDasharray="3 5" />
        <path d="M 124 521 L 168 504" fill="none" stroke={RED} strokeWidth="1.6" opacity="0.25" strokeDasharray="3 5" />
        <g transform="translate(51 590)">
          <circle r="11" fill="#071a0e" stroke={RED} strokeWidth="1.4" />
          <path d="M-4.5 -4.5 4.5 4.5M4.5 -4.5 -4.5 4.5" stroke={RED} strokeWidth="2" strokeLinecap="round" />
        </g>
        <text x="72" y="614" fontSize="11" fontWeight={700} fill={RED} letterSpacing="1.5" className="sf-flicker">WIRED INTERNET DOWN</text>
      </g>

      {/* ── Backup hop: Starlink router →(Wi-Fi)→ Eero gateway ── */}
      <g opacity={b}>
        <path d={P_HOP} fill="none" stroke={SKY} strokeWidth="1.6" className="sf-flow" />
        <Packets path={P_HOP} count={2} dur={1.4} color={SKY} r={2.8} />
        <g stroke={SKY} strokeWidth="1.3" fill="none" strokeLinecap="round" className="sf-breathe">
          <path d="M138 438 a 8 8 0 0 1 14 0" />
          <path d="M134 433 a 14 14 0 0 1 22 0" />
        </g>
      </g>

      {/* ── Mesh (always on) ── */}
      <g>
        <path d={P_MESH_3_4} fill="none" stroke={BLUE} strokeWidth="1.2" opacity="0.35" strokeDasharray="3 6" />
        {[P_MESH_1_3, P_MESH_1_2, P_MESH_2_4].map((p) => (
          <g key={p}>
            <path d={p} fill="none" stroke={BLUE} strokeWidth="1.4" opacity="0.3" />
            <path d={p} fill="none" stroke={BLUE} strokeWidth="1.6" className="sf-flow-slow" />
          </g>
        ))}
        <Packets path={P_MESH_1_3} count={2} dur={2} color={BLUE} r={2.6} />
        <Packets path={P_MESH_1_2} count={3} dur={2.6} color={BLUE} r={2.6} />
        <Packets path={P_MESH_2_4} count={2} dur={2.2} color={BLUE} r={2.6} />
      </g>

      {/* ── Devices ── */}
      {/* laptop, upstairs */}
      <g transform="translate(120 398)" stroke={BLUE} strokeWidth="1.3" fill="#0f3320">
        <rect x="-16" y="-12" width="32" height="20" rx="2" />
        <rect x="-22" y="8" width="44" height="4" rx="1" />
      </g>
      <WifiArcs x={120} y={378} delay={0.3} />
      {/* monitor, office */}
      <g transform="translate(470 398)" stroke={BLUE} strokeWidth="1.3" fill="#0f3320">
        <rect x="-20" y="-16" width="40" height="26" rx="2" />
        <path d="M-6 10h12M0 10v6M-10 16h20" fill="none" />
      </g>
      <WifiArcs x={470} y={374} delay={1.1} />
      {/* TV, main floor */}
      <g transform="translate(440 520)" stroke={BLUE} strokeWidth="1.3" fill="#0f3320">
        <rect x="-32" y="-18" width="64" height="36" rx="2" />
        <path d="M-12 22h24" fill="none" />
      </g>
      <WifiArcs x={440} y={494} delay={0.7} />
      {/* phone, main floor */}
      <g transform="translate(300 528)" stroke={BLUE} strokeWidth="1.3" fill="#0f3320">
        <rect x="-8" y="-16" width="16" height="30" rx="3" />
        <circle cx="0" cy="10" r="1.2" fill={BLUE} stroke="none" />
      </g>
      <WifiArcs x={300} y={504} delay={1.6} />

      {/* ── Eero nodes ── */}
      <Node x={185} y={350} label="3" />
      <Node x={420} y={350} label="4" />
      <Node x={385} y={480} label="2" />
      <Node x={185} y={495} label="1" gateway />
      <text x="185" y="530" textAnchor="middle" fontSize="10" fontWeight={700} fill={BLUE} letterSpacing="1.4">GATEWAY</text>

      {/* network name badge */}
      <g transform="translate(300 585)">
        <rect x="-84" y="-13" width="168" height="26" rx="4" fill="#071a0e" stroke={BLUE} strokeOpacity="0.5" />
        <circle cx="-68" cy="0" r="3" fill={BLUE} className="sf-breathe" />
        <text x="6" y="4.5" textAnchor="middle" fontSize="12" fontWeight={700} fill="#fff" opacity="0.9" letterSpacing="1.6">SCOTTHOME WI-FI</text>
      </g>
    </svg>
  );
}
