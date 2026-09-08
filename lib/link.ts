/*
 * The link that puts a template in somebody's roster.
 *
 * The whole template travels in the URL rather than an id the app fetches
 * back. That costs a couple of kilobytes and buys three things: the app never
 * has to talk to this website, a link keeps working if the page it came from
 * is gone, and anybody can share a bot they made without it having to be on
 * our site first. A template is a paragraph and a colour - it is small enough
 * to be its own link.
 *
 * What travels is only what a bot is configured with. No id, no session, no
 * transcript, no spend, and nothing about the machine it came from.
 */

import type { Template } from "@/data/templates";

/** The scheme the desktop app registers. */
export const SCHEME = "botcage";

/** What the app is handed. Versioned because this crosses between two things
 *  that are updated separately: a link made today will be opened by an app
 *  from some other month, and it should be able to say so rather than guess. */
export interface Import {
  v: 1;
  name: string;
  role: string;
  color: string;
  computer: boolean;
  network: "full" | "no-lan" | "offline";
  routines?: Template["routines"];
  /** Where it came from, so the app can say so before anything is created. */
  from?: string;
}

export function importOf(template: Template): Import {
  return {
    v: 1,
    name: template.name,
    role: template.role,
    color: template.color,
    computer: template.computer,
    network: template.network,
    ...(template.routines ? { routines: template.routines } : {}),
    from: template.id,
  };
}

/** base64url: the ordinary alphabet gives "+" and "/", and "+" in a query
 *  string is a space by the time anything reads it back. */
function pack(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** The one-click link. */
export function linkFor(template: Template): string {
  return `${SCHEME}://bot?t=${pack(JSON.stringify(importOf(template)))}`;
}

/** The same thing as text, for somebody who would rather look before they
 *  click, or who is reading this on a machine the app is not on. */
export function jsonFor(template: Template): string {
  return JSON.stringify(importOf(template), null, 2);
}
