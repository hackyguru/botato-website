import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Paints from "@/components/Paints";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Every face on the site paints itself out of these. */}
      <Paints />
      <Component {...pageProps} />
    </>
  );
}
