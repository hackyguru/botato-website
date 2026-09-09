import type { GetServerSideProps } from "next";

import { SITE } from "@/components/Seo";

/* Written here rather than dropped in public/, because a sitemap has to carry
   absolute URLs and a static file cannot read where the site is deployed. */

const PAGES: { path: string; changed: string; priority: string }[] = [
  { path: "/", changed: "2026-09-09", priority: "1.0" },
  { path: "/templates", changed: "2026-09-09", priority: "0.8" },
  { path: "/launch", changed: "2026-09-07", priority: "0.6" },
  { path: "/terms", changed: "2026-09-08", priority: "0.3" },
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    PAGES.map(
      (p) =>
        `  <url>\n` +
        `    <loc>${SITE}${p.path}</loc>\n` +
        `    <lastmod>${p.changed}</lastmod>\n` +
        `    <priority>${p.priority}</priority>\n` +
        `  </url>\n`,
    ).join("") +
    `</urlset>\n`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
  res.write(body);
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
