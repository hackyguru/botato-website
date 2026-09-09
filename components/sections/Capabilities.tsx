import Reveal from "@/components/Reveal";
import { Panel, SectionIntro } from "@/components/Section";
import {
  CallMock,
  ComputerMock,
  FacesMock,
  HandoffMock,
  RoutinesMock,
} from "@/components/mocks";

function Card({
  title,
  body,
  visual,
  delay,
  className = "",
  tall = false,
}: {
  title: string;
  body: React.ReactNode;
  visual: React.ReactNode;
  delay: number;
  className?: string;
  /** A card the width of the grid gets room for a row rather than a column. */
  tall?: boolean;
}) {
  return (
    <Reveal
      delay={delay}
      className={`flex min-w-0 flex-col gap-6 rounded-surface bg-fill-1 p-5 border border-line sm:p-7 ${className}`}
    >
      <div>
        <h3 className="text-xl font-medium tracking-[-0.02em] text-fg sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2.5 text-[14px] leading-[1.6] text-fg-2">{body}</p>
      </div>
      {/* One height for all four where they sit side by side, so the cards line
          up down the grid. In a single column that height is only a floor, or a
          mock taller than 260px loses its last line off the bottom.

          Clipped horizontally because the mocks are drawn at a desk-sized
          width: left to themselves they set the card's width, and a grid item
          is min-width:auto, so one of them ends up deciding how wide the whole
          grid is. */}
      <div
        className={`mt-auto min-w-0 overflow-hidden ${
          tall ? "min-h-[400px] sm:min-h-[360px]" : "min-h-[260px] lg:h-[260px]"
        }`}
      >
        {visual}
      </div>
    </Reveal>
  );
}

export default function Capabilities() {
  return (
    <Panel id="features" tone="panel" className="px-5 py-14 sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          align="center"
          eyebrow="What a bot gets"
          title={
            <>
              More than another
              <br className="hidden sm:block" /> chat window.
            </>
          }
          lede="A computer of its own, a voice, a schedule and a face that shows you what it is doing."
        />

        <div className="mt-12 grid gap-4 sm:mt-16 sm:gap-5 lg:grid-cols-2">
          <Card
            delay={0}
            title="Give it a computer"
            body="A computer of its own, with a browser and a screen you can watch, or take over whenever you want to. Each one looks like a different machine to the sites it visits."
            visual={<ComputerMock />}
          />
          <Card
            delay={80}
            title="Call it. Or call the room."
            body="Hold to talk and a bot listens, thinks and answers out loud, all on this machine. Call a channel and the whole room is on it, one voice at a time."
            visual={<CallMock />}
          />
          <Card
            delay={0}
            title="Routines and stand-ups"
            body="Work a bot does on a schedule, reported back into its chat or a channel. A routine can be a stand-up, where every bot in the room takes a turn."
            visual={<RoutinesMock />}
          />
          <Card
            delay={80}
            title="Every bot has a face"
            body="Every outline is generated from its name rather than picked off a list, so no two look alike and the same name always comes out the same creature. They blink, think with a cloud overhead and slump when a turn fails."
            visual={<FacesMock />}
          />
          <Card
            delay={0}
            className="lg:col-span-2"
            tall
            title="They hand work to each other"
            body="Bots share rooms, so they read what the others said and answer each other rather than only you. One that needs something asks the bot that has it and the work carries on without you in the middle of it."
            visual={<HandoffMock />}
          />
        </div>
      </div>
    </Panel>
  );
}
