import type { GetServerSideProps } from "next";

import { SITE } from "@/components/Seo";

/* The Sitemap directive has to be an absolute URL, which is why this is not a
   static file in public/. */

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400");
  res.write(`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  res.end();
  return { props: {} };
};

export default function Robots() {
  return null;
}
