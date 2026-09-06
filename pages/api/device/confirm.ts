/* A person, in a browser, saying yes or no to a code. */
import type { NextApiRequest, NextApiResponse } from "next";
import { confirm, deny } from "@/lib/device";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const code = typeof req.body?.code === "string" ? req.body.code : "";
  if (!code) return res.status(400).json({ error: "no code" });
  const status = req.body?.deny ? deny(code) : confirm(code);
  res.status(200).json({ status });
}
