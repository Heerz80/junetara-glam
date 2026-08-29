import { useEffect, useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { useApp } from "../context";
import { ARTISTS, SALONS, SERVICES, npr, type Salon, type Service } from "../data";
import { Kicker, Masked, Reveal, Stars, GatewayChips } from "./ui";
import {
  ArrowRight, Brush, Calendar, Check, Clock, Droplet, Eye, Flower, Gem, HomeVisit,
  Leaf, Nail, Pin, Scissors, Search, ShieldCheck, Sparkle, Wallet, X, Building,
} from "./Icons";

const SVC_ICON: Record<string, (p: { className?: string }) => JSX.Element> = {
  scissors: (p) => <Scissors {...p} />,
  droplet: (p) => <Droplet {...p} />,
  sparkle: (p) => <Sparkle {...p} />,
  gem: (p) => <Gem {...p} />,
  brush: (p) => <Brush {...p} />,
  flower: (p) => <Flower {...p} />,
  nail: (p) => <Nail {...p} />,
  leaf: (p) => <Leaf {...p} />,
  eye: (p) => <Eye {...p} />,
};

const TIMES = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30"];

/* ---------------- booking modal ---------------- */
function BookingModal({ preselect, defaultMode, onClose }: { preselect: Service | null; defaultMode: "salon" | "home"; onClose: () => void }) {
  const { addBooking, toast } = useApp();
  const [step, setStep] = useState(preselect ? 2 : 1);
  const [mode, setMode] = useState<"salon" | "home">(preselect && defaultMode === "home" ? "home" : defaultMode);
  const [serviceId, setServiceId] = useState(preselect?.id ?? "");
  const [venueId, setVenueId] = useState("");
  const [artistId, setArtistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [gateway, setGateway] = useState("eSewa");

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1)), []);
  const service = SERVICES.find((s) => s.id === serviceId) ?? null;
  const venues = useMemo(() => (mode === "home" ? SALONS.filter((s) => s.home) : SALONS), [mode]);
  const venue = SALONS.find((s) => s.id === venueId) ?? null;
  const artist = ARTISTS.find((a) => a.id === artistId) ?? null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const confirm = () => {
    if (!service || !date || !time) return;
    if (mode === "salon" && !venueId) { toast("Choose a salon to continue"); return; }
    if (mode === "home" && !artistId) { toast("Choose an artist to continue"); return; }
    if (name.trim().length < 2) { toast("Add your name so the artist knows who to greet"); return; }
    if (mode === "home" && address.trim().length < 8) { toast("Add your full home address for the artist"); return; }
    addBooking({
      service: service.name,
      price: service.price,
      venue: mode === "salon" ? `${venue?.name}, ${venue?.area}` : "Home service",
      artist: mode === "salon" ? (artist?.name ?? "First available artist") : (artist?.name ?? ""),
      date,
      time,
      mode,
      name: name.trim(),
      gateway,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Book a service">
      <button className="absolute inset-0 bg-pine/80 backdrop-blur-sm" onClick={onClose} aria-label="Close booking" />
      <div className="modal-in relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-ivory shadow-2xl sm:rounded-2xl">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-ink/10 bg-sand/70 px-6 py-4 sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-crimson">Junetara booking engine</p>
            <h3 className="font-display text-2xl italic text-pine">Book your service</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((n) => (
              <span key={n} className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold transition-all ${step > n ? "bg-marigold text-pine" : step === n ? "bg-pine text-marigold" : "border border-ink/20 text-ink/40"}`}>
                {step > n ? <Check className="h-3.5 w-3.5" /> : n}
              </span>
            ))}
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink/60 transition hover:bg-crimson hover:text-ivory" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8">
          {step === 1 && (
            <div className="fade-in">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Step 1 — choose your ritual</p>
              <div className="mt-4 space-y-2.5">
                {SERVICES.map((s) => {
                  const Icon = SVC_ICON[s.icon];
                  const active = serviceId === s.id;
                  return (
                    <button key={s.id} onClick={() => setServiceId(s.id)} className={`flex w-full items-center gap-4 rounded-xl border p-3.5 text-left transition-all ${active ? "border-forest bg-forest/5 shadow-sm" : "border-ink/10 bg-white/70 hover:border-marigold/60"}`}>
                      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${active ? "bg-forest text-sun" : "bg-sand text-forest"}`}>
                        {Icon?.({ className: "h-5 w-5" })}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[17px] text-pine">{s.name} <span className="text-[12px] italic text-ink/40">· {s.nep}</span></span>
                        <span className="text-[12.5px] text-ink/55">{s.minutes} min · {s.cat}</span>
                      </span>
                      <span className="shrink-0 font-display text-xl text-crimson">{npr(s.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Step 2 — where & who</p>
                <div className="flex rounded-full border border-ink/15 bg-white/70 p-1">
                  {(["salon", "home"] as const).map((m) => (
                    <button key={m} onClick={() => { setMode(m); setVenueId(""); setArtistId(""); }} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${mode === m ? "bg-pine text-marigold" : "text-ink/55 hover:text-pine"}`}>
                      {m === "salon" ? <Building className="h-3.5 w-3.5" /> : <HomeVisit className="h-3.5 w-3.5" />} {m === "salon" ? "At salon" : "At home"}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "salon" ? (
                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {venues.map((v) => {
                    const active = venueId === v.id;
                    return (
                      <button key={v.id} onClick={() => setVenueId(v.id)} className={`rounded-xl border p-4 text-left transition-all ${active ? "border-forest bg-forest/5 shadow-sm" : "border-ink/10 bg-white/70 hover:border-marigold/60"}`}>
                        <div className="flex items-center justify-between">
                          <p className="font-display text-[17px] text-pine">{v.name}</p>
                          {v.verified && <ShieldCheck className="h-4 w-4 text-forest" />}
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-ink/55"><Pin className="h-3.5 w-3.5 text-crimson" /> {v.area}, {v.city}</p>
                        <div className="mt-1.5 flex items-center gap-1.5"><Stars rating={v.rating} className="h-3 w-3" /><span className="text-[12px] font-bold text-forest">{v.rating}</span><span className="text-[11.5px] text-ink/45">({v.reviews})</span></div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <>
                  <p className="mt-4 rounded-lg bg-marigold/15 px-4 py-2.5 text-[12.5px] font-semibold text-ink/70">
                    <HomeVisit className="mr-1.5 inline h-4 w-4 text-crimson" />
                    Home-service artists are matched by proximity (40%), rating (25%), price (20%), availability (10%) and response time (5%).
                  </p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {ARTISTS.map((a) => {
                      const active = artistId === a.id;
                      return (
                        <button key={a.id} onClick={() => setArtistId(a.id)} className={`flex items-center gap-3.5 rounded-xl border p-4 text-left transition-all ${active ? "border-forest bg-forest/5 shadow-sm" : "border-ink/10 bg-white/70 hover:border-marigold/60"}`}>
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pine font-display text-[15px] italic text-marigold">{a.initials}</span>
                          <span className="min-w-0">
                            <span className="block truncate font-display text-[16px] text-pine">{a.name}</span>
                            <span className="block truncate text-[12px] text-ink/55">{a.spec} · {a.years} yrs</span>
                            <span className="mt-0.5 flex items-center gap-1.5"><Stars rating={a.rating} className="h-3 w-3" /><span className="text-[11.5px] font-bold text-forest">{a.rating}</span><span className="text-[11px] text-ink/45">{a.bookings.toLocaleString()} bookings</span></span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {mode === "salon" && (
                <>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Preferred artist (optional)</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => setArtistId("")} className={`rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-all ${!artistId ? "border-pine bg-pine text-marigold" : "border-ink/15 text-ink/60 hover:border-forest"}`}>First available</button>
                    {ARTISTS.map((a) => (
                      <button key={a.id} onClick={() => setArtistId(a.id)} className={`rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-all ${artistId === a.id ? "border-pine bg-pine text-marigold" : "border-ink/15 text-ink/60 hover:border-forest"}`}>{a.name}</button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Step 3 — when & pay</p>
              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {days.map((d) => {
                  const label = format(d, "EEE d MMM");
                  const active = date === label;
                  return (
                    <button key={label} onClick={() => setDate(label)} className={`rounded-xl border py-3 text-center transition-all ${active ? "border-pine bg-pine text-marigold shadow-md" : "border-ink/10 bg-white/70 hover:border-marigold/60"}`}>
                      <span className="block text-[10px] font-bold uppercase tracking-widest opacity-70">{format(d, "EEE")}</span>
                      <span className="mt-0.5 block font-display text-xl">{format(d, "d")}</span>
                      <span className="block text-[10px] uppercase tracking-wider opacity-70">{format(d, "MMM")}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Available slots <span className="ml-2 normal-case tracking-normal text-ink/40">· 10-min Redis hold once selected</span></p>
              <div className="mt-3 flex flex-wrap gap-2">
                {TIMES.map((t) => (
                  <button key={t} onClick={() => setTime(t)} className={`rounded-full border px-5 py-2.5 text-[13px] font-bold transition-all ${time === t ? "border-forest bg-forest text-sun shadow-md" : "border-ink/15 bg-white/70 hover:border-marigold/70"}`}>{t}</button>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">Your name</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Prakriti Adhikari" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-[14.5px] outline-none transition focus:border-marigold" />
                </label>
                {mode === "home" ? (
                  <label className="block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">Home address</span>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, street, tole, city" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-[14.5px] outline-none transition focus:border-marigold" />
                  </label>
                ) : (
                  <div className="rounded-lg border border-dashed border-ink/20 bg-sand/60 px-4 py-3 text-[13px] text-ink/60">
                    <Pin className="mr-1.5 inline h-4 w-4 text-crimson" />
                    {venue ? `${venue.name} — ${venue.area}, ${venue.city}` : "Salon address appears after confirmation"}
                  </div>
                )}
              </div>

              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Pay with</p>
              <div className="mt-2"><GatewayChips value={gateway} onChange={setGateway} /></div>

              {service && date && time && (
                <div className="ticket mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-pine px-6 py-4 text-ivory">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-marigold">Your booking</p>
                    <p className="font-display text-xl italic">{service.name} — {npr(service.price)}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-4 text-[12.5px] text-ivory/70">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-marigold" /> {date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-marigold" /> {time} · {service.minutes} min</span>
                      {mode === "salon" && venue && <span className="flex items-center gap-1.5"><Pin className="h-3.5 w-3.5 text-marigold" /> {venue.area}</span>}
                      {artist && <span className="flex items-center gap-1.5"><Sparkle className="h-3.5 w-3.5 text-marigold" /> {artist.name}</span>}
                    </p>
                  </div>
                  <Wallet className="h-8 w-8 text-marigold" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-ink/10 bg-sand/70 px-6 py-4 sm:px-8">
          <button onClick={() => (step === 1 ? onClose() : setStep(step - 1))} className="rounded-full border border-ink/20 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ink/65 transition hover:border-crimson hover:text-crimson">
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 3 ? (
            <button
              onClick={() => {
                if (step === 1 && !serviceId) { toast("Choose a service to continue"); return; }
                if (step === 2) {
                  if (mode === "salon" && !venueId) { toast("Choose a salon to continue"); return; }
                  if (mode === "home" && !artistId) { toast("Choose an artist to continue"); return; }
                }
                setStep(step + 1);
              }}
              className="group flex items-center gap-2 rounded-full bg-pine px-7 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-forest"
            >
              Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          ) : (
            <button onClick={confirm} className="group flex items-center gap-2 rounded-full bg-crimson px-7 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-pine">
              <Check className="h-4 w-4" /> Pay {service ? npr(service.price) : ""} & confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Services view ---------------- */
export default function Services() {
  const { searchSeed } = useApp();
  const [mode, setMode] = useState<"salon" | "home">("salon");
  const [q, setQ] = useState(searchSeed.services ?? "");
  const [booking, setBooking] = useState<{ open: boolean; preselect: Service | null }>({ open: false, preselect: null });

  const services = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return SERVICES;
    return SERVICES.filter((s) => `${s.name} ${s.nep} ${s.cat}`.toLowerCase().includes(needle));
  }, [q]);

  const venues = mode === "home" ? SALONS.filter((s) => s.home) : SALONS;

  return (
    <div>
      {/* header */}
      <section className="relative h-[380px] overflow-hidden md:h-[430px]">
        <img src={SALONS[0].img} alt="A verified Junetara partner salon" className="kenburns absolute inset-0 h-full w-full object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-pine/90 via-pine/45 to-pine/25" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
            <Reveal><Kicker tone="light">सेवा · Salon & home services</Kicker></Reveal>
            <Masked as="h1" className="mt-4 font-display text-6xl font-semibold leading-[1.0] text-ivory md:text-7xl" lines={[<>Book a chair —</>, <><em className="italic text-marigold">or a doorstep</em>.</>]} />
            <Reveal delay={250}>
              <p className="mt-4 max-w-2xl text-[15.5px] text-ivory/80">
                {SALONS.length} verified venues and {ARTISTS.length} listed artists in the valley. Transparent NPR pricing,
                live slots, payment by eSewa · Khalti · Fonepay, SMS reminders via Sparrow.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* service menu */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal><Kicker>The menu · मूल्य सूची</Kicker></Reveal>
            <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>Ten ways to <em className="italic text-crimson">glow</em>.</>]} />
          </div>
          <Reveal delay={150}>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services…" className="w-64 rounded-lg border border-ink/15 bg-white/80 py-2.5 pl-10 pr-3 text-[14px] outline-none transition focus:border-marigold" />
            </div>
          </Reveal>
        </div>

        <div data-tour="booking" className="overflow-hidden rounded-xl border border-ink/10 bg-white/60">
          {services.map((s, i) => {
            const Icon = SVC_ICON[s.icon];
            return (
              <Reveal key={s.id} delay={i * 50}>
                <div
                  className={`group grid cursor-pointer items-center gap-4 p-5 transition-colors duration-300 hover:bg-marigold/10 md:grid-cols-[auto_1fr_auto_auto] md:gap-6 md:p-6 ${i > 0 ? "border-t border-ink/10" : ""}`}
                  onClick={() => setBooking({ open: true, preselect: s })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setBooking({ open: true, preselect: s })}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-forest/25 bg-ivory text-forest transition-all duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-sun">
                    {Icon?.({ className: "h-5 w-5" })}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-pine transition-colors group-hover:text-crimson">{s.name} <span className="text-[12px] italic text-ink/40">· {s.nep}</span></h3>
                    <p className="mt-0.5 max-w-xl text-[13.5px] text-ink/60">{s.desc}</p>
                  </div>
                  <div className="flex items-center gap-5 md:flex-col md:items-end md:gap-0.5">
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-ink/55"><Clock className="h-4 w-4 text-marigold" /> {s.minutes} min</span>
                    <span className="font-display text-xl text-crimson">{npr(s.price)}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setBooking({ open: true, preselect: s }); }}
                    className="flex items-center gap-2 rounded-full border border-pine px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-pine transition-all group-hover:bg-pine group-hover:text-marigold"
                  >
                    Book <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </Reveal>
            );
          })}
          {services.length === 0 && (
            <p className="p-10 text-center font-display text-xl italic text-ink/50">No service matches “{q}” — try “facial”, “hair” or “bridal”.</p>
          )}
        </div>
      </section>

      {/* venues / artists */}
      <section className="border-y border-ink/10 bg-sand/60">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Reveal><Kicker>{mode === "salon" ? "Verified venues · साझेदार सैलुन" : "Home-capable partners · घर-घर सेवा"}</Kicker></Reveal>
              <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={mode === "salon" ? [<>Where to <em className="italic text-crimson">sit</em>.</>] : [<>Who comes <em className="italic text-crimson">home</em>.</>]} />
            </div>
            <Reveal delay={150}>
              <div className="flex rounded-full border border-ink/15 bg-white/80 p-1">
                {(["salon", "home"] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-[11.5px] font-bold uppercase tracking-wider transition-all ${mode === m ? "bg-pine text-marigold" : "text-ink/55 hover:text-pine"}`}>
                    {m === "salon" ? <Building className="h-4 w-4" /> : <HomeVisit className="h-4 w-4" />} {m === "salon" ? "At salon" : "At home"}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {mode === "salon" ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {venues.map((v, i) => (
                <Reveal key={v.id} delay={i * 80}>
                  <button onClick={() => setBooking({ open: true, preselect: null })} className="group block h-full w-full overflow-hidden rounded-xl border border-ink/10 bg-ivory text-left transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_55px_-28px_rgba(14,43,38,0.45)]">
                    <div className="relative h-40 overflow-hidden">
                      <img src={v.img} alt={v.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      <div className="absolute left-3 top-3 flex gap-1.5">
                        {v.verified && <span className="flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sun"><ShieldCheck className="h-3 w-3" /> Verified</span>}
                        {v.home && <span className="flex items-center gap-1 rounded-full bg-crimson px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ivory"><HomeVisit className="h-3 w-3" /> Home too</span>}
                      </div>
                      <span className="absolute bottom-3 right-3 rounded-full bg-pine/80 px-2.5 py-1 text-[11px] font-bold text-marigold">{"रू".repeat(v.level)}</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl text-pine">{v.name}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] text-ink/55"><Pin className="h-3.5 w-3.5 text-crimson" /> {v.area}, {v.city}</p>
                      <div className="mt-2 flex items-center gap-2"><Stars rating={v.rating} /><span className="text-[12.5px] font-bold text-forest">{v.rating}</span><span className="text-[12px] text-ink/45">({v.reviews} reviews)</span></div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {v.tags.map((t) => <span key={t} className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-semibold text-ink/60">{t}</span>)}
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ARTISTS.map((a, i) => (
                <Reveal key={a.id} delay={i * 80}>
                  <button onClick={() => setBooking({ open: true, preselect: null })} className="group flex h-full w-full items-start gap-4 rounded-xl border border-ink/10 bg-ivory p-5 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-marigold/70 hover:shadow-[0_28px_55px_-28px_rgba(14,43,38,0.45)]">
                    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pine to-forest font-display text-xl italic text-marigold transition-transform duration-500 group-hover:rotate-6">{a.initials}</span>
                    <span>
                      <span className="block font-display text-xl text-pine">{a.name}</span>
                      <span className="block text-[12px] font-bold uppercase tracking-[0.12em] text-crimson">{a.spec}</span>
                      <span className="mt-1.5 flex items-center gap-2"><Stars rating={a.rating} className="h-3 w-3" /><span className="text-[12px] font-bold text-forest">{a.rating}</span><span className="text-[11.5px] text-ink/45">{a.bookings.toLocaleString()} bookings · {a.years} yrs</span></span>
                      <span className="mt-2 flex items-center gap-1.5 text-[12px] text-ink/55"><Pin className="h-3.5 w-3.5 text-crimson" /> {a.city} {a.home && <span className="rounded-full bg-blush/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-crimson">Home visits</span>}</span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* how the engine works */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal><Kicker>Under the hood</Kicker></Reveal>
            <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>No double</>, <><em className="italic text-crimson">bookings. Ever.</em></>]} />
            <Reveal delay={200}>
              <p className="mt-5 max-w-sm text-[14.5px] text-ink/65">
                The same booking engine powers salon chairs, home visits and bridal event teams — with live
                availability over WebSockets and a Redis slot-hold while you pay.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            <div className="relative">
              <div aria-hidden className="pulse-line absolute left-5 top-6 h-px w-[calc(100%-2.5rem)] bg-forest/20 lg:left-6 lg:top-7 lg:w-[calc(100%-3rem)]" />
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { n: "01", t: "Hold", d: "Pick a slot — it's held for 10 minutes while you pay via your wallet of choice." },
                  { n: "02", t: "Confirm", d: "Vendor gets push + Sparrow SMS instantly. Your calendar and receipt update live." },
                  { n: "03", t: "Rate both ways", d: "After the service, you rate the artist and they rate the visit — trust compounds." },
                ].map((s, i) => (
                  <Reveal key={s.n} delay={i * 120}>
                    <div className="relative rounded-xl border border-ink/10 bg-white/70 p-5">
                      <span className="relative z-10 grid h-11 w-11 place-items-center rounded-full border-2 border-marigold bg-ivory font-display text-[15px] italic text-crimson">{s.n}</span>
                      <h3 className="mt-3 font-display text-xl text-pine">{s.t}</h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/60">{s.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {booking.open && <BookingModal preselect={booking.preselect} defaultMode={mode} onClose={() => setBooking({ open: false, preselect: null })} />}
    </div>
  );
}
