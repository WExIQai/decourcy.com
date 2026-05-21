"use client";

import { useEffect, useRef, useState } from "react";
import {
  ASSISTANT_PROSE,
  CHAT_TITLES,
  CODE_SNIPPETS,
  DIFF_SNIPPETS,
  STATUS_LINES,
  TERMINAL_OUTPUT,
  TOOL_CALLS,
  USER_PROMPTS,
  pick,
  shortId,
  type DiffSnippet,
} from "./content";

/* ────────────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────────── */

type Block =
  | { id: string; kind: "user"; text: string }
  | { id: string; kind: "thinking"; status: string }
  | { id: string; kind: "prose"; text: string }
  | { id: string; kind: "code"; lang: string; text: string }
  | {
      id: string;
      kind: "tool";
      name: string;
      args: string;
      status: "running" | "done";
      result: string[];
    }
  | { id: string; kind: "diff"; path: string; text: string; lines: DiffSnippet["hunks"] };

type ChatTitle = { id: string; title: string; active: boolean };

type PaneState = {
  blocks: Block[];
  inputText: string;
  titles: ChatTitle[];
  conversationKey: number;
};

type Variant = "chat" | "terminal";

/* ────────────────────────────────────────────────────────────────
   Engine — runs forever, no fixed loop
   ──────────────────────────────────────────────────────────────── */

const MAX_BLOCKS = 18;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function chance(p: number) {
  return Math.random() < p;
}

function buildTitles(activeIdx = 0): ChatTitle[] {
  const seen = new Set<string>();
  const pool = [...CHAT_TITLES].sort(() => Math.random() - 0.5);
  const titles: ChatTitle[] = [];
  for (const t of pool) {
    if (seen.has(t)) continue;
    seen.add(t);
    titles.push({ id: shortId(), title: t, active: false });
    if (titles.length >= 9) break;
  }
  if (titles[activeIdx]) titles[activeIdx].active = true;
  return titles;
}

function useEngine(variant: Variant) {
  const [state, setState] = useState<PaneState>({
    blocks: [],
    inputText: "",
    titles: [],
    conversationKey: 0,
  });

  const cancelRef = useRef<{ cancelled: boolean; timeout: number | null }>({
    cancelled: false,
    timeout: null,
  });

  useEffect(() => {
    const ctl = cancelRef.current;
    ctl.cancelled = false;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        if (ctl.cancelled) return resolve();
        ctl.timeout = window.setTimeout(() => resolve(), ms);
      });

    const update = (mutator: (s: PaneState) => PaneState) => {
      if (ctl.cancelled) return;
      setState(mutator);
    };

    const appendBlock = (block: Block) => {
      update((s) => ({
        ...s,
        blocks: trim([...s.blocks, block]),
      }));
    };

    const updateLastBlock = (mut: (b: Block) => Block) => {
      update((s) => {
        if (s.blocks.length === 0) return s;
        const next = s.blocks.slice();
        next[next.length - 1] = mut(next[next.length - 1]);
        return { ...s, blocks: next };
      });
    };

    const removeLastBlockIf = (predicate: (b: Block) => boolean) => {
      update((s) => {
        if (s.blocks.length === 0) return s;
        const last = s.blocks[s.blocks.length - 1];
        if (!predicate(last)) return s;
        return { ...s, blocks: s.blocks.slice(0, -1) };
      });
    };

    const trim = (blocks: Block[]) =>
      blocks.length > MAX_BLOCKS ? blocks.slice(blocks.length - MAX_BLOCKS) : blocks;

    const setInput = (text: string) => update((s) => ({ ...s, inputText: text }));

    // ── Typing a user prompt into the input box, then "submitting" ──
    const typeUserPrompt = async (full: string) => {
      setInput("");
      let i = 0;
      while (i < full.length) {
        if (ctl.cancelled) return;
        const burst = Math.max(1, Math.floor(rand(1, 4)));
        i = Math.min(full.length, i + burst);
        setInput(full.slice(0, i));
        // occasional pause as if thinking mid-sentence
        const delay = chance(0.06) ? rand(180, 420) : rand(28, 70);
        await wait(delay);
      }
      await wait(rand(180, 460));
      // submit
      setInput("");
      appendBlock({ id: shortId(), kind: "user", text: full });
      await wait(rand(120, 320));
    };

    const streamProseChars = async (text: string) => {
      let i = 0;
      while (i < text.length) {
        if (ctl.cancelled) return;
        const burst = Math.max(2, Math.floor(rand(2, 7)));
        i = Math.min(text.length, i + burst);
        updateLastBlock((b) => (b.kind === "prose" ? { ...b, text: text.slice(0, i) } : b));
        const delay = chance(0.05) ? rand(120, 280) : rand(16, 38);
        await wait(delay);
      }
    };

    const streamCodeLines = async (lines: string[], lang: string) => {
      let acc = "";
      for (const line of lines) {
        if (ctl.cancelled) return;
        acc += (acc ? "\n" : "") + line;
        updateLastBlock((b) => (b.kind === "code" ? { ...b, text: acc, lang } : b));
        await wait(rand(40, 110));
      }
    };

    const streamDiffLines = async (lines: DiffSnippet["hunks"]) => {
      const acc: DiffSnippet["hunks"] = [];
      for (const line of lines) {
        if (ctl.cancelled) return;
        acc.push(line);
        const snapshot = acc.slice();
        updateLastBlock((b) => (b.kind === "diff" ? { ...b, lines: snapshot } : b));
        await wait(rand(45, 100));
      }
    };

    const runToolResult = async (resultLines: string[]) => {
      const acc: string[] = [];
      for (const line of resultLines) {
        if (ctl.cancelled) return;
        acc.push(line);
        const snapshot = acc.slice();
        updateLastBlock((b) =>
          b.kind === "tool" ? { ...b, result: snapshot, status: "done" } : b,
        );
        await wait(rand(30, 90));
      }
    };

    // ── Generate one assistant block, append + stream it ──
    const playAssistantBlock = async () => {
      const r = Math.random();

      if (r < 0.32) {
        appendBlock({ id: shortId(), kind: "prose", text: "" });
        await streamProseChars(pick(ASSISTANT_PROSE));
      } else if (r < 0.62) {
        const tool = pick(TOOL_CALLS);
        appendBlock({
          id: shortId(),
          kind: "tool",
          name: tool.name,
          args: tool.args,
          status: "running",
          result: [],
        });
        await wait(rand(380, 920));
        const resultLineCount = Math.floor(rand(1, 5));
        const result: string[] = [];
        for (let i = 0; i < resultLineCount; i++) result.push(pick(TERMINAL_OUTPUT));
        await runToolResult(result);
      } else if (r < 0.82) {
        const snippet = pick(CODE_SNIPPETS);
        appendBlock({ id: shortId(), kind: "code", lang: snippet.lang, text: "" });
        await streamCodeLines(snippet.lines, snippet.lang);
      } else {
        const d = pick(DIFF_SNIPPETS);
        appendBlock({
          id: shortId(),
          kind: "diff",
          path: d.path,
          text: "",
          lines: [],
        });
        await streamDiffLines(d.hunks);
      }
    };

    // ── Full exchange: user prompt → optional thinking → 2-5 assistant blocks ──
    const playExchange = async () => {
      await typeUserPrompt(pick(USER_PROMPTS));

      // thinking indicator (sometimes)
      if (chance(0.75)) {
        appendBlock({ id: shortId(), kind: "thinking", status: pick(STATUS_LINES) });
        await wait(rand(380, 1100));
        removeLastBlockIf((b) => b.kind === "thinking");
      }

      const blockCount = Math.floor(rand(2, 6));
      for (let i = 0; i < blockCount; i++) {
        if (ctl.cancelled) return;
        await playAssistantBlock();
        await wait(rand(180, 480));
      }
      await wait(rand(700, 1600));
    };

    // ── Switch to a new conversation (chat variant only) ──
    const switchConversation = async () => {
      await wait(rand(200, 500));
      update((s) => {
        const idx = Math.floor(Math.random() * s.titles.length);
        const titles = s.titles.map((t, i) => ({ ...t, active: i === idx }));
        // Replace the active title with a fresh randomly-picked one
        titles[idx] = { id: shortId(), title: pick(CHAT_TITLES), active: true };
        return {
          ...s,
          blocks: [],
          inputText: "",
          titles,
          conversationKey: s.conversationKey + 1,
        };
      });
      await wait(rand(300, 700));
    };

    // ── Main loop ──
    const loop = async () => {
      // Populate sidebar titles on the client (avoids hydration mismatch)
      update((s) => ({ ...s, titles: buildTitles(0) }));
      // Stagger the two panes so they don't move in sync
      await wait(variant === "chat" ? rand(0, 300) : rand(400, 900));
      while (!ctl.cancelled) {
        const exchangesBeforeSwitch = Math.floor(rand(3, 7));
        for (let i = 0; i < exchangesBeforeSwitch; i++) {
          if (ctl.cancelled) return;
          await playExchange();
        }
        if (variant === "chat") {
          await switchConversation();
        } else {
          // Terminal: clear screen occasionally to mimic /clear
          await wait(rand(300, 700));
          update((s) => ({ ...s, blocks: [], inputText: "" }));
          await wait(rand(400, 900));
        }
      }
    };

    void loop();

    return () => {
      ctl.cancelled = true;
      if (ctl.timeout) window.clearTimeout(ctl.timeout);
    };
  }, [variant]);

  return state;
}

/* ────────────────────────────────────────────────────────────────
   Naïve code "syntax" highlighter — just enough to look like code
   ──────────────────────────────────────────────────────────────── */

const KEYWORDS = new Set([
  "const", "let", "var", "function", "async", "await", "return", "if", "else",
  "for", "while", "switch", "case", "break", "continue", "try", "catch",
  "finally", "throw", "new", "class", "extends", "import", "export", "from",
  "default", "type", "interface", "enum", "in", "of", "typeof", "instanceof",
  "void", "as", "is", "null", "undefined", "true", "false", "this", "super",
  "def", "lambda", "pass", "yield", "raise", "with", "global", "nonlocal",
  "elif", "and", "or", "not", "None", "True", "False", "SELECT", "FROM",
  "WHERE", "INSERT", "INTO", "UPDATE", "SET", "DELETE", "CREATE", "TABLE",
  "INDEX", "ALTER", "ADD", "COLUMN", "JOIN", "ON", "GROUP", "BY", "ORDER",
  "LIMIT", "VALUES", "AS",
]);

function highlightLine(line: string): React.ReactNode[] {
  // Comments
  if (/^\s*(\/\/|#)/.test(line) || /^\s*--/.test(line)) {
    return [
      <span key="c" style={{ color: "#6b6760" }}>
        {line}
      </span>,
    ];
  }
  const parts: React.ReactNode[] = [];
  let i = 0;
  let buf = "";
  const flush = () => {
    if (buf) {
      parts.push(<span key={`p-${parts.length}`}>{buf}</span>);
      buf = "";
    }
  };
  while (i < line.length) {
    const ch = line[i];
    // Strings
    if (ch === "'" || ch === '"' || ch === "`") {
      flush();
      const quote = ch;
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === "\\") j++;
        j++;
      }
      j = Math.min(line.length, j + 1);
      parts.push(
        <span key={`s-${parts.length}`} style={{ color: "#a8a094" }}>
          {line.slice(i, j)}
        </span>,
      );
      i = j;
      continue;
    }
    // Numbers
    if (/[0-9]/.test(ch) && (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))) {
      flush();
      let j = i;
      while (j < line.length && /[0-9.]/.test(line[j])) j++;
      parts.push(
        <span key={`n-${parts.length}`} style={{ color: "#c8a878" }}>
          {line.slice(i, j)}
        </span>,
      );
      i = j;
      continue;
    }
    // Identifiers / keywords
    if (/[a-zA-Z_]/.test(ch)) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      flush();
      if (KEYWORDS.has(word)) {
        parts.push(
          <span key={`k-${parts.length}`} style={{ color: "#d97757" }}>
            {word}
          </span>,
        );
      } else {
        parts.push(<span key={`i-${parts.length}`}>{word}</span>);
      }
      i = j;
      continue;
    }
    buf += ch;
    i++;
  }
  flush();
  return parts;
}

/* ────────────────────────────────────────────────────────────────
   Auto-scroll hook: keeps the scroll pinned to bottom whenever blocks change
   ──────────────────────────────────────────────────────────────── */

function useStickyBottom(deps: unknown[]) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ────────────────────────────────────────────────────────────────
   Pane: chat (Claude.ai-style)
   ──────────────────────────────────────────────────────────────── */

function ChatPane() {
  const state = useEngine("chat");
  const scrollRef = useStickyBottom([state.blocks, state.inputText, state.conversationKey]);

  return (
    <div className="flex h-full min-h-0 w-full bg-[#262624] text-[#e8e6e3]">
      {/* Sidebar */}
      <div className="hidden md:flex w-56 shrink-0 flex-col border-r border-[#3a3835] bg-[#1f1e1d]">
        <div className="px-3 py-3 flex items-center gap-2 border-b border-[#3a3835]">
          <div className="w-6 h-6 rounded-md bg-[#d97757] flex items-center justify-center text-[#1f1e1d] text-xs font-bold">
            ✱
          </div>
          <div className="text-[13px] font-semibold tracking-tight">Claude</div>
        </div>
        <div className="px-2 py-2">
          <div className="text-[11px] uppercase tracking-wider text-[#9b958d] px-2 py-1">
            Recents
          </div>
          <div className="flex flex-col">
            {state.titles.map((t) => (
              <div
                key={t.id}
                className={
                  "truncate rounded px-2 py-1.5 text-[12px] cursor-default transition-colors " +
                  (t.active
                    ? "bg-[#353331] text-[#e8e6e3]"
                    : "text-[#b8b0a6] hover:bg-[#2c2b29]")
                }
              >
                {t.title}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto px-3 py-3 border-t border-[#3a3835] flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#3a3835] flex items-center justify-center text-[10px] text-[#9b958d]">
            W
          </div>
          <div className="text-[12px] text-[#9b958d]">william@wexiq.ai</div>
        </div>
      </div>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="h-11 shrink-0 border-b border-[#3a3835] flex items-center px-4 gap-3">
          <div className="text-[12px] text-[#9b958d]">Claude Opus 4.7</div>
          <div className="text-[#5b554e]">·</div>
          <div className="text-[12px] text-[#9b958d]">1M context</div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7aa86c]" />
            <div className="text-[11px] text-[#9b958d]">connected</div>
          </div>
        </div>

        {/* Conversation */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-8 py-6 space-y-4"
          key={state.conversationKey}
        >
          {state.blocks.map((b) => (
            <ChatBlock key={b.id} block={b} />
          ))}
        </div>

        {/* Input bar */}
        <div className="shrink-0 p-3 border-t border-[#3a3835]">
          <div className="mx-auto max-w-3xl rounded-lg border border-[#3a3835] bg-[#1f1e1d] px-3 py-2.5 flex items-start gap-2">
            <div className="flex-1 min-h-[1.5rem] text-[13px] text-[#e8e6e3] whitespace-pre-wrap leading-relaxed">
              {state.inputText}
              <Caret />
            </div>
            <div className="shrink-0 w-7 h-7 rounded-md bg-[#3a3835] flex items-center justify-center text-[#9b958d]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v16M12 4l-6 6M12 4l6 6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBlock({ block }: { block: Block }) {
  if (block.kind === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl bg-[#1f1e1d] border border-[#3a3835] px-3.5 py-2 text-[13px] leading-relaxed text-[#e8e6e3]">
          {block.text}
        </div>
      </div>
    );
  }
  if (block.kind === "thinking") {
    return (
      <div className="flex items-center gap-2 pl-1">
        <div className="w-5 h-5 rounded-md bg-[#d97757]/20 flex items-center justify-center text-[#d97757] text-[10px]">
          ✱
        </div>
        <div className="flex gap-1">
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </div>
      </div>
    );
  }
  if (block.kind === "prose") {
    return (
      <div className="flex gap-3">
        <div className="shrink-0 w-5 h-5 rounded-md bg-[#d97757]/15 flex items-center justify-center text-[#d97757] text-[10px] mt-0.5">
          ✱
        </div>
        <div className="text-[13px] leading-relaxed text-[#e8e6e3] whitespace-pre-wrap min-w-0">
          {block.text}
          <StreamCaret />
        </div>
      </div>
    );
  }
  if (block.kind === "code") {
    return (
      <div className="pl-8">
        <div className="rounded-lg border border-[#3a3835] overflow-hidden bg-[#1a1a1a]">
          <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#9b958d] bg-[#1f1e1d] border-b border-[#3a3835]">
            {block.lang}
          </div>
          <pre className="px-3 py-2 text-[11.5px] leading-[1.55] font-mono text-[#cfc8bd] overflow-x-hidden">
            {block.text.split("\n").map((line, i) => (
              <div key={i}>{highlightLine(line)}</div>
            ))}
            <StreamCaret />
          </pre>
        </div>
      </div>
    );
  }
  if (block.kind === "tool") {
    return (
      <div className="pl-8">
        <div className="rounded-lg border border-[#3a3835] bg-[#1f1e1d] overflow-hidden">
          <div className="px-3 py-2 flex items-center gap-2 text-[12px] font-mono">
            {block.status === "running" ? (
              <Spinner />
            ) : (
              <span className="text-[#7aa86c]">●</span>
            )}
            <span className="text-[#d97757]">{block.name}</span>
            <span className="text-[#9b958d]">({block.args})</span>
          </div>
          {block.result.length > 0 && (
            <div className="px-3 pb-2 pt-0 text-[11px] font-mono text-[#9b958d]">
              {block.result.map((r, i) => (
                <div key={i} className="truncate">
                  ⎿ {r}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  // diff
  return (
    <div className="pl-8">
      <div className="rounded-lg border border-[#3a3835] bg-[#1a1a1a] overflow-hidden">
        <div className="px-3 py-1.5 flex items-center gap-2 text-[11px] font-mono bg-[#1f1e1d] border-b border-[#3a3835]">
          <span className="text-[#d97757]">Edit</span>
          <span className="text-[#9b958d]">{block.path}</span>
        </div>
        <pre className="text-[11.5px] leading-[1.55] font-mono">
          {block.lines.map((l, i) => {
            const color =
              l.kind === "add"
                ? "bg-[#1e3a23] text-[#a8d49a]"
                : l.kind === "del"
                ? "bg-[#3a1e1e] text-[#d49a9a]"
                : "text-[#9b958d]";
            const prefix = l.kind === "add" ? "+" : l.kind === "del" ? "-" : " ";
            return (
              <div key={i} className={`${color} px-3`}>
                <span className="select-none mr-2 opacity-60">{prefix}</span>
                {l.text}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Pane: terminal (Claude Code-style)
   ──────────────────────────────────────────────────────────────── */

function TerminalPane() {
  const state = useEngine("terminal");
  const scrollRef = useStickyBottom([state.blocks, state.inputText]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#161514] text-[#cfc8bd] font-mono">
      <div className="h-11 shrink-0 border-b border-[#2a2826] flex items-center px-3 gap-2 text-[11px]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#3a3835]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3a3835]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#3a3835]" />
        </div>
        <div className="ml-3 text-[#9b958d]">claude — ~/wexiqai/decourcy.com</div>
        <div className="ml-auto flex items-center gap-2 text-[#9b958d]">
          <span className="text-[#7aa86c]">●</span>
          <span>claude-opus-4-7</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-3 text-[11.5px] leading-[1.55]">
        {state.blocks.map((b) => (
          <TerminalBlock key={b.id} block={b} />
        ))}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-[#d97757]">{">"}</span>
          <span className="text-[#e8e6e3] whitespace-pre-wrap break-words">
            {state.inputText}
            <Caret />
          </span>
        </div>
      </div>

      <div className="h-7 shrink-0 border-t border-[#2a2826] flex items-center px-3 text-[10px] text-[#6b6760] gap-4">
        <span className="text-[#7aa86c]">●</span>
        <span>main</span>
        <span>·</span>
        <span>ready</span>
        <span className="ml-auto">↑ tokens 142k / 1M</span>
      </div>
    </div>
  );
}

function TerminalBlock({ block }: { block: Block }) {
  if (block.kind === "user") {
    return (
      <div className="mb-2 flex items-baseline gap-2">
        <span className="text-[#d97757]">{">"}</span>
        <span className="text-[#e8e6e3] whitespace-pre-wrap break-words">{block.text}</span>
      </div>
    );
  }
  if (block.kind === "thinking") {
    return (
      <div className="mb-2 flex items-center gap-2 text-[#9b958d]">
        <span className="text-[#d97757]">✱</span>
        <span className="italic">{block.status}</span>
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </div>
    );
  }
  if (block.kind === "prose") {
    return (
      <div className="mb-2 text-[#cfc8bd] whitespace-pre-wrap break-words">
        {block.text}
        <StreamCaret />
      </div>
    );
  }
  if (block.kind === "code") {
    return (
      <div className="mb-2 border-l-2 border-[#3a3835] pl-3 text-[#cfc8bd]">
        {block.text.split("\n").map((line, i) => (
          <div key={i}>{highlightLine(line)}</div>
        ))}
        <StreamCaret />
      </div>
    );
  }
  if (block.kind === "tool") {
    return (
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          {block.status === "running" ? (
            <Spinner />
          ) : (
            <span className="text-[#7aa86c]">●</span>
          )}
          <span className="text-[#d97757]">{block.name}</span>
          <span className="text-[#9b958d]">({block.args})</span>
        </div>
        {block.result.map((r, i) => (
          <div key={i} className="pl-5 text-[#9b958d] truncate">
            ⎿ {r}
          </div>
        ))}
      </div>
    );
  }
  // diff
  return (
    <div className="mb-2">
      <div className="flex items-baseline gap-2">
        <span className="text-[#7aa86c]">●</span>
        <span className="text-[#d97757]">Edit</span>
        <span className="text-[#9b958d]">({block.path})</span>
      </div>
      <div className="pl-5">
        {block.lines.map((l, i) => {
          const color =
            l.kind === "add"
              ? "text-[#a8d49a]"
              : l.kind === "del"
              ? "text-[#d49a9a]"
              : "text-[#9b958d]";
          const prefix = l.kind === "add" ? "+" : l.kind === "del" ? "-" : " ";
          return (
            <div key={i} className={color}>
              <span className="select-none mr-2 opacity-60">{prefix}</span>
              {l.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Small UI primitives
   ──────────────────────────────────────────────────────────────── */

function Caret() {
  return (
    <span
      aria-hidden
      className="inline-block w-[7px] h-[1em] -mb-[2px] ml-[1px] bg-[#d97757] align-baseline"
      style={{ animation: "bgCaret 1.05s steps(2) infinite" }}
    />
  );
}

function StreamCaret() {
  return (
    <span
      aria-hidden
      className="inline-block w-[6px] h-[0.95em] -mb-[2px] ml-[1px] bg-[#cfc8bd]/70 align-baseline"
    />
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      aria-hidden
      className="inline-block w-1 h-1 rounded-full bg-[#9b958d]"
      style={{
        animation: "bgPulse 1.1s ease-in-out infinite",
        animationDelay: `${delay}ms`,
      }}
    />
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block w-3 h-3 rounded-full border-2 border-[#9b958d]/30 border-t-[#d97757]"
      style={{ animation: "bgSpin 0.8s linear infinite" }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────── */

export default function BGPage() {
  return (
    <div className="fixed inset-0 flex bg-[#161514] overflow-hidden select-none">
      <style>{`
        @keyframes bgCaret { 0%, 50% { opacity: 1; } 50.01%, 100% { opacity: 0; } }
        @keyframes bgPulse { 0%, 100% { opacity: 0.3; transform: translateY(0); } 50% { opacity: 1; transform: translateY(-1px); } }
        @keyframes bgSpin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { display: none; }
        * { scrollbar-width: none; }
      `}</style>
      <div className="flex-1 min-w-0 border-r border-[#0a0908]">
        <ChatPane />
      </div>
      <div className="flex-1 min-w-0">
        <TerminalPane />
      </div>
    </div>
  );
}
