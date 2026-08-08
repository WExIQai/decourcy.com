/**
 * Type declarations for the vendored JSZM interpreter (see jszm.js).
 *
 * JSZM is generator-driven: the host assigns generator functions as hooks
 * (print, read, save, restore, updateStatusLine) and then steps the
 * generator returned by run(). Values yielded by a hook propagate out of
 * run()'s iterator, and the value passed to iterator.next(v) is delivered
 * back into the suspended hook — this page uses that to pause the machine
 * while waiting for player input.
 */
type JSZMHookResult<R> = Generator<unknown, R, string> | Iterable<unknown>;

declare class JSZM {
  constructor(data: Uint8Array);

  /** Called for all game output. `scripting` mirrors the transcript flag. */
  print: (text: string, scripting: boolean) => JSZMHookResult<void>;
  /** Called on READ; must produce the player's input line. */
  read: (maxlen: number) => Generator<unknown, string, string>;
  /** Called on SAVE with the serialized machine state. Return success. */
  save: (data: Uint8Array) => JSZMHookResult<boolean>;
  /** Called on RESTORE; return the bytes passed to save(), or null/false. */
  restore: () => JSZMHookResult<Uint8Array | null | false | undefined>;
  /** Called before READ / on USL with room name and the two status values. */
  updateStatusLine:
    | ((text: string, v18: number, v17: number) => JSZMHookResult<void>)
    | null;
  /** Called when fixed-pitch highlighting toggles. */
  highlight: (fixpitch: boolean) => JSZMHookResult<void>;
  /** Called after memory (re)initialization, at start and on RESTART. */
  restarted: () => JSZMHookResult<void>;
  screen: ((window: number) => JSZMHookResult<void>) | null;
  split: ((height: number) => JSZMHookResult<void>) | null;

  isTandy: boolean;
  /** False = score/moves status line, true = hours/minutes. */
  statusType: boolean | null;
  /** Six-character serial number from the story file header. */
  serial: string;
  /** Release number from the story file header. */
  zorkid: number;

  /** Runs the machine; finishes only on QUIT. */
  run(): Generator<unknown, void, string | undefined>;
  /** Checksum-verifies the story file. */
  verify(): boolean;

  static version: {
    major: number;
    minor: number;
    subminor: number;
    timestamp: number;
  };
}

export default JSZM;
