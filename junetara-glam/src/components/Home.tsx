import { useState, type FormEvent } from "react";
import { useApp, type View } from "../context";
import {
  IMG, MARQUEE_ITEMS, ECOSYSTEM_LAYERS, MARKET_SEGMENTS, TIERS, COURSES, SALONS,
  PRODUCTS, INTERNSHIPS, TESTIMONIALS, npr, type Tier,
} from "../data";
import { Counter, Kicker, Marquee, Masked, OrbitBadge, Reveal, Stars } from "./ui";
import {
  ArrowRight, ArrowUpRight, Flower, GradCap, Pin, Qr, Search, ShieldCheck,
  Sparkle, Truck, Users, Wallet, Pulse, HomeVisit, Check,
} from "./Icons";
import { ProductCard } from "./Market";
import { LiveSessionsSection, LiveStrip } from "./LiveSessions";

const LAYER_ICON: Record<string, (p: { className?: string }) => JSX.Element> = {
  search: (p) => <Search {...p} />,
  wallet: (p) => <Wallet {...p} />,
  truck: (p) => <Truck {...p} />,
  cap: (p) => <GradCap {...p} />,
  pulse: (p) => <Pulse {...p} />,
};

const CONSOLE_TABS: { v: View; label: string; placeholder: string; chips: string[] }[] = [
  { v: "training", label: "Courses", placeholder: "Search bridal makeup, nail art, CTEVT diploma…", chips: ["Bridal", "Basic Beautician", "Ayurvedic", "Diploma"] },
  { v: "services", label: "Services", placeholder: "Search facial, haircut, mehndi, spa…", chips: ["Facial", "Bridal package", "Hair colour", "Mehndi"] },
  { v: "market", label: "Products", placeholder: "Search serum, hair oil, salon supplies…", chips: ["Vitamin-C", "Hair oil", "Salon kit"] },
  { v: "careers", label: "Careers", placeholder: "Search internships, stylist jobs, trainers…", chips: ["Internship", "Trainer", "Bridal artist"] },
];

function DiscoveryConsole() {
  const { go, seedSearch } = useApp();
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  const t = CONSOLE_TABS[tab];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    seedSearch(t.v, q);
    go(t.v);
  };

  return (
    <div data-tour="console" className="rounded-xl border border-pine/15 bg-white/85 p-4 shadow-[0_30px_70px_-30px_rgba(14,43,38,0.35)] backdrop-blur-sm sm:p-5">
      <div className="flex flex-wrap gap-1.5">
        {CONSOLE_TABS.map((c, i) => (
          <button
            key={c.v}
            onClick={() => { setTab(i); setQ(""); }}
            className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-all ${
              tab === i ? "bg-pine text-marigold" : "bg-sand/70 text-ink/60 hover:bg-sand hover:text-pine"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.placeholder}
            className="w-full rounded-lg border border-ink/15 bg-ivory py-3.5 pl-12 pr-4 text-[15px] outline-none transition focus:border-marigold focus:bg-white"
            aria-label="Search the ecosystem"
          />
        </div>
        <button
          type="submit"
          className="group flex shrink-0 items-center gap-2 rounded-lg bg-crimson px-5 text-[12px] font-bold uppercase tracking-[0.12em] text-ivory transition-all hover:bg-pine"
        >
          Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-ink/40">Popular:</span>
        {t.chips.map((c) => (
          <button
            key={c}
            onClick={() => { seedSearch(t.v, c); go(t.v); }}
            className="rounded-full border border-ink/15 px-3 py-1 text-[12px] font-semibold text-ink/65 transition hover:border-crimson hover:text-crimson"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { go } = useApp();

  return (
    <div>
      {/* ============ OPENER — the discovery layer, live ============ */}
      <section className="relative overflow-hidden">
        <p aria-hidden className="pointer-events-none absolute -top-10 right-0 select-none font-display text-[26vw] font-bold leading-none text-sand/60 lg:text-[290px]">
          जुनेतारा
        </p>
        <div aria-hidden className="pointer-events-none absolute -left-32 top-24 h-[420px] w-[420px] rounded-full bg-marigold/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute right-[-120px] top-96 h-[380px] w-[380px] rounded-full bg-blush/50 blur-3xl" />
        <Flower aria-hidden className="floaty absolute left-[6%] top-44 h-5 w-5 text-marigold/70" />
        <Flower aria-hidden className="floaty absolute left-[44%] top-28 h-4 w-4 text-crimson/50" style={{ animationDelay: "1.6s" }} />
        <Flower aria-hidden className="floaty absolute right-[8%] top-[55%] h-6 w-6 text-marigold/50" style={{ animationDelay: "3s" }} />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-14 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pt-20">
          <div className="lg:col-span-7">
            <Reveal>
              <Kicker tone="crimson">Nepal's first integrated beauty ecosystem · v1.0</Kicker>
            </Reveal>
            <Masked
              as="h1"
              className="mt-6 font-display text-[13vw] font-semibold leading-[0.99] tracking-tight text-pine sm:text-7xl lg:text-[76px]"
              lines={[
                <>Beauty, from</>,
                <>
                  classroom to <em className="italic text-crimson">client</em>
                  <span className="text-marigold">.</span>
                </>,
              ]}
            />
            <Reveal delay={340}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
                One mobile-first platform for a <strong className="font-bold text-pine">USD 1.5–2B</strong> market:
                verified CTEVT-aligned training, salon &amp; home-service booking, a B2C/B2B marketplace,
                and Nepal's first beauty talent pipeline — connected end to end.
              </p>
            </Reveal>
            <Reveal delay={460}>
              <div className="mt-8">
                <DiscoveryConsole />
              </div>
            </Reveal>
            <Reveal delay={580}>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                {[
                  { v: 1.5, d: 1, prefix: "USD ", suffix: "B+", label: "addressable market" },
                  { v: 500, d: 0, prefix: "", suffix: "+", label: "training centres to digitise" },
                  { v: 100, d: 0, prefix: "", suffix: " / 90d", label: "vendor target, Kathmandu" },
                  { v: 90, d: 0, prefix: "", suffix: "%+", label: "women beneficiaries" },
                ].map((s) => (
                  <div key={s.label} className="border-l-2 border-marigold/70 pl-3">
                    <p className="font-display text-[26px] font-semibold leading-none text-pine">
                      <Counter to={s.v} decimals={s.d} prefix={s.prefix} suffix={s.suffix} />
                    </p>
                    <p className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ink/50">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* right — living hero */}
          <div className="relative lg:col-span-5">
            <Reveal delay={220} className="relative mx-auto max-w-[430px]">
              <div aria-hidden className="absolute -left-4 -top-4 h-full w-full rounded-xl border-2 border-dashed border-marigold/60" />
              <div className="relative overflow-hidden rounded-xl shadow-[0_44px_90px_-32px_rgba(26,59,139,0.55)]">
                <img src={IMG.hero} alt="Nepali bridal makeup artist at work" className="kenburns h-[430px] w-full object-cover sm:h-[510px]" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-pine/55 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-pine/75 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-marigold backdrop-blur-sm">
                  <span className="blink h-1.5 w-1.5 rounded-full bg-marigold" /> 312 artists online
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="ticket flex items-center justify-between gap-3 rounded-lg bg-ivory/95 px-5 py-3.5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-crimson">Booking confirmed</p>
                      <p className="font-display text-[17px] italic leading-tight text-pine">Bridal trial · Moonlight Atelier</p>
                    </div>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-sun"><Check className="h-4 w-4" /></span>
                  </div>
                </div>
              </div>
              <OrbitBadge text="JUNETARA GLAM · KATHMANDU FIRST · 90-DAY MVP · EST. 2026 · " className="absolute -right-6 -top-9 h-28 w-28 text-pine sm:-right-10" />
            </Reveal>
          </div>
        </div>

        {/* on-air strip */}
        <div className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
          <Reveal delay={650}>
            <LiveStrip />
          </Reveal>
        </div>
      </section>

      {/* ============ marquee ============ */}
      <div className="border-y-2 border-pine bg-marigold py-4 text-pine">
        <Marquee items={MARQUEE_ITEMS} dur={30} />
      </div>

      {/* ============ LIVE layer — InDrive-style band ============ */}
      <section className="relative overflow-hidden bg-crimson py-16 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -top-8 right-2 select-none font-display text-[160px] font-bold italic leading-none text-ivory/[0.07]">लाइभ</p>
        <div aria-hidden className="pulse-line absolute left-0 right-0 top-1/2 hidden h-px bg-ivory/20 lg:block" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.26em] text-sun">
                <span className="blink h-2 w-2 rounded-full bg-sun" /> New · The Live layer
              </p>
            </Reveal>
            <Masked className="mt-4 font-display text-5xl font-semibold leading-[1.02] md:text-6xl" lines={[<>Watch the valley</>, <><em className="italic text-sun">move — and set your own price</em>.</>]} />
            <Reveal delay={200}>
              <p className="mt-5 max-w-xl leading-relaxed text-ivory/80">
                Real-time pings for every training centre, salon and home-service artist across Kathmandu Valley.
                Post a job, name your price, and let nearby artists accept — or counter — like a ride, but for beauty.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <button onClick={() => go("map")} className="group mt-7 inline-flex items-center gap-3 rounded-full bg-ivory px-7 py-4 text-[12.5px] font-bold uppercase tracking-[0.16em] text-crimson transition-all hover:-translate-y-0.5 hover:bg-sun hover:text-pine">
                Open the Live Map <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Reveal>
          </div>
          <Reveal delay={250} className="lg:col-span-5">
            <div className="relative rounded-xl border border-ivory/20 bg-pine/40 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">offer.of-24817 · live</p>
                <span className="blink h-2 w-2 rounded-full bg-marigold" />
              </div>
              {[
                { who: "You", txt: "Bridal touch-up · Thamel · my price रू 4,000", me: true },
                { who: "Sabina M. · 1.2 km", txt: "Accepts रू 4,000 — arriving in 18 min ✓", me: false },
                { who: "Ritu G. · 2.8 km", txt: "Counters रू 4,500 (gel + lashes included)", me: false },
              ].map((m, i) => (
                <div key={i} className={`fade-in mt-3 flex ${m.me ? "justify-end" : "justify-start"}`} style={{ animationDelay: `${i * 350}ms` }}>
                  <div className={`max-w-[85%] rounded-lg px-4 py-2.5 text-[13px] leading-snug ${m.me ? "bg-marigold text-pine" : "bg-ivory/10 text-ivory/90"}`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{m.who}</p>
                    {m.txt}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ live training sessions ============ */}
      <LiveSessionsSection />

      {/* ============ five-layer architecture ============ */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><Kicker>The system · पाँच तह</Kicker></Reveal>
            <Masked
              className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-pine md:text-6xl"
              lines={[<>Five layers,</>, <><em className="italic text-crimson">one ecosystem</em>.</>]}
            />
          </div>
          <Reveal delay={200} className="lg:col-span-5">
            <p className="max-w-md text-ink/65 lg:ml-auto">
              Every transaction on Junetara Glam flows through the same five layers — which is why a student,
              a customer and a vendor can all live on one platform.
            </p>
          </Reveal>
        </div>

        <div className="relative grid gap-4 md:grid-cols-5">
          <div aria-hidden className="pulse-line absolute left-0 right-0 top-9 hidden h-px bg-forest/25 md:block" />
          {ECOSYSTEM_LAYERS.map((l, i) => (
            <Reveal key={l.n} delay={i * 110}>
              <div className="group relative h-full rounded-xl border border-ink/10 bg-white/70 p-5 pt-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-marigold/70 hover:shadow-[0_24px_50px_-26px_rgba(14,43,38,0.4)]">
                <span className="absolute -top-3 left-5 rounded-full bg-pine px-2.5 py-0.5 font-display text-[13px] italic text-marigold">{l.n}</span>
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-sand text-forest transition-colors duration-300 group-hover:bg-marigold group-hover:text-pine">
                    {LAYER_ICON[l.icon]?.({ className: "h-5 w-5" })}
                  </span>
                  <span className="font-display text-lg italic text-ink/30">{l.nep}</span>
                </div>
                <h3 className="mt-4 font-display text-xl text-pine">{l.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink/60">{l.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ market intelligence — dark ============ */}
      <section className="relative overflow-hidden bg-pine py-20 text-ivory">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-forest blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 left-10 h-[340px] w-[340px] rounded-full bg-marigold/10 blur-3xl" />
        <p aria-hidden className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[170px] font-bold italic leading-none text-ivory/[0.04]">
          बजार
        </p>

        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal><Kicker tone="light">Industry research · 2025–26</Kicker></Reveal>
            <Masked className="mt-5 font-display text-5xl font-semibold leading-[1.02] md:text-6xl" lines={[<>A USD 2 billion</>, <><em className="italic text-marigold">offline</em> market.</>]} />
            <Reveal delay={200}>
              <p className="mt-6 max-w-md leading-relaxed text-ivory/70">
                Growing 8–10% a year, driven by a median age of 24, 15M internet users and a wedding industry
                worth NPR 50–80B — yet almost entirely cash, walk-in and word-of-mouth.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { k: "Median age", v: "24 yrs", s: "60% under 30" },
                  { k: "Social users", v: "12M", s: "TikTok · IG · FB" },
                  { k: "Women in workforce", v: "55%", s: "beauty = top-5 vocational track" },
                  { k: "Salon idle capacity", v: "40–60%", s: "off-peak, unrecovered" },
                ].map((d) => (
                  <div key={d.k} className="rounded-lg border border-ivory/15 bg-ivory/5 p-4">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-marigold">{d.k}</p>
                    <p className="mt-1 font-display text-2xl">{d.v}</p>
                    <p className="mt-0.5 text-[12px] text-ivory/55">{d.s}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={150}>
              <div className="rounded-xl border border-ivory/15 bg-ivory/5 p-6 md:p-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">Total addressable market by segment</p>
                  <p className="font-display text-3xl italic">
                    <Counter to={2} prefix="USD " suffix=".0B" />
                  </p>
                </div>
                <div className="mt-6 space-y-4">
                  {MARKET_SEGMENTS.map((s, i) => (
                    <div key={s.label}>
                      <div className="flex items-baseline justify-between gap-3 text-[13px]">
                        <span className="font-semibold text-ivory/85">{s.label}</span>
                        <span className="whitespace-nowrap text-ivory/55">{s.usd} · <span className="text-marigold">{s.cagr} CAGR</span></span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ivory/10">
                        <div
                          className="bar-grow h-full rounded-full bg-gradient-to-r from-marigold to-sun"
                          style={{ width: `${Math.max(s.width, 4)}%`, animationDelay: `${i * 120}ms` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-6 border-t border-ivory/10 pt-4 text-[11.5px] text-ivory/45">
                  Source: Statista &amp; IndexBox (products); industry extrapolation (services &amp; training) — BPI research, April 2026.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ live layer band ============ */}
      <section className="relative overflow-hidden bg-crimson py-16 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -left-2 -top-8 select-none font-display text-[150px] font-bold italic leading-none text-ivory/[0.06]">लाइभ</p>
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.26em] text-sun">
                <span className="blink h-2 w-2 rounded-full bg-sun" /> New · The Live Layer
              </p>
            </Reveal>
            <Masked className="mt-4 font-display text-5xl font-semibold leading-[1.02] md:text-6xl" lines={[<>Watch the valley move.</>, <><em className="italic text-sun">Bid your price.</em></>]} />
            <Reveal delay={200}>
              <p className="mt-5 max-w-lg leading-relaxed text-ivory/80">
                Real-time pings for every training centre, salon and home-service artist across Kathmandu —
                then name your own price and let nearby artists accept or counter, InDrive-style.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={250}>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => go("map")} className="group flex items-center gap-3 rounded-full bg-pine px-7 py-4 text-[13px] font-bold uppercase tracking-[0.16em] text-marigold transition-all hover:-translate-y-0.5">
                  <span className="blink h-2 w-2 rounded-full bg-marigold" /> Open the Live Map
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <button onClick={() => go("map")} className="rounded-full border border-ivory/40 px-7 py-4 text-[13px] font-bold uppercase tracking-[0.16em] text-ivory transition-all hover:-translate-y-0.5 hover:bg-ivory/10">
                  Try name-your-price
                </button>
              </div>
              <div className="mt-5 flex items-center gap-5 text-[12.5px] text-ivory/75">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#2b52e1" }} />Centres</span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ffb800" }} />Salons</span>
                <span className="flex items-center gap-2"><span className="blink h-2.5 w-2.5 rounded-full bg-sun" />Artists on the move</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ training tiers ============ */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal><Kicker>प्रशिक्षण · Standardised training</Kicker></Reveal>
            <Masked className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-pine md:text-6xl" lines={[<>From threading</>, <><em className="italic text-crimson">to teaching</em>.</>]} />
          </div>
          <Reveal delay={200}>
            <button onClick={() => go("training")} className="link-sweep flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-crimson">
              All {COURSES.length} listed courses <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(TIERS) as Tier[]).map((t, i) => {
            const tier = TIERS[t];
            const count = COURSES.filter((c) => c.tier === t).length;
            return (
              <Reveal key={t} delay={i * 100} style={{ marginTop: `${i * 14}px` }}>
                <button
                  onClick={() => go("training")}
                  className="group block h-full w-full rounded-xl border border-ink/10 bg-white/70 p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_55px_-28px_rgba(14,43,38,0.42)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="h-3 w-3 rounded-full" style={{ background: tier.color }} />
                    <span className="font-display text-4xl italic text-sand transition-colors group-hover:text-marigold">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-display text-[22px] leading-tight text-pine">{tier.label}</h3>
                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.14em] text-crimson">{tier.months}</p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-ink/60">{tier.desc}</p>
                  <div className="mt-5 border-t border-dashed border-ink/15 pt-4">
                    <p className="font-display text-lg text-forest">{tier.range}</p>
                    <p className="mt-1 flex items-center justify-between text-[12px] font-semibold text-ink/50">
                      {count} course{count === 1 ? "" : "s"} listed
                      <ArrowUpRight className="h-4 w-4 text-marigold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </p>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ============ services + venues ============ */}
      <section className="border-y border-ink/10 bg-sand/60">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-2">
          <div>
            <Reveal><Kicker>सेवा · Book in 60 seconds</Kicker></Reveal>
            <Masked className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-pine md:text-6xl" lines={[<>Walk-ins are</>, <><em className="italic text-crimson">so 2019</em>.</>]} />
            <Reveal delay={200}>
              <p className="mt-6 max-w-md text-ink/65">
                Real-time slots, verified vendors, eSewa/Khalti payment and SMS reminders.
                Choose a salon chair — or have the artist come to your home.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <ul className="mt-7 space-y-3">
                {[
                  "10-minute slot hold — no double bookings",
                  "Multi-dimensional ratings: quality, hygiene, punctuality, value",
                  "Home-service matching scored on proximity, rating & response time",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14.5px] text-ink/75">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest text-sun"><Check className="h-3.5 w-3.5" /></span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={400}>
              <button onClick={() => go("services")} className="group mt-8 inline-flex items-center gap-3 rounded-full bg-pine px-7 py-4 text-[12.5px] font-bold uppercase tracking-[0.16em] text-marigold transition-all hover:-translate-y-0.5 hover:bg-forest">
                Book a service <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Reveal>
          </div>

          <div className="space-y-4">
            {SALONS.slice(0, 4).map((s, i) => (
              <Reveal key={s.id} delay={i * 100}>
                <button onClick={() => go("services")} className="group flex w-full items-center gap-5 rounded-xl border border-ink/10 bg-white/80 p-4 text-left transition-all duration-300 hover:border-marigold/70 hover:shadow-[0_18px_44px_-24px_rgba(14,43,38,0.35)]">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                    <img src={s.img} alt={s.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                    {s.verified && <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-forest text-sun"><ShieldCheck className="h-3 w-3" /></span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-display text-lg text-pine">{s.name}</h3>
                      {s.home && <span className="flex shrink-0 items-center gap-1 rounded-full bg-blush/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-crimson"><HomeVisit className="h-3 w-3" /> Home</span>}
                    </div>
                    <p className="flex items-center gap-1.5 text-[12.5px] text-ink/55">
                      <Pin className="h-3.5 w-3.5 text-crimson" /> {s.area}, {s.city} · {"रू".repeat(0)}{"रू".repeat(s.level)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Stars rating={s.rating} />
                      <span className="text-[12px] font-bold text-forest">{s.rating}</span>
                      <span className="text-[12px] text-ink/45">({s.reviews})</span>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-marigold transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ marketplace preview ============ */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal><Kicker>बजार · The marketplace</Kicker></Reveal>
            <Masked className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-pine md:text-6xl" lines={[<>From Asan to</>, <><em className="italic text-crimson">anywhere</em>.</>]} />
          </div>
          <Reveal delay={200}>
            <div className="max-w-sm text-ink/60 lg:text-right">
              Retail for customers, wholesale for vendors — beating the New Road middleman markup.
              <button onClick={() => go("market")} className="link-sweep mt-2 block text-[12px] font-bold uppercase tracking-[0.16em] text-crimson lg:ml-auto">
                Enter the marketplace →
              </button>
            </div>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {[PRODUCTS[0], PRODUCTS[6], PRODUCTS[4], PRODUCTS[7]].map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ talent + verify teaser ============ */}
      <section className="relative overflow-hidden bg-forest py-20 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -bottom-10 right-4 select-none font-display text-[180px] font-bold italic leading-none text-ivory/[0.05]">प्रतिभा</p>
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-2">
          <div>
            <Reveal><Kicker tone="light">अवसर · Talent system</Kicker></Reveal>
            <Masked className="mt-5 font-display text-5xl font-semibold leading-[1.02] md:text-6xl" lines={[<>Graduates don't</>, <><em className="italic text-marigold">get lost anymore</em>.</>]} />
            <Reveal delay={200}>
              <p className="mt-6 max-w-md text-ivory/70">
                Internship matching by skill and location, a verified trainer database, and digital certificates
                any employer can QR-scan in two seconds.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">Open internships this week</p>
                <div className="space-y-2.5">
                  {INTERNSHIPS.slice(0, 3).map((x) => (
                    <button key={x.id} onClick={() => go("careers")} className="ticket group flex w-full items-center justify-between gap-4 rounded-lg bg-ivory/10 px-5 py-3 text-left transition-colors hover:bg-ivory/15">
                      <span>
                        <span className="block font-display text-[17px] italic">{x.title}</span>
                        <span className="text-[12px] text-ivory/55">{x.org} · {x.area}</span>
                      </span>
                      <span className="whitespace-nowrap text-[13px] font-bold text-marigold">{x.pay.split(" ")[0]} {x.pay.split(" ")[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={250}>
            <div className="relative rounded-xl border border-ivory/15 bg-pine/60 p-7 md:p-9">
              <Qr className="h-9 w-9 text-marigold" />
              <h3 className="mt-4 font-display text-3xl italic">Verify a certificate</h3>
              <p className="mt-2 text-sm text-ivory/65">Every Junetara certificate carries a unique QR. Try one — scan is simulated, trust is real:</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["JG-2026-0147", "JG-2025-0892", "JG-2025-0310"].map((id) => (
                  <button
                    key={id}
                    onClick={() => go("careers")}
                    className="rounded-full border border-marigold/40 bg-marigold/10 px-4 py-2 font-mono text-[13px] font-bold tracking-wider text-marigold transition hover:bg-marigold hover:text-pine"
                  >
                    {id}
                  </button>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-4 rounded-lg bg-ivory/5 p-4">
                <Users className="h-8 w-8 shrink-0 text-marigold" />
                <p className="text-[13.5px] text-ivory/70">
                  <strong className="text-ivory">2,225–3,845 jobs</strong> created over 3 years — from platform roles to
                  vendor hires to freelancer livelihoods.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ impact & SDGs ============ */}
      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal><Kicker>Impact · प्रभाव</Kicker></Reveal>
            <Masked className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-pine md:text-6xl" lines={[<>A women-first</>, <><em className="italic text-crimson">economy</em>.</>]} />
            <Reveal delay={200}>
              <p className="mt-6 max-w-lg text-ink/65">
                Over 90% of Nepal's beauty professionals are women. Junetara Glam gives them verified skills,
                digital clientele and income that doesn't need a storefront — aligned with CTEVT's mandate
                and the Digital Nepal Framework.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-7 flex flex-wrap gap-2">
                {["SDG 4 · Education", "SDG 5 · Gender equality", "SDG 8 · Decent work", "SDG 9 · Innovation", "SDG 10 · Reduced inequality", "SDG 12 · Responsible consumption"].map((s) => (
                  <span key={s} className="rounded-full border border-forest/30 bg-white/60 px-3.5 py-1.5 text-[12px] font-bold text-forest">{s}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal delay={150}>
              <div className="rounded-xl border border-ink/10 bg-white/70 p-6 md:p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">Employment projection · रोजगार सृजना</p>
                <div className="mt-4 overflow-hidden rounded-lg border border-ink/10">
                  <table className="w-full text-left text-[13.5px]">
                    <thead className="bg-pine text-marigold">
                      <tr>
                        <th className="px-4 py-2.5 font-bold">Category</th>
                        <th className="px-3 py-2.5 text-right font-bold">Yr 1</th>
                        <th className="px-3 py-2.5 text-right font-bold">Yr 2</th>
                        <th className="px-4 py-2.5 text-right font-bold">Yr 3</th>
                      </tr>
                    </thead>
                    <tbody className="text-ink/75">
                      {[
                        ["Platform jobs", "8–12", "15–20", "25–35"],
                        ["Vendor jobs created", "100–200", "300–500", "600–1,000"],
                        ["Freelancer livelihoods", "50–100", "150–300", "400–700"],
                        ["Student placements", "30–50", "100–200", "300–500"],
                      ].map((r, i) => (
                        <tr key={r[0]} className={i % 2 ? "bg-sand/50" : "bg-white/60"}>
                          <td className="px-4 py-2.5 font-semibold">{r[0]}</td>
                          <td className="px-3 py-2.5 text-right">{r[1]}</td>
                          <td className="px-3 py-2.5 text-right">{r[2]}</td>
                          <td className="px-4 py-2.5 text-right font-bold text-forest">{r[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-right font-display text-xl italic text-crimson">3-year total: 2,225 – 3,845 livelihoods</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ testimonials — scattered postcards ============ */}
      <section className="relative overflow-hidden bg-sand/60 py-20">
        <Sparkle aria-hidden className="absolute right-8 top-8 h-8 w-8 text-marigold/50" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 text-center">
            <Reveal><span className="inline-block"><Kicker>Early voices · बीटा प्रतिक्रिया</Kicker></span></Reveal>
            <Masked className="mt-4 font-display text-5xl font-semibold text-pine md:text-6xl" lines={[<>What the ecosystem</>, <><em className="italic text-crimson">is already changing</em>.</>]} />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 110}>
                <figure className={`flex h-full flex-col justify-between rounded-xl border border-ink/10 bg-ivory p-6 shadow-[0_18px_45px_-26px_rgba(14,43,38,0.4)] transition-all duration-500 hover:-translate-y-1.5 hover:rotate-0 ${["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"][i % 4]}`}>
                  <div>
                    <Flower className="h-5 w-5 text-marigold" />
                    <blockquote className="mt-4 font-display text-[17px] italic leading-snug text-pine">“{t.quote}”</blockquote>
                  </div>
                  <figcaption className="mt-6 border-t border-dashed border-ink/15 pt-4">
                    <p className="text-sm font-bold text-crimson">{t.name}</p>
                    <p className="text-[12px] uppercase tracking-wider text-ink/50">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ investor strip ============ */}
      <section className="relative overflow-hidden bg-pine py-16 text-ivory">
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-crimson/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <Reveal><Kicker tone="light">For investors · लगानीकर्ताका लागि</Kicker></Reveal>
              <Masked className="mt-4 font-display text-4xl font-semibold md:text-5xl" lines={[<>The numbers behind</>, <><em className="italic text-marigold">the plan</em>.</>]} />
            </div>
            <Reveal delay={200}>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => go("deck")} className="group flex items-center gap-2 rounded-full bg-marigold px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-pine transition hover:bg-sun">
                  Open the 12-slide deck
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <button onClick={() => go("partner")} className="rounded-full border border-ivory/30 px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:border-marigold hover:text-marigold">
                  Partner with us
                </button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={250}>
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ivory/15 bg-ivory/15 md:grid-cols-4">
              {[
                { v: "10–27×", l: "LTV / CAC ratio", s: "CAC रू 150–300 vs LTV रू 3–8K" },
                { v: "Mo 18–24", l: "Break-even", s: "≈108 orders/day at 200 vendors" },
                { v: "NPR 42–75L", l: "Startup cost", s: "≈ USD 31–56K, fully itemised" },
                { v: "USD 50–100K", l: "Seed ask", s: "18-month runway · Kathmandu-first" },
              ].map((s) => (
                <div key={s.l} className="bg-pine p-6">
                  <p className="font-display text-[26px] font-semibold text-marigold md:text-3xl">{s.v}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ivory/70">{s.l}</p>
                  <p className="mt-1.5 text-[12px] text-ivory/45">{s.s}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-6 text-[12px] text-ivory/40">
              Prepared by BPI Strategic Consulting · President: Heera Bohara Bhandari · Dhangadhi-1, Kailali | Sukedhara-4, Kathmandu · Confidential v1.0, April 2026 · {npr(4222000)} – {npr(7517000)}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
