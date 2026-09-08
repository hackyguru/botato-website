import { useEffect, useState } from "react";
import BotFace from "@/components/BotFace";
import { TEMPLATES } from "@/data/templates";

/* The bots on this page, doing what bots on this page do all day.
 *
 *  The faces are the templates themselves rather than invented ones, so the
 *  cluster beside the heading is the same eight you scroll past underneath it -
 *  and because a face is generated from its name, each one here is exactly the
 *  face that template will have in your roster.
 *
 *  One clock drives all of them, but each carries its own period and offset, so
 *  they change at different moments instead of blinking through the same mood
 *  together. A wall of bots doing the same thing at the same time reads as a
 *  loading state; a wall doing different things reads as a room. */

/** What a face can be caught doing. The undefined is a bot at rest, and it
 *  matters: without it nothing is ever still and the whole cluster fidgets. */
const MOODS = [undefined, "think", "happy", "work", "talk", undefined, "write"];

/** Where each sits, how big, and how quickly it moves on. Placed by hand: an
 *  even grid of faces is a spreadsheet, and the point is a crowd. */
const PLACED = [
  { at: "Scout", x: 6, y: 10, size: 58, every: 2600, from: 0 },
  { at: "Concierge", x: 44, y: 0, size: 46, every: 3100, from: 3 },
  { at: "Chair", x: 74, y: 16, size: 66, every: 2200, from: 5 },
  { at: "Scribe", x: 22, y: 44, size: 72, every: 3400, from: 1 },
  { at: "Sentry", x: 60, y: 52, size: 50, every: 2000, from: 4 },
  { at: "Engineer", x: 2, y: 72, size: 44, every: 2900, from: 6 },
  { at: "Studio", x: 40, y: 78, size: 56, every: 2400, from: 2 },
  { at: "Mentor", x: 78, y: 74, size: 40, every: 3600, from: 5 },
];

const TICK = 200;

export default function EmoteWall({ className = "" }: { className?: string }) {
  const [clock, setClock] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setClock((now) => now + TICK), TICK);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[380px] ${className}`}
      aria-hidden="true"
    >
      {PLACED.map((spot) => {
        const bot = TEMPLATES.find((one) => one.name === spot.at);
        if (!bot) return null;
        const mood =
          MOODS[(Math.floor(clock / spot.every) + spot.from) % MOODS.length];
        return (
          <span
            key={spot.at}
            className="absolute"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          >
            <BotFace
              name={bot.name}
              color={bot.color}
              size={spot.size}
              mood={mood}
            />
          </span>
        );
      })}
    </div>
  );
}
