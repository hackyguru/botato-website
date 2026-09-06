/* What the gateway is offering today.
 *
 * OpenAI-shaped, because that is the only thing the desktop app knows how to
 * read — and the reason there is so little code on the app's side of this.
 *
 * A handful rather than a catalogue, named for what they are for rather than
 * for who makes them. A name is a promise about the job a model does, and a
 * promise you can keep by pointing it somewhere else is worth more than a
 * model string somebody has pinned into a bot they made in March. What each
 * one resolves to is the gateway's business and can change without anybody's
 * bot needing an edit.
 *
 * Prices are dollars per million tokens, the same unit every other provider in
 * the picker is quoted in — being comparable at a glance is most of the pitch.
 * Credits are how an account is topped up, which is a separate question from
 * what a model costs to run.
 */
import type { NextApiRequest, NextApiResponse } from "next";

export const CURATED = [
  {
    id: "botcage-fast",
    name: "Fast",
    blurb: "For work that is mostly deciding what to do next.",
    context: 200000,
    price_in: 1,
    price_out: 5,
    tools: true,
    reasoning: false,
  },
  {
    id: "botcage-good",
    name: "Good",
    blurb: "The one to reach for. Handles a long thread and a hard question.",
    context: 1000000,
    price_in: 3,
    price_out: 15,
    tools: true,
    reasoning: true,
  },
  {
    id: "botcage-deep",
    name: "Deep",
    blurb: "Slow and expensive, for the problem the others got wrong.",
    context: 1000000,
    price_in: 5,
    price_out: 25,
    tools: true,
    reasoning: true,
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // A key is required even to read the menu, so that a bot configured against
  // this provider fails at sign-in rather than three screens later.
  const said = req.headers.authorization ?? "";
  if (!said.startsWith("Bearer bc_")) {
    return res.status(401).json({ error: { message: "no botcage key" } });
  }
  res.status(200).json({ object: "list", data: CURATED });
}
