import Reveal from "@/components/Reveal";

/* The page is the app's surface ladder, stood on end: the floor is black, and
   every section is a card one or two rungs up it. Contrast comes from the rungs
   rather than from flipping between light and dark. */

export function Panel({
  id,
  tone = "panel",
  className = "",
  children,
}: {
  id?: string;
  /** panel: a surface lifted off the app. main: a shade off the floor.
   *  floor: no card at all - the section stands on the black itself. */
  tone?: "panel" | "main" | "floor";
  className?: string;
  children: React.ReactNode;
}) {
  const tones = {
    panel: "bg-panel border border-line",
    main: "bg-main border border-line",
    floor: "",
  };
  return (
    <section
      id={id}
      className={`scroll-mt-6 overflow-hidden rounded-2xl text-fg sm:rounded-3xl ${tones[tone]} ${className}`}
    >
      {children}
    </section>
  );
}

/** A tiny tracked label above a heading - the page's only all-caps type.
 *  Set in text-3, which is the app's colour for what explains something. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-3">
      {children}
    </p>
  );
}

export function Heading({
  children,
  className = "",
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={`text-3xl font-medium leading-[1.02] tracking-[-0.04em] text-fg sm:text-5xl ${className}`}
    >
      {children}
    </Tag>
  );
}

/** The heading block most sections open with: label, headline, one paragraph. */
export function SectionIntro({
  eyebrow,
  title,
  lede,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading>{title}</Heading>
      {lede && (
        <p className="mt-5 text-base leading-[1.6] text-fg-2 sm:text-lg">{lede}</p>
      )}
    </Reveal>
  );
}

/** The app's primary button: blue, radius 12, brighter under the pointer.
 *  Carries the hero's arrow so the two read as the same control. */
export function PrimaryButton({
  href,
  children,
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-between gap-5 rounded-card bg-blue py-2.5 pl-6 pr-2.5 text-base font-medium text-white transition-[filter] hover:brightness-[1.08] ${className}`}
    >
      {children}
    </a>
  );
}
