import { useEffect, useRef } from "react";

/** Fades a block up the first time it is scrolled into view.
 *
 *  The class is toggled on the node rather than held in state: this is a
 *  purely visual thing happening to one element, so there is nothing for React
 *  to re-render, and the markup the server sends is the markup the client
 *  hydrates.
 *
 *  Once only - a section that re-animates every time you scroll past it is a
 *  section you cannot read twice. Reduced motion is handled in CSS, and a
 *  browser without IntersectionObserver simply shows everything. */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  as?: React.ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.classList.add("is-in");
        observer.disconnect();
      },
      // A little way in, so a block announces itself rather than arriving late.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
