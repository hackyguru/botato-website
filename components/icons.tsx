/* Line icons for the sections below the hero. Hero.tsx keeps its own copies so
   it stays exactly as it was. */

type IconProps = { className?: string };

function Stroke({
  className,
  children,
  width = 1.6,
}: IconProps & { children: React.ReactNode; width?: number }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function Arrow({ className }: IconProps) {
  return (
    <Stroke className={className} width={1.8}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Stroke>
  );
}

export function Github({ className }: IconProps) {
  return (
    <Stroke className={className} width={1.7}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </Stroke>
  );
}

export function Apple({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.72c.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.18-1.73-1.35-.14-2.64.8-3.33.8-.69 0-1.75-.78-2.87-.76-1.48.02-2.84.86-3.6 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.52-.7 2.85-.7 1.33 0 1.7.7 2.87.68 1.19-.02 1.94-1.08 2.66-2.14.84-1.23 1.19-2.42 1.2-2.48-.02-.01-2.3-.88-2.32-3.5ZM14.2 6.34c.6-.74 1.01-1.76.9-2.78-.87.04-1.93.58-2.56 1.31-.56.65-1.05 1.7-.92 2.7.97.08 1.96-.5 2.58-1.23Z" />
    </svg>
  );
}

export function Linux({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <path d="M9 3.8c0-1 .9-1.8 2-1.8h2c1.1 0 2 .8 2 1.8v3.6c0 1 .4 1.9 1 2.6 1.4 1.5 2.2 3.4 2.2 5.4 0 1.4-.5 2.6-1.4 3.5" />
      <path d="M7.2 18.9A5 5 0 0 1 5.8 15.4c0-2 .8-3.9 2.2-5.4.6-.7 1-1.6 1-2.6" />
      <path d="M5.6 18.3c-.7.9-1.6 1.5-1.6 2.2 0 .8 1 1.3 2.6 1.3h10.8c1.6 0 2.6-.5 2.6-1.3 0-.7-.9-1.3-1.6-2.2" />
      <path d="M10.5 6.2h.01M13.5 6.2h.01" />
    </Stroke>
  );
}

export function Phone({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <rect x="6" y="2" width="12" height="20" rx="2.6" />
      <path d="M11 18.5h2" />
    </Stroke>
  );
}

export function Terminal({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <rect x="2.5" y="4" width="19" height="16" rx="2.4" />
      <path d="m6.8 10 2.4 2.2-2.4 2.2M12.4 15.2h4.6" />
    </Stroke>
  );
}

export function Wave({ className }: IconProps) {
  return (
    <Stroke className={className} width={1.8}>
      <path d="M3 12h1.6M7 8.4v7.2M10.4 5.6v12.8M13.8 9.2v5.6M17.2 7v10M20.8 12H22" />
    </Stroke>
  );
}

export function Clock({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </Stroke>
  );
}

export function Lock({ className }: IconProps) {
  return (
    <Stroke className={className}>
      <rect x="4" y="10" width="16" height="11" rx="2.4" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </Stroke>
  );
}
