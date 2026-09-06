/* Where somebody finishes signing the app in.
 *
 * Deliberately plain, and deliberately says what it is about to do. This is
 * the one page on the site that hands out a credential, so it should read
 * less like a landing page and more like a receipt: the code you are
 * approving, what approving it means, and two buttons of which one is "no".
 */

import Head from "next/head";
import { useState } from "react";
import { Inter } from "next/font/google";
import BrandMark from "@/components/BrandMark";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

type Outcome = "asking" | "working" | "ready" | "denied" | "expired";

export default function Link() {
  const [code, setCode] = useState("");
  const [outcome, setOutcome] = useState<Outcome>("asking");

  async function answer(deny: boolean) {
    setOutcome("working");
    try {
      const reply = await fetch("/api/device/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, deny }),
      });
      const { status } = await reply.json();
      setOutcome(status === "ready" ? "ready" : status === "denied" ? "denied" : "expired");
    } catch {
      setOutcome("expired");
    }
  }

  // Typed in whatever case, with or without the dash, because a code being
  // read off another screen is not the moment to be strict about punctuation.
  const tidy = (typed: string) => {
    const bare = typed.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
    return bare.length > 4 ? `${bare.slice(0, 4)}-${bare.slice(4)}` : bare;
  };

  return (
    <div className={`${inter.variable} font-sans`}>
      <Head>
        <title>Connect botcage</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <main className="flex min-h-svh items-center justify-center bg-floor p-4">
        <div className="w-full max-w-md rounded-surface border border-line bg-panel p-7 sm:p-9">
          <BrandMark className="h-10 w-10" />

          {outcome === "ready" ? (
            <>
              <h1 className="mt-7 text-2xl font-medium tracking-[-0.03em] text-fg">
                Connected.
              </h1>
              <p className="mt-3 text-[14px] leading-[1.6] text-fg-2">
                botcage has the key. You can close this tab — the app will have
                noticed within a few seconds.
              </p>
            </>
          ) : outcome === "denied" ? (
            <>
              <h1 className="mt-7 text-2xl font-medium tracking-[-0.03em] text-fg">
                Turned down.
              </h1>
              <p className="mt-3 text-[14px] leading-[1.6] text-fg-2">
                No key was issued. If that request was not yours, nothing has
                happened and there is nothing to undo.
              </p>
            </>
          ) : outcome === "expired" ? (
            <>
              <h1 className="mt-7 text-2xl font-medium tracking-[-0.03em] text-fg">
                That code has gone.
              </h1>
              <p className="mt-3 text-[14px] leading-[1.6] text-fg-2">
                Codes last a quarter of an hour. Ask botcage for a new one and
                try again — it is the same two clicks.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCode("");
                  setOutcome("asking");
                }}
                className="mt-6 rounded-control border border-line bg-fill-2 px-4 py-2 text-[13px] font-medium text-fg-2 transition-colors hover:text-fg"
              >
                Enter another code
              </button>
            </>
          ) : (
            <>
              <h1 className="mt-7 text-2xl font-medium tracking-[-0.03em] text-fg">
                Connect botcage
              </h1>
              <p className="mt-3 text-[14px] leading-[1.6] text-fg-2">
                Type the code the app is showing. Approving it lets that copy of
                botcage spend credits from this account until you revoke it.
              </p>

              <input
                value={code}
                onChange={(e) => setCode(tidy(e.target.value))}
                placeholder="XXXX-XXXX"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                aria-label="The code botcage is showing"
                className="mt-6 w-full rounded-control border border-line bg-field px-4 py-3 text-center font-mono text-xl tracking-[0.2em] text-fg outline-none placeholder:text-fg-3 focus:border-branch"
              />

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={code.length !== 9 || outcome === "working"}
                  onClick={() => answer(false)}
                  className="flex-1 rounded-control bg-blue py-2.5 text-[14px] font-medium text-white transition-[filter] hover:brightness-[1.08] disabled:opacity-40"
                >
                  {outcome === "working" ? "Connecting…" : "Connect"}
                </button>
                <button
                  type="button"
                  disabled={code.length !== 9 || outcome === "working"}
                  onClick={() => answer(true)}
                  className="rounded-control border border-line bg-fill-2 px-4 text-[14px] font-medium text-fg-2 transition-colors hover:text-fg disabled:opacity-40"
                >
                  Not me
                </button>
              </div>

              {/* The sentence that makes "Not me" mean something. A person who
                  did not start this needs to know that pressing it is the
                  right move, not a dead end. */}
              <p className="mt-5 text-[12.5px] leading-[1.6] text-fg-3">
                Did not ask for this? Press <strong className="font-medium text-fg-2">Not me</strong>.
                Somebody with your code but not your account cannot finish
                without you, and a code nobody approves expires on its own.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
