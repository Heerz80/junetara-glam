import { useMemo, useState, type FormEvent } from "react";
import { useApp } from "../context";
import { INTERNSHIPS, JOBS, TRAINERS, REVENUE_STREAMS, ROADMAP, CITIES, npr, SEED_CERTS } from "../data";
import { Kicker, Masked, Reveal, Stars } from "./ui";
import {
  ArrowRight, Briefcase, Building, Calendar, Check, Flower, GradCap, Mail, Qr,
  Search, Seal, ShieldCheck, Sparkle, Users, Wallet, X, Coins,
} from "./Icons";

/* ================= CAREERS ================= */
type CareerTab = "internships" | "jobs" | "trainers" | "verify";

function VerifyPanel() {
  const { certs } = useApp();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<"idle" | "valid" | "invalid">("idle");
  const found = useMemo(() => certs.find((c) => c.id.toLowerCase() === input.trim().toLowerCase()), [certs, input]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setResult(found ? "valid" : "invalid");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <p className="text-[13.5px] leading-relaxed text-ink/65">
          Every Junetara certificate carries a unique ID and QR code, issued only after logged practical hours
          and a passing assessment. Employers scan or type the ID — verification takes two seconds, not two phone calls.
        </p>
        <form onSubmit={submit} className="mt-5 flex gap-2">
          <div className="relative flex-1">
            <Qr className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
            <input
              value={input}
              onChange={(e) => { setInput(e.target.value); setResult("idle"); }}
              placeholder="e.g. JG-2026-0147"
              className="w-full rounded-lg border border-ink/15 bg-white py-3.5 pl-11 pr-3 font-mono text-[14.5px] tracking-wider outline-none transition focus:border-marigold"
              aria-label="Certificate ID"
            />
          </div>
          <button type="submit" className="rounded-lg bg-pine px-6 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-forest">Verify</button>
        </form>
        <p className="mt-3 text-[12px] text-ink/50">
          Try a live one:{" "}
          {SEED_CERTS.map((c, i) => (
            <span key={c.id}>
              <button onClick={() => { setInput(c.id); setResult("idle"); }} className="font-mono font-bold text-crimson hover:underline">{c.id}</button>
              {i < SEED_CERTS.length - 1 && " · "}
            </span>
          ))}
        </p>
        <p className="mt-5 text-[12px] text-ink/50">Certificates you earn in My Space courses are added here automatically.</p>
      </div>

      <div className="min-h-[300px]">
        {result === "idle" && (
          <div className="grid h-full place-items-center rounded-xl border-2 border-dashed border-ink/20 bg-white/50 p-10 text-center">
            <div>
              <Qr className="mx-auto h-12 w-12 text-ink/25" />
              <p className="mt-3 font-display text-xl italic text-ink/45">Awaiting a certificate ID…</p>
            </div>
          </div>
        )}
        {result === "invalid" && (
          <div className="fade-in flex h-full flex-col items-center justify-center rounded-xl border border-crimson/40 bg-crimson/5 p-10 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-crimson text-ivory"><X className="h-7 w-7" /></span>
            <p className="mt-4 font-display text-2xl italic text-crimson">Not found in the registry</p>
            <p className="mt-2 max-w-sm text-[13.5px] text-ink/60">This ID has not been issued by Junetara Glam. Treat the credential with caution and report suspicious certificates.</p>
          </div>
        )}
        {result === "valid" && found && (
          <div className="fade-in relative overflow-hidden rounded-xl border-2 border-forest bg-white p-7 shadow-[0_30px_60px_-30px_rgba(14,43,38,0.5)]">
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-marigold/15 blur-2xl" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-forest"><Flower className="h-3.5 w-3.5 text-marigold" /> Junetara Glam · Certified</p>
                <h3 className="mt-2 font-display text-3xl italic text-pine">{found.holder}</h3>
                <p className="mt-1 text-[14px] font-semibold text-crimson">{found.course}</p>
              </div>
              <span className="stamp-in grid h-20 w-20 shrink-0 place-items-center rounded-full border-[3px] border-forest text-center font-display text-[11px] font-bold uppercase leading-tight text-forest">
                Verified<br />✓ QR
              </span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-dashed border-ink/20 pt-5 text-[13.5px] sm:grid-cols-4">
              <div><dt className="text-[10.5px] font-bold uppercase tracking-wider text-ink/45">Institute</dt><dd className="mt-0.5 font-semibold text-ink/80">{found.center}</dd></div>
              <div><dt className="text-[10.5px] font-bold uppercase tracking-wider text-ink/45">Issued</dt><dd className="mt-0.5 font-semibold text-ink/80">{found.date}</dd></div>
              <div><dt className="text-[10.5px] font-bold uppercase tracking-wider text-ink/45">Practical hours</dt><dd className="mt-0.5 font-semibold text-ink/80">{found.hours}h logged</dd></div>
              <div><dt className="text-[10.5px] font-bold uppercase tracking-wider text-ink/45">Registry ID</dt><dd className="mt-0.5 font-mono font-bold text-forest">{found.id}</dd></div>
            </dl>
            <p className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-forest"><ShieldCheck className="h-4 w-4" /> Signature matches issuer record · Skill badges attached to holder profile</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function Careers() {
  const { apply, applications, searchSeed } = useApp();
  const [tab, setTab] = useState<CareerTab>("internships");
  const [q, setQ] = useState(searchSeed.careers ?? "");
  const qq = q.trim().toLowerCase();
  const matchListing = (l: (typeof INTERNSHIPS)[number]) =>
    !qq || [l.title, l.org, l.area, l.level, ...l.skills].join(" ").toLowerCase().includes(qq);
  const matchTrainer = (t: (typeof TRAINERS)[number]) =>
    !qq || [t.name, t.spec, t.creds].join(" ").toLowerCase().includes(qq);

  const tabs: { id: CareerTab; label: string; count?: number }[] = [
    { id: "internships", label: "Internships", count: INTERNSHIPS.length },
    { id: "jobs", label: "Jobs", count: JOBS.length },
    { id: "trainers", label: "Trainers", count: TRAINERS.length },
    { id: "verify", label: "Verify certificate" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-sand/70">
        <p aria-hidden className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[170px] font-bold leading-none text-forest/10">अवसर</p>
        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-16 md:px-8">
          <Reveal><Kicker>अवसर · The talent layer</Kicker></Reveal>
          <Masked as="h1" className="mt-5 font-display text-6xl font-semibold leading-[1.0] text-pine md:text-7xl" lines={[<>Skills in.</>, <><em className="italic text-crimson">Livelihoods out.</em></>]} />
          <Reveal delay={200}>
            <p className="mt-5 max-w-2xl text-lg text-ink/65">
              Nepal's first structured beauty employment pipeline: algorithm-matched internships, a verified
              trainer database, and QR certificates employers can trust in seconds.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="relative mb-6 max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/35" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search internships, jobs, trainers, skills…"
            className="w-full rounded-lg border border-ink/15 bg-white/80 py-3.5 pl-12 pr-4 text-[15px] outline-none transition focus:border-marigold focus:bg-ivory"
            aria-label="Search the talent layer"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 transition hover:text-crimson" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.12em] transition-all ${tab === t.id ? "bg-pine text-marigold" : "bg-white/70 text-ink/60 hover:text-pine border border-ink/10"}`}>
              {t.label}
              {t.count !== undefined && <span className={`rounded-full px-2 py-0.5 text-[10.5px] ${tab === t.id ? "bg-marigold text-pine" : "bg-sand text-ink/55"}`}>{t.count}</span>}
            </button>
          ))}
        </div>

        {(tab === "internships" || tab === "jobs") && (
          (tab === "internships" ? INTERNSHIPS : JOBS).filter(matchListing).length === 0 ? (
            <p className="rounded-xl border-2 border-dashed border-ink/20 bg-white/50 p-10 text-center text-[14px] text-ink/55">
              Nothing matches “{q}” in {tab} — try “bridal”, “trainer” or a skill.
            </p>
          ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {(tab === "internships" ? INTERNSHIPS : JOBS).filter(matchListing).map((l, i) => {
              const applied = applications.some((a) => a.listingId === l.id);
              return (
                <Reveal key={l.id} delay={(i % 2) * 90}>
                  <article className={`ticket flex h-full flex-col rounded-xl border p-6 transition-all duration-500 hover:-translate-y-1 ${applied ? "border-forest/50 bg-forest/5" : "border-ink/10 bg-white/80 hover:border-marigold/60 hover:shadow-[0_26px_55px_-28px_rgba(14,43,38,0.42)]"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <span className={`grid h-11 w-11 place-items-center rounded-full ${l.kind === "internship" ? "bg-marigold/25 text-forest" : "bg-crimson/15 text-crimson"}`}>
                        {l.kind === "internship" ? <GradCap className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${l.kind === "internship" ? "bg-marigold/20 text-forest" : "bg-crimson/10 text-crimson"}`}>{l.kind}</span>
                    </div>
                    <h3 className="mt-4 font-display text-2xl text-pine">{l.title}</h3>
                    <p className="mt-1 text-[13.5px] font-semibold text-ink/60">{l.org} · {l.area}</p>
                    <p className="mt-2 font-display text-lg text-crimson">{l.pay}</p>
                    <p className="text-[12.5px] text-ink/55">Looking for: {l.level}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {l.skills.map((s) => <span key={s} className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-semibold text-ink/60">{s}</span>)}
                    </div>
                    <div className="mt-5 border-t border-dashed border-ink/15 pt-4">
                      {applied ? (
                        <span className="flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-wider text-forest"><Check className="h-4 w-4" /> Applied — under review</span>
                      ) : (
                        <button onClick={() => apply(l.id, l.title, l.org, l.kind)} className="group flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-marigold transition hover:bg-crimson hover:text-ivory">
                          Apply with Junetara profile <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
          )
        )}

        {tab === "trainers" && (
          TRAINERS.filter(matchTrainer).length === 0 ? (
            <p className="rounded-xl border-2 border-dashed border-ink/20 bg-white/50 p-10 text-center text-[14px] text-ink/55">
              No trainer matches “{q}” — try “hair”, “ayurvedic” or “cosmetology”.
            </p>
          ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRAINERS.filter(matchTrainer).map((t, i) => (
              <Reveal key={t.id} delay={i * 90}>
                <article className="flex h-full flex-col rounded-xl border border-ink/10 bg-white/80 p-6 text-center transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_55px_-28px_rgba(14,43,38,0.42)]">
                  <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-pine to-forest font-display text-2xl italic text-marigold">{t.initials}</span>
                  <h3 className="mt-4 font-display text-xl text-pine">{t.name}</h3>
                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.12em] text-crimson">{t.spec}</p>
                  <p className="mt-2.5 rounded-lg bg-sand/80 px-3 py-2 text-[12px] font-semibold text-ink/65">{t.creds}</p>
                  <div className="mt-3 flex items-center justify-center gap-2 text-[12.5px] text-ink/55">
                    <Stars rating={t.rating} className="h-3 w-3" /> <b className="text-forest">{t.rating}</b> · {t.students.toLocaleString()} students · {t.years} yrs
                  </div>
                  <span className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-forest"><ShieldCheck className="h-3.5 w-3.5" /> Verified trainer</span>
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
          )
        )}

        {tab === "verify" && (
          <Reveal>
            <VerifyPanel />
          </Reveal>
        )}
      </section>

      {applications.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
          <Reveal>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">Your applications · {applications.length}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {applications.map((a) => (
                  <span key={a.id} className="flex items-center gap-2 rounded-full bg-sand px-4 py-2 text-[12.5px] font-semibold text-ink/70">
                    {a.kind === "internship" ? <GradCap className="h-3.5 w-3.5 text-forest" /> : <Briefcase className="h-3.5 w-3.5 text-crimson" />}
                    {a.title} — {a.org}
                    <span className="rounded-full bg-marigold/30 px-2 py-0.5 text-[10px] font-bold uppercase text-forest">under review</span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      )}
    </div>
  );
}

/* ================= PARTNER ================= */
const PARTNER_TYPES = [
  { id: "Salon / Parlor", icon: Building, desc: "List services, fill off-peak chairs, manage slots", perk: "0% commission for 6 months (seed)" },
  { id: "Freelance Artist", icon: Sparkle, desc: "Build a clientele without a storefront — home & events", perk: "Free profile + portfolio page" },
  { id: "Training Centre", icon: GradCap, desc: "Publish CTEVT-aligned courses, manage batches & fees", perk: "Free verification audit" },
  { id: "Product Vendor", icon: Coins, desc: "Sell B2C retail and B2B wholesale beyond Kathmandu", perk: "Logistics handled by partners" },
];

function RoiCalculator() {
  const [customers, setCustomers] = useState(14);
  const [ticket, setTicket] = useState(1500);
  const [idle, setIdle] = useState(50);
  const capture = 0.3;
  const monthly = Math.round(customers * 30 * ticket * (idle / 100) * capture);
  const yearly = monthly * 12;
  return (
    <div className="rounded-xl border border-ink/10 bg-white/85 p-6 md:p-7">
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-crimson"><Wallet className="h-4 w-4" /> Vendor ROI calculator</p>
      <div className="mt-5 space-y-5">
        {[
          { label: "Customers per day today", val: customers, set: setCustomers, min: 4, max: 40, unit: "" },
          { label: "Average ticket (NPR)", val: ticket, set: setTicket, min: 500, max: 5000, unit: "", step: 100 },
          { label: "Idle capacity (off-peak)", val: idle, set: setIdle, min: 20, max: 70, unit: "%" },
        ].map((s) => (
          <label key={s.label} className="block">
            <span className="flex items-baseline justify-between text-[13px] font-semibold text-ink/70">
              {s.label}
              <span className="font-display text-lg italic text-forest">{s.val.toLocaleString("en-IN")}{s.unit}</span>
            </span>
            <input type="range" min={s.min} max={s.max} step={s.step ?? 1} value={s.val} onChange={(e) => s.set(Number(e.target.value))} className="mt-2 w-full" />
          </label>
        ))}
      </div>
      <div className="ticket mt-6 flex items-center justify-between gap-4 rounded-lg bg-pine px-6 py-5 text-ivory">
        <div>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-marigold">Estimated extra revenue (30% capture)</p>
          <p className="font-display text-3xl font-semibold">{npr(monthly)}<span className="text-base italic text-ivory/60"> / month</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-marigold">Per year</p>
          <p className="font-display text-2xl text-sun">{npr(yearly)}</p>
        </div>
      </div>
      <p className="mt-3 text-[11.5px] text-ink/50">Conservative model from the financial plan — active salons handle 10–20 clients/day; Junetara captures 3–5% of that digitally.</p>
    </div>
  );
}

export function Partner() {
  const { submitPartner, partnerLeads } = useApp();
  const [type, setType] = useState(PARTNER_TYPES[0].id);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [city, setCity] = useState(CITIES[0]);
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const next = () => {
    if (step === 3) {
      if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 9) return;
      submitPartner(type, name.trim(), city);
      setDone(true);
      return;
    }
    setStep(step + 1);
  };

  return (
    <div>
      <section className="relative overflow-hidden bg-pine text-ivory">
        <p aria-hidden className="pointer-events-none absolute -right-6 -top-12 select-none font-display text-[190px] font-bold leading-none text-ivory/[0.045]">साझेदार</p>
        <div aria-hidden className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-crimson/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-16 md:px-8">
          <Reveal><Kicker tone="light">साझेदार · Vendor onboarding</Kicker></Reveal>
          <Masked as="h1" className="mt-5 font-display text-6xl font-semibold leading-[1.0] md:text-7xl" lines={[<>Join the first</>, <><em className="italic text-marigold">100</em>.</>]} />
          <Reveal delay={200}>
            <p className="mt-5 max-w-2xl text-lg text-ivory/75">
              The seed cohort gets <strong className="text-sun">0% commission for 6 months</strong>, free premium listings and a
              dedicated success manager. Kathmandu first — Thamel, New Baneshwor, Lazimpat and beyond.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 text-[13px] font-semibold text-ivory/70">
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-marigold" /> 100 vendors in 90 days</span>
              <span className="flex items-center gap-2"><Check className="h-4 w-4 text-marigold" /> 40 salons · 20 freelancers · 15 academies · 15 home providers · 10 product vendors</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* types + onboarding */}
      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal><Kicker>Choose your lane</Kicker></Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PARTNER_TYPES.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <button onClick={() => setType(p.id)} className={`flex h-full w-full flex-col rounded-xl border-2 p-5 text-left transition-all ${type === p.id ? "border-marigold bg-marigold/10 shadow-md" : "border-ink/10 bg-white/70 hover:border-forest/40"}`}>
                  <span className={`grid h-11 w-11 place-items-center rounded-full ${type === p.id ? "bg-pine text-marigold" : "bg-sand text-forest"}`}><p.icon className="h-5 w-5" /></span>
                  <h3 className="mt-3 font-display text-xl text-pine">{p.id}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink/60">{p.desc}</p>
                  <p className="mt-3 text-[11.5px] font-bold uppercase tracking-wider text-crimson">✳ {p.perk}</p>
                </button>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200}>
            <div className="mt-8 overflow-hidden rounded-xl border border-ink/10">
              <table className="w-full text-left text-[13.5px]">
                <thead className="bg-forest text-sun">
                  <tr><th className="px-4 py-3 font-bold">Commission phase</th><th className="px-4 py-3 font-bold">Rate</th><th className="px-4 py-3 font-bold">Who gets it</th></tr>
                </thead>
                <tbody className="text-ink/75">
                  {[
                    ["Seed partners · Weeks 1–4", "0% for 6 months", "First 20 vendors"],
                    ["Wave 1 · Weeks 5–8", "5%", "Referrals & association partners"],
                    ["Wave 2 · Weeks 9–12", "8%", "Training centres & freelancers"],
                    ["Standard (Year 1+)", "10–15%", "All vendors"],
                  ].map((r, i) => (
                    <tr key={r[0]} className={i % 2 ? "bg-white/60" : "bg-sand/50"}>
                      <td className="px-4 py-2.5 font-semibold">{r[0]}</td>
                      <td className="px-4 py-2.5 font-display text-lg text-crimson">{r[1]}</td>
                      <td className="px-4 py-2.5">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={150}>
            <div className="rounded-xl border border-ink/10 bg-ivory p-6 shadow-[0_30px_60px_-30px_rgba(14,43,38,0.4)] md:p-7">
              {done ? (
                <div className="fade-in text-center">
                  <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest text-sun"><Seal className="h-8 w-8" /></span>
                  <h3 className="mt-5 font-display text-3xl italic text-pine">Application received!</h3>
                  <p className="mx-auto mt-3 max-w-xs text-[14px] text-ink/65">
                    Reference <strong className="font-mono text-forest">{partnerLeads[partnerLeads.length - 1]?.id ?? "JG-V-XXXX"}</strong>.
                    Our onboarding team will call within 48 hours with your dashboard login and verification checklist.
                  </p>
                  <button onClick={() => { setDone(false); setStep(1); setName(""); setPhone(""); }} className="mt-6 rounded-full border border-ink/20 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ink/60 transition hover:border-crimson hover:text-crimson">
                    Submit another
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">Onboarding · {type}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3].map((n) => (
                        <span key={n} className={`h-1.5 w-8 rounded-full transition-colors ${step >= n ? "bg-marigold" : "bg-ink/15"}`} />
                      ))}
                    </div>
                  </div>
                  {step === 1 && (
                    <div className="fade-in mt-5">
                      <h3 className="font-display text-2xl italic text-pine">What will you list?</h3>
                      <p className="mt-2 text-[13.5px] text-ink/60">You picked <strong className="text-pine">{type}</strong>. We'll tailor your dashboard — bookings, courses, listings or wholesale orders.</p>
                      <ul className="mt-4 space-y-2">
                        {["Self-service profile & catalogue setup", "eSewa/Khalti settlements, weekly payout", "Sparrow SMS confirmations included", "Performance analytics from day one"].map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-ink/70"><Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" /> {f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="fade-in mt-5 space-y-3.5">
                      <h3 className="font-display text-2xl italic text-pine">Your details</h3>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">{type === "Freelance Artist" ? "Full name" : "Business name"}</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder={type === "Freelance Artist" ? "e.g. Sabina Maharjan" : "e.g. Asha Beauty Lounge"} className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-[14.5px] outline-none transition focus:border-marigold" />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">City</span>
                        <select value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-[14.5px] outline-none focus:border-marigold">
                          {CITIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </label>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="fade-in mt-5 space-y-3.5">
                      <h3 className="font-display text-2xl italic text-pine">How do we reach you?</h3>
                      <label className="block">
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">Mobile (WhatsApp preferred)</span>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" inputMode="tel" className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-[14.5px] outline-none transition focus:border-marigold" />
                      </label>
                      <p className="rounded-lg bg-marigold/15 px-4 py-3 text-[12.5px] font-semibold text-ink/70">
                        <Users className="mr-1.5 inline h-4 w-4 text-crimson" />
                        {name || "Your business"} · {city} · {type}
                      </p>
                    </div>
                  )}
                  <div className="mt-6 flex items-center justify-between gap-3">
                    {step > 1 ? (
                      <button onClick={() => setStep(step - 1)} className="rounded-full border border-ink/20 px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink/60 transition hover:border-crimson hover:text-crimson">Back</button>
                    ) : <span />}
                    <button
                      onClick={next}
                      disabled={step === 3 && (name.trim().length < 2 || phone.replace(/\D/g, "").length < 9)}
                      className="group flex items-center gap-2 rounded-full bg-crimson px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-ivory transition hover:bg-pine disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {step === 3 ? "Submit application" : "Continue"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </Reveal>
          <Reveal delay={250}>
            <div className="mt-5"><RoiCalculator /></div>
          </Reveal>
        </div>
      </section>

      {/* 90-day roadmap */}
      <section className="border-t border-ink/10 bg-sand/60">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Reveal><Kicker>The 90-day build</Kicker></Reveal>
              <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>From zero to <em className="italic text-crimson">launch</em>.</>]} />
            </div>
            <Reveal delay={150}>
              <p className="max-w-xs text-[13.5px] text-ink/60">Five sprints, one focused MVP: course enrollment, service booking, vendor onboarding, admin panel.</p>
            </Reveal>
          </div>
          <div className="relative">
            <div aria-hidden className="pulse-line absolute left-0 right-0 top-7 hidden h-px bg-forest/25 lg:block" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {ROADMAP.map((r, i) => (
                <Reveal key={r.sprint} delay={i * 110}>
                  <div className="relative h-full rounded-xl border border-ink/10 bg-ivory p-5 transition-all duration-500 hover:-translate-y-1 hover:border-marigold/70">
                    <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border-2 border-marigold bg-pine font-display text-[15px] italic text-marigold">{i + 1}</span>
                    <p className="mt-3 text-[10.5px] font-bold uppercase tracking-[0.18em] text-crimson">{r.sprint} · {r.weeks}</p>
                    <h3 className="mt-1 font-display text-xl text-pine">{r.title}</h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-ink/60">{r.desc}</p>
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-forest">{r.focus}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={300}>
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-ink/10 bg-ivory p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">Year-1 revenue mix (projected)</p>
                <div className="mt-4 space-y-2.5">
                  {REVENUE_STREAMS.map((r, i) => (
                    <div key={r.stream} className="flex items-center justify-between gap-3 border-b border-dashed border-ink/15 pb-2.5 text-[13.5px] last:border-0">
                      <span className="font-semibold text-ink/75">{r.stream}</span>
                      <span className="flex items-center gap-3 whitespace-nowrap">
                        <span className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-bold text-ink/60">{r.rate}</span>
                        <span className="font-display text-lg text-forest">{r.y1}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-right font-display text-xl italic text-crimson">Year 1 total: NPR 48–96 lakh</p>
              </div>
              <div className="flex flex-col justify-center rounded-xl bg-pine p-7 text-ivory">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-marigold"><Mail className="h-4 w-4" /> Strategic partner</p>
                <h3 className="mt-3 font-display text-3xl italic">B Polytechnic Institute Pvt. Ltd.</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ivory/70">
                  BPI is the strategic brain behind Junetara Glam — platform architecture, investor relations,
                  CTEVT liaison and AI/IT strategy. 23+ years of institutional experience.
                </p>
                <p className="mt-4 text-[13px] text-ivory/60">President: Heera Bohara Bhandari · Dhangadhi-1, Kailali | Sukedhara-4, Kathmandu</p>
                <p className="mt-1 flex items-center gap-2 text-[13px] text-marigold"><Mail className="h-4 w-4" /> heerabohara80@gmail.com</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
