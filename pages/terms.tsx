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

const UPDATED = "8 September 2026";
const REPO = "https://github.com/hackyguru/botato";
const LICENCE = "https://www.apache.org/licenses/LICENSE-2.0";

const DESCRIPTION =
  "The terms you accept by using botato: it runs on your own machine, it is provided as is and what your bots do is your responsibility.";

/** A numbered clause. The measure is 65 characters, as on the launch post. */
function Clause({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12 scroll-mt-8" id={`clause-${n}`}>
      <h2 className="text-xl font-medium tracking-[-0.03em] text-fg sm:text-2xl">
        <span className="mr-2.5 text-fg-3 tabular-nums">{n}.</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-[1.65] text-fg-2 sm:text-[15.5px]">
        {children}
      </div>
    </section>
  );
}

/** A clause that has to be seen to bind. Brighter type inside a ruled box,
 *  with the operative sentence set in capitals, because a disclaimer a court
 *  finds inconspicuous is a disclaimer that does not hold. */
function Loud({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-branch bg-fill-1 px-5 py-4 text-[14.5px] font-medium leading-[1.6] text-fg">
      {children}
    </div>
  );
}

export default function Terms() {
  return (
    <div className={`${inter.variable} ${instrumentSerif.variable} font-sans`}>
      <Seo
        title="Terms of use"
        description={DESCRIPTION}
        path="/terms"
        type="article"
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
                Last updated {UPDATED}
              </p>
              <h1 className="text-3xl font-medium leading-[1.05] tracking-[-0.04em] text-fg sm:text-5xl">
                Terms of <span className="font-serif font-normal italic">use</span>.
              </h1>
              <p className="mt-6 text-lg leading-[1.55] text-fg sm:text-xl">
                botato runs autonomous programs on your own computer, with your keys
                and your accounts. These terms set out what that means and where the
                responsibility sits. Read them before you install it.
              </p>

              {/* The short version. Deliberately marked as not the agreement, so
                  it cannot be read as narrowing the clauses it summarises. */}
              <div className="mt-8 rounded-card border border-branch bg-fill-1 px-5 py-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-3">
                  The short version
                </p>
                <ul className="mt-3.5 space-y-2 text-[14.5px] leading-[1.6] text-fg-2">
                  <li className="flex gap-2.5">
                    <span className="text-fg-3">1.</span>
                    <span>
                      botato runs on your machine. There is nothing of ours in
                      between and nothing of ours to fall back on.
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-fg-3">2.</span>
                    <span>
                      Bots act without asking. Whatever yours does, you did.
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-fg-3">3.</span>
                    <span>
                      It is alpha software, given away for free, with no warranty of
                      any kind.
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="text-fg-3">4.</span>
                    <span>
                      As far as the law allows, nobody behind botato is liable to
                      you for anything.
                    </span>
                  </li>
                </ul>
                <p className="mt-4 text-[13px] leading-[1.55] text-fg-3">
                  This box is a summary and is not the agreement. The clauses below
                  are.
                </p>
              </div>

              <Clause n={1} title="What these terms cover">
                <p>
                  In these terms, <strong className="font-medium text-fg">botato</strong>{" "}
                  means the botato project: the desktop application, the phone
                  client, this website, the template gallery and the documentation.{" "}
                  <strong className="font-medium text-fg">We</strong> and{" "}
                  <strong className="font-medium text-fg">us</strong> mean the botato
                  project and the people who maintain and contribute to it.{" "}
                  <strong className="font-medium text-fg">You</strong> mean the person
                  or organisation using any of it.
                </p>
                <p>
                  You accept these terms by downloading, installing, running or using
                  botato, or by using this website. If you do not accept them, do not
                  use it.
                </p>
                <p>
                  The botato software is released under the{" "}
                  <a
                    href={LICENCE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link underline decoration-line underline-offset-2 transition-colors hover:decoration-current"
                  >
                    Apache License, Version 2.0
                  </a>
                   and that licence governs your rights in the software itself,
                  including its disclaimer of warranty and its limitation of liability.
                  These terms sit alongside it and cover everything else. Where the two
                  conflict on the subject of the software, the licence wins. Nothing
                  here gives you rights in the software beyond what the licence gives
                  you.
                </p>
              </Clause>

              <Clause n={2} title="It is an alpha">
                <p>
                  botato is unfinished software published early on purpose. It has
                  defects. It will change in ways that are not compatible with what
                  came before. Features may be removed. Data written by one version may
                  not be readable by the next.
                </p>
                <p>
                  There is no support, no service level, no uptime commitment and no
                  promise that any release will be followed by another. Development may
                  stop at any time, without notice.
                </p>
              </Clause>

              <Clause n={3} title="It runs on your computer, not ours">
                <p>
                  botato has no account and no server of ours. It runs on hardware you
                  control, using your operating system, your container runtime, your
                  network and your credentials. Your bots, files, messages and keys
                  stay on your machine.
                </p>
                <p>
                  We therefore have no access to any of it. We cannot see what your
                  bots are doing, cannot stop them, cannot recover a file, cannot reset
                  a key and cannot restore anything you lose. There is no switch we
                  hold. Backups are entirely your responsibility and so is the
                  security of the machine botato runs on.
                </p>
              </Clause>

              <Clause n={4} title="Your bots are your responsibility">
                <Loud>
                  A BOT IS AN AUTONOMOUS PROGRAM THAT ACTS WITHOUT ASKING YOU FIRST.
                  EVERYTHING A BOT DOES UNDER YOUR INSTALLATION IS YOUR ACT, AND YOU
                  ARE SOLELY RESPONSIBLE FOR IT.
                </Loud>
                <p>
                  When you give a bot a computer, a credential or a connector, you are
                  giving it the ability to use them on its own. It can send email,
                  write and delete files, browse the web, call APIs, buy things, agree
                  to things, publish things and change accounts you own. It can do all
                  of that while you are asleep, because that is the point of it.
                </p>
                <p>
                  You chose to run it, you configured it and you granted the access.
                  You are responsible for what follows, legally and financially, to us
                  and to everyone else. Give a bot the least access that lets it do the
                  job. Read what it proposes before you approve it. Do not point one at
                  anything you cannot afford to have it get wrong.
                </p>
                <p>
                  A bot is answered by a language model and language models are
                  unreliable by nature. Output can be wrong, invented, out of date, or
                  all three while sounding certain. Nothing a bot produces is legal,
                  medical, financial, tax, safety or other professional advice and you
                  must not treat it as such. Check anything that matters before you act
                  on it.
                </p>
              </Clause>

              <Clause n={5} title="What you must not do">
                <p>You must not use botato, or let a bot use it, to:</p>
                <ul className="ml-1 space-y-2 border-l border-line pl-5">
                  <li>break any law, or infringe anyone&rsquo;s rights;</li>
                  <li>
                    access, test or interfere with any system, account or network you
                    do not own or have written permission to touch;
                  </li>
                  <li>
                    send unsolicited bulk messages, or scrape or automate against a
                    service in breach of its terms;
                  </li>
                  <li>
                    impersonate a person or organisation, or produce material designed
                    to deceive people about who is speaking;
                  </li>
                  <li>
                    harass or stalk anyone, or monitor a person without the consent the
                    law requires;
                  </li>
                  <li>
                    produce material that sexualises minors, or that exists to promote
                    violence, terrorism or self-harm;
                  </li>
                  <li>
                    develop weapons, or anything whose purpose is to cause physical
                    harm;
                  </li>
                  <li>
                    breach sanctions or export controls, or make botato available to
                    anyone they prohibit.
                  </li>
                </ul>
                <Loud>
                  BOTATO IS NOT BUILT FOR HIGH RISK USE. YOU MUST NOT USE IT IN THE
                  OPERATION OF MEDICAL DEVICES, VEHICLES, AIRCRAFT, WEAPONS, CRITICAL
                  INFRASTRUCTURE, OR ANYWHERE ELSE ITS FAILURE COULD LEAD TO DEATH,
                  PERSONAL INJURY, OR SEVERE PROPERTY OR ENVIRONMENTAL DAMAGE.
                </Loud>
              </Clause>

              <Clause n={6} title="Other people&rsquo;s services">
                <p>
                  botato is a way of reaching services we do not run. The model that
                  answers a bot is one of them: Claude Code, Gemini CLI, Ollama on your
                  machine, or any of the providers reachable through an
                  OpenAI-compatible endpoint. So are the container runtime it needs,
                  the connectors you grant, the relays a paired phone may fall back to,
                  Apple&rsquo;s push service and every site a bot visits.
                </p>
                <p>
                  Your relationship with each of them is yours, not ours. Their terms
                  and privacy policies apply to what you send them and what you send a
                  model provider includes the content of your bot&rsquo;s turns. We do
                  not control them, do not endorse them and are not responsible for
                  what they do, what they charge, what they do with your data, or
                  whether they keep working. If one of them changes or disappears,
                  parts of botato may stop working and that is not a defect we owe
                  you a fix for.
                </p>
              </Clause>

              <Clause n={7} title="Money">
                <p>
                  botato is free. Most of what it reaches is not. You bring your own
                  API keys and you pay whoever issued them, on their terms.
                </p>
                <p>
                  A bot can retry, loop, or run a routine far more often than you
                  expected and a metered API will bill you for every call. Set
                  spending limits with your provider before you leave a bot running. We
                  do not see, control, cap, refund or reimburse any charge you incur,
                  however it arose.
                </p>
              </Clause>

              <Clause n={8} title="Credentials and data">
                <p>
                  Keys, tokens and passwords live in your system keychain and in a
                  per-bot vault on your disk. Their safety is the safety of your
                  machine and your operating system account. We never receive them and
                  cannot recover, reset or revoke them for you.
                </p>
                <p>
                  Anything you hand a bot, a container or a connector may be used by
                  it and anything in a turn may be sent to whichever provider answers
                  that turn. Do not give a bot access to material you are not willing
                  to have it use or send.
                </p>
              </Clause>

              <Clause n={9} title="Reaching your machine from somewhere else">
                <p>
                  Pairing a phone opens a route to the copy of botato on your
                  computer. It connects directly where the network allows and falls
                  back to public relays where it does not.
                </p>
                <p>
                  Opening any route to your own machine carries risk. You decide
                  whether to pair a device and you accept that risk when you do. Keep
                  pairing secrets secret and unpair anything you no longer hold. We
                  are not responsible for access obtained through a device you paired
                  or a secret you disclosed.
                </p>
              </Clause>

              <Clause n={10} title="Templates">
                <p>
                  A template describes a bot: what it is for, what it may reach and
                  the work it does. Templates are contributed by people who are not us.
                  We do not review, test, endorse or vouch for any of them, or for what
                  a bot built from one will do once it is running with your access.
                </p>
                <p>
                  Installing one is your decision and your risk. Read what it asks for
                  before you accept it.
                </p>
                <p>
                  If you submit a template, you confirm you have the right to, you
                  grant us a worldwide, royalty-free, irrevocable licence to host,
                  display and distribute it and you accept that it must contain no
                  secrets, no personal data and nothing unlawful. We may edit or remove
                  anything from the gallery at any time, for any reason or for none.
                </p>
              </Clause>

              <Clause n={11} title="This website">
                <p>
                  This site is provided as is. Descriptions, screenshots, figures and
                  roadmaps are illustrative, may be out of date and are not
                  commitments. Nothing on it is an offer, a warranty, or professional
                  advice of any kind.
                </p>
              </Clause>

              <Clause n={12} title="No warranty">
                <Loud>
                  BOTATO IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
                  AVAILABLE&rdquo;, WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND.
                  TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
                  EXPRESS, IMPLIED AND STATUTORY, INCLUDING ANY WARRANTY OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE,
                  NON-INFRINGEMENT, ACCURACY, QUIET ENJOYMENT, AND ANY WARRANTY ARISING
                  FROM COURSE OF DEALING, USAGE OR TRADE PRACTICE.
                </Loud>
                <p>
                  We do not warrant that botato will work, that it will meet your
                  requirements, that it will be available, uninterrupted, timely,
                  secure or free of error, that any defect will be corrected, or that
                  it is free of harmful components. No advice or information you get
                  from us or from botato, spoken or written, creates any warranty.
                </p>
              </Clause>

              <Clause n={13} title="Limitation of liability">
                <Loud>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, WE WILL NOT BE LIABLE TO YOU
                  FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR
                  PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, BUSINESS,
                  GOODWILL, DATA, FILES OR CREDENTIALS, ARISING OUT OF OR RELATING TO
                  BOTATO, WHETHER IN CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY,
                  STATUTE OR OTHERWISE, AND WHETHER OR NOT WE WERE ADVISED THAT SUCH
                  DAMAGES WERE POSSIBLE.
                </Loud>
                <p>
                  Without limiting that and to the fullest extent permitted by law, we
                  are not liable for anything a bot did or failed to do; for any amount
                  a bot caused you to be charged by any provider; for any message a bot
                  sent, any file it changed or deleted, any purchase it made, any
                  agreement it entered, or anything it published; for loss of, or
                  damage to, any data or credential; for unauthorised access to your
                  machine or your accounts; or for the acts, omissions, content,
                  pricing, security or availability of any third party.
                </p>
                <Loud>
                  OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS RELATING TO BOTATO WILL
                  NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US FOR BOTATO IN
                  THE TWELVE MONTHS BEFORE THE CLAIM AROSE, WHICH FOR FREE SOFTWARE IS
                  NOTHING, AND (B) FIFTY UNITED STATES DOLLARS.
                </Loud>
                <p>
                  These limits apply even if a limited remedy is found to have failed
                  of its essential purpose. They are a fundamental part of the basis on
                  which botato is offered: it is given away for nothing and it would
                  not be given away at all without them.
                </p>
              </Clause>

              <Clause n={14} title="What we cannot exclude">
                <p>
                  Some jurisdictions do not allow the exclusion of certain warranties,
                  or the limitation of certain damages. Nothing in these terms excludes
                  or limits any liability that cannot lawfully be excluded or limited,
                  including liability for death or personal injury caused by
                  negligence, or for fraud or fraudulent misrepresentation.
                </p>
                <p>
                  Where any exclusion or limitation in these terms is held to be
                  unenforceable, it applies to the maximum extent the law does permit
                  and the remainder of these terms stays in force. If you deal as a
                  consumer, you may have rights that these terms do not affect.
                </p>
              </Clause>

              <Clause n={15} title="You cover us">
                <p>
                  You will defend, indemnify and hold harmless the botato project and
                  its maintainers and contributors from and against any claim, demand,
                  proceeding, damage, loss, liability, fine, penalty and cost,
                  including reasonable legal fees, arising out of or relating to your
                  use of botato, anything your bots did or failed to do, your breach
                  of these terms, your infringement of anyone&rsquo;s rights, your
                  breach of any law, or anything you submitted to the template gallery.
                </p>
              </Clause>

              <Clause n={16} title="Changes and stopping">
                <p>
                  We may change these terms. The date at the top changes when we do
                  and continuing to use botato after that is how you accept the new
                  version. We may change, suspend or discontinue any part of botato or
                  this website at any time, without notice and without liability to
                  you.
                </p>
                <p>
                  You may stop using botato whenever you like. That is the only remedy
                  available to you if you are unhappy with it or with these terms.
                </p>
              </Clause>

              <Clause n={17} title="The rest">
                <p>
                  If any provision of these terms is held invalid or unenforceable, it
                  is severed and the rest continues in effect. A failure to enforce a
                  provision is not a waiver of it. Nothing here creates an agency,
                  partnership, joint venture or employment between us. There are no
                  third-party beneficiaries, except that the people named in clause 15
                  may rely on it. These terms, together with the Apache License 2.0,
                  are the entire agreement between us about botato and replace
                  anything said before.
                </p>
                <p>
                  Questions about these terms belong in the{" "}
                  <a
                    href={`${REPO}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link underline decoration-line underline-offset-2 transition-colors hover:decoration-current"
                  >
                    project repository
                  </a>
                  .
                </p>
              </Clause>

              <p className="mt-14 border-t border-line pt-6 text-[13px] leading-[1.6] text-fg-3">
                botato is alpha software that runs autonomous programs with your own
                credentials. If you are not comfortable being responsible for what one
                does, do not install it.
              </p>
            </article>
          </Panel>

          <Footer />
        </div>
      </div>
    </div>
  );
}
