import { Fragment, useEffect, useRef, useState } from "react";
import BotFace from "@/components/BotFace";
import BrandMark from "@/components/BrandMark";
import BotDesktop from "@/components/BotDesktop";

/* The botato desktop window, playing one scene on a loop.
 *
 *  Built to the app's own measurements rather than to a rough likeness: the
 *  268px sidebar, the 34px gutter, the 26px composer, the desk row above
 *  everything, the docked computer as a third column, and the icons out of the
 *  app's own sprite. A message is a flat row with no bubble around it, because
 *  that is what botato draws.
 *
 *  The scene is five acts and answers one question - what is it actually like
 *  to have these things working for you:
 *
 *    1. a standup room, where you ask and six bots answer one at a time
 *    2. one of those answers says it is negotiating an invoice, so we open it
 *    3. and open its computer, which is a column not an overlay
 *    4. the computer is mid-negotiation on a mail client, unattended
 *    5. it comes back with a number, and stops - the send is yours to approve,
 *       so it lands on your desk and the desk says 1.
 *
 *  A single clock drives all of it: the component ticks a millisecond counter
 *  that wraps at LOOP, and every part of the scene is derived from it. Easier
 *  to reason about than a chain of timeouts, it cannot drift out of step with
 *  itself, and looping is one modulo. */

/* Named for the job rather than for a person: you read the roster once and
   know who to ask, and the one holding the invoice is obvious. */
const FINANCE = { name: "Finance", color: "#0a84ff" };
const ENGINEER = { name: "Engineer", color: "#ff5a00" };
const PM = { name: "PM", color: "#30d158" };
const DESIGNER = { name: "Designer", color: "#bf5af2" };
const SUPPORT = { name: "Support", color: "#ffb020" };
const GROWTH = { name: "Growth", color: "#e0393e" };
const LEGAL = { name: "Legal", color: "#8e8e93" };

const ROOM = [ENGINEER, PM, DESIGNER, FINANCE, SUPPORT, GROWTH];
/** Everyone in the rail. #standup is the six; #invoices is the three whose
 *  job an invoice actually is. */
const ROSTER = [...ROOM, LEGAL];
const INVOICE_MEMBERS = [FINANCE, LEGAL, PM];

function Mention({
  children,
  room = false,
}: {
  children: React.ReactNode;
  room?: boolean;
}) {
  return (
    <span
      className="rounded-[3px] px-[2px] font-medium text-[#7ab6ff]"
      style={{ background: `rgba(10, 132, 255, ${room ? 0.22 : 0.16})` }}
    >
      {children}
    </span>
  );
}

const ASK_ROOM = (
  <>
    Hey <Mention room>@everyone</Mention>, can you drop your updates from today?
  </>
);

/** The standup, in the order it happens. Finance's is the one that matters:
 *  it is the thread we follow out of the room. */
const UPDATES: { bot: { name: string; color: string }; text: string }[] = [
  {
    bot: ENGINEER,
    text: "Deploy went out at 09:10. The error log has been quiet since.",
  },
  {
    bot: PM,
    text: "Changelog is drafted. I still need a release date from you.",
  },
  {
    bot: DESIGNER,
    text: "New icons are in the shared folder. Nothing blocking.",
  },
  {
    bot: FINANCE,
    text: "Northwind invoiced us 4,800. I am negotiating it on my computer now.",
  },
  { bot: SUPPORT, text: "Two tickets closed, one waiting on the customer." },
  {
    bot: GROWTH,
    text: "Nine sign-ups overnight, all of them from the launch post.",
  },
];

/** What is in the server. Categories, because seven rooms in one list is the
 *  point at which you stop reading it. */
const ROOMS: {
  cat: string;
  rooms: {
    name: string;
    when: string;
    live?: boolean;
    unread?: boolean;
    badge?: number;
  }[];
}[] = [
  {
    cat: "Team",
    rooms: [
      { name: "standup", when: "09:31", live: true },
      { name: "launch", when: "09:04", unread: true, badge: 3 },
      { name: "random", when: "Tue" },
    ],
  },
  {
    cat: "Money",
    rooms: [
      { name: "invoices", when: "Wed" },
      { name: "suppliers", when: "Mon" },
    ],
  },
  {
    cat: "Product",
    rooms: [
      { name: "design-review", when: "Tue" },
      { name: "support-escalations", when: "Fri" },
    ],
  },
];

/** Yesterday's standup, still up the thread. A room you have only just opened
 *  looks like a demo; a room with a week behind it looks like a room. */
const ROOM_HISTORY: {
  day: string;
  who: string;
  when: string;
  text: React.ReactNode;
  me?: boolean;
  color?: string;
}[] = [
  {
    day: "Wednesday",
    who: "You",
    when: "09:30",
    me: true,
    text: (
      <>
        Standup <Mention room>@everyone</Mention> - short one today.
      </>
    ),
  },
  {
    day: "Wednesday",
    who: "Engineer",
    when: "09:31",
    color: ENGINEER.color,
    text: "0.3.8 shipped. One rollback on the sandbox image, re-cut and out again.",
  },
  {
    day: "Wednesday",
    who: "Designer",
    when: "09:31",
    color: DESIGNER.color,
    text: "Icon set is at 40 of 60. Nothing needed from anyone.",
  },
  {
    day: "Wednesday",
    who: "Finance",
    when: "09:32",
    color: FINANCE.color,
    text: "Three invoices in, all under the threshold. Paid and filed.",
  },
  {
    day: "Wednesday",
    who: "PM",
    when: "09:32",
    color: PM.color,
    text: "Waiting on Legal for the Northwind contract before I can schedule anything.",
  },
  {
    day: "Wednesday",
    who: "Support",
    when: "09:33",
    color: SUPPORT.color,
    text: "Quiet day. Four tickets, all closed.",
  },
  {
    day: "Wednesday",
    who: "Growth",
    when: "14:02",
    color: GROWTH.color,
    text: "Landing page copy is rewritten. I will put it past PM before it goes up.",
  },
  {
    day: "Yesterday",
    who: "You",
    when: "09:30",
    me: true,
    text: (
      <>
        Same as always <Mention room>@everyone</Mention> - drop your updates
        when you can.
      </>
    ),
  },
  {
    day: "Yesterday",
    who: "Engineer",
    when: "09:31",
    color: ENGINEER.color,
    text: "Release 0.3.9 is out. Two crash reports overnight, both fixed and shipped.",
  },
  {
    day: "Yesterday",
    who: "Growth",
    when: "09:31",
    color: GROWTH.color,
    text: "Launch post is drafted. I am waiting on a screenshot from Designer.",
  },
  {
    day: "Yesterday",
    who: "Designer",
    when: "09:32",
    color: DESIGNER.color,
    text: "Screenshot is with Growth now - the one with the computer open.",
  },
  {
    day: "Yesterday",
    who: "Finance",
    when: "09:32",
    color: FINANCE.color,
    text: "Two invoices in, both under the threshold. Paid and filed.",
  },
  {
    day: "Yesterday",
    who: "PM",
    when: "09:33",
    color: PM.color,
    text: "Nothing blocking. I will chase the design review this afternoon.",
  },
  {
    day: "Yesterday",
    who: "Legal",
    when: "11:40",
    color: LEGAL.color,
    text: "Northwind contract is signed off. Standard terms, nothing unusual in it.",
  },
  {
    day: "Yesterday",
    who: "Support",
    when: "16:10",
    color: SUPPORT.color,
    text: "Ticket 812 is closed - the customer replied and is happy with the fix.",
  },
  {
    day: "Yesterday",
    who: "You",
    when: "16:12",
    me: true,
    text: "Good week. Same time tomorrow.",
  },
];

const INVOICE_HISTORY: {
  bot: { name: string; color: string };
  day: string;
  at: string;
  text: string;
}[] = [
  {
    bot: PM,
    day: "Wednesday",
    at: "10:04",
    text: "Setting this room up so invoices stop living in my inbox.",
  },
  {
    bot: FINANCE,
    day: "Wednesday",
    at: "10:05",
    text: "Good. I will post anything I settle in here, with the numbers.",
  },
  {
    bot: LEGAL,
    day: "Wednesday",
    at: "10:06",
    text: "And I will read the terms on anything that changes them.",
  },
  {
    bot: FINANCE,
    day: "Thursday",
    at: "09:14",
    text: "Brightwell 1180 came in at 1,240.00. Over the threshold, so it went to the desk.",
  },
  {
    bot: FINANCE,
    day: "Thursday",
    at: "15:50",
    text: "Approved and paid. They took 60.00 off for settling inside the week.",
  },
  {
    bot: LEGAL,
    day: "Thursday",
    at: "15:52",
    text: "Terms unchanged on that one. Filed against the contract.",
  },
  {
    bot: PM,
    day: "Monday",
    at: "14:20",
    text: "Reminder for the room: anything over 4,000 needs the quarterly forecast updating.",
  },
  {
    bot: FINANCE,
    day: "Monday",
    at: "14:22",
    text: "Noted. I will flag those to you here as well as to the desk.",
  },
  {
    bot: LEGAL,
    day: "Monday",
    at: "14:25",
    text: "Same for me if the payment terms move at all.",
  },
  {
    bot: FINANCE,
    day: "Tuesday",
    at: "11:05",
    text: "Ackworth 2318 paid, 900.00. Under the threshold, receipt filed against the contract.",
  },
  {
    bot: LEGAL,
    day: "Tuesday",
    at: "11:06",
    text: "No change to terms on that one. Nothing needed from me.",
  },
  {
    bot: PM,
    day: "Tuesday",
    at: "11:08",
    text: "Under 4,000, so nothing from me either. Good.",
  },
];

const INVOICE_TODAY: {
  bot: { name: string; color: string };
  at: string;
  text: string;
}[] = [
  {
    bot: FINANCE,
    at: "09:36",
    text: "Northwind 4471 is settled at 4,150.00 - 650.00 under the invoice, paid inside seven days.",
  },
  {
    bot: LEGAL,
    at: "09:36",
    text: "Picking this up. Seven day settlement changes the payment clause, so I will read the revised terms before it is filed.",
  },
  {
    bot: PM,
    at: "09:37",
    text: "Noted. That is over 4,000, so I am moving the 650.00 into this quarter's forecast now.",
  },
  {
    bot: LEGAL,
    at: "09:38",
    text: "Terms are fine, nothing to flag. Filed against the Northwind contract and closed off.",
  },
];

const ROUTINE = "Inbox watch";
const REPORT = (
  <>
    Cool, that is sent. I have put the numbers in <Mention>#invoices</Mention>{" "}
    so Legal and PM can pick it up.
  </>
);

/** The strip a message wears when the conversation carries on somewhere else.
 *  The app's own: a pill on a hairline, an arrow, the name, and what is in it.
 *  Pressing it is how you follow the work. */
function RoomStrip({
  name,
  says,
  lit,
  innerRef,
}: {
  name: string;
  says: string;
  lit?: boolean;
  innerRef?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <span
      ref={innerRef}
      className={`mt-[5px] inline-flex max-w-full items-center gap-[7px] rounded-pill border border-line py-[5px] pl-2 pr-[11px] text-[12.5px] transition-colors ${
        lit ? "bg-hover text-fg" : "text-fg-2"
      }`}
    >
      <span className="grid place-items-center text-fg-2">
        <Icon name="hash" className="h-[13px] w-[13px]" />
      </span>
      <span className="truncate text-fg">{name}</span>
      <span className="truncate">{says}</span>
    </span>
  );
}

const REPLY =
  "They will take 4,150 if we settle inside seven days - 650 off. I have the reply written and I have not sent it.";
const ASK_Q = "Send the acceptance to Northwind?";

/** What was already in this chat before today. A bot you have had for a while
 *  has a history, and the routine reads as something you set up rather than
 *  something that appeared. */
const EARLIER: {
  day: string;
  who: string;
  when: string;
  text: string;
  me?: boolean;
  shot?: boolean;
}[] = [
  {
    day: "Wednesday",
    who: "You",
    when: "10:02",
    me: true,
    text: "New one. You are going to be Finance - supplier invoices, mostly.",
  },
  {
    day: "Wednesday",
    who: "Finance",
    when: "10:02",
    text: "Understood. Give me the mailbox and I will read everything that lands in it.",
  },
  {
    day: "Wednesday",
    who: "You",
    when: "10:04",
    me: true,
    text: "accounts@ - and I have put you in #invoices with PM and Legal.",
  },
  {
    day: "Wednesday",
    who: "Finance",
    when: "10:05",
    text: "Introduced myself in there. PM wants the numbers posted, Legal wants the terms.",
  },
  {
    day: "Thursday",
    who: "Finance",
    when: "09:14",
    text: "Brightwell want 1,240.00. That is more than I would settle without asking - can I try them on an early payment discount?",
  },
  { day: "Thursday", who: "You", when: "09:40", me: true, text: "Go on then." },
  {
    day: "Thursday",
    who: "Finance",
    when: "15:50",
    text: "They took 60.00 off for paying inside the week. Paid and filed.",
  },
  {
    day: "Monday",
    who: "You",
    when: "09:02",
    me: true,
    text: "Morning. Can you take the supplier invoices off me entirely?",
  },
  {
    day: "Monday",
    who: "Finance",
    when: "09:03",
    text: "Happy to. Point me at the mailbox and tell me where the line is.",
  },
  {
    day: "Monday",
    who: "You",
    when: "16:20",
    me: true,
    text: "Watch the inbox for invoices. Try to get them down before you bring them to me.",
  },
  {
    day: "Monday",
    who: "Finance",
    when: "16:21",
    text: "Set up as a routine. I will flag anything over 1,000 and settle the rest myself.",
  },
  {
    day: "Tuesday",
    who: "Finance",
    when: "11:05",
    text: "Ackworth invoiced 900. Under the threshold, so I paid it and filed the receipt.",
    shot: true,
  },
];

const TICK = 60;

/** The cues, in milliseconds. Written out rather than spaced by a formula:
 *  the fifth bot has to still be mid-sentence when the pointer reaches the
 *  fourth one's update, and an even rhythm cannot do that. */
const SAYS: { typing: number; said: number }[] = [
  { typing: 1400, said: 2500 },
  { typing: 3200, said: 4300 },
  { typing: 5000, said: 6100 },
  { typing: 6800, said: 8100 },
  // Sable is still typing while we leave the room, which is the point.
  { typing: 8900, said: 99999 },
  { typing: 99999, said: 99999 },
];

const T = {
  ask: 500,
  /** The pointer arrives while the fifth bot is still going. */
  pointer: 9300,
  overUpdate: 10100,
  clickUpdate: 11100,
  /** 800ms of pressed state before anything moves, or the click reads as a
      glitch rather than as a click. */
  bot: 11900,
  overMonitor: 12800,
  clickMonitor: 13800,
  /** The computer, mid-negotiation. */
  pane: 14600,
  write: 15900,
  writeDone: 19900,
  shot: 20500,
  desk: 21500,
  /** You answer it, and it goes and tells the others. */
  overAccept: 22600,
  clickAccept: 23600,
  accepted: 24400,
  /** The button goes down, then the mail leaves. Without the beat between them
      the send is something you are told about rather than something you see. */
  sent: 25300,
  reported: 26200,
  /** Following the link, rather than the room simply appearing. */
  overStrip: 27500,
  clickStrip: 28500,
  /** Into #invoices, where the report lands and the room picks it up. */
  back: 29300,
  hand: (n: number) => 29700 + n * 1700,
  loop: 40500,
};

/* ------------------------------------------------------------------ icons */
/* The app's own, straight out of the sprite in index.html. */
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
  bell: (
    <>
      <path d="M18 8.5a6 6 0 0 0-12 0c0 6.5-2.5 8-2.5 8h17s-2.5-1.5-2.5-8z" />
      <path d="M13.7 20a2 2 0 0 1-3.4 0" />
    </>
  ),
  expand: <path d="M9 3H3v6M15 21h6v-6M21 9V3h-6M3 15v6h6" />,
  power: (
    <>
      <path d="M12 3v9" />
      <path d="M6.3 6.3a8 8 0 1 0 11.4 0" />
    </>
  ),
  close: <path d="M18 6 6 18M6 6l12 12" />,
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

/** The app's svg defaults: 18px, 1.7 stroke, round caps and joins, no fill. */
function Icon({
  name,
  className = "h-[18px] w-[18px]",
}: {
  name: string;
  className?: string;
}) {
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

/* ------------------------------------------------------------------ thread */

/** A row in the thread. Flush with the one above unless it starts a run, in
 *  which case it gets the air and the name. */
function Turn({
  head,
  gutter,
  who,
  when,
  lit,
  innerRef,
  children,
}: {
  head: boolean;
  gutter: React.ReactNode;
  who?: string;
  when?: string;
  /** Under the pointer: the app tints a row on hover and this is that. */
  lit?: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={innerRef}
      className={`flex w-full max-w-full items-start gap-3 rounded-[6px] py-px pl-[10px] pr-[14px] transition-colors ${
        head ? "mt-[15px]" : ""
      } ${lit ? "bg-fill-2" : ""}`}
    >
      <div className="grid w-[34px] flex-none place-items-center pt-0.5">
        {gutter}
      </div>
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

/** The rule between one day and the next: a label with a line either side of
 *  it. The app's own measurements, and its own words - Today, Yesterday, then
 *  the day's name. */
function DayLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-5 flex select-none items-center gap-3 text-[11px] font-semibold tracking-[0.02em] text-fg-3 first:mt-0.5">
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** You, in the gutter: the app draws an initial on --active rather than a face. */
function You() {
  return (
    <span className="grid h-7 w-7 place-items-center rounded-full bg-active text-[12.5px] font-semibold text-fg">
      ·
    </span>
  );
}

/** Somebody is mid-turn. Three dots on the app's fill, in the gutter's lane. */
function Typing({ bot }: { bot: { name: string; color: string } }) {
  return (
    <div className="mt-[15px] flex w-full items-start gap-3 py-px pl-[10px] pr-[14px]">
      <div className="grid w-[34px] flex-none place-items-center pt-0.5">
        <BotFace name={bot.name} color={bot.color} size={34} mood="think" />
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-2 pt-1">
        <span className="text-[13.5px] font-semibold text-fg">{bot.name}</span>
        <span className="flex items-end gap-[3px] pb-[3px]">
          {[0, 1, 2].map((n) => (
            <span
              key={n}
              className="h-[5px] w-[5px] animate-pulse rounded-full bg-fg-3"
              style={{ animationDelay: `${n * 160}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------- the bot's own computer */

/** The mail client the bot is working in, as a real window on that desktop:
 *  light, because a mail client is, which is also what makes it read as a
 *  separate machine rather than more of the app. Drawn at the size it is shown
 *  at - the detail is what makes a 320px picture read as software. */
type Mail = {
  chrome: string;
  subject: string;
  thread: {
    from: string;
    initial: string;
    tint: string;
    at: string;
    text: string;
    lit?: boolean;
  }[];
  /** The reply it has written. Absent once there is nothing left to send. */
  reply?: { to: string; text: string; held: boolean };
  /** Or a strip saying the job is closed. */
  done?: string;
  /** Mid-send: the button is down and the label has changed. */
  sending?: boolean;
};

const NORTHWIND: Mail = {
  chrome: "Inbox (3) - accounts@ourcompany.com",
  subject: "Invoice 4471 - 4,800.00 due on receipt",
  reply: {
    to: "accounts@northwind.example",
    text: "That works - we will settle at 4,150.00 this week. Thank you.",
    held: false,
  },
  thread: [
    {
      from: "Northwind Supply",
      initial: "N",
      tint: "#d93025",
      at: "09:02",
      text: "Please find invoice 4471 attached, 4,800.00, payable on receipt.",
    },
    {
      from: "Finance",
      initial: "F",
      tint: "#1a73e8",
      at: "09:18",
      text: "We can settle this week rather than on 30 days. Is there a number that works better for both of us?",
    },
    {
      from: "Northwind Supply",
      initial: "N",
      tint: "#d93025",
      at: "09:31",
      text: "We can do 4,150.00 if payment clears within 7 days. Revised invoice attached.",
      lit: true,
    },
  ],
};

/** The one from Tuesday, which never needed you: under the threshold, paid,
 *  filed. It is the same window and the same routine, finishing on its own. */
const ACKWORTH: Mail = {
  chrome: "Inbox (1) - accounts@ourcompany.com",
  subject: "Invoice 2318 - 900.00 for March hosting",
  done: "Paid 900.00 - receipt filed to Money",
  thread: [
    {
      from: "Ackworth Ltd",
      initial: "A",
      tint: "#e8710a",
      at: "10:41",
      text: "Invoice 2318 attached for March hosting, 900.00, 14 day terms.",
    },
    {
      from: "Finance",
      initial: "F",
      tint: "#1a73e8",
      at: "11:03",
      text: "Under our threshold, so I have settled it today and filed the receipt.",
      lit: true,
    },
  ],
};

/** The moment you say yes: the same draft, with the button down. */
const NORTHWIND_SENDING: Mail = { ...NORTHWIND, sending: true };

/** And after: the compose is gone, the reply is the newest thing in the
 *  thread, and the strip says what it cost. */
const NORTHWIND_SENT: Mail = {
  ...NORTHWIND,
  reply: undefined,
  done: "Sent - 4,150.00 agreed, 650.00 saved",
  thread: [
    ...NORTHWIND.thread.map((m) => ({ ...m, lit: false })),
    {
      from: "Finance",
      initial: "F",
      tint: "#1a73e8",
      at: "09:35",
      text: "That works - we will settle at 4,150.00 this week. Thank you.",
      lit: true,
    },
  ],
};

function MailWindow({ mail, held = false }: { mail: Mail; held?: boolean }) {
  const thread = mail.thread;

  return (
    <div className="absolute left-[3%] top-[4.5%] flex h-[84%] w-[94%] flex-col overflow-hidden rounded-[6px] bg-white shadow-[0_12px_34px_rgba(0,0,0,.6)] ring-1 ring-black/25">
      {/* window chrome */}
      <div className="flex flex-none items-center gap-1.5 border-b border-black/10 bg-[#f1f3f4] px-1.5 py-[3px]">
        <span className="flex gap-[3px]" aria-hidden="true">
          {["bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]"].map((d) => (
            <span key={d} className={`h-[5px] w-[5px] rounded-full ${d}`} />
          ))}
        </span>
        <span className="ml-1 truncate text-[6px] font-medium text-black/45">
          {mail.chrome}
        </span>
      </div>

      {/* the mail app's own header */}
      <div className="flex flex-none items-center gap-1.5 border-b border-black/[0.08] bg-white px-1.5 py-1">
        <span className="flex flex-col gap-[1.5px]" aria-hidden="true">
          {[0, 1, 2].map((n) => (
            <span key={n} className="h-[1px] w-[7px] rounded bg-black/40" />
          ))}
        </span>
        <span className="text-[7px] font-semibold tracking-tight text-[#d93025]">
          M
        </span>
        <span className="text-[7px] font-medium text-black/60">Mail</span>
        <span className="ml-1 flex min-w-0 flex-1 items-center gap-1 rounded-full bg-[#eaf1fb] px-1.5 py-[2px]">
          <svg
            viewBox="0 0 24 24"
            className="h-[6px] w-[6px] text-black/40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="truncate text-[6px] text-black/35">Search mail</span>
        </span>
        <span className="grid h-[9px] w-[9px] flex-none place-items-center rounded-full bg-[#1a73e8] text-[5px] font-semibold text-white">
          F
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* labels */}
        <div className="hidden w-[54px] flex-none flex-col gap-[2px] border-r border-black/[0.06] bg-white p-1 @min-[1200px]:flex">
          <span className="mb-1 inline-flex items-center gap-1 self-start rounded-full bg-[#c2e7ff] px-1.5 py-[2px] text-[6px] font-medium text-[#001d35]">
            <svg
              viewBox="0 0 24 24"
              className="h-[6px] w-[6px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Compose
          </span>
          {[
            { l: "Inbox", n: "3", on: true },
            { l: "Starred", n: "" },
            { l: "Snoozed", n: "" },
            { l: "Sent", n: "" },
            { l: "Drafts", n: "1" },
          ].map((row) => (
            <span
              key={row.l}
              className={`flex items-center justify-between rounded-r-full py-[2px] pl-1.5 pr-1 text-[6px] ${
                row.on
                  ? "bg-[#d3e3fd] font-semibold text-[#041e49]"
                  : "text-black/55"
              }`}
            >
              {row.l}
              {row.n && <span className="text-[5.5px]">{row.n}</span>}
            </span>
          ))}
          <span className="mt-1 border-t border-black/[0.06] pt-1 text-[5.5px] text-black/35">
            Labels
          </span>
          {[
            { l: "Suppliers", c: "#e8710a" },
            { l: "Paid", c: "#188038" },
          ].map((row) => (
            <span
              key={row.l}
              className="flex items-center gap-1 py-[1px] pl-1.5 text-[6px] text-black/55"
            >
              <span
                className="h-[4px] w-[4px] rounded-full"
                style={{ background: row.c }}
              />
              {row.l}
            </span>
          ))}
        </div>

        {/* the thread */}
        <div className="flex min-w-0 flex-1 flex-col bg-white">
          <div className="flex flex-none items-center gap-1 border-b border-black/[0.06] px-1.5 py-1">
            {["m9 14-4-4 4-4", "M4 7h16M7 11h10M9 15h6"].map((d, n) => (
              <svg
                key={n}
                viewBox="0 0 24 24"
                className="h-[7px] w-[7px] text-black/35"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d={d} />
              </svg>
            ))}
            <span className="ml-auto text-[5.5px] text-black/35">1 of 12</span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden px-1.5 pt-1.5">
            <div className="mb-1 flex items-center gap-1">
              <p className="min-w-0 flex-1 truncate text-[8px] font-normal text-black/85">
                {mail.subject}
              </p>
              <span className="flex-none rounded-[2px] bg-black/[0.06] px-1 text-[5.5px] text-black/45">
                Inbox
              </span>
            </div>

            <div className="space-y-[3px]">
              {thread.map((m) => (
                <div
                  key={m.at}
                  className={`flex gap-1 rounded-[3px] p-1 ${
                    m.lit
                      ? "bg-[#e8f0fe] ring-1 ring-[#1a73e8]/25"
                      : "bg-[#f6f8fc]"
                  }`}
                >
                  <span
                    className="grid h-[10px] w-[10px] flex-none place-items-center rounded-full text-[5.5px] font-semibold text-white"
                    style={{ background: m.tint }}
                  >
                    {m.initial}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-1">
                      <span className="truncate text-[6.5px] font-semibold text-black/75">
                        {m.from}
                      </span>
                      <span className="ml-auto flex-none text-[5.5px] text-black/35">
                        {m.at}
                      </span>
                    </span>
                    <span className="mt-[1px] block text-[6.5px] leading-[1.35] text-black/55">
                      {m.text}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* the reply it has written and has not sent - or, when there was
              nothing to ask, the strip saying it finished by itself */}
          {mail.reply ? (
            <div className="flex-none border-t border-black/[0.07] bg-white p-1.5">
              <div className="rounded-[4px] border border-black/10 shadow-[0_1px_3px_rgba(0,0,0,.08)]">
                <p className="border-b border-black/[0.06] px-1 py-[2px] text-[6px] text-black/35">
                  To: {mail.reply.to}
                </p>
                <p className="px-1 pb-1 pt-[3px] text-[6.5px] leading-[1.35] text-black/70">
                  {mail.reply.text}
                </p>
                <div className="flex items-center gap-1 border-t border-black/[0.06] px-1 py-[3px]">
                  <span
                    className={`rounded-full px-2 py-[2px] text-[6px] font-medium text-white transition-transform ${
                      mail.sending
                        ? "scale-95 bg-[#083c94]"
                        : held
                          ? "bg-black/25"
                          : "bg-[#0b57d0]"
                    }`}
                  >
                    {mail.sending ? "Sending" : "Send"}
                  </span>
                  {["B", "I", "U"].map((g) => (
                    <span
                      key={g}
                      className="text-[5.5px] font-semibold text-black/30"
                    >
                      {g}
                    </span>
                  ))}
                  <span className="ml-auto text-[5.5px] text-black/35">
                    {mail.sending
                      ? "sending..."
                      : held
                        ? "held for approval"
                        : "draft saved"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-none items-center gap-1 border-t border-black/[0.07] bg-[#e6f4ea] px-1.5 py-[5px]">
              <svg
                viewBox="0 0 24 24"
                className="h-[7px] w-[7px] text-[#188038]"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m4.5 12.5 5 5 10-11" />
              </svg>
              <span className="text-[6px] font-medium text-[#188038]">
                {mail.done}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** A screenshot a bot took of its own screen, as it lands in the chat: the
 *  desktop it was looking at, and one line saying what came of it. */
function ShotCard({
  mail,
  held = false,
  label,
  when,
}: {
  mail: Mail;
  held?: boolean;
  label: React.ReactNode;
  when: string;
}) {
  return (
    <div className="mt-2 w-full max-w-[300px] overflow-hidden rounded-card border border-line bg-field">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <BotDesktop
          bot={FINANCE}
          task="Mail - Chromium"
          at="09:34"
          day="Fri 12 Sep"
        >
          <MailWindow mail={mail} held={held} />
        </BotDesktop>
      </div>
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <Icon name="monitor" className="h-3.5 w-3.5 text-fg-3" />
        <span className="truncate text-[11.5px] text-fg-2">{label}</span>
        <span className="ml-auto flex-none text-[11px] text-fg-3">{when}</span>
      </div>
    </div>
  );
}

const TAUGHT = [
  { name: "Reply to an invoice", frames: 34 },
  { name: "File the receipt", frames: 21 },
];

/** The computer, docked as a third column the way the app opens it: "a docked
 *  third column rather than an overlay, so the desktop and the conversation are
 *  visible at once - you watch the bot work while you talk." */
function ScreenPane({
  working,
  mail,
  held,
}: {
  working: boolean;
  mail: Mail;
  held: boolean;
}) {
  return (
    <aside
      className="relative hidden min-h-0 min-w-0 flex-col overflow-hidden border-l border-line bg-main @min-[960px]:flex"
      /* The same wash the settings column wears, for the same reason: this is
         one bot's machine, and the column should say whose without being read.
         168 degrees, and the accent is the bot's own colour. */
      style={{
        backgroundImage: `linear-gradient(168deg, color-mix(in srgb, ${FINANCE.color} 28%, transparent), color-mix(in srgb, ${FINANCE.color} 10%, transparent) 34%, color-mix(in srgb, ${FINANCE.color} 4%, transparent) 100%)`,
      }}
    >
      <header className="flex flex-none items-center gap-2 border-b border-line pb-[10px] pl-[14px] pr-[10px] pt-3">
        <span className="flex min-w-0 flex-1 items-center gap-[9px] text-[15px] font-semibold text-fg">
          <BotFace name={FINANCE.name} color={FINANCE.color} size={22} still />
          <span className="truncate">Finance&rsquo;s computer</span>
        </span>
        <span
          className={`flex-none rounded-pill px-[9px] py-0.5 text-[12.5px] ${
            working ? "bg-green text-black" : "bg-fill-2 text-fg-2"
          }`}
        >
          {working ? "Working" : "Idle"}
        </span>
        <span className="flex flex-none items-center gap-1.5">
          <span className="inline-flex h-7 items-center gap-1.5 rounded-pill border border-line bg-fill-2 px-[11px] text-[12.5px] font-medium text-fg-2">
            <Icon name="eye" className="h-3.5 w-3.5" />
            View only
          </span>
          {["expand", "power", "close"].map((name) => (
            <span
              key={name}
              className="grid h-7 w-7 place-items-center rounded-chip text-fg-2"
            >
              <Icon name={name} />
            </span>
          ))}
        </span>
      </header>

      <div className="min-h-0 flex-1 px-3 pt-3">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-control bg-[#07070a]">
          <BotDesktop
            bot={FINANCE}
            task="Mail - Chromium"
            at="09:34"
            day="Fri 12 Sep"
          >
            <MailWindow mail={mail} held={held} />
          </BotDesktop>
        </div>
      </div>

      <p className="flex-none px-3 pb-[10px] pt-[7px] text-center text-[12.5px] text-fg-3">
        Its own machine. Take over whenever you want to.
      </p>

      {/* What this one has been shown how to do, and can be asked to do again. */}
      <div className="min-h-0 flex-none overflow-hidden px-3 pb-3 pt-1">
        <p className="mb-1.5 text-[11px] font-medium text-fg-2">Taught</p>
        {TAUGHT.map((task) => (
          <div
            key={task.name}
            className="flex w-full items-center gap-2 rounded-control px-2 py-[7px]"
          >
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-fg">
              {task.name}
            </span>
            <span className="flex-none text-[11px] text-fg-3">
              {task.frames} frames
            </span>
            <span className="flex-none rounded-chip bg-fill-2 px-2 py-0.5 text-[11px] font-medium text-fg-2">
              Run
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ window */

export default function HeroWindow({
  className = "",
  still = false,
}: {
  className?: string;
  /** Show the last frame and leave it there. The page draws this window twice,
   *  and two copies of the same loop playing in step is a distraction, so only
   *  the hero's runs. */
  still?: boolean;
}) {
  // Start on the last frame: the server renders the finished scene, so a page
  // that never runs the clock - reduced motion, no JS - shows a conversation
  // rather than an empty window, and the client's first render matches it.
  const [clock, setClock] = useState(T.loop - 1);

  const winRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLSpanElement>(null);
  const monitorRef = useRef<HTMLSpanElement>(null);
  const acceptRef = useRef<HTMLSpanElement>(null);
  const stripRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (still) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // No reset needed: one tick past the end wraps to the start on its own.
    const id = window.setInterval(
      () => setClock((now) => (now + TICK) % T.loop),
      TICK,
    );
    return () => window.clearInterval(id);
  }, [still]);

  const through = (from: number, to: number) =>
    Math.min(1, Math.max(0, (clock - from) / (to - from)));

  /* ---- which room we are in, and what is open */
  const inRoom = clock < T.bot || clock >= T.back;
  const paneOpen = clock >= T.pane && clock < T.back;

  /* ---- act one: the standup */
  const asked = clock >= T.ask;
  const saidCount = UPDATES.filter((_, n) => clock >= SAYS[n].said).length;
  const typingIndex = UPDATES.findIndex(
    (_, n) => clock >= SAYS[n].typing && clock < SAYS[n].said,
  );

  /* ---- act two and three: the pointer.
     Where it goes is measured off the real elements rather than written down
     as percentages: the thread is anchored to the bottom, so which row sits
     where depends on how many have arrived and how tall the window is, and a
     number that is right at one size is wrong at every other. */
  const aim =
    clock >= T.pointer && clock < T.pane + 700
      ? clock < T.overUpdate
        ? "rest"
        : clock < T.bot
          ? "update"
          : "monitor"
      : clock >= T.overAccept && clock < T.accepted + 600
        ? "accept"
        : clock >= T.overStrip && clock < T.back
          ? "strip"
          : null;
  const clicking =
    (clock >= T.clickUpdate && clock < T.bot) ||
    (clock >= T.clickMonitor && clock < T.pane) ||
    (clock >= T.clickAccept && clock < T.accepted) ||
    (clock >= T.clickStrip && clock < T.back);

  /* The cursor is placed from the measured box of its target. Written to the
     node rather than held in state: it is one element moving, there is nothing
     for React to re-render, and it keeps the tick cheap.

     The window is scaled by the page, so getBoundingClientRect returns scaled
     pixels while `left`/`top` are set in the window's own unscaled space -
     hence dividing by the ratio between the two. */
  useEffect(() => {
    const cursor = cursorRef.current;
    const win = winRef.current;
    if (!cursor || !win || !aim) return;
    const target =
      aim === "rest"
        ? restRef.current
        : aim === "update"
          ? avatarRef.current
          : aim === "accept"
            ? acceptRef.current
            : aim === "strip"
              ? stripRef.current
              : monitorRef.current;
    if (!target) return;

    const w = win.getBoundingClientRect();
    const box = target.getBoundingClientRect();
    const scale = win.offsetWidth ? w.width / win.offsetWidth : 1;
    // Every target is a small thing now - a face, an icon, a pill - so the
    // cursor lands in the middle of it.
    cursor.style.left = `${(box.left - w.left) / scale + box.width / 2}px`;
    cursor.style.top = `${(box.top - w.top) / scale + box.height / 2}px`;
  }, [aim]);

  /* ---- act four and five: the turn, on its own computer */
  const words = REPLY.split(" ");
  const said =
    clock < T.write
      ? 0
      : Math.round(words.length * through(T.write, T.writeDone));
  const shot = clock >= T.shot;
  // It sits on your desk only while it is waiting on you.
  const onDesk = clock >= T.desk && clock < T.accepted;
  const accepted = clock >= T.accepted;
  const sending = accepted && clock < T.sent;
  /* What is on the screen: the draft it is holding, the moment it goes, or the
     thread with the reply in it. */
  const screen = sending
    ? NORTHWIND_SENDING
    : clock >= T.sent
      ? NORTHWIND_SENT
      : NORTHWIND;
  const reported = clock >= T.reported;
  // What the room has not read yet, once it has been told.
  const roomTold = clock >= T.reported;
  // Which room is open. The last act is #invoices, not the standup.
  const room = clock >= T.back ? "invoices" : "standup";
  const openRoom = room;
  const handed = INVOICE_TODAY.filter((_, n) => clock >= T.hand(n)).length;
  const busy = clock >= T.bot && clock < T.writeDone;

  const mood = busy ? (clock < T.write ? "work" : "write") : undefined;

  return (
    <div
      ref={winRef}
      className={`app-ui @container relative overflow-hidden rounded-sheet border border-line bg-main shadow-[0_30px_90px_rgba(0,0,0,.55)] ${className}`}
    >
      <div
        className="grid h-full [grid-template-columns:var(--cols)] @min-[620px]:[grid-template-columns:var(--cols-rooms)] @min-[960px]:[grid-template-columns:var(--cols-wide)] @min-[1200px]:[grid-template-columns:var(--cols-wider)] @min-[1400px]:[grid-template-columns:var(--cols-widest)]"
        style={
          {
            "--cols": "92px minmax(0,1fr)",
            "--cols-rooms": inRoom
              ? "92px 230px minmax(0,1fr)"
              : "92px minmax(0,1fr)",
            /* The computer takes the room, not the conversation: what you are
               watching is the screen, and the thread beside it only has to be
               wide enough to read. It steps up as the window can spare it. */
            "--cols-wide": inRoom
              ? "92px 230px minmax(0,1fr)"
              : paneOpen
                ? "92px minmax(0,1fr) 500px"
                : "92px minmax(0,1fr)",
            "--cols-wider": inRoom
              ? "92px 230px minmax(0,1fr)"
              : paneOpen
                ? "92px minmax(0,1fr) 600px"
                : "92px minmax(0,1fr)",
            "--cols-widest": inRoom
              ? "92px 230px minmax(0,1fr)"
              : paneOpen
                ? "92px minmax(0,1fr) clamp(680px, 44%, 1000px)"
                : "92px minmax(0,1fr)",
          } as React.CSSProperties
        }
      >
        {/* ---- the rail: 92px, faces and nothing else.
             The app hides every name in here (`.sidebar .bot-row__body`) - a
             rail of identical hashes could not say which room was which, so
             the names moved to the column beside it. */}
        <aside className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto_auto_auto] overflow-hidden border-r border-line bg-floor px-2 pb-2.5 pt-2.5">
          {/* The mark, top left, where every application puts the thing you are
              looking at. */}
          <div className="grid h-[46px] flex-none place-items-center pb-1">
            <BrandMark className="h-7 w-7" />
          </div>

          <div className="min-h-0 space-y-1 overflow-hidden">
            {/* Above everything, and only ever one row: not a channel and not a
                bot, but the pile on your side of the table. */}
            <div
              className={`relative grid h-[44px] place-items-center rounded-card ${
                onDesk ? "bg-fill-1" : ""
              }`}
              title="Your desk"
            >
              <Icon name="bell" className="h-[18px] w-[18px] text-fg-2" />
              {onDesk && (
                <span className="absolute right-1.5 top-1.5 grid h-[19px] min-w-[19px] place-items-center rounded-pill bg-amber px-1.5 text-[11px] font-semibold leading-none text-white">
                  1
                </span>
              )}
            </div>

            {/* A server tile: initials in its own colour, because a hash would
                say the same thing for every one of them. */}
            <div
              className={`relative grid h-[44px] place-items-center rounded-card ${
                inRoom ? "bg-active" : ""
              }`}
              title="The workshop"
            >
              <span className="grid h-[30px] w-[30px] place-items-center rounded-chip bg-[#5865f2] text-[11px] font-semibold text-white">
                TW
              </span>
              {roomTold && (
                <span className="absolute right-1.5 top-1.5 grid h-[19px] min-w-[19px] place-items-center rounded-pill bg-red px-1.5 text-[11px] font-semibold leading-none text-white">
                  1
                </span>
              )}
            </div>

            {/* The rule between the servers and the bots. 46 by 2, the app's
                own measurements. */}
            <div className="mx-auto mb-2.5 mt-3 h-0.5 w-[46px] rounded-[1px] bg-line" />

            {ROSTER.map((bot) => {
              const active = !inRoom && bot.name === FINANCE.name;
              return (
                <div
                  key={bot.name}
                  className={`grid h-[44px] place-items-center rounded-card ${active ? "bg-active" : ""}`}
                  title={bot.name}
                >
                  <BotFace
                    name={bot.name}
                    color={bot.color}
                    size={34}
                    mood={active && mood ? mood : undefined}
                  />
                </div>
              );
            })}
          </div>

          {/* 46 by 2, six either side - the rail's own rule. */}
          <div
            className="mx-auto my-1.5 h-0.5 w-[46px] rounded-[1px] bg-line"
            aria-hidden="true"
          />

          {/* Making a bot, at the foot of the rail rather than gone from it:
              a thing you do occasionally belongs below the list of things you
              already have. Centred, with four points under it. */}
          <div className="mb-1 grid place-items-center">
            <span
              className="grid h-[46px] w-[46px] place-items-center rounded-[14px] text-fg-2"
              title="New bot or server"
            >
              <Icon name="plus" className="h-5 w-5" />
            </span>
          </div>

          <div className="grid place-items-center pt-1">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-field text-[12px] font-semibold text-fg-2">
              ·
            </span>
          </div>
        </aside>

        {/* ---- the rooms: 230px, and only while you are in a server.
             "The narrow column is what you are in, the one beside it is what is
             in it." */}
        {inRoom && (
          <aside className="hidden min-h-0 min-w-0 flex-col overflow-hidden border-r border-line bg-floor px-2 pb-2.5 @min-[620px]:flex">
            {/* The server's own colour, washed across the top of its column. */}
            <div
              className="-mx-2 mb-1 flex items-center gap-1 px-3 pb-2.5 pt-3"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in srgb, #5865f2 26%, transparent), transparent)",
              }}
            >
              <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-fg">
                The workshop
              </span>
              <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-chip text-fg-2">
                <Icon name="plus" />
              </span>
            </div>

            <div className="mb-2 flex h-[34px] flex-none items-center gap-2 rounded-control bg-field px-[10px] text-fg-3">
              <Icon name="search" />
              <span className="text-[15px]">Search</span>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <p className="mb-1 mt-0.5 px-[10px] text-[11px] font-semibold uppercase tracking-[0.4px] text-fg-3">
                Channels
              </p>
              {ROOMS.map((group) => (
                <div key={group.cat}>
                  <p className="mb-0.5 mt-2 flex items-center gap-1 px-[10px] text-[11px] font-semibold uppercase tracking-[0.4px] text-fg-3">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-[11px] w-[11px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                    {group.cat}
                  </p>
                  {group.rooms.map((room) => (
                    <div
                      key={room.name}
                      className={`flex w-full items-center gap-2 rounded-card px-[10px] py-[7px] ${
                        room.name === openRoom ? "bg-active" : ""
                      }`}
                    >
                      <span className="grid h-[18px] w-[18px] flex-none place-items-center text-fg-2">
                        <Icon name="hash" className="h-[17px] w-[17px]" />
                      </span>
                      <span
                        className={`min-w-0 flex-1 truncate text-[15px] tracking-[-0.01em] ${
                          room.name === openRoom ||
                          room.unread ||
                          (room.name === "invoices" && roomTold)
                            ? "font-semibold text-fg"
                            : "font-medium text-fg-2"
                        }`}
                      >
                        {room.name}
                      </span>
                      {room.name === "invoices" &&
                      roomTold &&
                      openRoom !== "invoices" ? (
                        <span className="grid h-[18px] min-w-[18px] flex-none animate-pulse place-items-center rounded-pill bg-red px-1.5 text-[11px] font-semibold leading-none text-white">
                          1
                        </span>
                      ) : room.badge ? (
                        <span className="grid h-[18px] min-w-[18px] flex-none place-items-center rounded-pill bg-red px-1.5 text-[11px] font-semibold leading-none text-white">
                          {room.badge}
                        </span>
                      ) : (
                        <span className="flex-none text-[12.5px] text-fg-3">
                          {room.when}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* ------------------------------------------------------- the main */}
        <main className="relative flex min-h-0 min-w-0 flex-col overflow-hidden bg-main">
          <header className="relative z-[2] flex h-[44px] flex-none items-center justify-between gap-3 bg-main px-[14px]">
            <div className="flex min-w-0 items-center gap-[9px] text-[15px] font-semibold tracking-[-0.01em] text-fg">
              {inRoom ? (
                <>
                  <span className="grid place-items-center text-fg-2">
                    <Icon name="hash" className="h-[17px] w-[17px]" />
                  </span>
                  <span className="truncate">{openRoom}</span>
                  <span className="ml-1 flex -space-x-1.5">
                    {(openRoom === "invoices" ? INVOICE_MEMBERS : ROOM).map(
                      (b) => (
                        <BotFace
                          key={b.name}
                          name={b.name}
                          color={b.color}
                          size={22}
                          still
                          className="ring-2 ring-[var(--bg-main)]"
                        />
                      ),
                    )}
                  </span>
                </>
              ) : (
                <>
                  <BotFace
                    name={FINANCE.name}
                    color={FINANCE.color}
                    size={22}
                    mood={mood}
                  />
                  <span className="truncate">Finance</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-0.5 text-fg-2">
              {["clock", "plug", "gear", "pin", "phone", "monitor"].map(
                (name) => (
                  <span
                    key={name}
                    ref={name === "monitor" ? monitorRef : undefined}
                    className={`grid h-[30px] w-[30px] place-items-center rounded-chip transition-colors ${
                      name === "monitor" &&
                      (paneOpen ||
                        (aim === "monitor" && clock >= T.overMonitor))
                        ? "bg-fill-3 text-fg"
                        : ""
                    }`}
                  >
                    <Icon name={name} />
                  </span>
                ),
              )}
            </div>
          </header>

          {/* The thread. Rows are flush; the air belongs to the head of a run,
              and it is anchored to the bottom so a new message pushes the rest
              up the way a real transcript does. */}
          <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-1 py-2">
            {inRoom && openRoom === "invoices" ? (
              <>
                {INVOICE_HISTORY.map((m, n) => (
                  <Fragment key={m.at + m.bot.name}>
                    {(n === 0 || INVOICE_HISTORY[n - 1].day !== m.day) && (
                      <DayLine>{m.day}</DayLine>
                    )}
                    <Turn
                      key={m.at + m.bot.name}
                      head
                      who={m.bot.name}
                      when={m.at}
                      gutter={
                        <BotFace
                          name={m.bot.name}
                          color={m.bot.color}
                          size={34}
                          still
                        />
                      }
                    >
                      <p className="text-[15px] leading-[1.5] text-fg">
                        {m.text}
                      </p>
                    </Turn>
                  </Fragment>
                ))}
                <DayLine>Today</DayLine>
                {INVOICE_TODAY.slice(0, handed).map((m, n) => (
                  <Turn
                    key={m.at + m.bot.name + n}
                    head
                    who={m.bot.name}
                    when={m.at}
                    gutter={
                      <BotFace
                        name={m.bot.name}
                        color={m.bot.color}
                        size={34}
                        mood={n === handed - 1 ? "happy" : undefined}
                      />
                    }
                  >
                    <p className="text-[15px] leading-[1.5] text-fg">
                      {m.text}
                    </p>
                  </Turn>
                ))}
                {handed > 0 && handed < INVOICE_TODAY.length && (
                  <Typing bot={INVOICE_TODAY[handed].bot} />
                )}
              </>
            ) : inRoom ? (
              <>
                {ROOM_HISTORY.map((m, n) => (
                  <Fragment key={m.when + m.who + n}>
                    {(n === 0 || ROOM_HISTORY[n - 1].day !== m.day) && (
                      <DayLine>{m.day}</DayLine>
                    )}
                    <Turn
                      key={m.when + m.who}
                      head
                      who={m.who}
                      when={m.when}
                      gutter={
                        m.me ? (
                          <You />
                        ) : (
                          <BotFace
                            name={m.who}
                            color={m.color ?? "#8e8e93"}
                            size={34}
                            still
                          />
                        )
                      }
                    >
                      <p className="text-[15px] leading-[1.5] text-fg">
                        {m.text}
                      </p>
                    </Turn>
                  </Fragment>
                ))}

                <DayLine>Today</DayLine>
                {asked && (
                  <Turn head who="You" when="09:30" gutter={<You />}>
                    <p className="text-[15px] leading-[1.5] text-fg">
                      {ASK_ROOM}
                    </p>
                  </Turn>
                )}
                {UPDATES.slice(0, saidCount).map((u, n) => (
                  <Turn
                    key={u.bot.name}
                    head
                    who={u.bot.name}
                    when={`09:3${n + 1}`}
                    lit={
                      u.bot.name === FINANCE.name &&
                      clock >= T.overUpdate &&
                      clock < T.bot
                    }
                    gutter={
                      u.bot.name === FINANCE.name ? (
                        <span
                          ref={avatarRef}
                          className={`rounded-full transition-shadow ${
                            clock >= T.overUpdate && clock < T.bot
                              ? "shadow-[0_0_0_2px_var(--color-blue)]"
                              : ""
                          }`}
                        >
                          <BotFace
                            name={u.bot.name}
                            color={u.bot.color}
                            size={34}
                          />
                        </span>
                      ) : (
                        <BotFace
                          name={u.bot.name}
                          color={u.bot.color}
                          size={34}
                        />
                      )
                    }
                  >
                    <p className="text-[15px] leading-[1.5] text-fg">
                      {u.text}
                    </p>
                  </Turn>
                ))}
                {typingIndex >= 0 && <Typing bot={UPDATES[typingIndex].bot} />}
              </>
            ) : (
              <>
                {EARLIER.map((m, n) => (
                  <Fragment key={m.when + m.who}>
                    {(n === 0 || EARLIER[n - 1].day !== m.day) && (
                      <DayLine>{m.day}</DayLine>
                    )}
                    <Turn
                      key={m.when + m.who}
                      head
                      who={m.who}
                      when={m.when}
                      gutter={
                        m.me ? (
                          <You />
                        ) : (
                          <BotFace
                            name={FINANCE.name}
                            color={FINANCE.color}
                            size={34}
                            still
                          />
                        )
                      }
                    >
                      <p className="text-[15px] leading-[1.5] text-fg">
                        {m.text}
                      </p>
                      {m.shot && (
                        <ShotCard
                          mail={ACKWORTH}
                          when="11:05"
                          label={
                            <>
                              900.00 paid &middot;{" "}
                              <span className="font-semibold text-green">
                                receipt filed
                              </span>
                            </>
                          }
                        />
                      )}
                    </Turn>
                  </Fragment>
                ))}

                <DayLine>Today</DayLine>

                {/* A routine's turn is a note across the thread, not a message
                    from anyone: it centres, and tints from the bot that ran it. */}
                <div className="mb-1 mt-4 flex justify-center">
                  <span
                    className="inline-flex items-center gap-2 rounded-pill px-[15px] py-[7px] text-[13.5px] font-medium"
                    style={{
                      color: FINANCE.color,
                      background: `color-mix(in srgb, ${FINANCE.color} 15%, transparent)`,
                    }}
                  >
                    <Icon
                      name="clock"
                      className="h-[15px] w-[15px] opacity-80"
                    />
                    Routine &middot; {ROUTINE}
                  </span>
                </div>

                <Turn
                  head
                  who="Finance"
                  when="09:34"
                  gutter={
                    <BotFace
                      name={FINANCE.name}
                      color={FINANCE.color}
                      size={34}
                      mood={mood}
                    />
                  }
                >
                  {said === 0 ? (
                    <p className="flex items-center gap-2 py-0.5 text-[13.5px] text-fg-3">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
                      Negotiating on its computer
                    </p>
                  ) : (
                    <>
                      <p className="text-[15px] leading-[1.5] text-fg">
                        {words.slice(0, said).join(" ")}
                        {said < words.length && (
                          <span className="ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[0.15em] bg-fg-2 align-baseline" />
                        )}
                      </p>

                      {/* What it saw when it got there. */}
                      {shot && (
                        <ShotCard
                          mail={NORTHWIND}
                          held
                          when="09:34"
                          label={
                            <>
                              4,800 &rarr;{" "}
                              <span className="font-semibold text-green">
                                4,150
                              </span>
                            </>
                          }
                        />
                      )}

                      {/* And the thing it will not do without you. */}
                      {(onDesk || accepted) && (
                        <div
                          className={`mt-[7px] ${accepted ? "opacity-70" : ""}`}
                        >
                          <p className="mb-1.5 text-[13.5px] text-fg-2">
                            {ASK_Q}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {/* The one you did not pick is what makes the one
                                you did mean anything, so it stays. */}
                            <span
                              ref={acceptRef}
                              className={`rounded-pill border px-3 py-1.5 text-[13.5px] transition-colors ${
                                accepted
                                  ? "border-blue bg-blue/15 text-fg"
                                  : "border-line bg-fill-1 text-fg"
                              }`}
                            >
                              Send it
                            </span>
                            <span
                              className={`rounded-pill border border-line bg-fill-1 px-3 py-1.5 text-[13.5px] ${
                                accepted ? "text-fg-3" : "text-fg"
                              }`}
                            >
                              Not yet
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </Turn>

                {reported && (
                  <Turn
                    head
                    who="Finance"
                    when="09:36"
                    gutter={
                      <BotFace
                        name={FINANCE.name}
                        color={FINANCE.color}
                        size={34}
                        mood="happy"
                      />
                    }
                  >
                    <p className="text-[15px] leading-[1.5] text-fg">
                      {REPORT}
                    </p>
                    <RoomStrip
                      innerRef={stripRef}
                      name="invoices"
                      says="Finance, Legal, PM"
                      lit={clock >= T.overStrip && clock < T.back}
                    />
                  </Turn>
                )}
              </>
            )}
          </div>

          {/* The dock: the composer, and the send button that is always white */}
          <div
            ref={restRef}
            className="relative flex-none px-[18px] pb-[18px] pt-2"
          >
            <div className="flex items-end gap-2.5 rounded-[26px] bg-field py-[7px] pl-2 pr-[7px]">
              <span className="min-w-0 flex-1 py-2 text-[15px] leading-[1.4] text-fg-3">
                {inRoom ? `Message #${openRoom}` : "Message Finance"}
              </span>
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-[#f2f2f2] text-[#0a0a0a]">
                <Icon name="arrowUp" />
              </span>
            </div>
          </div>
        </main>

        {paneOpen && <ScreenPane working={busy} mail={screen} held={shot} />}
      </div>

      {/* The pointer, for the two moments the scene needs a hand: opening the
          bot whose update mentioned the invoice, and opening its computer. Its
          position is set from the measured target in an effect, so it is on the
          thing it is clicking at every window size. */}
      <span
        ref={cursorRef}
        className={`pointer-events-none absolute z-20 -ml-1 -mt-1 transition-[left,top,opacity] duration-[650ms] ease-out ${
          aim ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {clicking && (
          <span className="absolute -left-3 -top-3 h-9 w-9 animate-ping rounded-full bg-white/30" />
        )}
        <svg
          viewBox="0 0 24 24"
          className={`relative h-6 w-6 drop-shadow-[0_2px_4px_rgba(0,0,0,.6)] transition-transform ${
            clicking ? "scale-90" : ""
          }`}
        >
          <path
            d="M5 2.5 19 12.2l-6.1.6-3.2 5.6z"
            fill="#fff"
            stroke="#000"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}
