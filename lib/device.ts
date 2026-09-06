/*
 * The device sign-in the desktop app talks to.
 *
 * Three moving parts and one rule. The app asks for a code and gets back two
 * things: a code a person can read out, and a token only the app holds. The
 * person types the code into /link. The app, which has been asking politely,
 * gets the key. Both halves are needed, so a code read off somebody's screen
 * is worth nothing without the app that asked for it.
 *
 * ── This store is memory, and memory is not where this belongs ──────────────
 *
 * A Map in a module lives as long as one server process. That is fine for a
 * code with a fifteen-minute life on a single instance, and wrong the moment
 * there are two: the app would poll one process about a code confirmed on
 * another and wait forever. Before this carries real accounts it wants a real
 * store — anything shared and expiring will do, since nothing here is kept
 * longer than the sign-in it belongs to.
 *
 * Said plainly rather than left to be discovered, because it works perfectly
 * until the day it is deployed properly, which is the worst way for a thing
 * to break.
 */

import { randomBytes } from "node:crypto";

/** How long somebody has to walk to another window and type four characters
 *  twice. Long enough to answer the door; short enough that a code on a
 *  screen behind you is not a standing invitation. */
const LIFETIME = 15 * 60 * 1000;

/** How often the app is welcome to ask. */
export const INTERVAL = 3;

export type Status = "pending" | "ready" | "denied" | "expired";

interface Sitting {
  code: string;
  token: string;
  status: Status;
  /** Minted only once somebody has said yes. */
  key?: string;
  expires: number;
}

const byToken = new Map<string, Sitting>();
const byCode = new Map<string, Sitting>();

/* Characters that cannot be misread aloud or by eye: no O against 0, no I or
   L against 1, no S against 5. What is left is still 28 bits over eight
   characters, which is far more than a fifteen-minute window needs. */
const SAYABLE = "ABCDEFGHJKMNPQRTUVWXYZ2346789";

function say(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (const byte of bytes) out += SAYABLE[byte % SAYABLE.length];
  return out;
}

/** Anything past its time, forgotten. Called on the way in rather than on a
 *  timer: the only thing that makes this map grow is somebody starting a
 *  sign-in, so that is the moment worth tidying at. */
function sweep(): void {
  const now = Date.now();
  for (const [token, sitting] of byToken) {
    if (sitting.expires < now) {
      byToken.delete(token);
      byCode.delete(sitting.code);
    }
  }
}

/** Start one. */
export function begin(): { code: string; token: string; expiresIn: number } {
  sweep();
  // Grouped in two halves because that is how a person reads a code back to
  // themselves while walking to another window.
  let code = `${say(4)}-${say(4)}`;
  while (byCode.has(code)) code = `${say(4)}-${say(4)}`;

  const sitting: Sitting = {
    code,
    token: randomBytes(32).toString("base64url"),
    status: "pending",
    expires: Date.now() + LIFETIME,
  };
  byToken.set(sitting.token, sitting);
  byCode.set(code, sitting);
  return { code, token: sitting.token, expiresIn: Math.floor(LIFETIME / 1000) };
}

/** What the app is waiting to hear.
 *
 *  A key is handed over exactly once. The second poll after a successful one
 *  gets "ready" and nothing else — if the first reply went missing the app
 *  will have to start again, which is the correct outcome: a key that can be
 *  collected twice is a key that can be collected by somebody else. */
export function ask(token: string): { status: Status; key?: string } {
  const sitting = byToken.get(token);
  if (!sitting) return { status: "expired" };
  if (sitting.expires < Date.now()) return { status: "expired" };
  if (sitting.status !== "ready") return { status: sitting.status };

  const key = sitting.key;
  delete sitting.key;
  return { status: "ready", ...(key ? { key } : {}) };
}

/** Somebody typed the code and said yes.
 *
 *  In a real one this is where an account is looked up and the key is that
 *  account's, issued against it and revocable from it. Here it is a fresh
 *  string, because there are no accounts yet and inventing a fake one would
 *  make this look further along than it is. */
export function confirm(typed: string): Status {
  sweep();
  const sitting = byCode.get(typed.trim().toUpperCase());
  if (!sitting) return "expired";
  if (sitting.expires < Date.now()) return "expired";
  if (sitting.status === "ready") return "ready";

  sitting.status = "ready";
  sitting.key = `bc_live_${randomBytes(24).toString("base64url")}`;
  return "ready";
}

/** Or said no. Distinct from letting it expire: one is an answer. */
export function deny(typed: string): Status {
  const sitting = byCode.get(typed.trim().toUpperCase());
  if (!sitting || sitting.expires < Date.now()) return "expired";
  sitting.status = "denied";
  return "denied";
}

/** Whether a code is one we are waiting on, so /link can say "no such code"
 *  before somebody presses a button rather than after. */
export function pending(typed: string): boolean {
  const sitting = byCode.get(typed.trim().toUpperCase());
  return Boolean(sitting && sitting.expires >= Date.now() && sitting.status === "pending");
}
