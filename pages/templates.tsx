import Link from "next/link";

import Seo from "@/components/Seo";
import { useState } from "react";
import { Inter, Instrument_Serif } from "next/font/google";
import BrandMark from "@/components/BrandMark";
import EmoteWall from "@/components/EmoteWall";
import TemplateCard from "@/components/TemplateCard";
import Footer from "@/components/sections/Footer";
import { Panel } from "@/components/Section";
import { Cross, Search } from "@/components/icons";
import { TAGS, TEMPLATES } from "@/data/templates";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const DESCRIPTION =
  "Bots somebody has already worked out - a name, a brief and the work it does on a schedule. One click puts one in your roster.";

export default function Templates() {
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  /* Everything a card shows is searchable, tags included: somebody looking for
     "invoice" should find the bot whether that word is in its name, its brief,
     the line under it, or the label on it. */
  const q = query.trim().toLowerCase();
  const shown = TEMPLATES.filter((one) => {
    if (tag && !one.tags.includes(tag)) return false;
    if (!q) return true;
    return [one.name, one.role, one.blurb, ...one.tags, one.by ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return (
    <div className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
      <Seo
        title="Templates"
        description={DESCRIPTION}
        path="/templates"
      />

      <div className="min-h-svh bg-floor px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4 md:px-6 md:pb-6 md:pt-6">
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
          <Panel tone="panel" className="px-5 py-10 sm:px-10 sm:py-14 lg:px-16">
            <header className="mx-auto flex max-w-6xl items-center gap-4">
              <Link
                href="/"
                aria-label="botato"
                className="flex shrink-0 items-center"
              >
                <BrandMark className="h-9 w-9" color="#f2f2f2" />
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-fg-2 transition-colors hover:text-fg"
              >
                botato
              </Link>
              <Link
                href="/#platforms"
                className="ml-auto rounded-pill bg-fill-2 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-fill-3"
              >
                Get botato
              </Link>
            </header>

            <div className="mx-auto mt-12 grid max-w-6xl gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-center lg:gap-14">
              <div className="max-w-2xl">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-3">
                  Templates
                </p>
                <h1 className="text-3xl font-medium leading-[1.02] tracking-[-0.04em] text-fg sm:text-5xl">
                  Bots somebody has
                  <br className="hidden sm:block" /> already worked out.
                </h1>
                <p className="mt-5 text-base leading-[1.6] text-fg-2 sm:text-lg">
                  The part of a bot worth copying: what it is for, what it may
                  reach and the work it does on a schedule. Nothing personal comes
                  with it and one click puts one in your roster.
                </p>
              </div>

              {/* The same eight, doing what they do all day. */}
              <EmoteWall className="hidden lg:block" />
            </div>

            {/* A field and a row of labels, and that is the whole navigation
                this page needs. Eight templates do not want a sidebar. */}
            <div className="mx-auto mt-10 max-w-6xl">
              <label className="flex h-11 items-center gap-2.5 rounded-control bg-fill-1 px-3.5 ring-1 ring-inset ring-line transition-colors focus-within:ring-blue">
                <Search className="h-[18px] w-[18px] shrink-0 text-fg-3" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bots, briefs and labels"
                  aria-label="Search templates"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-fg-3"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-fg-3 transition-colors hover:bg-fill-2 hover:text-fg"
                  >
                    <Cross className="h-3.5 w-3.5" />
                  </button>
                )}
              </label>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Filter on={tag === null} onClick={() => setTag(null)}>
                  All
                </Filter>
                {TAGS.map((name) => (
                  <Filter
                    key={name}
                    on={tag === name}
                    onClick={() => setTag(name)}
                  >
                    {name}
                  </Filter>
                ))}
                {(q || tag) && (
                  <span className="ml-auto text-[13px] text-fg-3">
                    {shown.length} of {TEMPLATES.length}
                  </span>
                )}
              </div>
            </div>

            {shown.length > 0 ? (
              <div className="mx-auto mt-6 grid max-w-6xl gap-3 sm:mt-8 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
                {shown.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="mx-auto mt-8 max-w-6xl rounded-surface border border-line bg-fill-1 px-6 py-10 text-center">
                <p className="text-[15px] text-fg">
                  Nothing here matches &ldquo;{query}&rdquo;.
                </p>
                <p className="mt-1.5 text-[13.5px] text-fg-2">
                  There are eight so far - the shelf is young. Worked this one
                  out yourself? Add it below.
                </p>
              </div>
            )}

            {/* Where the next one comes from. A gallery with no way in is a
                catalogue, and this is meant to be a shelf people add to. */}
            <p className="mx-auto mt-10 max-w-2xl text-[13px] leading-[1.6] text-fg-3">
              Worked out a good one? Templates are a file rather than a
              database, so a new one arrives the same way any other contribution
              does: add it to{" "}
              <a
                className="text-link transition-opacity hover:opacity-70"
                href="https://github.com/hackyguru/botato-website/blob/main/data/templates.ts"
                target="_blank"
                rel="noopener noreferrer"
              >
                data/templates.ts
              </a>{" "}
              and open a pull request. Every bot here also has a{" "}
              <strong className="font-medium text-fg-2">Copy JSON</strong>{" "}
              button - the same thing a link carries, if you would rather read
              it before you run it.
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
