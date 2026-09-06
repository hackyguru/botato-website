/* Whether a typed code is one we are waiting on — so the page can say "no such
   code" while somebody is still looking at it, rather than after they commit. */
import type { NextApiRequest, NextApiResponse } from "next";
import { pending } from "@/lib/device";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = typeof req.query.code === "string" ? req.query.code : "";
  res.status(200).json({ pending: code ? pending(code) : false });
}
