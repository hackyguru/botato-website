/*
 * What a bot looks like, derived the way the app derives it.
 *
 * In the app a face comes from the bot's id, which is a random string made a
 * millisecond before it. Here there are no ids - a template is a name and a
 * job - so the name is the seed, and the same name draws the same creature in
 * both places. That matters more here than anywhere: the point of a gallery
 * is that what you are looking at is what you will get.
 */

import { BODIES } from "./blob";

const HEADS = BODIES;
const EYES = ["dot", "wide", "sleepy", "ring", "tall", "wink"];
const BROWS = ["none", "flat", "angled", "raised", "thick", "quirk"];

/** What a name asks to look like.
 *
 *  A bot called "Artist" should look like one. The head is all this system
 *  draws - no hands, so no brush to hold - so what an artist can wear is the
 *  beret. Kept identical to the app's table: a template that wears a headset
 *  on this page and nothing in the roster is a template that lied. */
const LOOKS: { mark: string; words: string[] }[] = [
  { mark: "beret", words: ["artist", "art", "design", "paint", "draw", "illustrat", "creative", "brand", "studio"] },
  { mark: "headset", words: ["support", "helpdesk", "concierge", "sales", "success", "reception", "triage", "oncall", "on-call"] },
  { mark: "bolt", words: ["engineer", "builder", "build", "dev", "ops", "sre", "infra", "mechanic", "electric", "power", "fix"] },
  { mark: "band", words: ["analyst", "research", "scientist", "data", "quant", "editor", "writer", "archivist", "librarian"] },
  { mark: "halo", words: ["guide", "angel", "mentor", "guardian", "shepherd", "oracle", "sage", "ethic"] },
  { mark: "cap", words: ["coach", "trainer", "gym", "fitness", "runner", "courier", "delivery", "intern", "rookie", "scout"] },
  { mark: "cowboy", words: ["ranger", "wrangler", "cowboy", "sheriff", "outlaw", "maverick", "herder"] },
  { mark: "antenna", words: ["monitor", "watch", "radar", "signal", "news", "scanner", "sentry", "listen"] },
  { mark: "tuft", words: ["garden", "grower", "farm", "chef", "cook", "baker", "barista", "kitchen"] },
  { mark: "bow", words: ["host", "butler", "waiter", "greeter", "assistant", "secretary", "planner", "concert"] },
];

export interface Face {
  head: string;
  eyes: string;
  brow: string;
  mark: string;
}

/** FNV-1a, the same one the app uses: stable across machines and releases, so
 *  a template drawn here and the bot made from it are the same creature. */
export function seedOf(text: string): number {
  let hash = 2166136261;
  for (let at = 0; at < text.length; at++) {
    hash ^= text.charCodeAt(at);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

/** The face a name implies. */
export function faceFromName(name: string): Face {
  const said = name.trim().toLowerCase();
  if (!said) return { head: "pebble", eyes: "dot", brow: "none", mark: "none" };
  const seed = seedOf(said);
  return {
    head: HEADS[seed % HEADS.length],
    eyes: EYES[(seed >> 3) % EYES.length],
    brow: BROWS[(seed >> 6) % BROWS.length],
    // Nothing worn unless the name asked for it: a blob's whole case is that
    // the outline carries it, so anything in front of the outline has to have
    // earned its place.
    mark: LOOKS.find((look) => look.words.some((word) => said.includes(word)))?.mark ?? "none",
  };
}
