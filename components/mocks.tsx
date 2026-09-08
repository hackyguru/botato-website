import { useEffect, useState } from "react";

import BotFace from "@/components/BotFace";
import BotProps, { type Kit } from "@/components/BotProps";
import BotDesktop, { BrowserWindow } from "@/components/BotDesktop";
import { Clock, Lock, Wave } from "@/components/icons";

/* Stand-ins for the app, drawn rather than screenshotted so they stay sharp and
   stay honest. Every surface here is a rung of the app's own ladder - bg for
   the sidebar, bg-main for the conversation, panel for a sheet, field for
   something you type in - and every string is something botcage actually does.

   They are set in .app-ui, the app's type rather than the page's. */

const MERIDIAN = { name: "Meridian", color: "#0a84ff" };
const PIKE = { name: "Pike", color: "#ff5a00" };
const WREN = { name: "Wren", color: "#30d158" };

/** A window: the app's sheet radius, its hairline, its shadow. */
function Window({
  title,
  children,
  className = "",
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`app-ui flex flex-col overflow-hidden rounded-sheet border border-line bg-main shadow-[var(--shadow)] ${className}`}
    >
      <div className="flex flex-none items-center gap-2 border-b border-line bg-floor px-3.5 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          {["bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]"].map((dot) => (
            <span key={dot} className={`h-2.5 w-2.5 rounded-full ${dot}`} />
          ))}
        </span>
        <span className="ml-1.5 truncate text-[12.5px] font-medium text-fg-3">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

/** A bot's own computer: the container's desktop, watched. Its wallpaper, its
 *  panel, its browser - what you actually see when you open one. */
export function ComputerMock() {
  return (
    <Window title="Pike&rsquo;s computer" className="h-full">
      <div className="relative min-h-0 flex-1 bg-floor">
        <BotDesktop
          bot={{ name: "Pike", color: "#ff5a00" }}
          task="Zendesk - Chromium"
        >
          <BrowserWindow
            url="support.example.com/agent/queue"
            title="Support queue"
          >
            {/* the queue it was told to work */}
            <div className="space-y-[3px] p-1">
              <div className="flex items-center gap-1 border-b border-black/[0.06] pb-[3px]">
                <span className="text-[6px] font-semibold text-black/70">
                  Open tickets
                </span>
                <span className="rounded-full bg-[#e8f0fe] px-1 text-[5px] text-[#1967d2]">
                  7
                </span>
              </div>
              {[
                { who: "A. Mensah", s: "Cannot pair my phone", on: true },
                { who: "R. Okonkwo", s: "Invoice query" },
                { who: "J. Fowler", s: "Routine did not fire" },
                { who: "S. Patel", s: "Export is empty" },
              ].map((row) => (
                <div
                  key={row.who}
                  className={`flex items-center gap-1 rounded-[2px] px-1 py-[2px] ${
                    row.on ? "bg-[#e8f0fe]" : ""
                  }`}
                >
                  <span className="h-[6px] w-[6px] flex-none rounded-full bg-black/15" />
                  <span className="w-[38%] truncate text-[5.5px] text-black/60">
                    {row.who}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[5.5px] text-black/45">
                    {row.s}
                  </span>
                </div>
              ))}
            </div>
          </BrowserWindow>
        </BotDesktop>

        {/* what the pane puts over it: whether it is working, and the way in */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
          <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-line bg-floor/80 px-2 text-[11.5px] font-medium text-green backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
            Working
          </span>
          <span className="inline-flex h-6 items-center rounded-full border border-line bg-floor/80 px-2 text-[11.5px] font-medium text-fg-2 backdrop-blur-sm">
            Take over
          </span>
        </div>
      </div>
    </Window>
  );
}

/** A call on a channel: faces side by side, whoever has the floor lit. */
export function CallMock() {
  const onCall = [
    { ...MERIDIAN, talking: false },
    { ...PIKE, talking: true },
    { ...WREN, talking: false },
  ];
  return (
    <div className="app-ui flex h-full flex-col justify-between rounded-surface border border-line bg-floor p-5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-fg-3">
        <span className="h-1.5 w-1.5 rounded-full bg-red" />
        On a call · #launch · 04:12
      </div>
      <div className="flex items-end justify-center gap-5 py-6">
        {onCall.map((bot) => (
          <div key={bot.name} className="flex flex-col items-center gap-2">
            <span
              className={`rounded-full p-1 ${
                bot.talking ? "ring-2 ring-green" : "ring-1 ring-line"
              }`}
            >
              <BotFace
                name={bot.name}
                color={bot.color}
                size={bot.talking ? 46 : 34}
                mood={bot.talking ? "talk" : undefined}
                className={bot.talking ? "" : "opacity-45"}
              />
            </span>
            <span
              className={`text-[11px] font-medium ${
                bot.talking ? "text-fg" : "text-fg-3"
              }`}
            >
              {bot.name}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2.5 rounded-control bg-field px-3.5 py-2.5">
        <Wave className="h-4 w-4 shrink-0 text-green" />
        <p className="truncate text-[12.5px] text-fg-2">
          “Notarisation is the long pole - two hours and it runs last.”
        </p>
      </div>
      <p className="mt-2.5 text-[11px] text-fg-3">
        Every word lands in the channel as it is said, so you have notes when
        you hang up.
      </p>
    </div>
  );
}

/** Routines, as the app lists them. */
export function RoutinesMock() {
  const routines = [
    { name: "Stand-up", when: "Weekdays, 09:00", where: "#launch", live: true },
    { name: "Competitor watch", when: "Mondays, 07:30", where: "Pike" },
    { name: "Inbox triage", when: "Every 2 hours", where: "Halloway" },
  ];
  return (
    <div className="app-ui flex h-full flex-col gap-2 rounded-surface border border-line bg-floor p-4">
      {routines.map((routine) => (
        <div
          key={routine.name}
          className="flex items-center gap-3 rounded-card bg-field px-3.5 py-3"
        >
          <Clock className="h-4 w-4 shrink-0 text-fg-3" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-medium text-fg">
              {routine.name}
            </span>
            <span className="block truncate text-[11px] text-fg-3">
              {routine.when} → {routine.where}
            </span>
          </span>
          {routine.live && (
            <span className="shrink-0 rounded-full border border-line bg-fill-2 px-2 py-0.5 text-[11px] font-medium text-green">
              running
            </span>
          )}
        </div>
      ))}
      <p className="mt-auto pt-2 text-[11px] leading-relaxed text-fg-3">
        Each bot reports what actually ran, so one with nothing to report says
        so.
      </p>
    </div>
  );
}

/** A wall of faces: heads, eyes, brows, smiles and marks, all from names.
 *  The seven colours are the app's own swatches - deliberately not a scale,
 *  because these are people rather than levels. */
const FACE_WALL = [
  "Meridian",
  "Pike",
  "Wren",
  "Halloway",
  "Sable",
  "Odile",
  "Ferris",
  "Juno",
  "Marlow",
  "Bexley",
  "Tallis",
  "Corvid",
  "Ines",
  "Quill",
  "Rooke",
  "Vesper",
  "Alder",
  "Nimbus",
  "Padgett",
  "Esk",
  "Lowry",
  "Fen",
  "Cormac",
  "Wick",
];

const SWATCHES = [
  "#0a84ff",
  "#8e8e93",
  "#e0393e",
  "#ff5a00",
  "#ffb020",
  "#30d158",
  "#bf5af2",
];

export function FacesMock() {
  return (
    <div className="grid h-full place-content-center rounded-surface border border-line bg-floor p-5">
      <div className="grid grid-cols-6 justify-items-center gap-y-4">
        {FACE_WALL.map((name, at) => (
          <BotFace
            key={name}
            name={name}
            color={SWATCHES[at % SWATCHES.length]}
            size={30}
          />
        ))}
      </div>
    </div>
  );
}

/** The same conversation, on the phone that reached the laptop it is happening
 *  on. Open at the bottom: the card crops it, so it reads as a device standing
 *  in the frame rather than a picture of one. */
export function PhonePreview() {
  return (
    <div className="app-ui mx-auto w-[212px] rounded-t-[2.1rem] border border-b-0 border-line bg-floor p-2 pb-0 shadow-[var(--shadow)]">
      <div className="overflow-hidden rounded-t-[1.7rem] bg-main">
        <div className="flex justify-center pb-1 pt-2">
          <span className="h-1 w-14 rounded-full bg-raised" />
        </div>
        <div className="flex items-center gap-2 border-b border-line px-3 py-2">
          <BotFace name="Meridian" color="#0a84ff" size={18} still />
          <span className="text-[12.5px] font-semibold text-fg">Meridian</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-green">
            <Lock className="h-2.5 w-2.5" />
            direct
          </span>
        </div>
        <div className="space-y-2 p-3 pb-8">
          <p className="ml-auto max-w-[86%] rounded-card rounded-br-sm bg-blue px-2.5 py-1.5 text-[11px] leading-snug text-white">
            Did the invoice from Friday ever go out?
          </p>
          <p className="max-w-[92%] rounded-card rounded-tl-sm bg-field px-2.5 py-1.5 text-[11px] leading-snug text-fg">
            It did not. I have sent it now and put a reminder in for Thursday.
          </p>
          <p className="ml-auto max-w-[70%] rounded-card rounded-br-sm bg-blue px-2.5 py-1.5 text-[11px] leading-snug text-white">
            Perfect, thank you.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

/** Four bots handing work along without being asked.
 *
 *  One clock rather than four timers: a counter ticks, and everything below
 *  is derived from it, so the bubbles cannot drift out of step with the faces
 *  or with each other. */

const TICK = 120;
const TURN = 2900;
const TYPING = 800;
const HOLD = 3400;
const LOOP = TURN * 4 + HOLD;

/** A bot named inside someone else's message, lit in its own colour. */
function At({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="rounded-[4px] px-[3px] font-medium"
      style={{ color, backgroundColor: `${color}22` }}
    >
      {children}
    </span>
  );
}

const CREW: {
  name: string;
  color: string;
  kit: Kit;
  says: React.ReactNode;
}[] = [
  {
    name: "Finance",
    color: "#0a84ff",
    kit: "finance",
    says: (
      <>
        Northwind renewed. I need last quarter&rsquo;s usage before I can invoice
        them.
      </>
    ),
  },
  {
    name: "Engineer",
    color: "#ff5a00",
    kit: "engineer",
    says: (
      <>
        Pulling it now. <At color="#bf5af2">@Designer</At> the seat count moved,
        so the deck is out of date.
      </>
    ),
  },
  {
    name: "Designer",
    color: "#bf5af2",
    kit: "designer",
    says: (
      <>
        On it. New pricing slide in{" "}
        <span className="font-medium text-fg">#launch</span> in ten minutes.
      </>
    ),
  },
  {
    name: "Legal",
    color: "#30d158",
    kit: "legal",
    says: (
      <>
        I will check the renewal terms before any of it goes out. Nobody asked us
        for this.
      </>
    ),
  },
];

/* Where each dot sits on the row and how long it takes to cross. Fixed rather
   than random, because a random stream would differ between the server render
   and the first client one. Negative delays so the row is already full at the
   moment the page loads instead of filling up from empty. */
const DRIFT = [
  { y: 46, size: 3, dur: 5.2, at: -0.4 },
  { y: 52, size: 2, dur: 7.6, at: -2.1 },
  { y: 41, size: 2, dur: 6.4, at: -3.8 },
  { y: 57, size: 2.5, dur: 8.9, at: -1.2 },
  { y: 49, size: 2, dur: 5.9, at: -4.6 },
  { y: 44, size: 3, dur: 9.4, at: -6.2 },
  { y: 55, size: 2, dur: 6.9, at: -0.9 },
  { y: 50, size: 2.5, dur: 7.1, at: -5.3 },
  { y: 43, size: 2, dur: 8.2, at: -2.7 },
  { y: 54, size: 2, dur: 5.6, at: -3.1 },
  { y: 47, size: 2.5, dur: 9.8, at: -7.4 },
  { y: 51, size: 2, dur: 6.7, at: -1.8 },
];

/** Three dots, while a bot is still forming the message. */
function Dots() {
  return (
    <span className="flex items-center gap-[3px] py-[3px]">
      {[0, 1, 2].map((at) => (
        <span
          key={at}
          className="h-[4px] w-[4px] animate-pulse rounded-full bg-fg-3"
          style={{ animationDelay: `${at * 160}ms` }}
        />
      ))}
    </span>
  );
}

export function HandoffMock() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setNow((was) => (was + TICK) % LOOP), TICK);
    return () => clearInterval(id);
  }, []);

  const turn = Math.min(CREW.length - 1, Math.floor(now / TURN));
  const into = now - turn * TURN;
  const typing = now < TURN * CREW.length && into < TYPING;

  return (
    <div className="app-ui flex h-full flex-col justify-end rounded-surface border border-line bg-floor p-4 sm:p-6">
      <div className="relative grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-x-4">
        {/* Work in flight, behind the row of faces, tinted by whoever has the
            floor. A dot that passes behind a face disappears into it. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[24px] hidden h-[82px] transition-colors duration-700 sm:block"
          style={{ color: CREW[turn].color }}
        >
          {DRIFT.map((dot, at) => (
            <span
              key={at}
              className="drift"
              style={
                {
                  top: `${dot.y}%`,
                  width: `${dot.size}px`,
                  height: `${dot.size}px`,
                  "--dur": `${dot.dur}s`,
                  "--at": `${dot.at}s`,
                  "--lit": dot.size > 2.2 ? 0.65 : 0.4,
                } as React.CSSProperties
              }
            />
          ))}
        </span>

        {CREW.map((bot, at) => {
          // One bubble at a time: it rises when the bot takes the floor and
          // drops away when the next one does.
          const holds = at === turn;
          const spoken = holds && !typing;
          return (
            <div key={bot.name} className="relative flex flex-col items-center">
              <div className="flex min-h-[104px] w-full items-end justify-center sm:min-h-[96px]">
                <div
                  className={`relative w-full rounded-card border border-line bg-field px-3 py-2 transition-all duration-500 ${
                    holds
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1.5 opacity-0"
                  }`}
                >
                  {/* The message stays mounted and is only revealed, so the
                      bubble is sized by its own text from the first frame and
                      does not resize when the bot stops typing. */}
                  <p
                    className={`text-[11.5px] leading-[1.45] text-fg-2 transition-opacity duration-300 ${
                      spoken ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {bot.says}
                  </p>
                  {!spoken && (
                    <span className="absolute inset-0 flex items-center px-3">
                      <Dots />
                    </span>
                  )}
                  {/* The tail, pointing down at whoever said it. */}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-[4.5px] left-1/2 h-[8px] w-[8px] -translate-x-1/2 rotate-45 border-b border-r border-line bg-field"
                  />
                </div>
              </div>

              <span className="relative mt-4 flex flex-col items-center gap-3.5">
                <BotFace
                  name={bot.name}
                  color={bot.color}
                  size={80}
                  mood={holds ? (typing ? "think" : "talk") : undefined}
                  className={`transition-opacity duration-500 ${
                    holds ? "" : "opacity-45"
                  }`}
                >
                  <BotProps name={bot.name} kit={bot.kit} />
                </BotFace>
                <span
                  className="text-[12.5px] font-medium transition-colors duration-500"
                  style={{ color: holds ? bot.color : "#636366" }}
                >
                  {bot.name}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-[11px] leading-relaxed text-fg-3">
        Nobody typed a word of this. One bot needed something, asked the bot that
        had it and the rest picked the work up.
      </p>
    </div>
  );
}
