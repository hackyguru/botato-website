import Head from "next/head";
import { Inter, Instrument_Serif } from "next/font/google";
import Hero from "@/components/Hero";
import Capabilities from "@/components/sections/Capabilities";
import { CTA, Download } from "@/components/sections/Download";
import Footer from "@/components/sections/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const DESCRIPTION =
  "Bots that run on your own laptop, with their own memory and a computer of their own. They keep working with the lid shut, and your phone reaches them from anywhere.";

export default function Home() {
  return (
    <div className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
      <Head>
        <title>botcage - bots that live on your own machine</title>
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="botcage" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#000000" />
      </Head>

      <Hero />

      {/* Everything below stands in the same frame the hero sits in, on the
          app's own floor, so the page reads as one stack of cards rather than a
          hero with a document under it. The gap matches the frame's padding at
          every breakpoint. */}
      <main className="flex flex-col gap-3 bg-floor px-3 pb-3 sm:gap-4 sm:px-4 sm:pb-4 md:gap-6 md:px-6 md:pb-6">
        <Capabilities />
        <Download />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
