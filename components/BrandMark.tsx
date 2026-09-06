import { body } from "@/lib/blob";

/** The botcage mark.
 *
 *  A character in the same family as the bots rather than a logo standing
 *  beside them: the same generated outline, the same two dots, the same light.
 *  Pebble in the tan the app icon is drawn in — what is in the Dock, so the
 *  thing on the page and the thing on the machine are one creature.
 *
 *  It carries its eyes as circles rather than as the spans a bot's face uses,
 *  because it has no moods to animate, and a logo that could blink would be a
 *  logo that could blink at the wrong moment. */

const SHAPE = "pebble";
const SKIN = "#c8a06a";

export default function BrandMark({
  className = "",
  color = SKIN,
}: {
  className?: string;
  color?: string;
}) {
  const drawn = body(SHAPE);
  const eye = (x: number) => (
    <circle cx={x.toFixed(1)} cy={drawn.eyeY.toFixed(1)} r={drawn.eyeR.toFixed(1)} fill="rgba(0,0,0,0.78)" />
  );
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path d={drawn.d} fill={color} />
      <path d={drawn.d} fill="url(#face-lo)" />
      <path d={drawn.d} fill="url(#face-hi)" />
      {eye(50 - drawn.eyeGap)}
      {eye(50 + drawn.eyeGap)}
    </svg>
  );
}
