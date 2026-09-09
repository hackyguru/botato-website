import Link from "next/link";
import { useEffect, useRef } from "react";
import BrandMark from "@/components/BrandMark";
import { WorksWith } from "@/components/engines";
import HeroWindow from "@/components/HeroWindow";

// Each blob drifts along the sum of two sine waves per axis, so paths feel
// organic and never visibly repeat. Frequencies are in radians/second.
//
// The four colours are the app's own bot swatches from design/tokens.json -
// #ff5a00, #0a84ff, #bf5af2, #ffb020 - so the light behind the headline is made
// of the colours bots actually come in, and the faces further down the page are
// lit by the same four. The ground they are painted on is the panel rung, which
// is what every section card below the hero is drawn on.
const FLUID_BLOBS = [
  {
    color: "255, 90, 0",
    radius: 0.55,
    cx: 0.25,
    cy: 0.3,
    ax: 0.22,
    ay: 0.18,
    fx1: 0.11,
    fx2: 0.047,
    fy1: 0.09,
    fy2: 0.061,
    phase: 0.0,
  },
  {
    color: "10, 132, 255",
    radius: 0.6,
    cx: 0.75,
    cy: 0.4,
    ax: 0.2,
    ay: 0.22,
    fx1: 0.08,
    fx2: 0.053,
    fy1: 0.12,
    fy2: 0.041,
    phase: 2.1,
  },
  {
    color: "191, 90, 242",
    radius: 0.5,
    cx: 0.5,
    cy: 0.75,
    ax: 0.24,
    ay: 0.16,
    fx1: 0.1,
    fx2: 0.039,
    fy1: 0.07,
    fy2: 0.057,
    phase: 4.2,
  },
  {
    color: "255, 176, 32",
    radius: 0.42,
    cx: 0.15,
    cy: 0.8,
    ax: 0.18,
    ay: 0.2,
    fx1: 0.06,
    fx2: 0.051,
    fy1: 0.11,
    fy2: 0.043,
    phase: 1.3,
  },
] as const;

function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Low internal resolution: the CSS blur upscales it into soft fluid color.
    const W = (canvas.width = 480);
    const H = (canvas.height = 300);

    const draw = (t: number) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#17171a";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (const b of FLUID_BLOBS) {
        const x =
          W *
          (b.cx +
            b.ax * Math.sin(t * b.fx1 + b.phase) +
            b.ax * 0.6 * Math.sin(t * b.fx2 + b.phase * 2));
        const y =
          H *
          (b.cy +
            b.ay * Math.cos(t * b.fy1 + b.phase) +
            b.ay * 0.6 * Math.sin(t * b.fy2 + b.phase * 3));
        const r = H * b.radius * (1 + 0.12 * Math.sin(t * 0.13 + b.phase));
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, `rgba(${b.color}, 0.85)`);
        grad.addColorStop(0.55, `rgba(${b.color}, 0.35)`);
        grad.addColorStop(1, `rgba(${b.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(0);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute -inset-[8%] h-[116%] w-[116%] blur-[70px] saturate-[1.25]"
      aria-hidden="true"
    />
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const LAUNCH_POST = "/launch";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "/templates" },
  { label: "Platforms", href: "#platforms" },
];

export default function Hero() {
  return (
    <div className="min-h-svh bg-floor p-3 sm:p-4 md:p-6">
      <div className="hero-frame relative">
        <section className="hero-frame__card hero-enter relative min-h-[calc(100svh-24px)] overflow-hidden rounded-2xl bg-panel sm:min-h-[calc(100svh-32px)] sm:rounded-3xl md:min-h-[calc(100svh-48px)] lg:h-[calc(100svh-48px)]">
          {/* Background - swap for a <video> if you have one, e.g.
            <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline>
              <source src="/hero-bg.mp4" type="video/mp4" />
            </video> */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <FluidBackground />
          </div>
          {/* Darkening gradient overlay, heaviest at the bottom where the copy sits */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/5 to-black/55" />

          <div className="relative z-10 flex min-h-[calc(100svh-24px)] flex-col gap-6 p-4 sm:min-h-[calc(100svh-32px)] sm:p-6 md:min-h-[calc(100svh-48px)] md:p-8 lg:h-full">
            {/* Floating glass navbar */}
            <header
              className="hero-rise flex h-[var(--nav-h)] w-full items-center gap-3 rounded-2xl bg-white/70 py-2 pl-4 pr-2 shadow-sm backdrop-blur-md sm:w-auto sm:gap-6 sm:self-start lg:h-auto"
              style={{ "--hero-delay": "160ms" } as React.CSSProperties}
            >
              <a href="#top" aria-label="botato" className="flex shrink-0 items-center">
                <BrandMark className="h-10 w-10" color="#131315" eye="rgba(255,255,255,0.92)" />
              </a>
              <nav
                className="hidden items-center gap-5 sm:flex"
                aria-label="Primary navigation"
              >
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="whitespace-nowrap text-sm font-medium text-gray-800 transition-opacity hover:opacity-60"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="ml-auto flex items-center gap-3">
                <a
                  href="#platforms"
                  className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 sm:px-5"
                >
                  Get botato
                </a>
              </div>
            </header>

            {/* Below lg the window sits in a slot cut out of the card just
                here. This holds its room open in the flow, so a short screen
                grows the card rather than sliding the copy under it. */}
            <div className="h-[var(--win-h)] shrink-0 lg:hidden" aria-hidden="true" />

            {/* Spacer pushes content to the bottom */}
            <div className="min-h-[2rem] flex-1" />

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              {/* Left: badge + headline */}
              <div className="shrink-0 text-white lg:max-w-lg xl:max-w-2xl">
                <Link
                  href={LAUNCH_POST}
                  className="hero-rise group mb-4 inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/20 bg-black/25 py-1.5 pl-2 pr-1.5 text-[12px] backdrop-blur-md transition-colors hover:border-white/30 hover:bg-black/35 sm:gap-3 sm:text-[13px]"
                  style={{ "--hero-delay": "300ms" } as React.CSSProperties}
                >
                  {/* Amber rather than the blue accent, on the design system's
                      own terms: amber is "a warning that is not a failure",
                      which is what a pre-release label is. */}
                  <span className="shrink-0 rounded-full border border-amber px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.08em] text-amber">
                    Alpha
                  </span>
                  <span className="shrink-0 font-semibold text-white">botato is here</span>
                  {/* The invitation is the part a phone has no room for. */}
                  <span className="hidden text-white/25 sm:inline" aria-hidden="true">
                    ·
                  </span>
                  <span className="hidden text-white/55 sm:inline">Read the launch post</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors group-hover:bg-white/20">
                    <ArrowUpRightIcon className="h-[13px] w-[13px]" />
                  </span>
                </Link>
                <h1 className="text-4xl font-medium leading-[0.98] tracking-[-0.045em] drop-shadow-lg sm:text-6xl lg:text-[3.5rem] xl:text-7xl">
                  <span className="slot-line">
                    <span
                      className="slot-inner"
                      style={{ "--slot-delay": "380ms" } as React.CSSProperties}
                    >
                      Stop prompting.
                    </span>
                  </span>
                  <span className="slot-line">
                    <span
                      className="slot-inner"
                      style={{ "--slot-delay": "480ms" } as React.CSSProperties}
                    >
                      Start{" "}
                      <span className="font-serif font-normal italic">delegating</span>.
                    </span>
                  </span>
                </h1>
              </div>

              {/* Right: supporting copy + CTAs */}
              <div
                className="hero-rise w-full shrink-0 text-white lg:w-[min(560px,45%)] lg:pb-1"
                style={{ "--hero-delay": "560ms" } as React.CSSProperties}
              >
                <WorksWith className="mb-4" />
                <p className="max-w-[560px] text-lg font-semibold leading-[1.4] drop-shadow-md">
                  <span className="lg:block">
                    Your bots run on your laptop, each with a computer of its own.
                  </span>{" "}
                  <span className="lg:block">
                    Shut the lid and they carry on. Your phone still reaches them.
                  </span>
                </p>
                <div className="mt-6 flex flex-col items-stretch gap-2 sm:mt-5 sm:flex-row sm:items-center sm:gap-6">
                  <a
                    href="#platforms"
                    className="group inline-flex w-full items-center justify-between gap-5 rounded-full bg-white py-2.5 pl-6 pr-2.5 text-base font-semibold text-neutral-900 shadow-lg transition-shadow hover:shadow-xl sm:w-auto"
                  >
                    Download for macOS
                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 text-white transition-colors group-hover:bg-neutral-700">
                      <ArrowIcon className="h-[18px] w-[18px] transition-transform duration-[420ms] ease-[cubic-bezier(.65,0,.35,1)] group-hover:translate-x-[165%]" />
                      <ArrowIcon className="absolute h-[18px] w-[18px] -translate-x-[165%] transition-transform duration-[420ms] ease-[cubic-bezier(.65,0,.35,1)] group-hover:translate-x-0" />
                    </span>
                  </a>
                  <a
                    href="https://github.com/hackyguru/botato"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full py-3 text-base font-semibold text-white/85 drop-shadow-md transition-colors hover:text-white sm:justify-start sm:py-0"
                  >
                    <GithubIcon className="h-5 w-5" />
                    GitHub
                    <ArrowIcon className="h-[17px] w-[17px]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The window, in the notch the card leaves for it. */}
        <div
          className="hero-frame__window hero-rise overflow-hidden"
          style={{ "--hero-delay": "700ms" } as React.CSSProperties}
        >
          <div className="hero-window-scale">
            <HeroWindow className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
