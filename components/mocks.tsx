import BotFace from "@/components/BotFace";
import { Clock, Lock, Terminal, Wave } from "@/components/icons";

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

/** A bot's own computer: a Linux desktop in a container, watched. */
export function ComputerMock() {
  return (
    <Window title="Pike&rsquo;s computer" className="h-full">
      <div className="relative min-h-0 flex-1 bg-floor p-3">
        <div className="flex items-center gap-2 rounded-control bg-field px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-fg-3" />
          <span className="truncate text-[11px] text-fg-3">
            support.example.com/queue
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {[92, 74, 84, 61, 79].map((width, at) => (
            <div key={at} className="flex items-center gap-2">
              <span className="h-6 w-6 shrink-0 rounded-chip bg-fill-1" />
              <span
                className="h-2 rounded-full bg-fill-2"
                style={{ width: `${width}%` }}
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-line bg-fill-2 px-2.5 text-[12.5px] font-medium text-green">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
            Working
          </span>
          <span className="inline-flex h-7 items-center rounded-full border border-line bg-fill-2 px-2.5 text-[12.5px] font-medium text-fg-2">
            Take over
          </span>
          <span className="ml-auto hidden items-center gap-1.5 text-[11px] text-fg-3 sm:inline-flex">
            <Terminal className="h-3.5 w-3.5" />
            a machine of its own
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
          “Notarisation is the long pole - two hours, and it runs last.”
        </p>
      </div>
      <p className="mt-2.5 text-[11px] text-fg-3">
        Every word lands in the channel as it is said, so you have notes when you hang up.
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
        Each bot reports what actually ran, so one with nothing to report says so.
      </p>
    </div>
  );
}

/** A wall of faces: heads, eyes, brows, smiles and marks, all from names.
 *  The seven colours are the app's own swatches - deliberately not a scale,
 *  because these are people rather than levels. */
const FACE_WALL = [
  "Meridian", "Pike", "Wren", "Halloway", "Sable", "Odile",
  "Ferris", "Juno", "Marlow", "Bexley", "Tallis", "Corvid",
  "Ines", "Quill", "Rooke", "Vesper", "Alder", "Nimbus",
  "Padgett", "Esk", "Lowry", "Fen", "Cormac", "Wick",
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
          <BotFace key={name} name={name} color={SWATCHES[at % SWATCHES.length]} size={30} />
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
            It did not. I have sent it now, and put a reminder in for Thursday.
          </p>
          <p className="ml-auto max-w-[70%] rounded-card rounded-br-sm bg-blue px-2.5 py-1.5 text-[11px] leading-snug text-white">
            Perfect, thank you.
          </p>
        </div>
      </div>
    </div>
  );
}
