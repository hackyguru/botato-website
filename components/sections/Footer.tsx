import Link from "next/link";

import { Github } from "@/components/icons";

const REPO = "https://github.com/hackyguru/botato";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "What a bot gets", href: "#features" },
      { label: "Templates", href: "/templates" },
      { label: "Platforms", href: "#platforms" },
    ],
  },
  {
    title: "Runs on",
    links: [
      { label: "Claude Code", href: "https://claude.com/claude-code" },
      { label: "Gemini CLI", href: "https://github.com/google-gemini/gemini-cli" },
      { label: "Ollama", href: "https://ollama.com" },
    ],
  },
  {
    title: "Source",
    links: [
      { label: "Repository", href: REPO },
      { label: "Releases", href: `${REPO}/releases` },
      { label: "The phone app", href: `${REPO}/blob/main/mobile/README.md` },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden rounded-2xl border border-line bg-panel px-5 pb-8 pt-14 text-fg sm:rounded-3xl sm:px-10 sm:pb-10 sm:pt-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-8">
          <div>
            <p className="text-lg font-semibold tracking-tight">botato</p>
            <p className="mt-3 max-w-xs text-[13.5px] leading-[1.6] text-fg-3">
              Bots that live on your own machine. No account, no server of ours, no
              telemetry.
            </p>
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-fill-2 px-3.5 py-2 text-[13px] font-medium text-fg transition-colors hover:bg-fill-3 hover:text-fg"
            >
              <Github className="h-4 w-4" />
              hackyguru/botato
            </a>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-3">
                {column.title}
              </p>
              <ul className="mt-3 space-y-0.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="-mx-1 inline-block rounded px-1 py-1.5 text-[13.5px] text-fg-2 transition-colors hover:text-fg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* The wordmark, big enough to be the thing you remember. */}
        <p
          aria-hidden="true"
          className="mt-14 select-none text-[clamp(3.5rem,17vw,13rem)] font-medium leading-[0.8] tracking-[-0.055em] text-white/[0.07] sm:mt-20"
        >
          botato
        </p>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-[12.5px] text-fg-3 sm:flex-row sm:items-center sm:justify-between">
          <p>Alpha, version 0.4.0.</p>
          <p>Nothing runs on anyone else&rsquo;s computer.</p>
          <Link
            href="/terms"
            className="transition-colors hover:text-fg-2"
          >
            Terms of use
          </Link>
        </div>
      </div>
    </footer>
  );
}
