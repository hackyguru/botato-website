/* The app asking to be let in. Answers with the half a person reads and the
   half only the app holds. */
import type { NextApiRequest, NextApiResponse } from "next";
import { begin, INTERVAL } from "@/lib/device";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const { code, token, expiresIn } = begin();
  const site = `${req.headers["x-forwarded-proto"] ?? "http"}://${req.headers.host}`;
  res.status(200).json({
    code,
    // Built from the request rather than a constant: this has to be right on
    // localhost, on a preview deploy and in production, and a hardcoded host
    // is only ever right in one of the three.
    verify_url: `${site}/link`,
    token,
    expires_in: expiresIn,
    interval: INTERVAL,
  });
}
