import { useMemo, useState, type FormEvent } from "react";
import { useApp } from "../context";
import {
  BRANDS, PROMOTIONS, COLLAB_TYPES, AFFILIATE_TIERS, LEADERBOARD, IMG, npr, CITIES,
} from "../data";
import { Kicker, Masked, Marquee, Reveal, Stars } from "./ui";
import {
  ArrowRight, Check, Copy, Flower, GradCap, Heart, Megaphone, Pin, Sparkle, Store, Users, Wallet,
} from "./Icons";

function daysLeft(ends: string) {
  const d = Math.ceil((new Date(ends).getTime() - Date.now()) / 86400000);
  return d > 0 && d < 3000 ? d : null;
}

function CodeChip({ code }: { code: string }) {
  const { toast } = useApp();
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(code).catch(() => {});
        toast(`Code ${code} copied — apply it in your bag`);
      }}
      className="group flex items-center gap-2 rounded-lg border-2 border-dashed border-crimson/50 bg-ivory px-3.5 py-2 font-mono text-[13px] font-bold tracking-widest text-crimson transition-all hover:border-crimson hover:bg-crimson hover:text-ivory"
    >
      {code}
      <Copy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
    </button>
  );
}

/* ---------- Brand collab + promotions + affiliate ---------- */
export default function Collaborate() {
  const { toast, submitPartner, affiliate, joinAffiliate } = useApp();

  const [brandName, setBrandName] = useState("");
  const [brandType, setBrandType] = useState(COLLAB_TYPES[0].title);
  const [brandMsg, setBrandMsg] = useState("");

  const [affName, setAffName] = useState("");
  const [affChannel, setAffChannel] = useState("Instagram / TikTok creator");
  const [affCity, setAffCity] = useState("Kathmandu");

  const featured = PROMOTIONS[0];
  const fDays = daysLeft(featured.ends);

  const brandSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (brandName.trim().length < 2) {
      toast("Add your brand name so our partnerships team knows who's calling");
      return;
    }
    submitPartner(`Brand · ${brandType}`, brandName.trim(), "Kathmandu");
    setBrandName("");
    setBrandMsg("");
  };

  const affSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (affName.trim().length < 2) {
      toast("Add your name to generate your affiliate code");
      return;
    }
    joinAffiliate(affName.trim(), affChannel, affCity);
  };

  const affLink = useMemo(
    () => (affiliate ? `junetaraglam.com/?ref=${affiliate.code}` : ""),
    [affiliate]
  );

  return (
    <div>
      {/* header — brand wall */}
      <section className="relative overflow-hidden bg-pine pb-16 pt-16 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -right-6 -top-16 select-none font-display text-[190px] font-bold leading-none text-ivory/[0.045]">ब्रान्ड</p>
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-crimson/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute right-10 bottom-0 h-64 w-64 rounded-full bg-marigold/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><Kicker tone="light">सहकार्य · Collabs & creators</Kicker></Reveal>
          <Masked
            as="h1"
            className="mt-5 font-display text-6xl font-semibold leading-[1.0] md:text-7xl"
            lines={[<>Grow with the</>, <><em className="italic text-marigold">glow economy</em>.</>]}
          />
          <Reveal delay={200}>
            <p className="mt-4 max-w-xl text-lg text-ivory/70">
              Brands get shelves, campaigns and 500+ students a year. Creators get a cut of every glow they start.
              Everyone gets tracked, transparent, monthly payouts.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {[
                { v: "8", l: "partner brands live" },
                { v: "40+", l: "artist collective" },
                { v: "1.2M", l: "monthly impressions" },
                { v: "5–8%", l: "affiliate commission" },
              ].map((s) => (
                <div key={s.l} className="border-l-2 border-marigold/70 pl-3">
                  <p className="font-display text-3xl font-semibold leading-none text-marigold">{s.v}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ivory/55">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="relative mt-10 border-t border-ivory/10 pt-5 text-ivory/70">
          <Marquee items={BRANDS.map((b) => b.name)} dur={26} reverse />
        </div>
      </section>

      {/* featured campaign */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-ink/10 bg-white/70 lg:grid-cols-12">
            <div className="relative h-72 lg:col-span-5 lg:h-auto">
              <img src={IMG.lipstick} alt="Kumari Cosmetics festive campaign" className="kenburns absolute inset-0 h-full w-full object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-transparent to-pine/20" />
              <span className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-crimson px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ivory">
                <Megaphone className="h-3.5 w-3.5" /> Featured campaign
              </span>
            </div>
            <div className="flex flex-col justify-center p-8 lg:col-span-7 lg:p-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-crimson">{featured.brand} × Junetara Glam</p>
              <h2 className="mt-3 font-display text-4xl font-semibold italic text-pine md:text-5xl">{featured.title}</h2>
              <p className="mt-3 max-w-lg text-ink/65">{featured.desc} Live across the marketplace and every partner salon.</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="font-display text-5xl font-semibold text-crimson">{featured.off}</span>
                <CodeChip code={featured.code} />
                {fDays && (
                  <span className="rounded-full bg-sand px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wider text-ink/60">
                    Ends in {fDays} days
                  </span>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* brand directory */}
      <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal><Kicker>Partner brands</Kicker></Reveal>
            <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>The shelf of <em className="italic text-crimson">partners</em>.</>]} />
          </div>
          <Reveal delay={150}>
            <p className="max-w-sm text-[13.5px] text-ink/55 lg:text-right">From Ilam tea-oil labs to Bhaktapur ateliers — Nepali-first, verified, stocked.</p>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {BRANDS.map((b, i) => (
            <Reveal key={b.id} delay={(i % 4) * 90}>
              <div className="group rounded-xl border border-ink/10 bg-white/70 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-26px_rgba(14,43,38,0.4)]">
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-12 w-12 place-items-center rounded-lg font-display text-lg font-semibold italic text-ivory transition-transform duration-500 group-hover:rotate-6"
                    style={{ background: b.color }}
                  >
                    {b.initials}
                  </span>
                  <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink/55">since {b.since}</span>
                </div>
                <h3 className="mt-4 font-display text-xl leading-tight text-pine">{b.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink/55">
                  <Pin className="h-3 w-3 text-crimson" /> {b.origin} · {b.cat}
                </p>
                <p className="mt-3 border-t border-dashed border-ink/15 pt-3 text-[12.5px] font-semibold text-forest">{b.deal}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* promotions — ticket wall */}
      <section className="border-y border-ink/10 bg-sand/60">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="mb-8">
            <Reveal><Kicker>Live promotions</Kicker></Reveal>
            <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>Codes that <em className="italic text-crimson">actually work</em>.</>]} />
            <Reveal delay={150}><p className="mt-2 max-w-md text-[13.5px] text-ink/55">Copy any code, open your bag, paste — the discount applies at checkout.</p></Reveal>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {PROMOTIONS.map((p, i) => {
              const dl = daysLeft(p.ends);
              return (
                <Reveal key={p.code} delay={i * 90}>
                  <div className="ticket flex items-center justify-between gap-5 rounded-xl border border-ink/10 bg-ivory p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_48px_-26px_rgba(194,59,78,0.35)]">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-crimson/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-crimson">{p.tag}</span>
                        {dl ? (
                          <span className="text-[11px] font-bold uppercase tracking-wider text-ink/45">{dl} days left</span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-forest"><Check className="h-3 w-3" /> always on</span>
                        )}
                      </div>
                      <h3 className="mt-2 truncate font-display text-2xl italic text-pine">{p.title}</h3>
                      <p className="mt-0.5 text-[12.5px] text-ink/55">{p.brand} · {p.desc}</p>
                      <p className="mt-2 font-display text-3xl font-semibold text-crimson">{p.off}</p>
                    </div>
                    <div className="shrink-0"><CodeChip code={p.code} /></div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* collab ledger + inquiry */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal><Kicker>For brands</Kicker></Reveal>
          <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>Four ways to</>, <><em className="italic text-crimson">collaborate</em>.</>]} />
          <div className="mt-7 space-y-2">
            {COLLAB_TYPES.map((c, i) => (
              <Reveal key={c.n} delay={i * 100}>
                <div className="group grid gap-3 rounded-xl border border-ink/10 bg-white/70 p-5 transition-all duration-300 hover:border-crimson/50 hover:bg-ivory sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6">
                  <span className="font-display text-3xl italic text-sand transition-colors group-hover:text-crimson">{c.n}</span>
                  <div>
                    <h3 className="font-display text-xl text-pine">{c.title}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink/60">{c.desc}</p>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-forest/10 px-3.5 py-1.5 text-[11.5px] font-bold text-forest">{c.metric}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={200}>
            <form onSubmit={brandSubmit} className="rounded-2xl border border-ink/10 bg-pine p-7 text-ivory md:p-8">
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-marigold">
                <Store className="h-4 w-4" /> Brand inquiry
              </p>
              <h3 className="mt-3 font-display text-3xl italic">Put your brand on the shelf.</h3>
              <p className="mt-2 text-sm text-ivory/65">Partnerships team replies within 48h with a placement proposal.</p>
              <div className="mt-6 space-y-3.5">
                <input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Brand name *"
                  className="w-full rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-3 text-[14px] text-ivory placeholder:text-ivory/35 outline-none transition focus:border-marigold"
                />
                <select
                  value={brandType}
                  onChange={(e) => setBrandType(e.target.value)}
                  className="w-full rounded-lg border border-ivory/20 bg-pine px-4 py-3 text-[14px] text-ivory outline-none transition focus:border-marigold"
                >
                  {COLLAB_TYPES.map((c) => (
                    <option key={c.n} value={c.title}>{c.title}</option>
                  ))}
                </select>
                <textarea
                  value={brandMsg}
                  onChange={(e) => setBrandMsg(e.target.value)}
                  placeholder="Tell us about your products & goal (optional)"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-3 text-[14px] text-ivory placeholder:text-ivory/35 outline-none transition focus:border-marigold"
                />
                <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-lg bg-marigold px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-pine transition hover:bg-sun">
                  Request proposal <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      {/* ============ affiliate program — dark ============ */}
      <section className="relative overflow-hidden bg-forest py-20 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -bottom-12 right-2 select-none font-display text-[180px] font-bold italic leading-none text-ivory/[0.05]">कमाइ</p>
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-marigold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Reveal><Kicker tone="light">Affiliation · एफिलिएट</Kicker></Reveal>
              <Masked className="mt-4 font-display text-5xl font-semibold leading-[1.02] md:text-6xl" lines={[<>Your audience,</>, <><em className="italic text-marigold">your income</em>.</>]} />
              <Reveal delay={200}>
                <p className="mt-5 max-w-md text-ivory/70">
                  Share your link, earn on every booking, enrollment and product your audience makes —
                  tracked for 30 days, paid monthly via eSewa or bank.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div className="mt-7 space-y-3">
                  {[
                    { n: "1", icon: Copy, t: "Generate your code", d: "Instant personal link — junetaraglam.com/?ref=YOU" },
                    { n: "2", icon: Heart, t: "Share the glow", d: "Tutorials, reviews, salon tours — any content that converts" },
                    { n: "3", icon: Wallet, t: "Get paid monthly", d: "5–8% of every order, transparent dashboard, eSewa payout" },
                  ].map((s) => (
                    <div key={s.n} className="flex items-center gap-4 rounded-xl border border-ivory/12 bg-ivory/5 p-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-marigold font-display text-lg italic text-pine">{s.n}</span>
                      <div>
                        <p className="flex items-center gap-2 font-display text-lg italic"><s.icon className="h-4 w-4 text-marigold" /> {s.t}</p>
                        <p className="text-[13px] text-ivory/60">{s.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={380}>
                <div className="mt-7 overflow-hidden rounded-xl border border-ivory/15">
                  <table className="w-full text-left text-[13.5px]">
                    <thead className="bg-ivory/10 text-marigold">
                      <tr>
                        <th className="px-4 py-2.5 font-bold">Tier</th>
                        <th className="px-3 py-2.5 font-bold">Who it's for</th>
                        <th className="px-3 py-2.5 text-right font-bold">Rate</th>
                        <th className="px-4 py-2.5 text-right font-bold">Payout</th>
                      </tr>
                    </thead>
                    <tbody>
                      {AFFILIATE_TIERS.map((t, i) => (
                        <tr key={t.tier} className={i % 2 ? "bg-ivory/[0.03]" : ""}>
                          <td className="px-4 py-2.5 font-semibold">{t.tier}</td>
                          <td className="px-3 py-2.5 text-ivory/65">{t.req}</td>
                          <td className="px-3 py-2.5 text-right font-display text-lg text-marigold">{t.rate}</td>
                          <td className="px-4 py-2.5 text-right text-ivory/65">{t.payout}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            </div>

            {/* sign-up / mini dashboard */}
            <div className="lg:col-span-6">
              <Reveal delay={250}>
                <div className="rounded-2xl border border-marigold/25 bg-pine/70 p-7 md:p-8">
                  {!affiliate ? (
                    <form onSubmit={affSubmit}>
                      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-marigold">
                        <Sparkle className="h-4 w-4" /> Join the collective
                      </p>
                      <h3 className="mt-3 font-display text-3xl italic">Get your code in 10 seconds.</h3>
                      <div className="mt-6 space-y-3.5">
                        <input
                          value={affName}
                          onChange={(e) => setAffName(e.target.value)}
                          placeholder="Your name *"
                          className="w-full rounded-lg border border-ivory/20 bg-ivory/5 px-4 py-3 text-[14px] text-ivory placeholder:text-ivory/35 outline-none transition focus:border-marigold"
                        />
                        <select
                          value={affChannel}
                          onChange={(e) => setAffChannel(e.target.value)}
                          className="w-full rounded-lg border border-ivory/20 bg-pine px-4 py-3 text-[14px] text-ivory outline-none transition focus:border-marigold"
                        >
                          {["Instagram / TikTok creator", "YouTube channel", "Training centre", "Salon chain", "Blogger / other"].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <select
                          value={affCity}
                          onChange={(e) => setAffCity(e.target.value)}
                          className="w-full rounded-lg border border-ivory/20 bg-pine px-4 py-3 text-[14px] text-ivory outline-none transition focus:border-marigold"
                        >
                          {CITIES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <button type="submit" className="group flex w-full items-center justify-center gap-2 rounded-lg bg-marigold px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-pine transition hover:bg-sun">
                          Generate my code <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                      <p className="mt-4 text-[11.5px] text-ivory/45">Free to join · no minimum followers to start · cancel anytime</p>
                    </form>
                  ) : (
                    <div className="fade-in">
                      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-marigold">
                        <span className="blink h-1.5 w-1.5 rounded-full bg-marigold" /> Your affiliate dashboard
                      </p>
                      <h3 className="mt-3 font-display text-3xl italic">Namaste, {affiliate.name.split(" ")[0]} ✳</h3>
                      <div className="mt-5 rounded-xl border border-dashed border-marigold/50 bg-ivory/5 p-4">
                        <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-ivory/50">Your link</p>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <code className="truncate font-mono text-[13.5px] font-bold text-marigold">{affLink}</code>
                          <button
                            onClick={() => { navigator.clipboard?.writeText(`https://${affLink}`).catch(() => {}); toast("Affiliate link copied — go make some glow"); }}
                            className="flex shrink-0 items-center gap-1.5 rounded-full bg-marigold px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-pine transition hover:bg-sun"
                          >
                            <Copy className="h-3.5 w-3.5" /> Copy
                          </button>
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-3 gap-3">
                        {[
                          { v: "1,284", l: "link clicks", live: true },
                          { v: "38", l: "conversions" },
                          { v: npr(22800), l: "earned · lifetime" },
                        ].map((s) => (
                          <div key={s.l} className="rounded-xl border border-ivory/12 bg-ivory/5 p-4 text-center">
                            <p className="flex items-center justify-center gap-1.5 font-display text-xl text-marigold md:text-2xl">
                              {s.live && <span className="blink h-1.5 w-1.5 rounded-full bg-crimson" />}
                              {s.v}
                            </p>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory/50">{s.l}</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-[12px] text-ivory/55">
                        {affiliate.channel} · {affiliate.city} · code <strong className="text-marigold">{affiliate.code}</strong> · next payout: month-end via eSewa
                      </p>
                    </div>
                  )}
                </div>
              </Reveal>

              {/* leaderboard */}
              <Reveal delay={340}>
                <div className="mt-6 overflow-hidden rounded-2xl border border-ivory/15 bg-pine/50">
                  <p className="border-b border-ivory/10 px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-marigold">
                    Top affiliates · this month
                  </p>
                  <div className="divide-y divide-ivory/8">
                    {LEADERBOARD.map((a, i) => (
                      <div key={a.name} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-ivory/5">
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-base italic ${i === 0 ? "bg-marigold text-pine" : "bg-ivory/10 text-ivory/70"}`}>
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold">{a.name}</p>
                          <p className="text-[11.5px] text-ivory/50">{a.channel}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-lg text-marigold">{npr(a.earn)}</p>
                          <p className="text-[10.5px] text-ivory/45">{a.clicks.toLocaleString("en-IN")} clicks · {a.conv} sales</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* brand-proof strip */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-ink/10 bg-white/70 p-7 md:p-8">
            <div className="flex items-center gap-5">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-crimson/10 text-crimson"><GradCap className="h-7 w-7" /></span>
              <div>
                <h3 className="font-display text-2xl italic text-pine">Academy sponsors wanted for Spring '27 intake</h3>
                <p className="mt-1 flex items-center gap-2 text-[13.5px] text-ink/60">
                  <Users className="h-4 w-4 text-forest" /> Brand a full student kit — 500+ kits, nationwide
                  <span className="hidden items-center gap-1 sm:flex"><Flower className="h-3.5 w-3.5 text-marigold" /><Stars rating={5} className="h-3 w-3" /></span>
                </p>
              </div>
            </div>
            <button
              onClick={() => { submitPartner("Brand · Academy sponsorship", "Your brand", "Kathmandu"); }}
              className="rounded-full bg-pine px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-crimson hover:text-ivory"
            >
              Sponsor a cohort
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
