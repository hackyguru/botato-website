import BotFace from "@/components/BotFace";
import Reveal from "@/components/Reveal";
import { Heading, Panel, PrimaryButton, SectionIntro } from "@/components/Section";
import HeroWindow from "@/components/HeroWindow";
import { PhonePreview } from "@/components/mocks";
import Link from "next/link";
import { Apple, Arrow, Linux, People, Phone } from "@/components/icons";

// The list rather than `releases/latest`: botato is alpha and every release is
// published as a pre-release, which is exactly what `latest` excludes — so that
// URL is a 404 rather than a download.
const RELEASES = "https://github.com/hackyguru/botato/releases";
const REPO = "https://github.com/hackyguru/botato";

/** A pill for one platform's build. Two of them sit under the desktop card,
 *  because it is one app and two ways of getting it, not two products. */
function GetButton({
  href,
  Icon,
  children,
}: {
  href: string;
  Icon: (props: { className?: string }) => React.ReactElement;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border border-line bg-fill-2 px-4 py-2 text-[13.5px] font-medium text-fg transition-colors hover:bg-fill-3"
    >
      <Icon className="h-4 w-4 text-fg-2" />
      {children}
      <Arrow className="h-3.5 w-3.5 text-fg-3 transition-transform duration-300 group-hover:translate-x-0.5" />
    </a>
  );
}

/** Preview on top, cropped by the card, then what it is and how to get it. */
function PlatformCard({
  title,
  note,
  preview,
  actions,
  delay,
}: {
  title: string;
  note: string;
  preview: React.ReactNode;
  actions: React.ReactNode;
  delay: number;
}) {
  return (
    <Reveal
      delay={delay}
      className="flex flex-col overflow-hidden rounded-surface border border-line bg-fill-1"
    >
      <div className="h-[260px] overflow-hidden px-6 pt-7 sm:px-8">{preview}</div>
      <div className="border-t border-line p-6 sm:p-7">
        <h3 className="text-xl font-medium tracking-[-0.02em] text-fg">{title}</h3>
        <p className="mt-2 text-[13.5px] leading-[1.55] text-fg-2">{note}</p>
        <div className="mt-5 flex flex-wrap gap-2.5">{actions}</div>
      </div>
    </Reveal>
  );
}

export function Download() {
  return (
    <Panel id="platforms" tone="panel" className="px-5 py-14 sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          align="center"
          eyebrow="Platforms"
          title={
            <>
              One team, wherever
              <br className="hidden sm:block" /> you are.
            </>
          }
          lede="The laptop does the work. The phone is how you reach it when you are not sitting at it and neither needs an account."
        />

        <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-2">
          <PlatformCard
            delay={0}
            title="Desktop"
            note="Where the bots live. Leave it plugged in and shut the lid; they carry on without you."
            preview={
              <div
                className="h-[330px]"
                style={{ "--win-scale": 0.42 } as React.CSSProperties}
              >
                <div className="hero-window-scale">
                  <HeroWindow still className="h-full w-full" />
                </div>
              </div>
            }
            actions={
              <>
                <GetButton href={RELEASES} Icon={Apple}>
                  macOS
                </GetButton>
                <GetButton href={RELEASES} Icon={Linux}>
                  Linux
                </GetButton>
              </>
            }
          />

          <PlatformCard
            delay={90}
            title="iOS &amp; Android"
            note="Your laptop in your pocket. Scan a code once to pair them, then reach your bots from anywhere."
            preview={<PhonePreview />}
            actions={
              <GetButton href={`${REPO}/blob/main/mobile/README.md`} Icon={Phone}>
                Read the guide
              </GetButton>
            }
          />
        </div>

        <Reveal delay={160}>
          <p className="mt-8 text-center text-[13px] leading-[1.6] text-fg-3 sm:mt-10">
            Alpha, and every release is a pre-release: provided as is, with no
            warranty, and expect it to break. Bots answer through Claude Code by
            default and can be pointed at another model whenever you like. Everything
            else botato sets up for you the first time you need it.
          </p>
        </Reveal>
      </div>
    </Panel>
  );
}

const GREETERS = [
  { name: "Meridian", color: "#0a84ff", mark: "antenna" },
  { name: "Pike", color: "#ff5a00", mark: "cap" },
  { name: "Wren", color: "#30d158", mark: "tuft" },
  { name: "Halloway", color: "#bf5af2", mark: "halo" },
  { name: "Sable", color: "#ffb020", mark: "cowboy" },
];

export function CTA() {
  return (
    <Panel tone="floor" className="px-5 py-16 text-center sm:px-10 sm:py-24">
      <Reveal className="mx-auto max-w-2xl">
        <div className="flex justify-center gap-3 sm:gap-5">
          {GREETERS.map((bot) => (
            <BotFace
              key={bot.name}
              name={bot.name}
              color={bot.color}
              mark={bot.mark}
              size={44}
            />
          ))}
        </div>
        <Heading className="mt-9 text-4xl sm:text-6xl">
          Meet your <span className="font-serif font-normal italic">first</span> bot.
        </Heading>
        <p className="mt-5 text-base leading-[1.6] text-fg-2 sm:text-lg">
          Give it a name and a job. Everything after that happens on your machine.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-6">
          <PrimaryButton href={RELEASES} external className="w-full sm:w-auto">
            Download botato
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-chip bg-white/15 text-white">
              <Arrow className="h-[18px] w-[18px] transition-transform duration-[420ms] ease-[cubic-bezier(.65,0,.35,1)] group-hover:translate-x-[165%]" />
              <Arrow className="absolute h-[18px] w-[18px] -translate-x-[165%] transition-transform duration-[420ms] ease-[cubic-bezier(.65,0,.35,1)] group-hover:translate-x-0" />
            </span>
          </PrimaryButton>
          <Link
            href="/templates"
            className="inline-flex items-center justify-center gap-2.5 text-base font-semibold text-fg-2 transition-colors hover:text-fg sm:justify-start"
          >
            <People className="h-5 w-5" />
            Explore bots from the community
            <Arrow className="h-[17px] w-[17px]" />
          </Link>
        </div>
      </Reveal>
    </Panel>
  );
}
