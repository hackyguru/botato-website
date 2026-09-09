import { useState } from "react";
import BotFace from "@/components/BotFace";
import type { Template } from "@/data/templates";
import { jsonFor, linkFor } from "@/lib/link";

const NETWORK: Record<Template["network"], string> = {
  full: "Reaches the internet",
  "no-lan": "Internet, not your network",
  offline: "No network",
};

/** Every fifteen minutes and every Friday are the same field in the app and
 *  read nothing alike, so a routine says itself in words. */
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function when(routine: NonNullable<Template["routines"]>[number]): string {
  switch (routine.every) {
    case "hour":
      return "Every hour";
    case "minutes":
      return "Every few minutes";
    case "day":
      return `Every day at ${routine.at}`;
    case "weekday":
      return `Weekdays at ${routine.at}`;
    case "week":
      return `${DAYS[routine.day ?? 1]}s at ${routine.at}`;
    case "once":
      return `Once, at ${routine.at}`;
  }
}

export default function TemplateCard({ template }: { template: Template }) {
  // Which of the two ways of taking it you last asked for. A card that opens
  // its own long paragraph and never closes it turns a gallery into a wall.
  const [showing, setShowing] = useState<"none" | "brief" | "json">("none");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(jsonFor(template));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // A refused clipboard is not worth an error message: the JSON is on
      // screen and can be selected.
      setShowing("json");
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-surface border border-line bg-fill-1 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <BotFace name={template.name} color={template.color} size={44} still />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-medium tracking-[-0.02em] text-fg">{template.name}</h3>
          <p className="mt-1 text-[13px] leading-[1.55] text-fg-2">{template.blurb}</p>
        </div>
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {template.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-chip bg-fill-2 px-2 py-[3px] text-[11px] font-medium text-fg-3"
          >
            {tag}
          </li>
        ))}
      </ul>

      {/* What it is allowed to do, said before you take it rather than found
          in its settings afterwards. */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px] text-fg-3">
        <div>
          <dt className="sr-only">Computer</dt>
          <dd>{template.computer ? "Has a desktop" : "No desktop"}</dd>
        </div>
        <div>
          <dt className="sr-only">Network</dt>
          <dd>{NETWORK[template.network]}</dd>
        </div>
      </dl>

      {template.routines?.length ? (
        <ul className="flex flex-col gap-1.5 border-t border-line pt-4">
          {template.routines.map((routine) => (
            <li key={routine.name} className="flex items-baseline justify-between gap-3 text-[12px]">
              <span className="text-fg-2">{routine.name}</span>
              <span className="shrink-0 text-fg-3">{when(routine)}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {showing === "brief" && (
        <p className="whitespace-pre-wrap rounded-control border border-line bg-fill-1 p-3.5 text-[12.5px] leading-[1.6] text-fg-2">
          {template.role}
        </p>
      )}

      {showing === "json" && (
        <pre className="overflow-x-auto rounded-control border border-line bg-fill-1 p-3.5 text-[11.5px] leading-[1.55] text-fg-2">
          {jsonFor(template)}
        </pre>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <a
          href={linkFor(template)}
          className="rounded-control bg-blue px-4 py-2 text-[13px] font-medium text-white transition-[filter] hover:brightness-[1.08]"
        >
          Add to botato
        </a>
        <button
          type="button"
          onClick={() => setShowing(showing === "brief" ? "none" : "brief")}
          className="rounded-control border border-line bg-fill-2 px-3.5 py-2 text-[13px] font-medium text-fg-2 transition-colors hover:text-fg"
        >
          {showing === "brief" ? "Hide brief" : "Read its brief"}
        </button>
        <button
          type="button"
          onClick={copy}
          className="rounded-control px-2.5 py-2 text-[13px] font-medium text-fg-3 transition-colors hover:text-fg-2"
        >
          {copied ? "Copied" : "Copy JSON"}
        </button>
      </div>
    </div>
  );
}
