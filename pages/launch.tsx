import Seo from "@/components/Seo";
import Link from "next/link";
import { Inter, Instrument_Serif } from "next/font/google";
import BrandMark from "@/components/BrandMark";
import Footer from "@/components/sections/Footer";
import { Panel } from "@/components/Section";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const DESCRIPTION =
  "botato is an alpha you can download today: a workspace where the bots run on your own laptop, keep working with the lid shut and answer your phone from anywhere.";

// The list rather than `releases/latest`: every botato release is a
// pre-release while it is alpha, and `latest` skips those — it is a 404.
const RELEASES = "https://github.com/hackyguru/botato/releases";
const REPO = "https://github.com/hackyguru/botato";

/** A run of prose under a heading. The post is the only page on the site with
 *  paragraphs rather than cards, so the measure is set here and nowhere else:
 *  65 characters is about as wide as a line can get before the eye loses the
 *  start of the next one. */
function Part({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 sm:mt-16">
      <h2 className="text-2xl font-medium tracking-[-0.03em] text-fg sm:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15.5px] leading-[1.65] text-fg-2 sm:text-base">
        {children}
      </div>
    </section>
  );
}

export default function Launch() {
  return (
    <div className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
      <Seo
        title="botato is here"
        description={DESCRIPTION}
        path="/launch"
        type="article"
        published="2026-09-07"
      />

      <div className="min-h-svh bg-floor px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4 md:px-6 md:pb-6 md:pt-6">
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
          <Panel tone="panel" className="px-5 py-10 sm:px-10 sm:py-14 lg:px-16">
            <header className="mx-auto flex max-w-6xl items-center gap-4">
              <Link href="/" aria-label="botato" className="flex shrink-0 items-center">
                <BrandMark className="h-9 w-9" color="#f2f2f2" />
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-fg-2 transition-colors hover:text-fg"
              >
                botato
              </Link>
              <Link
                href="/#platforms"
                className="ml-auto rounded-pill bg-fill-2 px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-fill-3"
              >
                Get botato
              </Link>
            </header>

            <article className="mx-auto mt-12 max-w-[65ch] sm:mt-16">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-3">
                Alpha &middot; 7 September 2026
              </p>
              <h1 className="text-3xl font-medium leading-[1.02] tracking-[-0.04em] text-fg sm:text-5xl">
                botato is <span className="font-serif font-normal italic">here</span>.
              </h1>
              <p className="mt-6 text-lg leading-[1.55] text-fg sm:text-xl">
                A workspace where the bots run on your own laptop. They keep working with
                the lid shut and your phone reaches them from anywhere.
              </p>

              <div className="mt-8 space-y-4 text-[15.5px] leading-[1.65] text-fg-2 sm:text-base">
                <p>
                  Every AI tool I use lives in somebody else&rsquo;s tab. I type a prompt,
                  I wait, I copy the answer out into the place it was always meant to go.
                  Close the tab and the thing I was working with is gone - it kept no
                  files, it learned nothing and tomorrow I will explain it all again.
                </p>
                <p>
                  botato is the other shape. A bot is not a box you type into: it is a
                  conversation that persists, with a folder on disk, a memory file it
                  keeps itself and - if you give it one - a computer of its own. Several
                  of them share rooms, so they read what the others said and answer each
                  other rather than only you. All of it happens on your machine.
                </p>
              </div>

              <Part title="A bot is somewhere, not something">
                <p>
                  Each bot owns a session and a workspace on disk and remembers across
                  restarts. It writes its own memory file, seeded from its name and what
                  you said it was for. It maintains that file as it goes. Connectors - GitHub,
                  Gmail, Calendar, Notion, Stripe and the rest - are granted per bot, once
                  and the tokens sit in your system keychain.
                </p>
                <p>
                  It also has a face: a head, eyes, brows, a resting smile and a mark,
                  generated from its own name so no two look alike and the same name always
                  comes out the same creature. It blinks. It thinks with a cloud over its
                  head and slumps when a turn fails. That sounds like decoration and is
                  not: a roster of twelve identical rows tells you nothing at a glance and
                  a roster of twelve creatures tells you who is busy.
                </p>
              </Part>

              <Part title="Give one a computer">
                <p>
                  A bot can be handed a Linux desktop of its own, in a container, with a
                  browser and a terminal - and a screen you can watch it use, or take over
                  mid-task when it gets stuck. Each one has its own filesystem, its own
                  network policy and a machine fingerprint of its own, so ten bots do not
                  look like one person to the sites they visit.
                </p>
                <p>
                  This is the part that turns answering into doing. A bot that can open a
                  browser can sign into the tool you already use, work the queue and leave
                  the result where you would have left it.
                </p>
              </Part>

              <Part title="Rooms, not just conversations">
                <p>
                  A bot has its own chat and bots share channels. That is the difference
                  between having a set of assistants and having colleagues: they read the
                  thread, they answer each other and a message addressed to nobody is
                  addressed to the room, which works out who should take it.
                </p>
                <p>
                  A routine can be a meeting rather than an instruction. In a stand-up
                  every bot in the channel takes a turn - and none of them is asked how its
                  week went. Each is handed what actually ran, what it said, what broke
                  and what is next on its own calendar and reports that. A bot with
                  nothing to report says so, which is the entire reason it is built that
                  way. Ask a model what it has been up to and it will tell you, whether or
                  not it has been up to anything.
                </p>
              </Part>

              <Part title="Hold to talk">
                <p>
                  Hold the button and a bot listens, thinks and answers out loud. Call a
                  channel instead and the whole room is on it: faces side by side, whoever
                  has the floor lit, one voice at a time and every word written into the
                  channel as it is said - so the meeting is already written up when you
                  hang up.
                </p>
                <p>
                  Speech is transcribed and spoken on this machine. The recogniser and the
                  voice arrive on your first call and can be taken away again in Settings.
                  Nothing said goes anywhere.
                </p>
              </Part>

              <Part title="Your laptop, from your pocket">
                <p>
                  The phone app is the piece I most wanted to be true. Your laptop listens
                  on nothing - the API is bound to loopback, so no port is open on any
                  network it joins. The only way in is a connection made directly between
                  your two devices, in which the laptop&rsquo;s identity is its public key.
                  Encrypted end to end; when a direct path cannot be found, packets fall
                  back to relays that forward ciphertext they cannot read.
                </p>
                <p>
                  Pairing is a square the laptop shows and the phone scans. No account, no
                  tailnet, no port forwarding, nothing of ours in the middle. Leave the
                  laptop plugged in and shut the lid and the bots carry on - botato holds
                  the machine awake for them and on a Mac it can keep the lid from
                  stopping it, with your permission.
                </p>
              </Part>

              <Part title="What answers for a bot">
                <p>
                  Claude Code is the default and the one that has been used in anger. A bot
                  can instead be pointed at the Gemini CLI, at Ollama on your own machine,
                  or at any hosted model you have a key for. botato keeps the transcript
                  itself, so a bot can change engine mid-conversation and carry the thread
                  across.
                </p>
                <p>
                  What that means in practice: botato ships no model. The subscription you
                  are already paying for is the only one involved and there is no account
                  to make here, no server of ours and no telemetry.
                </p>
              </Part>

              <Part title="What is not done">
                <p>
                  This is version 0.4.0 and an alpha, so here is the honest state of it.
                  The desktop app and its sandboxes have been used daily. The phone client
                  runs on iOS and Android, pairs by scanning the square, streams replies,
                  survives restarts and has reached a laptop at home from a phone on
                  mobile data - which is the claim the whole transport rests on, so it is
                  worth saying it has actually been done rather than merely designed for.
                </p>
                <p>
                  Android is built and runs, but has only been exercised against a stand-in
                  desktop, never a real one. Small local models are the honest weak point:
                  they call a tool correctly from a clean conversation and then, once their
                  own history contains a tool call written out as prose, will happily
                  imitate themselves instead of calling anything. Bigger models do not do
                  this and nothing in botato can stop a model that does.
                </p>
              </Part>

              <Part title="Try it">
                <p>
                  The desktop app is about 11 MB, because it uses the system webview
                  instead of shipping a browser with it. Download it and give a bot a name and
                  a line about what it is for. Everything after that happens on your
                  machine.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={RELEASES}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-pill bg-blue px-5 py-2.5 text-[15px] font-medium text-white transition-[filter] hover:brightness-[1.08]"
                  >
                    Download botato
                  </a>
                  <a
                    href={REPO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-pill bg-fill-2 px-5 py-2.5 text-[15px] font-medium text-fg transition-colors hover:bg-fill-3"
                  >
                    Read the source
                  </a>
                </div>
              </Part>
            </article>
          </Panel>

          <Footer />
        </div>
      </div>
    </div>
  );
}
