import BotFace from "@/components/BotFace";

/* A bot's own computer, as the container actually draws it.
 *
 *  Three things make it that machine rather than a picture of a desktop: the
 *  wallpaper is a wash of the bot's own colour, the app's name is tiled across
 *  it so a screenshot says where it came from, and there is a panel along the
 *  bottom with the launchers, the window that is open, and the clock. */

type Bot = { name: string; color: string };

/** The name, tiled. Staggered rows rather than a rotated pattern - that is how
 *  the image is built, and a rotation would blur the type at this size. */
function Watermark() {
  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, row) => (
        <div
          key={row}
          className="absolute flex w-[150%] justify-between"
          style={{ top: `${row * 13 - 2}%`, left: row % 2 ? "-14%" : "-2%" }}
        >
          {Array.from({ length: 6 }).map((_, n) => (
            <span
              key={n}
              className="text-[6px] font-semibold tracking-tight text-white/[0.09]"
            >
              botcage
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/** The panel: launchers, the window that is open, and the time. */
function Panel({ task, at, day }: { task: string; at: string; day: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[9%] min-h-[16px] items-center gap-1 bg-[#16161a] px-1">
      <span className="flex items-center gap-[3px]" aria-hidden="true">
        <span className="h-[7px] w-[6px] rounded-[1px] bg-white/35" />
        <span className="text-[6px] font-bold leading-none text-[#e0393e]">
          X
        </span>
        <span className="h-[7px] w-[7px] rounded-full bg-[#4a9dff]" />
        <span className="h-[7px] w-[6px] rounded-[1px] bg-[#ffb020]/80" />
      </span>
      <span className="ml-1 flex min-w-0 items-center gap-1 rounded-[2px] bg-white/[0.09] px-1 py-[2px]">
        <span className="h-[7px] w-[7px] flex-none rounded-full bg-[#4a9dff]" />
        <span className="truncate text-[5.5px] leading-[1.15] text-white/70">
          {task}
        </span>
      </span>
      <span className="ml-auto flex-none pr-0.5 text-right text-[5.5px] leading-[1.15] text-white/55">
        {at}
        <br />
        {day}
      </span>
    </div>
  );
}

export default function BotDesktop({
  bot,
  task,
  at = "16:02",
  day = "Mon 07 Sep",
  children,
}: {
  bot: Bot;
  /** What the panel says is open. */
  task: string;
  at?: string;
  day?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0b0b0d]">
      {/* The wash: dark at the top corner, the bot's own colour at the far one. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(128deg, #0b0b0d 0%, #0b0b0d 22%, color-mix(in srgb, ${bot.color} 30%, #0b0b0d) 68%, color-mix(in srgb, ${bot.color} 62%, #0b0b0d) 100%)`,
        }}
      />
      <Watermark />
      {/* Whose machine it is, in the corner it leaves free. */}
      <div className="absolute bottom-[13%] right-2 opacity-25">
        <BotFace name={bot.name} color={bot.color} size={26} still />
      </div>
      {children}
      <Panel task={task} at={at} day={day} />
    </div>
  );
}

/** Chromium, as the sandbox opens it: the tab strip, the toolbar, and the
 *  flag warning the container's own start-up puts there. */
export function BrowserWindow({
  url,
  title,
  children,
}: {
  url: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="absolute left-[2%] top-[4%] flex h-[80%] w-[68%] flex-col overflow-hidden rounded-t-[4px] bg-white shadow-[0_10px_30px_rgba(0,0,0,.5)] ring-1 ring-black/25">
      {/* tab strip */}
      <div className="flex flex-none items-end gap-[3px] bg-[#dee1e6] px-1 pt-[3px]">
        <span className="grid h-[9px] w-[9px] place-items-center rounded-[2px] bg-[#cdd1d6] text-[5px] text-black/50">
          v
        </span>
        <span className="flex min-w-0 max-w-[62%] flex-1 items-center gap-1 rounded-t-[3px] bg-white px-1 py-[2px]">
          <span className="h-[5px] w-[5px] flex-none rounded-full bg-black/25" />
          <span className="truncate text-[5.5px] text-black/70">{title}</span>
          <span className="ml-auto flex-none text-[5.5px] leading-none text-black/35">
            ×
          </span>
        </span>
        <span className="text-[6px] leading-[9px] text-black/45">+</span>
        <span className="ml-auto flex items-center gap-[5px] pb-[2px] pr-[1px] text-[5px] text-black/45">
          <span className="block h-px w-[7px] bg-current" />
          <span>▫</span>
          <span>×</span>
        </span>
      </div>

      {/* toolbar */}
      <div className="flex flex-none items-center gap-1 border-b border-black/10 bg-white px-1 py-[3px]">
        <span className="flex items-center gap-[3px] text-[6px] text-black/35">
          <span>←</span>
          <span>→</span>
          <span>⟳</span>
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1 rounded-full border border-[#1a73e8] px-1 py-[1px]">
          <span className="grid h-[5px] w-[5px] flex-none place-items-center rounded-full border border-black/30 text-[3px] text-black/40">
            i
          </span>
          {/* selected, the way it is when the window has just opened */}
          <span className="truncate rounded-[1px] bg-[#1a73e8] px-[2px] text-[5.5px] text-white">
            {url}
          </span>
          <span className="ml-auto flex-none text-[5.5px] text-black/30">
            ☆
          </span>
        </span>
        <span className="flex flex-none items-center gap-[3px] text-[5.5px] text-black/35">
          <span className="grid h-[7px] w-[7px] place-items-center rounded-full border border-black/25 text-[4px]">
            ●
          </span>
          <span>⋮</span>
        </span>
      </div>

      {/* the flag the sandbox starts it with, and says so */}
      <div className="flex flex-none items-center gap-1 border-b border-black/[0.08] bg-[#f8f9fa] px-1.5 py-[3px]">
        <span className="min-w-0 flex-1 truncate text-center text-[5px] leading-[1.2] text-black/55">
          You are using an unsupported command-line flag: --no-sandbox.
          Stability and security will suffer.
        </span>
        <span className="flex-none text-[5px] text-black/35">×</span>
      </div>

      <div className="min-h-0 flex-1 bg-white">{children}</div>
    </div>
  );
}
