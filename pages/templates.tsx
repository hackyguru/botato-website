import Head from "next/head";
import { useState } from "react";
import { Inter, Instrument_Serif } from "next/font/google";
import BrandMark from "@/components/BrandMark";
import TemplateCard from "@/components/TemplateCard";
import Footer from "@/components/sections/Footer";
import { Panel } from "@/components/Section";
import { TAGS, TEMPLATES } from "@/data/templates";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const DESCRIPTION =
  "Bots somebody has already worked out — a name, a brief, and the work it does on a schedule. One click puts one in your roster.";

export default function Templates() {
  const [tag, setTag] = useState<string | null>(null);
  const shown = tag ? TEMPLATES.filter((t) => t.tags.includes(tag)) : TEMPLATES;

  return (
    <div className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
      <Head>
        <title>Templates - botcage</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="botcage templates" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="theme-color" content="#000000" />
      </Head>

      <div className="min-h-svh bg-floor px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4 md:px-6 md:pb-6 md:pt-6">
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
          <Panel tone="panel" className="px-5 py-10 sm:px-10 sm:py-14 lg:px-16">
            <header className="mx-auto flex max-w-6xl items-center gap-4">
              <a href="/" aria-label="botcage" className="flex shrink-0 items-center">
                <BrandMark className="h-9 w-9" />
              </a>
              <a
                href="/"
                className="text-sm font-medium text-fg-2 transition-colors hover:text-fg"
              >
                botcage
              </a>
              <a
                href="/#platforms"
                className="ml-auto rounded-pill bg-fill-2 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-fill-3"
              >
                Get botcage
              </a>
            </header>

            <div className="mx-auto mt-12 max-w-2xl sm:mt-16">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-3">
                Templates
              </p>
              <h1 className="text-3xl font-medium leading-[1.02] tracking-[-0.04em] text-fg sm:text-5xl">
                Bots somebody has
                <br className="hidden sm:block" /> already worked out.
              </h1>
              <p className="mt-5 text-base leading-[1.6] text-fg-2 sm:text-lg">
                A template is the part of a bot worth copying: what it is for, what it may
                reach, and the work it does without being asked. Nothing personal travels
                with it — no transcript, no keys, no history. One click opens botcage with
                the bot filled in, and you decide whether to keep it.
              </p>
            </div>

            {/* One row, and it is the whole navigation this page needs. Eight
                templates do not want a sidebar. */}
            <div className="mx-auto mt-10 flex max-w-6xl flex-wrap gap-2">
              <Filter on={tag === null} onClick={() => setTag(null)}>
                All
              </Filter>
              {TAGS.map((name) => (
                <Filter key={name} on={tag === name} onClick={() => setTag(name)}>
                  {name}
                </Filter>
              ))}
            </div>

            <div className="mx-auto mt-6 grid max-w-6xl gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
              {shown.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>

            {/* Where the next one comes from. A gallery with no way in is a
                catalogue, and this is meant to be a shelf people add to. */}
            <p className="mx-auto mt-10 max-w-2xl text-[13px] leading-[1.6] text-fg-3">
              Worked out a good one? Templates are a file rather than a database, so a new
              one arrives the same way any other contribution does: add it to{" "}
              <a
                className="text-link transition-opacity hover:opacity-70"
                href="https://github.com/hackyguru/botcage-website/blob/main/data/templates.ts"
                target="_blank"
                rel="noopener noreferrer"
              >
                data/templates.ts
              </a>{" "}
              and open a pull request. Every bot here also has a{" "}
              <strong className="font-medium text-fg-2">Copy JSON</strong> button — the same
              thing a link carries, if you would rather read it before you run it.
            </p>
          </Panel>

          <Footer />
        </div>
      </div>
    </div>
  );
}

function Filter({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`rounded-pill px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
        on ? "bg-fill-3 text-fg" : "bg-fill-1 text-fg-3 hover:text-fg-2"
      }`}
    >
      {children}
    </button>
  );
}
