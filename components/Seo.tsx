import Head from "next/head";

/* Everything a crawler or a chat window needs, in one place.
 *
 * Written once rather than per page because the failure mode is silent: a
 * missing og:image is a link that unfurls as a grey box, and nobody sees that
 * on the page they are editing. */

/** Where the site lives. Absolute URLs are not optional for og:image, and a
 *  relative one is simply dropped by every crawler that reads it, so this has
 *  to be right. Set NEXT_PUBLIC_SITE_URL in the deployment to override. */
export const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://botato.hackyguru.com";

export const SITE_NAME = "botato";
const OG = "/og.png";

/** A path made absolute. Crawlers resolve nothing themselves. */
export const url = (path = "/") => `${SITE}${path}`;

export default function Seo({
  title,
  description,
  path = "/",
  type = "website",
  image = OG,
  published,
  noindex = false,
  children,
}: {
  /** The tab, and the unfurl heading. Suffixed with the site name unless it
   *  is the home page, whose title is the name already. */
  title: string;
  description: string;
  /** Absolute path on this site, for the canonical and og:url. */
  path?: string;
  type?: "website" | "article";
  image?: string;
  /** ISO date, for an article. */
  published?: string;
  noindex?: boolean;
  children?: React.ReactNode;
}) {
  const full = path === "/" ? title : `${title} - ${SITE_NAME}`;
  const here = url(path);
  const card = url(image);
  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={here} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={here} />
      <meta property="og:image" content={card} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="botato: bots that live on your own machine" />
      <meta property="og:locale" content="en_GB" />
      {published && <meta property="article:published_time" content={published} />}

      {/* Twitter reads its own names and falls back to og for the rest. */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={card} />

      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" type="image/png" href="/botato.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      {children}
    </Head>
  );
}

/** What botato is, in the vocabulary a search engine parses rather than reads.
 *  Only on the home page: repeating it per page competes with itself. */
export function AppSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "botato",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, iOS, Android",
    description:
      "A workspace where the bots run on your own machine. Each one gets a memory, a schedule and a computer of its own.",
    url: SITE,
    image: url(OG),
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    softwareVersion: "0.6.0",
    author: { "@type": "Person", name: "hackyguru" },
    codeRepository: "https://github.com/hackyguru/botato",
  };
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
