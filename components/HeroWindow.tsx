import { useEffect, useState } from "react";
import BotFace from "@/components/BotFace";
import BrandMark from "@/components/BrandMark";

/* The botcage desktop window, running one turn on a loop.
 *
 *  Built to the app's own measurements rather than to a rough likeness: the
 *  268px sidebar, the 34px gutter, the 26px composer, the icons out of the
 *  app's sprite and the brand mark with the face punched out of it. The one
 *  departure is the top: the real window reserves 22px for the traffic lights
 *  macOS draws over it, and with none drawn here nothing is held back for
 *  them - so both columns take ordinary padding instead. A message
 *  is a flat row with no bubble around it, because that is what botcage draws -
 *  the tinted rounded rectangles every other chat app uses were the single
 *  biggest thing making a mock of this look like a mock of something else.
 *
 *  A single clock drives the scene: the component ticks a millisecond counter
 *  that wraps at LOOP, and everything else is derived from it. Easier to reason
 *  about than a chain of timeouts, it cannot drift out of step with itself, and
 *  looping is one modulo.
 *
 *  Under 720px the sidebar collapses to the app's own 66px rail - RAIL_AT in
 *  src/main.ts, so it happens exactly where the real window does. It is a real
 *  state of the real window rather than a liberty taken to fit the page. It is
 *  a container query, not a viewport one: the window is sized by whatever slot
 *  it is dropped into, so its own width is the only thing that can answer
 *  whether the roster still fits. */

const MERIDIAN = { name: "Meridian", color: "#0a84ff" };
const PIKE = { name: "Pike", color: "#ff5a00" };
const WREN = { name: "Wren", color: "#30d158" };
const HALLOWAY = { name: "Halloway", color: "#bf5af2" };

const ASK = "Did the invoice from Friday ever go out?";
const REPLY =
  "It did not. I have sent it now, and put a reminder in for Thursday in case nobody replies before then.";
const PIKE_REPLY = "I will watch the account and say if anything lands.";

/** The cues, in milliseconds: when each thing starts. */
const T = {
  type: 900,
  typeDone: 4200,
  send: 4600,
  think: 4600,
  work: 6400,
  write: 8000,
  writeDone: 12200,
  happy: 12200,
  rest: 13100,
  pike: 14200,
  loop: 19500,
};

const TICK = 60;

/* The app's own icons, straight out of the sprite in index.html. */
const ICON: Record<string, React.ReactNode> = {
  sidebar: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9.5 3v18" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 1.9" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M6.5 8h11v3.2a5.5 5.5 0 0 1-5.5 5.5 5.5 5.5 0 0 1-5.5-5.5z" />
      <path d="M12 16.7V21" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
    </>
  ),
  pin: (
    <>
      <path d="M9 3h6l-1 6 4 3.5V15H6v-2.5L10 9z" />
      <path d="M12 15v6" />
    </>
  ),
  phone: (
    <path d="M15.5 21A13.5 13.5 0 0 1 3 8.5V6a2 2 0 0 1 2-2h2.2a1 1 0 0 1 1 .8l.8 3.4a1 1 0 0 1-.5 1.1l-1.6.9a11 11 0 0 0 4.9 4.9l.9-1.6a1 1 0 0 1 1.1-.5l3.4.8a1 1 0 0 1 .8 1V19a2 2 0 0 1-2 2z" />
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  arrowUp: <path d="m5 12 7-7 7 7M12 19V5" />,
  hash: <path d="M9.5 3 7.8 21M16.2 3l-1.7 18M3.8 8.5h17M3 15.5h17" />,
};

/** The app's svg defaults: 18px, 1.7 stroke, round caps and joins, no fill. */
function Icon({ name, className = "h-[18px] w-[18px]" }: { name: string; className?: string }) {
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
      {ICON[name]}
    </svg>
  );
}

/** A row in the thread. Flush with the one above unless it starts a run, in
 *  which case it gets the air and the name. */
function Turn({
  head,
  gutter,
  who,
  when,
  children,
}: {
  head: boolean;
  gutter: React.ReactNode;
  who?: string;
  when?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex w-full max-w-full items-start gap-3 rounded-[6px] py-px pl-[10px] pr-[14px] ${head ? "mt-[15px]" : ""}`}
    >
      <div className="grid w-[34px] flex-none place-items-center pt-0.5">{gutter}</div>
      <div className="min-w-0 flex-1">
        {head && (
          <div className="mb-px flex items-baseline gap-2">
            <span className="text-[13.5px] font-semibold text-fg">{who}</span>
            <span className="text-[10.5px] tabular-nums text-fg-3">{when}</span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export default function HeroWindow({
  className = "",
  still = false,
}: {
  className?: string;
  /** Show the finished turn and leave it there. The page draws this window
   *  twice, and two copies of the same loop playing in step is a distraction,
   *  so only the hero's runs. */
  still?: boolean;
}) {
  // Start on the last frame: the server renders the finished turn, so a page
  // that never runs the clock - reduced motion, no JS - shows a conversation
  // rather than an empty window, and the client's first render matches it.
  const [clock, setClock] = useState(T.loop - 1);

  useEffect(() => {
    if (still) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // No reset needed: one tick past the end wraps to the start on its own.
    const id = window.setInterval(() => setClock((now) => (now + TICK) % T.loop), TICK);
    return () => window.clearInterval(id);
  }, [still]);

  const through = (from: number, to: number) =>
    Math.min(1, Math.max(0, (clock - from) / (to - from)));

  const draft =
    clock < T.send ? ASK.slice(0, Math.round(ASK.length * through(T.type, T.typeDone))) : "";
  const asked = clock >= T.send;
  const working = clock >= T.work && clock < T.write;
  const words = REPLY.split(" ");
  const said = clock < T.write ? 0 : Math.round(words.length * through(T.write, T.writeDone));
  const pikeSaid = clock >= T.pike;

  const mood =
    clock >= T.think && clock < T.work
      ? "think"
      : working
        ? "work"
        : clock >= T.write && clock < T.writeDone
          ? "write"
          : clock >= T.happy && clock < T.rest
            ? "happy"
            : undefined;

  /* Rooms first, then bots, which is the order the app files them in: a channel
     is where several of them are, so it sits above the list of them one at a
     time. A thread hangs off the room it came from, on a branch, rather than
     floating in the list on its own. */
  const rooms: { name: string; when: string; thread?: boolean; live?: boolean }[] = [
    { name: "launch", when: "09:25", live: true },
    { name: "invoices", when: "09:12", thread: true },
    { name: "research", when: "Tue" },
  ];

  const roster: {
    name: string;
    color: string;
    last: string;
    when: string;
    active?: boolean;
    asleep?: boolean;
  }[] = [
    { ...MERIDIAN, last: "Looking through the outbox…", when: "09:25", active: true },
    { ...PIKE, last: "Nothing new on the account.", when: "08:10" },
    { ...WREN, last: "The draft is ready for you.", when: "Tue", asleep: true },
    { ...HALLOWAY, last: "Nothing to report.", when: "Mon" },
  ];

  const railText = "hidden @min-[720px]:block";

  return (
    <div
      className={`app-ui @container relative overflow-hidden rounded-sheet border border-line bg-main shadow-[0_30px_90px_rgba(0,0,0,.55)] ${className}`}
    >
      <div className="grid h-full grid-cols-[66px_minmax(0,1fr)] @min-[720px]:grid-cols-[268px_minmax(0,1fr)]">
        {/* ---------------------------------------------------------- sidebar */}
        <aside className="flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-line bg-floor p-[10px]">
          <div className="flex h-[34px] flex-none items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-[7px] pl-[10px]">
              <BrandMark className="h-5 w-5 shrink-0" />
              <span
                className={`truncate text-[14.5px] font-semibold tracking-[-0.01em] text-fg ${railText}`}
              >
                botcage
              </span>
            </span>
            <span className="hidden items-center @min-[720px]:flex">
              <span className="grid h-[30px] w-[30px] place-items-center rounded-chip text-fg-2">
                <Icon name="sidebar" />
              </span>
              <span className="grid h-[30px] w-[30px] place-items-center rounded-chip text-fg-2">
                <Icon name="plus" />
              </span>
            </span>
          </div>

          <div className="my-[6px] mb-2 flex h-[34px] flex-none items-center gap-2 rounded-control bg-field px-[10px] text-fg-3">
            <Icon name="search" />
            <span className={`text-[15px] ${railText}`}>Search</span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden pb-1.5">
            <p
              className={`mb-1 mt-0.5 px-[10px] text-[11px] font-semibold uppercase tracking-[0.4px] text-fg-3 ${railText}`}
            >
              Channels
            </p>
            {rooms.map((room) =>
              room.thread ? (
                /* A thread carries no hash of its own: the branch it hangs from
                   says what it is, and a glyph on every line would only compete
                   with the room's above it. The elbow stops the line at the
                   thing it points to rather than running on past it. */
                <div
                  key={room.name}
                  className={`relative ml-[22px] w-[calc(100%-22px)] py-[5px] pl-5 pr-[10px] before:absolute before:bottom-1/2 before:left-0 before:top-0 before:w-0.5 before:bg-branch before:content-[''] after:absolute after:left-0 after:top-1/2 after:h-0.5 after:w-2.5 after:rounded-bl after:bg-branch after:content-[''] ${railText}`}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="flex-1 truncate text-[15px] font-medium tracking-[-0.01em] text-fg">
                      {room.name}
                    </span>
                    <span className="text-[12.5px] text-fg-2">{room.when}</span>
                  </span>
                </div>
              ) : (
                <div
                  key={room.name}
                  className="flex w-full items-center gap-3 rounded-card px-[10px] py-[9px]"
                >
                  <span className="grid h-[34px] w-[34px] flex-none place-items-center text-fg-2">
                    <Icon name="hash" className="h-[19px] w-[19px]" />
                  </span>
                  <span className={`min-w-0 flex-1 ${railText}`}>
                    <span className="flex items-baseline gap-2">
                      <span className="flex-1 truncate text-[15px] font-medium tracking-[-0.01em] text-fg">
                        {room.name}
                      </span>
                      <span className="text-[12.5px] text-fg-2">{room.when}</span>
                    </span>
                  </span>
                  {room.live && (
                    <span className="mr-1 h-1.5 w-1.5 flex-none animate-pulse rounded-full bg-blue" />
                  )}
                </div>
              ),
            )}

            <p
              className={`mb-1 mt-3 px-[10px] text-[11px] font-semibold uppercase tracking-[0.4px] text-fg-3 ${railText}`}
            >
              Bots
            </p>
            {roster.map((bot) => (
              <div
                key={bot.name}
                className={`flex w-full items-center gap-3 rounded-card px-[10px] py-[9px] ${
                  bot.active ? "bg-active" : ""
                } ${bot.asleep ? "opacity-40" : ""}`}
              >
                <BotFace
                  name={bot.name}
                  color={bot.color}
                  size={34}
                  still={bot.asleep}
                  mood={bot.active ? mood : undefined}
                />
                <span className={`min-w-0 flex-1 ${railText}`}>
                  <span className="flex items-baseline gap-2">
                    <span className="flex-1 truncate text-[15px] font-medium tracking-[-0.01em] text-fg">
                      {bot.name}
                    </span>
                    <span className="text-[12.5px] text-fg-2">{bot.when}</span>
                  </span>
                  <span className="block truncate text-[13.5px] text-fg-2">{bot.last}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-none flex-col gap-0.5 pt-1.5">
            <div className="flex items-center gap-3 rounded-card px-2 py-[7px]">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-field text-[12px] font-semibold text-fg-2">
                ·
              </span>
              <span className={`flex-1 truncate text-left text-[14.5px] text-fg ${railText}`}>
                botcage
              </span>
            </div>
          </div>
        </aside>

        {/* ------------------------------------------------------------- main */}
        <main className="relative flex min-h-0 min-w-0 flex-col overflow-hidden bg-main">
          <header className="relative z-[2] flex h-[44px] flex-none items-center justify-between gap-3 bg-main px-[14px]">
            <div className="flex min-w-0 items-center gap-[9px] text-[15px] font-semibold tracking-[-0.01em] text-fg">
              <BotFace name={MERIDIAN.name} color={MERIDIAN.color} size={22} mood={mood} />
              <span className="truncate">Meridian</span>
            </div>
            <div className="flex items-center gap-0.5 text-fg-2">
              {["clock", "plug", "gear", "pin", "phone", "monitor"].map((name) => (
                <span
                  key={name}
                  className="grid h-[30px] w-[30px] place-items-center rounded-chip"
                >
                  <Icon name={name} />
                </span>
              ))}
            </div>
          </header>

          {/* The thread. Rows are flush; the air belongs to the head of a run,
              and it is anchored to the bottom so a new message pushes the rest
              up the way a real transcript does. */}
          <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-1 py-2">
            {asked && (
              <Turn
                head
                who="You"
                when="09:24"
                gutter={
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-active text-[12.5px] font-semibold text-fg">
                    ·
                  </span>
                }
              >
                <p className="text-[15px] leading-[1.5] text-fg">{ASK}</p>
              </Turn>
            )}

            {(working || said > 0) && (
              <Turn
                head
                who="Meridian"
                when="09:24"
                gutter={
                  <BotFace name={MERIDIAN.name} color={MERIDIAN.color} size={34} mood={mood} />
                }
              >
                {working ? (
                  <p className="flex items-center gap-2 py-0.5 text-[13.5px] text-fg-3">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
                    Looking through the outbox
                  </p>
                ) : (
                  <p className="text-[15px] leading-[1.5] text-fg">
                    {words.slice(0, said).join(" ")}
                    {said < words.length && (
                      <span className="ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[0.15em] bg-fg-2 align-baseline" />
                    )}
                  </p>
                )}
              </Turn>
            )}

            {pikeSaid && (
              <Turn
                head
                who="Pike"
                when="09:25"
                gutter={<BotFace name={PIKE.name} color={PIKE.color} size={34} />}
              >
                <p className="text-[15px] leading-[1.5] text-fg">{PIKE_REPLY}</p>
              </Turn>
            )}
          </div>

          {/* The dock: the composer, and the send button that is always white */}
          <div className="relative flex-none px-[18px] pb-[18px] pt-2">
            <div className="flex items-end gap-2.5 rounded-[26px] bg-field py-[7px] pl-2 pr-[7px]">
              <span className="min-w-0 flex-1 py-2 text-[15px] leading-[1.4] text-fg">
                {draft || <span className="text-fg-3">Message</span>}
                {draft && clock < T.send && (
                  <span className="ml-px inline-block h-[0.95em] w-[2px] translate-y-[0.15em] bg-fg align-baseline" />
                )}
              </span>
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#f2f2f2] text-[#0a0a0a]">
                <Icon name="arrowUp" />
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
