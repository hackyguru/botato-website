/* "Have they finished yet?" — asked every few seconds by an app with nothing
   else to do until somebody answers. */
import type { NextApiRequest, NextApiResponse } from "next";
import { ask } from "@/lib/device";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const token = typeof req.body?.token === "string" ? req.body.token : "";
  if (!token) return res.status(400).json({ error: "no token" });
  // Always 200, even for expired: this is a question with several ordinary
  // answers, and only one of them is an error on anybody's part.
  res.status(200).json(ask(token));
}
