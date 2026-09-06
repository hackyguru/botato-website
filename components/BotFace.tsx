/* A bot's face, exactly as the app draws one.
 *
 *  Not a square with a rounded corner any more. The body is a generated
 *  outline — `r(θ) = 1 + Σ harmonics + Σ lobes`, sampled and closed with a
 *  spline — so a cat has ears and a teardrop has a point, and the eye line
 *  comes from the body that came out rather than from the middle of the box.
 *
 *  The CSS in globals.css is a copy of the app's, and blob.ts is a copy of the
 *  app's generator, so a face on this page is the face you would get in the
 *  roster. Traits derive from the name here because on a website the name is
 *  the id. */

import { body, gazeOf, bodyOf } from "@/lib/blob";
import { faceFromName, seedOf, type Face } from "@/lib/face";

type Props = {
  name: string;
  color: string;
  /** The face's width in pixels; every part is a fraction of it. */
  size?: number;
  /** A portrait rather than a creature: no blinking. */
  still?: boolean;
  /** What it is doing this second — think, work, write, happy, talk. Kept
   *  apart from the traits: a trait is what a bot looks like at rest. */
  mood?: string;
  className?: string;
} & Partial<Face>;

export default function BotFace({
  name,
  color,
  size = 34,
  still = false,
  mood,
  className = "",
  ...overrides
}: Props) {
  const face = { ...faceFromName(name), ...prune(overrides) };
  const shape = bodyOf(face.head);
  const drawn = body(shape);
  return (
    <span
      className={`face${still ? " face--still" : ""} ${className}`}
      data-head={shape}
      data-eyes={face.eyes}
      data-brow={face.brow}
      data-mark={face.mark}
      {...(mood ? { "data-mood": mood } : {})}
      role="img"
      aria-label={name}
      style={
        {
          "--u": `${size}px`,
          "--skin": color,
          // Its own blink rhythm, so a row of them does not blink in unison.
          "--beat": `${(seedOf(name) % 1700) / 1000 + 2.2}s`,
          // A teardrop's face sits lower on it than a pebble's does, and a
          // pair of ears is above the eyes rather than level with them.
          "--eye-y": `${drawn.eyeY.toFixed(1)}%`,
          "--eye-gap": `${drawn.eyeGap.toFixed(1)}%`,
          "--gaze": `${gazeOf(shape).toFixed(2)}%`,
        } as React.CSSProperties
      }
    >
      <svg className="face__body" viewBox="0 0 100 100" aria-hidden="true">
        <path d={drawn.d} fill="var(--skin)" />
        <path d={drawn.d} fill="url(#face-lo)" />
        <path d={drawn.d} fill="url(#face-hi)" />
      </svg>
      <span className="face__brows">
        <i />
        <i />
      </span>
      <span className="face__eyes">
        <i />
        <i />
      </span>
      <span className="face__mark" />
      {/* Empty at rest and owned by no trait: whatever a mood wants to put
          above a bot's head lives here. */}
      <span className="face__aura" />
    </span>
  );
}

/** Spreading `{mark: undefined}` over the derived traits would blank them. */
function prune(overrides: Partial<Face>): Partial<Face> {
  return Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => value !== undefined),
  );
}
