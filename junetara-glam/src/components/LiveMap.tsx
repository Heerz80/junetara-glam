import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../context";
import { LIVE_SPOTS, SPOT_META, SERVICES, ARTISTS, OFFER_RULES, npr, type LiveSpot, type SpotKind } from "../data";
import { Kicker, Masked, Reveal } from "./ui";
import { GradCap, HomeVisit, Pin, Sparkle, Store, Wallet, ArrowRight, Check, X } from "./Icons";

const KIND_ICON: Record<SpotKind, (p: { className?: string }) => JSX.Element> = {
  center: (p) => <GradCap {...p} />,
  salon: (p) => <Store {...p} />,
  artist: (p) => <HomeVisit {...p} />,
};

/* ---------- stylized Kathmandu Valley base map ---------- */
function ValleyMap() {
  return (
    <svg viewBox="0 0 1000 700" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      {/* terrain */}
      <rect width="1000" height="700" fill="#e6ecfa" />
      <path d="M120,350 C100,200 250,80 480,70 C720,60 900,180 910,340 C920,500 800,640 520,640 C260,640 140,520 120,350 Z" fill="#e6d7ba" />
      <path d="M180,350 C170,230 300,120 500,110 C700,100 850,210 855,345 C860,480 740,600 510,600 C300,600 190,470 180,350 Z" fill="#e6ecfa" />
      {/* hills */}
      <circle cx="150" cy="180" r="60" fill="#2b52e1" opacity="0.08" />
      <circle cx="860" cy="520" r="70" fill="#2b52e1" opacity="0.07" />
      <circle cx="820" cy="160" r="50" fill="#2b52e1" opacity="0.08" />
      {/* ward blocks */}
      {[
        [400, 240, 90, 55], [520, 210, 80, 50], [620, 300, 95, 60], [450, 420, 100, 60],
        [330, 330, 70, 45], [560, 400, 75, 48], [430, 300, 60, 42], [660, 420, 60, 40],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="10" fill="#1e293b" opacity="0.05" />
      ))}
      {/* ring road */}
      <path
        d="M250,350 C250,200 400,120 520,120 C680,120 780,220 780,350 C780,480 680,560 520,560 C380,560 250,480 250,350 Z"
        fill="none" stroke="#c19a4b" strokeWidth="5" strokeDasharray="2 14" strokeLinecap="round" opacity="0.55"
      />
      {/* Bagmati river */}
      <path
        d="M80,300 C200,320 280,270 380,320 C470,365 520,430 610,425 C710,420 770,375 900,400"
        fill="none" stroke="#7fb3c8" strokeWidth="10" strokeLinecap="round" opacity="0.5"
      />
      {/* landmark labels */}
      {[
        ["THAMEL", 440, 250], ["LAZIMPAT", 555, 190], ["BOUDHA", 725, 215], ["MAHARAJGUNJ", 470, 135],
        ["BANESHWOR", 668, 320], ["SWAYAMBHU", 215, 290], ["JHAMSİKHEL", 480, 462], ["PATAN", 435, 505],
      ].map(([t, x, y], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" fontSize="15" fontWeight="700" letterSpacing="2.5" fill="#1e293b" opacity="0.35" fontFamily="Mukta, sans-serif">
          {t}
        </text>
      ))}
    </svg>
  );
}

/* ---------- InDrive-style offer engine ---------- */
function OfferEngine() {
  const { addBooking, addOffer, toast } = useApp();
  const [serviceId, setServiceId] = useState(SERVICES[2].id);
  const [artistId, setArtistId] = useState(ARTISTS[0].id);
  const [pct, setPct] = useState(100);
  const [phase, setPhase] = useState<"setup" | "sending" | "result">("setup");
  const [verdict, setVerdict] = useState<{ status: "accepted" | "countered" | "declined"; counterPrice?: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const service = SERVICES.find((s) => s.id === serviceId)!;
  const artist = ARTISTS.find((a) => a.id === artistId)!;
  const myPrice = Math.round((service.price * pct) / 100 / 10) * 10;
  const providers = useMemo(() => ARTISTS.filter((a) => a.home), []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const send = () => {
    setPhase("sending");
    setVerdict(null);
    timer.current = setTimeout(() => {
      let v: { status: "accepted" | "countered" | "declined"; counterPrice?: number };
      if (pct >= OFFER_RULES.acceptAt) v = { status: "accepted" };
      else if (pct >= OFFER_RULES.counterFloor) v = { status: "countered", counterPrice: Math.round(((myPrice + service.price) / 2) / 10) * 10 };
      else v = { status: "declined" };
      setVerdict(v);
      setPhase("result");
    }, 1400);
  };

  const confirm = (price: number, status: "accepted" | "countered") => {
    addBooking({
      service: service.name, price, venue: "Home service", artist: artist.name,
      date: "Tomorrow", time: "10:00", mode: "home", name: "You", gateway: "Offer engine",
    });
    addOffer({ service: service.name, artist: artist.name, myPrice, basePrice: service.price, status, counterPrice: verdict?.counterPrice, finalPrice: price });
    setPhase("setup");
    setVerdict(null);
    setPct(100);
  };

  return (
    <div data-tour="bidding" className="rounded-xl border border-ink/10 bg-ivory p-6 shadow-[0_24px_60px_-30px_rgba(14,43,38,0.4)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">
            <Wallet className="h-4 w-4" /> Name your price
          </p>
          <h3 className="mt-1 font-display text-2xl italic text-pine">Bid like InDrive</h3>
        </div>
        <span className="rounded-full bg-marigold/25 px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-forest">Live bidding</span>
      </div>

      {/* service + artist */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Service</span>
          <select
            value={serviceId}
            onChange={(e) => { setServiceId(e.target.value); setPhase("setup"); setVerdict(null); }}
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-marigold"
          >
            {SERVICES.map((s) => <option key={s.id} value={s.id}>{s.name} · base {npr(s.price)}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Nearby artist</span>
          <select
            value={artistId}
            onChange={(e) => setArtistId(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-3 py-2.5 text-[14px] outline-none focus:border-marigold"
          >
            {providers.map((a) => <option key={a.id} value={a.id}>{a.name} · {a.rating}★ · {a.city}</option>)}
          </select>
        </label>
      </div>

      {/* price slider */}
      <div className="mt-5 rounded-lg bg-sand/70 p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-ink/50">Your offer</span>
          <span className="font-display text-3xl font-semibold text-pine">{npr(myPrice)}</span>
        </div>
        <input
          type="range" min={OFFER_RULES.minPct} max={OFFER_RULES.maxPct} step={5} value={pct}
          onChange={(e) => { setPct(Number(e.target.value)); if (phase === "result") { setPhase("setup"); setVerdict(null); } }}
          className="mt-3 w-full" aria-label="Offer percentage"
        />
        <div className="mt-1.5 flex justify-between text-[10.5px] font-bold uppercase tracking-wider text-ink/40">
          <span>{OFFER_RULES.minPct}% · {npr(Math.round((service.price * OFFER_RULES.minPct) / 100 / 10) * 10)}</span>
          <span className={pct >= OFFER_RULES.acceptAt ? "text-forest" : pct >= OFFER_RULES.counterFloor ? "text-marigold" : "text-crimson"}>
            {pct}% of base {npr(service.price)}
          </span>
          <span>{OFFER_RULES.maxPct}%</span>
        </div>
      </div>

      {/* verdict / actions */}
      {phase === "setup" && (
        <button onClick={send} className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-crimson py-3.5 text-[12.5px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-pine">
          Send offer to {artist.name.split(" ")[0]} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      )}

      {phase === "sending" && (
        <div className="mt-4 flex items-center justify-center gap-3 rounded-full bg-pine py-3.5 text-[12.5px] font-bold uppercase tracking-[0.14em] text-marigold">
          <Sparkle className="h-4 w-4 animate-spin" /> {artist.name.split(" ")[0]} is considering your offer…
        </div>
      )}

      {phase === "result" && verdict && (
        <div className="fade-in mt-4 rounded-lg border p-4">
          {verdict.status === "accepted" && (
            <div className="border-forest/30 bg-forest/10">
              <p className="flex items-center gap-2 font-display text-lg italic text-forest"><Check className="h-5 w-5" /> Offer accepted at {npr(myPrice)}!</p>
              <button onClick={() => confirm(myPrice, "accepted")} className="mt-3 w-full rounded-full bg-forest py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-sun transition hover:bg-pine">
                Confirm booking
              </button>
            </div>
          )}
          {verdict.status === "countered" && (
            <div className="border-marigold/40 bg-marigold/10">
              <p className="font-display text-lg italic text-pine">Counter-offer: {npr(verdict.counterPrice!)}</p>
              <p className="mt-1 text-[12.5px] text-ink/60">{artist.name.split(" ")[0]} met you halfway. Accept or adjust your slider.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => confirm(verdict.counterPrice!, "countered")} className="rounded-full bg-marigold py-2.5 text-[11.5px] font-bold uppercase tracking-wider text-pine transition hover:bg-sun">Accept {npr(verdict.counterPrice!)}</button>
                <button onClick={() => { setPhase("setup"); setVerdict(null); }} className="rounded-full border border-ink/20 py-2.5 text-[11.5px] font-bold uppercase tracking-wider text-ink/60 transition hover:border-crimson hover:text-crimson">Decline</button>
              </div>
            </div>
          )}
          {verdict.status === "declined" && (
            <div className="border-crimson/30 bg-crimson/10">
              <p className="flex items-center gap-2 font-display text-lg italic text-crimson"><X className="h-5 w-5" /> Offer declined</p>
              <p className="mt-1 text-[12.5px] text-ink/60">Too far below base price. Try {OFFER_RULES.counterFloor}%+ ({npr(Math.round((service.price * OFFER_RULES.counterFloor) / 100 / 10) * 10)}) or another artist.</p>
            </div>
          )}
        </div>
      )}

      <p className="mt-3 text-center text-[11px] text-ink/40">
        ≥{OFFER_RULES.acceptAt}% auto-accepts · {OFFER_RULES.counterFloor}–{OFFER_RULES.acceptAt}% gets countered · below declines
      </p>
    </div>
  );
}

/* ---------- live map view ---------- */
export default function LiveMap() {
  const { go, offers } = useApp();
  const [filter, setFilter] = useState<SpotKind | "all">("all");
  const [selected, setSelected] = useState<LiveSpot | null>(null);
  const [tick, setTick] = useState(0);

  // living "updated Ns ago" pulse
  useEffect(() => {
    const t = setInterval(() => setTick((x) => (x + 1) % 10), 1000);
    return () => clearInterval(t);
  }, []);

  const spots = filter === "all" ? LIVE_SPOTS : LIVE_SPOTS.filter((s) => s.kind === filter);

  return (
    <div>
      {/* header */}
      <section className="relative overflow-hidden bg-pine pb-14 pt-16 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -right-4 -top-12 select-none font-display text-[180px] font-bold leading-none text-ivory/[0.045]">लाइभ</p>
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><Kicker tone="light">Live layer · real-time tracking</Kicker></Reveal>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <Masked as="h1" className="font-display text-6xl font-semibold leading-[1.0] md:text-7xl" lines={[<>See the valley,</>, <><em className="italic text-marigold">live</em>.</>]} />
            <Reveal delay={200}>
              <p className="flex items-center gap-2 rounded-full border border-marigold/40 bg-ivory/5 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold">
                <span className="blink h-2 w-2 rounded-full bg-marigold" /> Live · updated {tick}s ago
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* map column */}
          <div className="lg:col-span-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <button onClick={() => { setFilter("all"); setSelected(null); }} className={`rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition ${filter === "all" ? "bg-pine text-marigold" : "bg-sand text-ink/60 hover:bg-sand/70"}`}>
                All · {LIVE_SPOTS.length}
              </button>
              {(Object.keys(SPOT_META) as SpotKind[]).map((k) => (
                <button
                  key={k}
                  onClick={() => { setFilter(k); setSelected(null); }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition ${filter === k ? "bg-pine text-marigold" : "bg-sand text-ink/60 hover:bg-sand/70"}`}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: SPOT_META[k].color }} />
                  {SPOT_META[k].label}
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-xl border border-ink/10 shadow-[0_30px_70px_-30px_rgba(14,43,38,0.4)]" style={{ aspectRatio: "10 / 7" }}>
              <ValleyMap />
              {spots.map((s) => {
                const meta = SPOT_META[s.kind];
                const Icon = KIND_ICON[s.kind];
                const active = selected?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(active ? null : s)}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 ${s.status === "moving" ? "floaty" : ""}`}
                    style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: active ? 30 : 10 }}
                    aria-label={s.name}
                  >
                    {/* pulse ring */}
                    <span className="absolute inset-0 -m-2 animate-ping rounded-full opacity-40" style={{ background: meta.color }} />
                    <span
                      className={`relative grid h-10 w-10 place-items-center rounded-full border-[3px] border-ivory text-ivory shadow-lg transition-transform duration-300 ${active ? "scale-125" : "group-hover:scale-110"}`}
                      style={{ background: meta.color }}
                    >
                      <Icon className="h-4.5 w-4.5 h-5 w-5" />
                    </span>
                  </button>
                );
              })}

              {/* selected pin card */}
              {selected && (
                <div className="fade-in absolute bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-4 sm:w-80">
                  <div className="ticket rounded-xl border border-ink/10 bg-ivory/97 p-5 shadow-xl backdrop-blur">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: SPOT_META[selected.kind].color }}>
                          {SPOT_META[selected.kind].label} · {SPOT_META[selected.kind].nep}
                        </p>
                        <h3 className="mt-1 font-display text-xl italic text-pine">{selected.name}</h3>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${selected.status === "online" ? "bg-forest/15 text-forest" : selected.status === "busy" ? "bg-marigold/25 text-forest" : "bg-crimson/15 text-crimson"}`}>
                        {selected.status}
                      </span>
                    </div>
                    <p className="mt-2 flex items-start gap-1.5 text-[13px] text-ink/65"><Pin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-crimson" />{selected.detail}</p>
                    <div className="mt-4 flex gap-2">
                      {selected.kind === "center" && (
                        <button onClick={() => go("training")} className="flex-1 rounded-full bg-pine py-2.5 text-[11px] font-bold uppercase tracking-wider text-marigold transition hover:bg-forest">View courses</button>
                      )}
                      {selected.kind === "salon" && (
                        <button onClick={() => go("services")} className="flex-1 rounded-full bg-crimson py-2.5 text-[11px] font-bold uppercase tracking-wider text-ivory transition hover:bg-pine">Book here</button>
                      )}
                      {selected.kind === "artist" && (
                        <button onClick={() => go("services")} className="flex-1 rounded-full bg-crimson py-2.5 text-[11px] font-bold uppercase tracking-wider text-ivory transition hover:bg-pine">Offer a price</button>
                      )}
                      <button onClick={() => setSelected(null)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/50 transition hover:border-crimson hover:text-crimson" aria-label="Close">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* legend */}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-ink/55">
              <span className="font-bold uppercase tracking-wider text-ink/40">Legend</span>
              {(Object.keys(SPOT_META) as SpotKind[]).map((k) => (
                <span key={k} className="flex items-center gap-2"><span className="h-3 w-3 rounded-full border-2 border-ivory shadow" style={{ background: SPOT_META[k].color }} />{SPOT_META[k].label}</span>
              ))}
              <span className="flex items-center gap-2"><span className="blink h-2 w-2 rounded-full bg-crimson" />Moving artist</span>
            </div>
          </div>

          {/* offer engine column */}
          <div className="space-y-6 lg:col-span-4">
            <OfferEngine />

            {/* recent bids */}
            <Reveal>
              <div className="rounded-xl border border-ink/10 bg-white/70 p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Your recent bids</p>
                {offers.length === 0 ? (
                  <p className="mt-3 text-[13px] text-ink/50">No bids yet — send your first offer above.</p>
                ) : (
                  <ul className="mt-3 space-y-2.5">
                    {offers.slice(0, 5).map((o) => (
                      <li key={o.id} className="flex items-center justify-between gap-3 border-b border-dashed border-ink/10 pb-2.5 text-[13px] last:border-0 last:pb-0">
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-ink">{o.service}</span>
                          <span className="text-[11.5px] text-ink/50">{o.artist} · bid {npr(o.myPrice)}</span>
                        </span>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${o.status === "accepted" ? "bg-forest/15 text-forest" : o.status === "countered" ? "bg-marigold/25 text-forest" : "bg-crimson/15 text-crimson"}`}>
                          {o.status} {o.finalPrice ? `· ${npr(o.finalPrice)}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
