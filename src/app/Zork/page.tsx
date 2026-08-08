"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import JSZM from "./jszm";

// ─── CONSTANTS ────────────────────────────────────────────────

const STORY_URL = "/Zork/zork1.z3";
const SAVE_KEY = "zork1.save.v1";

const ZORK_ART = `
███████╗ ██████╗ ██████╗ ██╗  ██╗    ██╗
╚══███╔╝██╔═══██╗██╔══██╗██║ ██╔╝    ██║
  ███╔╝ ██║   ██║██████╔╝█████╔╝     ██║
 ███╔╝  ██║   ██║██╔══██╗██╔═██╗     ██║
███████╗╚██████╔╝██║  ██║██║  ██╗    ██║
╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝`;

interface QuickCommand {
  label: string;
  cmd: string;
  // Instant commands submit on tap; the rest pre-fill the input so the
  // player can add an object ("open mailbox").
  instant: boolean;
}

const QUICK_COMMANDS: QuickCommand[] = [
  { label: "N", cmd: "north", instant: true },
  { label: "S", cmd: "south", instant: true },
  { label: "E", cmd: "east", instant: true },
  { label: "W", cmd: "west", instant: true },
  { label: "Up", cmd: "up", instant: true },
  { label: "Down", cmd: "down", instant: true },
  { label: "Look", cmd: "look", instant: true },
  { label: "Inv", cmd: "inventory", instant: true },
  { label: "Take", cmd: "take ", instant: false },
  { label: "Open", cmd: "open ", instant: false },
  { label: "Examine", cmd: "examine ", instant: false },
  { label: "Save", cmd: "save", instant: true },
  { label: "Restore", cmd: "restore", instant: true },
];

type Phase = "loading" | "title" | "playing" | "ended" | "error";

interface Entry {
  id: number;
  kind: "game" | "player" | "system";
  text: string;
}

interface GameStatus {
  room: string;
  score: number;
  moves: number;
}

// ─── SAVE-FILE ENCODING ───────────────────────────────────────

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function base64ToBytes(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// ─── PAGE ─────────────────────────────────────────────────────

export default function ZorkPage() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [status, setStatus] = useState<GameStatus | null>(null);
  const [input, setInput] = useState("");
  const [meta, setMeta] = useState<{ release: number; serial: string } | null>(
    null,
  );
  // Visual-viewport height; shrinks when the on-screen keyboard opens so
  // the transcript and input bar stay visible above it.
  const [viewportH, setViewportH] = useState<number | null>(null);

  const storyRef = useRef<Uint8Array | null>(null);
  const genRef = useRef<Generator<unknown, void, string | undefined> | null>(
    null,
  );
  const outBufRef = useRef("");
  const nextIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pushEntry = useCallback((kind: Entry["kind"], text: string) => {
    if (!text) return;
    setEntries((prev) => [...prev, { id: nextIdRef.current++, kind, text }]);
  }, []);

  // Game output is buffered per turn and flushed as one transcript entry
  // when the machine stops to ask for input.
  const flushOutput = useCallback(() => {
    const text = outBufRef.current;
    outBufRef.current = "";
    pushEntry("game", text);
  }, [pushEntry]);

  // Steps the Z-machine until it suspends inside read() waiting for the
  // next command, finishes (QUIT), or throws.
  const advance = useCallback(
    (cmd?: string) => {
      const gen = genRef.current;
      if (!gen) return;
      try {
        const result = cmd === undefined ? gen.next() : gen.next(cmd);
        if (result.done) {
          flushOutput();
          genRef.current = null;
          setPhase("ended");
        }
      } catch (err) {
        flushOutput();
        pushEntry(
          "system",
          `\n*** Z-machine error: ${err instanceof Error ? err.message : String(err)} ***\n`,
        );
        genRef.current = null;
        setPhase("error");
      }
    },
    [flushOutput, pushEntry],
  );

  const startGame = useCallback(() => {
    const story = storyRef.current;
    if (!story) return;

    const vm = new JSZM(story);
    vm.print = function* (text: string) {
      outBufRef.current += text;
    };
    vm.read = function* () {
      flushOutput();
      // Suspends the machine; advance(cmd) delivers the player's line.
      const line = yield "read";
      return line ?? "";
    };
    // JSZM passes (text, v18, v17); in a V3 score game variable 17 is the
    // score and variable 18 is the move counter.
    vm.updateStatusLine = function* (room: string, moves: number, score: number) {
      setStatus({ room, score, moves });
    };
    vm.save = function* (data: Uint8Array) {
      try {
        localStorage.setItem(SAVE_KEY, bytesToBase64(data));
        return true;
      } catch {
        return false;
      }
    };
    vm.restore = function* () {
      try {
        const saved = localStorage.getItem(SAVE_KEY);
        return saved ? base64ToBytes(saved) : null;
      } catch {
        return null;
      }
    };
    vm.restarted = function* () {
      setStatus(null);
    };

    setEntries([]);
    setStatus(null);
    setInput("");
    setPhase("playing");
    genRef.current = vm.run();
    advance();
  }, [advance, flushOutput]);

  const submit = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd || !genRef.current) return;
      pushEntry("player", `${cmd}\n`);
      setInput("");
      advance(cmd);
    },
    [advance, pushEntry],
  );

  const handleQuick = useCallback(
    (q: QuickCommand) => {
      if (q.instant) {
        submit(q.cmd);
      } else {
        setInput(q.cmd);
        inputRef.current?.focus();
      }
    },
    [submit],
  );

  // Fetch the story file once, up front, so "tap to begin" is instant.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(STORY_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        if (cancelled) return;
        const bytes = new Uint8Array(buf);
        storyRef.current = bytes;
        setMeta({
          release: (bytes[2] << 8) | bytes[3],
          serial: String.fromCharCode(...bytes.slice(18, 24)),
        });
        setPhase("title");
      } catch (err) {
        if (cancelled) return;
        pushEntry(
          "system",
          `Could not load the story file: ${err instanceof Error ? err.message : String(err)}`,
        );
        setPhase("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pushEntry]);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => {
      setViewportH(vv.height);
      window.scrollTo(0, 0);
    };
    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, phase, viewportH]);

  const showHeader = phase === "playing" || phase === "ended" || phase === "error";

  return (
    <div
      className="flex h-dvh flex-col items-center bg-[#071a0e] font-mono"
      style={viewportH ? { height: `${viewportH}px` } : undefined}
    >
      {/* CRT scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.06) 1px, rgba(0,0,0,0.06) 2px)",
        }}
      />

      <div className="flex h-full w-full max-w-2xl flex-col overflow-hidden border-x border-[#33ff33]/10 bg-[#040e07]">
        {/* ─── STATUS BAR ─── */}
        {showHeader && (
          <header className="flex items-center justify-between gap-3 border-b border-[#5b9bd5]/25 bg-[#0d2b18] px-3 py-2">
            <span className="min-w-0 truncate text-xs font-bold uppercase tracking-wider text-white">
              {status?.room ?? "Zork I"}
            </span>
            {status && (
              <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-[#5b9bd5]">
                Score {status.score} · Moves {status.moves}
              </span>
            )}
          </header>
        )}

        {/* ─── TRANSCRIPT / TITLE ─── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4"
        >
          {phase === "loading" && (
            <div className="flex h-full items-center justify-center">
              <p className="animate-pulse text-sm font-bold uppercase tracking-wider text-[#33ff33]">
                Loading…
              </p>
            </div>
          )}

          {phase === "title" && (
            <div className="flex min-h-full flex-col items-center justify-center gap-6 py-6 text-center">
              <pre
                className="select-none text-[7px] leading-tight text-[#33ff33] sm:text-[10px]"
                style={{ textShadow: "0 0 10px rgba(51,255,51,0.4)" }}
              >
                {ZORK_ART}
              </pre>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/80 sm:text-sm">
                  The Great Underground Empire
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-white/40">
                  Infocom · Open-sourced under MIT, 2025
                </p>
                {meta && (
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                    Release {meta.release} · Serial {meta.serial}
                  </p>
                )}
              </div>
              <button
                onClick={startGame}
                className="animate-pulse cursor-pointer text-sm font-bold uppercase tracking-wider text-[#33ff33]"
              >
                &gt; Tap to begin &lt;
              </button>
              <div className="max-w-xs space-y-1.5 text-[10px] uppercase tracking-wider text-white/40">
                <p>Type commands: open mailbox · go north · take lamp</p>
                <p>Save and Restore keep one slot in this browser</p>
              </div>
              <a
                href="https://github.com/historicalsource/zork1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-wider text-[#5b9bd5]/70 underline-offset-2 hover:underline"
              >
                Source: historicalsource/zork1
              </a>
            </div>
          )}

          {(phase === "playing" || phase === "ended" || phase === "error") && (
            <pre
              className="whitespace-pre-wrap break-words text-sm leading-relaxed text-[#33ff33]"
              style={{ textShadow: "0 0 6px rgba(51,255,51,0.25)" }}
            >
              {entries.map((e) =>
                e.kind === "game" ? (
                  <span key={e.id}>{e.text}</span>
                ) : e.kind === "player" ? (
                  <span key={e.id} className="font-bold text-[#5b9bd5]">
                    {e.text}
                  </span>
                ) : (
                  <span key={e.id} className="text-red-400">
                    {e.text}
                  </span>
                ),
              )}
            </pre>
          )}
        </div>

        {/* ─── QUICK COMMANDS + INPUT ─── */}
        {phase === "playing" && (
          <>
            <div className="flex gap-1.5 overflow-x-auto border-t border-[#5b9bd5]/20 bg-[#071a0e] px-2 py-1.5">
              {QUICK_COMMANDS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleQuick(q)}
                  className="shrink-0 cursor-pointer rounded-sm border border-[#33ff33]/25 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#33ff33]/80 active:bg-[#33ff33]/10"
                >
                  {q.label}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-center gap-2 border-t border-[#5b9bd5]/25 bg-[#040e07] px-3 py-2"
            >
              <span className="font-bold text-[#33ff33]">&gt;</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                enterKeyHint="send"
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                placeholder="TYPE A COMMAND"
                aria-label="Game command"
                className="min-w-0 flex-1 bg-transparent text-base text-white caret-[#5b9bd5] outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                onMouseDown={(e) => e.preventDefault()}
                className="shrink-0 cursor-pointer rounded-sm border border-[#5b9bd5]/40 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#5b9bd5] active:bg-[#5b9bd5]/10"
              >
                Send
              </button>
            </form>
          </>
        )}

        {(phase === "ended" || phase === "error") && (
          <div className="border-t border-[#5b9bd5]/25 bg-[#040e07] px-3 py-3 text-center">
            <button
              onClick={startGame}
              className="animate-pulse cursor-pointer text-sm font-bold uppercase tracking-wider text-[#33ff33]"
            >
              &gt; Play again &lt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
