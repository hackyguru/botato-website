/* Things a bot wears and carries.
 *
 *  Every head here is a different generated outline, so nothing can be placed
 *  at a fixed height: a hat pinned to y=8 sits on a pebble's crown, floats
 *  above a teardrop and lands between a cat's ears. So the outline is read
 *  back out of the path the generator produced - the end point of each of its
 *  96 cubics is a sample on the edge - and a hat is placed on whatever the
 *  crown turned out to be. The eyes come from the same numbers the face
 *  itself uses, which is how a monocle lands on an eye rather than near one.
 *
 *  Drawn in the same 100x100 box as the body, and rendered inside the face
 *  element, so every mood that moves the head moves these with it. */

import { body, bodyOf, gazeOf } from "@/lib/blob";
import { faceFromName } from "@/lib/face";

type Point = { x: number; y: number };

/** The sample points of a drawn body, read back out of its path. */
function outline(d: string): Point[] {
  const at = /C[-\d.]+ [-\d.]+,[-\d.]+ [-\d.]+,([-\d.]+) ([-\d.]+)/g;
  return [...d.matchAll(at)].map((m) => ({ x: +m[1], y: +m[2] }));
}

/** Where the crown is: the highest point of the edge over the middle of the
 *  head, so a hat sits on the skull and not on an ear. */
function crownOf(pts: Point[]): Point {
  const over = pts.filter((p) => Math.abs(p.x - 50) <= 6);
  return (over.length ? over : pts).reduce((a, b) => (b.y < a.y ? b : a));
}

/** Where the chin is: the lowest point of the edge under the middle of the
 *  head, so a tie hangs off it rather than out of a cheek. */
function chinOf(pts: Point[]): Point {
  const under = pts.filter((p) => Math.abs(p.x - 50) <= 6);
  return (under.length ? under : pts).reduce((a, b) => (b.y > a.y ? b : a));
}

/** Where a hand would be: the widest point of the edge, below the eyes. */
function sideOf(pts: Point[], atY: number): Point {
  const band = pts.filter((p) => Math.abs(p.y - atY) <= 9);
  return (band.length ? band : pts).reduce((a, b) => (b.x > a.x ? b : a));
}

const INK = "rgba(0,0,0,0.28)";

export type Kit = "finance" | "engineer" | "designer" | "legal";

export default function BotProps({ name, kit }: { name: string; kit: Kit }) {
  const shape = bodyOf(faceFromName(name).head);
  const drawn = body(shape);
  const pts = outline(drawn.d);
  const crown = crownOf(pts);
  const hand = sideOf(pts, drawn.eyeY + 12);
  const gaze = gazeOf(shape);
  const eye = { x: 50 + drawn.eyeGap + gaze, y: drawn.eyeY };

  return (
    <svg
      className="face__props"
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      {kit === "designer" && <Designer crown={crown} hand={hand} />}
      {kit === "engineer" && <Engineer crown={crown} hand={hand} />}
      {kit === "legal" && <Legal eye={eye} r={drawn.eyeR} hand={hand} />}
      {kit === "finance" && (
        <Finance
          pts={pts}
          eyeY={drawn.eyeY}
          hand={hand}
          chin={chinOf(pts)}
        />
      )}
    </svg>
  );
}

/** A beret, worn at an angle because that is the only way one is ever worn,
 *  and a brush held up at the side. */
function Designer({ crown, hand }: { crown: Point; hand: Point }) {
  return (
    <>
      <g transform={`rotate(-13 ${crown.x} ${crown.y})`}>
        <ellipse
          cx={crown.x}
          cy={crown.y - 2}
          rx={25}
          ry={9.5}
          fill="#d1495b"
          stroke={INK}
          strokeWidth={1}
        />
        <ellipse cx={crown.x} cy={crown.y + 3.5} rx={18} ry={4} fill="#a2333f" />
        <circle cx={crown.x - 6} cy={crown.y - 11} r={3.2} fill="#e2606f" />
      </g>
      <g transform={`translate(${hand.x - 2} ${hand.y + 4}) rotate(-38)`}>
        <rect x={0} y={-1.8} width={19} height={3.6} rx={1.8} fill="#c8a06a" />
        <rect x={17} y={-2.8} width={5} height={5.6} rx={1.4} fill="#a8a8ad" />
        <path d="M22 -2.8 L30.5 0 L22 2.8 Z" fill="#bf5af2" />
      </g>
    </>
  );
}

/** A hard hat, and a spanner. */
function Engineer({ crown, hand }: { crown: Point; hand: Point }) {
  return (
    <>
      <g>
        <path
          d={`M${crown.x - 20} ${crown.y + 3} A20 19 0 0 1 ${crown.x + 20} ${crown.y + 3} Z`}
          fill="#f0b232"
          stroke={INK}
          strokeWidth={1}
        />
        <rect
          x={crown.x - 1.8}
          y={crown.y - 15}
          width={3.6}
          height={18}
          rx={1.8}
          fill="#c8871a"
        />
        <ellipse
          cx={crown.x}
          cy={crown.y + 3}
          rx={28}
          ry={5}
          fill="#e0a022"
          stroke={INK}
          strokeWidth={1}
        />
      </g>
      <g transform={`translate(${hand.x - 3} ${hand.y + 5}) rotate(-34)`}>
        <rect x={0} y={-2} width={20} height={4} rx={2} fill="#a8a8ad" />
        <path
          fillRule="evenodd"
          d="M23 0 m-7,0 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0 M23 0 m-3.3,0 a3.3,3.3 0 1,0 6.6,0 a3.3,3.3 0 1,0 -6.6,0"
          fill="#a8a8ad"
        />
      </g>
    </>
  );
}

/** A monocle over one eye, on a chain, and a gavel. */
function Legal({ eye, r, hand }: { eye: Point; r: number; hand: Point }) {
  const ring = r + 5.5;
  return (
    <>
      <circle
        cx={eye.x}
        cy={eye.y}
        r={ring}
        fill="rgba(255,255,255,0.14)"
        stroke="#e8e8ea"
        strokeWidth={2.2}
      />
      <path
        d={`M${eye.x + ring - 1} ${eye.y + 3} Q${eye.x + ring + 7} ${eye.y + 16} ${eye.x + ring - 2} ${eye.y + 24}`}
        fill="none"
        stroke="#c9c9ce"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <g transform={`translate(${hand.x - 3} ${hand.y + 6}) rotate(-40)`}>
        <rect x={0} y={-1.9} width={16} height={3.8} rx={1.9} fill="#c8a06a" />
        <rect
          x={14}
          y={-6.6}
          width={9.5}
          height={13.2}
          rx={2.4}
          fill="#8a6a3f"
          stroke={INK}
          strokeWidth={1}
        />
      </g>
    </>
  );
}

/** An accountant's eyeshade, a tie, and a coin. The shade is cut to the width
 *  of whatever head it is sitting on, and the tie hangs off its chin. */
function Finance({
  pts,
  eyeY,
  hand,
  chin,
}: {
  pts: Point[];
  eyeY: number;
  hand: Point;
  chin: Point;
}) {
  const brow = eyeY - 12;
  const band = pts.filter((p) => Math.abs(p.y - brow) <= 10);
  const left = band.length ? Math.min(...band.map((p) => p.x)) : 18;
  const right = band.length ? Math.max(...band.map((p) => p.x)) : 82;
  return (
    <>
      <path
        d={`M${left} ${brow} Q50 ${brow + 24} ${right} ${brow} Z`}
        fill="#2f9e64"
        stroke={INK}
        strokeWidth={1}
      />
      <rect
        x={left - 1}
        y={brow - 5.5}
        width={right - left + 2}
        height={6.5}
        rx={3.2}
        fill="#1c7a4a"
        stroke={INK}
        strokeWidth={1}
      />
      {/* The tie, tucked up under the chin so it reads as worn rather than
          as hanging in the air below the head. */}
      <path
        d={`M45.4 ${chin.y + 3} L54.6 ${chin.y + 3} L56.2 ${chin.y + 10} L50 ${chin.y + 16} L43.8 ${chin.y + 10} Z`}
        fill="#b8323c"
        stroke={INK}
        strokeWidth={0.9}
      />
      <path
        d={`M45.8 ${chin.y - 4} L54.2 ${chin.y - 4} L55.4 ${chin.y + 3.2} L44.6 ${chin.y + 3.2} Z`}
        fill="#8f2730"
        stroke={INK}
        strokeWidth={0.9}
      />
      <g transform={`translate(${hand.x + 2} ${hand.y + 2})`}>
        <circle r={8.5} fill="#f0b232" stroke={INK} strokeWidth={1} />
        <circle r={5.6} fill="none" stroke="#c8871a" strokeWidth={1.3} />
        <rect x={-0.9} y={-4} width={1.8} height={8} rx={0.9} fill="#c8871a" />
      </g>
    </>
  );
}
