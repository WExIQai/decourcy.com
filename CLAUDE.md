@AGENTS.md

# DeCourcy.com — Design & Style Guide

This site hosts business-related quick builds: example workflows, conceptual process diagrams, and demo pages. All pages must follow these rules.

## Typography

- Use modern, tech-forward fonts (the homepage uses Libre Baskerville for the title treatment; inner pages should use clean sans-serif fonts like Inter, DM Sans, or similar)
- Prefer glyphs, icons, and symbols over decorative elements
- No photo images anywhere on the site

## Color Palette

- **Background**: `#071a0e` (dark forest green — used on the homepage, use on all pages)
- **Primary elements**: darker shades of green (`#0d2b18`, `#1a4a2e`, `#143d24`, `#0f3320`)
- **Text**: white or white with reduced opacity for secondary text
- **Contrast/accent lines**: light blue (`#5b9bd5` or similar well-matching light blue) — use for elements that need to stand out against the green palette (connecting lines, highlights, active states, borders that need differentiation)

## Process Flow Diagrams

Most content will be workflow and process visualizations. Follow these rules:

- **Flow direction**: always top to bottom
- **Process boxes**: rectangles with very slight corner rounding (`rounded` or `rounded-sm` in Tailwind, ~4px border-radius)
- **Connectors**: arrows between boxes — use one-way arrows for sequential flow, two-way arrows where the process is bidirectional
- **Arrow color**: light blue accent (`#5b9bd5`) for contrast against green boxes
- **Box fill**: darker green shades from the palette above
- **Box borders**: subtle lighter green or light blue depending on emphasis
- **Labels**: white text inside boxes, keep concise, all caps and bold
- **Step numbering**: each step gets a circled number icon positioned to the left of its box (blue border circle, blue number, dark background fill)
- **Simultaneous steps**: wrap parallel branches in a dashed-border group box with lighter shading (`#0a2314`, border `#5b9bd5/20`), sharing a single step number
- **Decision branches**: Yes/No labels on branch arrows, uppercase bold

## Page Typography

- **Headlines**: all caps (`uppercase`), bold (`font-bold`)
- **Subheadings**: all caps (`uppercase`), smaller font size, bold (`font-bold`), wider tracking
- **No navigation links between pages** — every page stands alone with no back links or cross-page nav

## Animations

- **Scroll fade-in**: all flow elements use Intersection Observer to fade in (opacity 0→1, translateY 16px→0, 0.6s ease-out) as they enter the viewport at 10% threshold
- **Above the fold**: elements visible in the initial viewport trigger immediately on load — no delayed appearance
- Use the `FadeIn` wrapper component for all flow page content

## General Rules

- No photo images — use icons, glyphs, SVG symbols, or CSS-drawn elements only
- Keep layouts clean and minimal
- Pages should feel technical and modern, not decorative
- Consistent spacing and alignment across all workflow elements
- Automatically update this style guide when new patterns are established during iteration

## Interactive State Diagrams (e.g. `/StarlinkFailover`)

Pages that explain a system with two or more operating states (normal vs. backup, on vs. off) use a slider-driven scene rather than static before/after images:

- **Scene**: one inline SVG (viewBox ~600 wide, near-square so it fills a phone screen) drawn from palette primitives: house/room shells in `#0d2b18` / `#0a2314`, walls `#1a4a2e`, equipment boxes `#143d24`. Inputs enter on the left, distribution fans out to the right. Keep in-SVG labels short, all caps, bold, `letterSpacing` 1–1.5, and ≥10px in viewBox units; put the full legend/readout in HTML beside the diagram so it stays legible on mobile
- **State value**: a continuous `t` (0→1). Everything that differs between states cross-fades on `t` (group `opacity={t}` / `opacity={1 - t}`); everything that stays constant (the mesh, the devices) is drawn once. The scene is **not interactive**: a requestAnimationFrame loop holds each state for ~5 s and eases between them over ~1.5 s, runs only while the diagram is in view (IntersectionObserver), and re-renders only when `t` actually changes. Both states are always named on screen in a two-card strip above the scene; the current card is highlighted with a time-in-state bar (`.sf-progress`), and the scene header repeats the current state name. No sliders, toggles, or play buttons
- **Motion in connections**: flowing dashes with `stroke-dasharray` + a `stroke-dashoffset` keyframe (`.sf-flow`, direction follows path direction) plus a few "packet" circles on SMIL `<animateMotion>` along the same path. Expanding `.sf-ring` circles for active radios, `.sf-breathe` for status lights, gentle `.sf-drift` for the satellite. All motion is disabled under `prefers-reduced-motion`
- **Line colors**: wired and mesh paths use the accent blue `#5b9bd5`; radio/satellite paths use a lighter sky blue `#a8d4ff` so the two sources read differently. A muted red `#e0605a` is reserved for fault states (a break glyph, an outage label, a flickering LED) and is used sparingly; a muted amber `#e6c36a` marks transitional "searching" states in status consoles
- **Status console**: a monospace readout beside the scene (row per subsystem: pulsing dot, name, state word) plus a one-line "data path" string, so the scene is never the only carrier of meaning
- **Section header**: kicker (10–11px, tracking 0.28em, blue), short blue rule, all-caps bold title, optional one-sentence blurb

## Writing for Executive Readers

Pages aimed at a board- or CEO-level reader (e.g. `/StarlinkFailover`) use Simplified Technical English and assume little curiosity:

- One idea per sentence, under about 15 words, active voice, present tense. No idioms, no metaphors ("goes dark"), no jargon without a plain-word substitute (say "wired internet", not "hardline" or "WAN")
- Lead with what it means for the reader, not how it works. A three-sentence lead paragraph at `text-base`/`text-lg`, then the interactive scene, then at most three or four short sections
- Use the same name for the same thing every time (the dish, the Starlink router, the Eero gateway, PerryHome, PerryBackup). Network and menu names render in mono sky-blue via a `Name` span
- Procedures are numbered steps in the flow-diagram format. Each step is a list of imperative "do" lines (blue dot; red dot for "Do not …") and ends with a **Check** row: the observable condition that must be true before the next step. Follow the flow with a "Do not" card (red border) and an "Installation record" card (sign-off fields)
- Cut anything that only satisfies curiosity: timelines, FAQs, layered explanations, app mock-ups. If a fact drives a decision (cost posture, subscription requirement), it earns a requirements tile; otherwise it goes
- Never state a fixed count the reader might take as a requirement ("four nodes"); say "multiple nodes" and let the diagram be illustrative. Say once that the page reflects one proven, modeled setup and other equipment may need a similar but different approach
- Introduce any named thing (a Wi-Fi network, a product) before using it, and say what kind of thing it is every time it appears in a label ("PerryHome Wi-Fi", not "PerryHome"). Assume no prior context: define "mesh network" in one sentence

## Retro Game / Terminal Pages

Interactive game pages (e.g. `/EscapeFromParis`, `/Zork`) use a CRT terminal treatment layered on the site palette:

- **Panel**: near-black green `#040e07` on the `#071a0e` page background
- **Game text**: phosphor green `#33ff33`, monospace (`font-mono`), soft glow (`text-shadow: 0 0 6px rgba(51,255,51,0.25)`)
- **Player input / echoes**: light blue accent `#5b9bd5`
- **Scanlines**: full-screen `repeating-linear-gradient` overlay, `pointer-events-none`
- **Mobile terminal layout**: fixed-height flex column (status bar / scrollable transcript / input bar); track `window.visualViewport` height so the input bar stays above the on-screen keyboard (plus `interactiveWidget: "resizes-content"` in the viewport export); input font ≥16px to prevent iOS focus zoom; `autoCapitalize`/`autoCorrect`/`spellCheck` off for command inputs; one-tap quick-command chips for common verbs
