import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useApp } from "../context";
import { MARKET_SEGMENTS, ADMIN_REVENUE } from "../data";
import { Counter } from "./ui";
import {
  ArrowLeft, ArrowRight, Check, Flower, GradCap, Printer, Sparkle, Users, X,
} from "./Icons";

const DEV = ["०१", "०२", "०३", "०४", "०५", "०६", "०७", "०८", "०९", "१०", "११", "१२"];
const TITLES = [
  "Problem", "Solution", "Market", "Product", "Business model", "Traction plan",
  "Go-to-market", "Competition", "Team", "Financials", "Impact", "The ask",
];

/* ---------- small deck-only primitives ---------- */
function Kick({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] text-marigold">
      <span className="h-px w-10 bg-marigold/60" />
      {children}
      <Flower className="h-3.5 w-3.5" />
    </p>
  );
}

function Stat({ v, label, tone = "ivory" }: { v: ReactNode; label: string; tone?: "ivory" | "gold" | "red" }) {
  const c = tone === "gold" ? "text-marigold" : tone === "red" ? "text-coral" : "text-ivory";
  return (
    <div className="border-l-2 border-marigold/50 pl-4">
      <p className={`font-display text-4xl font-semibold leading-none md:text-5xl ${c}`}>{v}</p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory/50">{label}</p>
    </div>
  );
}

function Tick({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`flex items-center gap-2 text-[13px] ${ok ? "text-ivory/85" : "text-ivory/35"}`}>
      <span className={`grid h-5 w-5 place-items-center rounded-full ${ok ? "bg-marigold text-pine" : "bg-ivory/10 text-ivory/40"}`}>
        {ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      </span>
      {label}
    </span>
  );
}

function AreaMini({ data, unit }: { data: { m: string; v: number }[]; unit: string }) {
  const W = 320, H = 130, max = Math.max(...data.map((d) => d.v));
  const pts = data.map((d, i) => [ (i / (data.length - 1)) * (W - 16) + 8, H - 18 - (d.v / max) * (H - 40) ] as const);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H - 12} L${pts[0][0]},${H - 12} Z`;
  const last = pts[pts.length - 1];
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        <defs>
          <linearGradient id="deckArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffb800" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffb800" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1="8" x2={W - 8} y1={H - 18 - g * (H - 40)} y2={H - 18 - g * (H - 40)} stroke="#f4f6fc" strokeOpacity="0.08" />
        ))}
        <path d={area} fill="url(#deckArea)" className="fade-in" />
        <path d={line} fill="none" stroke="#ffb800" strokeWidth="2.5" strokeLinecap="round" className="fade-in" />
        <circle cx={last[0]} cy={last[1]} r="4.5" fill="#ffb800" className="blink" />
      </svg>
      <div className="mt-1 flex justify-between text-[10.5px] font-bold uppercase tracking-wider text-ivory/40">
        <span>{data[0].m}</span>
        <span className="text-marigold">peak · {unit}</span>
        <span>{data[data.length - 1].m}</span>
      </div>
    </div>
  );
}

function Donut({ segments, centerTop, centerBottom }: {
  segments: { pct: number; color: string; label: string }[];
  centerTop: string;
  centerBottom: string;
}) {
  const R = 52, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="flex items-center gap-7">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          {segments.map((s) => {
            const len = (s.pct / 100) * C;
            const off = -acc;
            acc += len;
            return (
              <circle key={s.label} cx="70" cy="70" r={R} fill="none" stroke={s.color} strokeWidth="16"
                strokeDasharray={`${len} ${C - len}`} strokeDashoffset={off} strokeLinecap="butt" />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-xl font-semibold text-marigold">{centerTop}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ivory/50">{centerBottom}</p>
          </div>
        </div>
      </div>
      <ul className="space-y-2.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5 text-[13px] text-ivory/75">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
            {s.label}
            <span className="ml-auto pl-4 font-display text-base text-ivory">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- slide shell ---------- */
function Slide({ active, dev, children }: { active: boolean; dev: string; children: ReactNode }) {
  return (
    <section className={`deck-slide ${active ? "active" : ""}`}>
      <div key={active ? "on" : "off"} className="relative flex min-h-full w-full items-center">
        <span aria-hidden className="pointer-events-none absolute -bottom-16 right-0 select-none font-display text-[300px] font-bold leading-none text-ivory/[0.04] md:text-[380px]">
          {dev}
        </span>
        <div aria-hidden className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-crimson/15 blur-3xl" />
        {children}
      </div>
    </section>
  );
}

const SPANS: Record<number, [string, string]> = {
  5: ["lg:col-span-5", "lg:col-span-7"],
  6: ["lg:col-span-6", "lg:col-span-6"],
  7: ["lg:col-span-7", "lg:col-span-5"],
};

function Grid({ left, right, leftSpan = 6 }: { left: ReactNode; right?: ReactNode; leftSpan?: number }) {
  const [l, r] = SPANS[leftSpan] ?? SPANS[6];
  return (
    <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-6 pb-32 pt-24 md:px-10 lg:grid-cols-12 lg:gap-14">
      <div className={l}>{left}</div>
      {right && <div className={r}>{right}</div>}
    </div>
  );
}

/* ---------- the deck ---------- */
export default function Deck() {
  const { go } = useApp();
  const [i, setI] = useState(0);
  const next = useCallback(() => setI((v) => Math.min(11, v + 1)), []);
  const prev = useCallback(() => setI((v) => Math.max(0, v - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(11);
      else if (e.key === "Escape") go("home");
      else if (e.key.toLowerCase() === "p") window.print();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [next, prev, go]);

  const ORDERS_CURVE = [
    { m: "M1–3", v: 10 }, { m: "M4–6", v: 25 }, { m: "M7–9", v: 50 }, { m: "M10–12", v: 80 },
    { m: "M13–15", v: 120 }, { m: "M16–18", v: 170 }, { m: "M19–21", v: 220 }, { m: "M22–24", v: 300 },
  ];

  const MATRIX_COLS = ["Training", "Booking", "Products", "Jobs", "Integrated"];
  const MATRIX_ROWS = [
    { name: "Facebook groups", cells: [false, false, false, false, false] },
    { name: "Daraz / SastoDeal", cells: [false, false, true, false, false] },
    { name: "Individual salon apps", cells: [false, true, false, false, false] },
    { name: "Zoom Beauty Academy", cells: [true, false, false, false, false] },
    { name: "Urban Company (India)", cells: [false, true, false, false, false] },
  ];

  return (
    <div className="deck-root fixed inset-0 z-[90] overflow-hidden bg-pine font-body text-ivory">
      {/* chrome — top */}
      <div className="deck-chrome absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-4 md:px-10">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-marigold text-pine"><Flower className="h-5 w-5" /></span>
          <span className="leading-none">
            <span className="block font-display text-lg font-semibold italic">Junetara Glam</span>
            <span className="text-[8.5px] font-bold uppercase tracking-[0.34em] text-marigold/80">Investor deck · v1.0</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-coral/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-coral sm:block">Confidential · Apr 2026</span>
          <span className="rounded-full border border-ivory/20 px-3.5 py-1.5 font-mono text-[12px] font-bold text-ivory/70">
            {String(i + 1).padStart(2, "0")} / 12
          </span>
          <button onClick={() => window.print()} className="flex items-center gap-2 rounded-full border border-ivory/20 px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-ivory/70 transition hover:border-marigold hover:text-marigold" aria-label="Print deck">
            <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Print</span>
          </button>
          <button onClick={() => go("home")} className="grid h-9 w-9 place-items-center rounded-full bg-crimson text-ivory transition hover:bg-marigold hover:text-pine" aria-label="Exit deck">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* slides */}
      <div className="h-full overflow-y-auto scroll-elegant">
        {/* 1 — problem */}
        <Slide active={i === 0} dev={DEV[0]}>
          <Grid
            left={
              <div className="fade-in">
                <Kick>01 · The problem</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  A <em className="italic text-marigold">USD 2B</em> industry,
                  <br />invisible to the internet.
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-ivory/65">
                  Nepal's beauty economy runs on walk-ins, phone calls and word-of-mouth.
                  No verified training. No booking. No data. The market cannot self-correct
                  because <strong className="text-ivory">no information flows exist</strong>.
                </p>
              </div>
            }
            right={
              <div className="fade-in grid grid-cols-2 gap-6" style={{ animationDelay: "200ms" }}>
                <Stat v={<><Counter to={500} suffix="+" /></>} label="unverified training centres" tone="red" />
                <Stat v={<Counter to={0} />} label="integrated platforms in Nepal" tone="red" />
                <Stat v="40–60%" label="salon capacity sitting idle" />
                <Stat v="रू 2,000" label="customer acquisition via flyers" />
                <div className="col-span-2 rounded-xl border border-dashed border-ivory/20 p-5 text-[13.5px] text-ivory/60">
                  Students can't compare courses · customers can't trust bookings ·
                  vendors can't reach demand · graduates can't find work
                </div>
              </div>
            }
          />
        </Slide>

        {/* 2 — solution */}
        <Slide active={i === 1} dev={DEV[1]}>
          <Grid
            leftSpan={5}
            left={
              <div className="fade-in">
                <Kick>02 · The solution</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  One platform.
                  <br /><em className="italic text-marigold">Five layers.</em>
                  <br />Whole industry.
                </h2>
                <p className="mt-6 max-w-md text-lg text-ivory/65">
                  Training, services, products and careers — connected so every
                  transaction feeds the next.
                </p>
              </div>
            }
            right={
              <div className="fade-in space-y-2.5" style={{ animationDelay: "180ms" }}>
                {[
                  ["01", "Discovery", "Search courses, salons, products, artists — GPS + rating filters"],
                  ["02", "Transaction", "Booking · enrollment · checkout via eSewa, Khalti, Fonepay"],
                  ["03", "Fulfillment", "Scheduling, vendor ops, SMS reminders, delivery tracking"],
                  ["04", "Talent system", "Internship matching, trainer DB, QR-verified certificates"],
                  ["05", "Intelligence", "Ratings, AI recommendations, demand prediction"],
                ].map(([n, t, d], k) => (
                  <div key={n} className="group flex items-center gap-5 rounded-xl border border-ivory/12 bg-ivory/5 p-4 transition-all hover:translate-x-1.5 hover:border-marigold/50" style={{ animationDelay: `${k * 90}ms` }}>
                    <span className="font-display text-2xl italic text-marigold/70">{n}</span>
                    <div>
                      <p className="font-display text-xl">{t}</p>
                      <p className="text-[12.5px] text-ivory/55">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            }
          />
        </Slide>

        {/* 3 — market */}
        <Slide active={i === 2} dev={DEV[2]}>
          <Grid
            leftSpan={5}
            left={
              <div className="fade-in">
                <Kick>03 · Market size</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  USD <Counter to={2} decimals={1} suffix="B" />
                  <br />and growing
                  <br /><em className="italic text-marigold">8–10%</em> a year.
                </h2>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {[["TAM", "USD 1.5–2.0B"], ["SAM", "USD 200–300M"], ["SOM · Yr 3", "USD 5–10M"]].map(([k, v]) => (
                    <span key={k} className="rounded-full border border-marigold/40 bg-marigold/10 px-4 py-2 text-[12.5px] font-bold">
                      <span className="text-marigold">{k}</span> <span className="text-ivory/80">{v}</span>
                    </span>
                  ))}
                </div>
                <div className="mt-7 grid grid-cols-3 gap-5">
                  <Stat v="24" label="median age · 60% under 30" />
                  <Stat v="12M" label="social media users" />
                  <Stat v="रू 80B" label="wedding industry / yr" />
                </div>
              </div>
            }
            right={
              <div className="fade-in rounded-2xl border border-ivory/12 bg-ivory/5 p-7" style={{ animationDelay: "200ms" }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">Addressable market by segment</p>
                <div className="mt-5 space-y-4">
                  {MARKET_SEGMENTS.map((s, k) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-[12.5px]">
                        <span className="text-ivory/80">{s.label}</span>
                        <span className="text-ivory/45">{s.usd} · <span className="text-marigold">{s.cagr}</span></span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ivory/10">
                        <div className={`h-full rounded-full bg-gradient-to-r from-marigold to-sun ${i === 2 ? "bar-grow" : ""}`} style={{ width: `${Math.max(s.width, 4)}%`, animationDelay: `${k * 110}ms` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 border-t border-ivory/10 pt-3 text-[11px] text-ivory/40">Beauty training alone grows 15–20% CAGR — the layer nobody has digitised.</p>
              </div>
            }
          />
        </Slide>

        {/* 4 — product */}
        <Slide active={i === 3} dev={DEV[3]}>
          <Grid
            left={
              <div className="fade-in">
                <Kick>04 · Product · MVP in 90 days</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  Ship the core.
                  <br /><em className="italic text-marigold">Skip the noise.</em>
                </h2>
                <div className="mt-7 grid gap-2.5 sm:grid-cols-2">
                  {["Course listing + enrollment", "Salon & home booking", "Vendor onboarding", "Admin panel", "Auth + OTP", "eSewa / Khalti payments"].map((f, k) => (
                    <div key={f} className="fade-in flex items-center gap-2.5 rounded-lg border border-ivory/12 bg-ivory/5 px-4 py-3 text-[13.5px] font-semibold" style={{ animationDelay: `${k * 70}ms` }}>
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-marigold text-pine"><Check className="h-3 w-3" /></span>
                      {f}
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[12.5px] text-ivory/45">
                  <span className="font-bold uppercase tracking-wider text-coral">Explicitly not yet:</span> AI recs · AR try-on · forums · B2B portal — phased to Months 7–18
                </p>
              </div>
            }
            right={
              <div className="fade-in relative rounded-2xl border border-ivory/12 bg-ivory/5 p-7" style={{ animationDelay: "220ms" }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">90-day build timeline</p>
                <div className="pulse-line relative mt-6 space-y-5 border-l border-ivory/15 pl-7">
                  {[
                    ["Wk 1–3", "Foundation", "Stack, schema, auth, CI/CD"],
                    ["Wk 4–6", "Core backend", "User · Training · Marketplace + payments"],
                    ["Wk 7–9", "Mobile app v1", "Flutter customer + vendor apps"],
                    ["Wk 10–11", "Admin + polish", "React panel, QA, performance"],
                    ["Wk 12–13", "Launch prep", "Beta with 10 vendors, store submission"],
                  ].map(([w, t, d]) => (
                    <div key={w} className="relative">
                      <span className="absolute -left-[34px] top-1 h-3 w-3 rounded-full border-2 border-marigold bg-pine" />
                      <p className="font-mono text-[11px] font-bold tracking-wider text-marigold">{w}</p>
                      <p className="font-display text-lg leading-tight">{t}</p>
                      <p className="text-[12px] text-ivory/50">{d}</p>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        </Slide>

        {/* 5 — business model */}
        <Slide active={i === 4} dev={DEV[4]}>
          <Grid
            leftSpan={7}
            left={
              <div className="fade-in">
                <Kick>05 · Business model</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  Seven ways <em className="italic text-marigold">to earn.</em>
                </h2>
                <div className="mt-7 overflow-hidden rounded-xl border border-ivory/12">
                  {[
                    ["Service booking commission", "10–15%", "रू 18–36L"],
                    ["Course enrollment commission", "8–12%", "रू 12–24L"],
                    ["Product sales commission", "5–10%", "रू 6–12L"],
                    ["Vendor premium subscription", "रू 1–5K / mo", "रू 6–12L"],
                    ["Featured listings", "रू 500–2K / mo", "रू 3–6L"],
                    ["Certification fees", "रू 500–1K / cert", "रू 1.5–3L"],
                  ].map(([s, r, y], k) => (
                    <div key={s} className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3 text-[13.5px] transition-colors hover:bg-ivory/5 ${k % 2 ? "bg-ivory/[0.03]" : ""}`}>
                      <span className="font-semibold">{s}</span>
                      <span className="font-mono text-[12px] text-marigold">{r}</span>
                      <span className="w-24 text-right font-display text-base text-ivory/75">{y}</span>
                    </div>
                  ))}
                  <div className="border-t border-marigold/30 bg-marigold/10 px-5 py-3 text-[13px] font-bold text-marigold">
                    Year 1 projected total · रू 48–96 lakh <span className="font-normal text-ivory/50">(+20–35% from subs, ads & certs)</span>
                  </div>
                </div>
              </div>
            }
            right={
              <div className="fade-in space-y-4" style={{ animationDelay: "200ms" }}>
                <div className="rounded-2xl border-2 border-marigold/60 bg-marigold/10 p-6 text-center">
                  <p className="font-display text-6xl font-semibold text-marigold">10–27×</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-ivory/60">LTV / CAC ratio</p>
                  <p className="mt-3 text-[12.5px] text-ivory/60">CAC रू 150–300 · LTV रू 3,000–8,000 over 2 years</p>
                </div>
                <div className="rounded-2xl border border-ivory/12 bg-ivory/5 p-6">
                  <div className="flex justify-between text-[13px]"><span className="text-ivory/60">Avg booking value</span><span className="font-display text-lg">रू 1,500</span></div>
                  <div className="mt-2 flex justify-between text-[13px]"><span className="text-ivory/60">Avg commission</span><span className="font-display text-lg text-marigold">रू 200</span></div>
                  <div className="mt-2 flex justify-between text-[13px]"><span className="text-ivory/60">Orders / vendor / day</span><span className="font-display text-lg">15–30</span></div>
                </div>
              </div>
            }
          />
        </Slide>

        {/* 6 — traction */}
        <Slide active={i === 5} dev={DEV[5]}>
          <Grid
            leftSpan={5}
            left={
              <div className="fade-in">
                <Kick>06 · Traction plan</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  <Counter to={100} /> vendors
                  <br />by <em className="italic text-marigold">day 90.</em>
                </h2>
                <div className="mt-7 space-y-3">
                  {[
                    ["Week 1–4", "20 seed partners", "0% commission · Thamel, Baneshwor, Lazimpat"],
                    ["Week 5–8", "+40 via referral wave", "5% commission · association partnerships"],
                    ["Week 9–12", "+40 freelancers & centres", "8% commission · TikTok onboarding"],
                  ].map(([w, t, d], k) => (
                    <div key={w} className="fade-in rounded-xl border border-ivory/12 bg-ivory/5 p-4" style={{ animationDelay: `${k * 120}ms` }}>
                      <p className="font-mono text-[11px] font-bold tracking-wider text-marigold">{w}</p>
                      <p className="font-display text-lg">{t}</p>
                      <p className="text-[12px] text-ivory/50">{d}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 flex items-center gap-2 text-[12.5px] text-ivory/55">
                  <span className="blink h-1.5 w-1.5 rounded-full bg-marigold" /> Mix: 40 salons · 20 freelancers · 15 centres · 15 home providers · 10 product vendors
                </p>
              </div>
            }
            right={
              <div className="fade-in rounded-2xl border border-ivory/12 bg-ivory/5 p-7" style={{ animationDelay: "220ms" }}>
                <div className="flex items-end justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">Daily orders · 24-month ramp</p>
                  <p className="font-display text-4xl font-semibold text-marigold"><Counter to={300} /></p>
                </div>
                <div className="mt-4"><AreaMini data={ORDERS_CURVE} unit="orders / day" /></div>
                <p className="mt-4 text-[12.5px] text-ivory/55">Kathmandu-first → Pokhara & Bharatpur → national. Revenue hits रू 25.2L/month by Month 24.</p>
              </div>
            }
          />
        </Slide>

        {/* 7 — go to market */}
        <Slide active={i === 6} dev={DEV[6]}>
          <Grid
            leftSpan={5}
            left={
              <div className="fade-in">
                <Kick>07 · Go-to-market</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  Demand,
                  <br /><em className="italic text-marigold">engineered.</em>
                </h2>
                <p className="mt-6 max-w-md text-lg text-ivory/65">
                  15M internet users already discover beauty on TikTok and Instagram.
                  We capture the funnel they're already scrolling.
                </p>
                <div className="mt-7 rounded-xl border-2 border-dashed border-marigold/50 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">Launch month budget</p>
                  <p className="mt-1 font-display text-3xl">रू 5–8 lakh</p>
                  <p className="text-[12px] text-ivory/55">20–30% off first booking · FB/IG + Google Ads · launch event</p>
                </div>
              </div>
            }
            right={
              <div className="fade-in space-y-5" style={{ animationDelay: "200ms" }}>
                {[
                  ["Influencer engine", "10–15 creators · NPR 100–500 per driven booking", "रू 3–5L", 62],
                  ["Campus partnerships", "10+ institutes · 500 student signups in 90 days", "Career fairs", 48],
                  ["Referral loop", "रू 100 + रू 100 · target 30% of acquisition by M6", "Organic", 40],
                  ["Grand launch", "Live demos · influencer meet · Kathmandu", "रू 5–8L", 70],
                ].map(([t, d, b, w], k) => (
                  <div key={t as string} className="fade-in rounded-xl border border-ivory/12 bg-ivory/5 p-5 transition-all hover:border-marigold/50" style={{ animationDelay: `${k * 110}ms` }}>
                    <div className="flex items-center justify-between">
                      <p className="font-display text-xl">{t}</p>
                      <span className="rounded-full bg-marigold/15 px-3 py-1 font-mono text-[11.5px] font-bold text-marigold">{b}</span>
                    </div>
                    <p className="mt-1 text-[12.5px] text-ivory/55">{d}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ivory/10">
                      <div className={`h-full rounded-full bg-gradient-to-r from-crimson to-marigold ${i === 6 ? "bar-grow" : ""}`} style={{ width: `${w}%`, animationDelay: `${k * 140}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
            }
          />
        </Slide>

        {/* 8 — competition */}
        <Slide active={i === 7} dev={DEV[7]}>
          <Grid
            leftSpan={5}
            left={
              <div className="fade-in">
                <Kick>08 · Competition</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  Nobody else
                  <br /><em className="italic text-marigold">connects the dots.</em>
                </h2>
                <p className="mt-6 max-w-md text-lg text-ivory/65">
                  Siloed players each own one slice. No one in Nepal — or globally —
                  unifies education, services, commerce and employment.
                </p>
                <div className="mt-7 flex items-center gap-3 rounded-xl border border-marigold/40 bg-marigold/10 p-4">
                  <Sparkle className="h-6 w-6 shrink-0 text-marigold" />
                  <p className="text-[13.5px] text-ivory/75"><strong className="text-marigold">First-mover moat:</strong> vendor lock-in through data, tools and the talent pipeline.</p>
                </div>
              </div>
            }
            right={
              <div className="fade-in overflow-hidden rounded-2xl border border-ivory/12" style={{ animationDelay: "200ms" }}>
                <div className="grid grid-cols-[1.4fr_repeat(5,1fr)] items-center gap-2 bg-ivory/10 px-5 py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-marigold">
                  <span>Player</span>
                  {MATRIX_COLS.map((c) => <span key={c} className="text-center">{c}</span>)}
                </div>
                {MATRIX_ROWS.map((r, k) => (
                  <div key={r.name} className={`grid grid-cols-[1.4fr_repeat(5,1fr)] items-center gap-2 px-5 py-3 text-[13px] transition-colors hover:bg-ivory/5 ${k % 2 ? "bg-ivory/[0.03]" : ""}`}>
                    <span className="font-semibold text-ivory/80">{r.name}</span>
                    {r.cells.map((c, j) => (
                      <span key={j} className="grid place-items-center">
                        {c ? <Check className="h-4 w-4 text-marigold/70" /> : <X className="h-4 w-4 text-ivory/20" />}
                      </span>
                    ))}
                  </div>
                ))}
                <div className="grid grid-cols-[1.4fr_repeat(5,1fr)] items-center gap-2 border-t-2 border-marigold bg-marigold/15 px-5 py-3.5 text-[13.5px]">
                  <span className="font-display text-lg italic text-marigold">Junetara Glam</span>
                  {MATRIX_COLS.map((c) => (
                    <span key={c} className="grid place-items-center"><Check className="h-5 w-5 text-marigold" /></span>
                  ))}
                </div>
              </div>
            }
          />
        </Slide>

        {/* 9 — team */}
        <Slide active={i === 8} dev={DEV[8]}>
          <Grid
            leftSpan={5}
            left={
              <div className="fade-in">
                <Kick>09 · Team & structure</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  Strategy by <em className="italic text-marigold">BPI.</em>
                  <br />Execution by partners.
                </h2>
                <p className="mt-6 max-w-md text-lg text-ivory/65">
                  A deliberately lean structure — the strategic brain stays independent,
                  delivery rides on specialised partners.
                </p>
                <div className="mt-7 grid grid-cols-2 gap-5">
                  <Stat v="23+" label="years institutional experience" />
                  <Stat v="6" label="core build team (Months 1–6)" />
                </div>
              </div>
            }
            right={
              <div className="fade-in space-y-4" style={{ animationDelay: "200ms" }}>
                <div className="rounded-2xl border-2 border-marigold/50 bg-ivory/5 p-6">
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-marigold font-display text-xl italic text-pine">HB</span>
                    <div>
                      <p className="font-display text-2xl">Heera Bohara Bhandari</p>
                      <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-marigold">President · BPI Strategic Consulting</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-ivory/65">
                    Platform strategy · business architecture · CTEVT liaison & curriculum standardisation ·
                    investor relations · AI/IT advisory. Dhangadhi-1, Kailali · Sukedhara-4, Kathmandu.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-ivory/12 bg-ivory/5 p-5">
                    <p className="flex items-center gap-2 font-display text-lg"><GradCap className="h-5 w-5 text-marigold" /> Technology partner</p>
                    <p className="mt-2 text-[12.5px] text-ivory/55">Flutter apps · Node microservices · AWS — builds against this deck's architecture.</p>
                  </div>
                  <div className="rounded-2xl border border-ivory/12 bg-ivory/5 p-5">
                    <p className="flex items-center gap-2 font-display text-lg"><Users className="h-5 w-5 text-marigold" /> Execution partners</p>
                    <p className="mt-2 text-[12.5px] text-ivory/55">Marketing ops · vendor field team · beauty-association networks.</p>
                  </div>
                </div>
              </div>
            }
          />
        </Slide>

        {/* 10 — financials */}
        <Slide active={i === 9} dev={DEV[9]}>
          <Grid
            leftSpan={5}
            left={
              <div className="fade-in">
                <Kick>10 · Financials</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  Numbers that
                  <br /><em className="italic text-marigold">hold up.</em>
                </h2>
                <div className="mt-7 space-y-3">
                  {[
                    ["Development team (6 mo)", "रू 26.7–46.2L", 74],
                    ["Marketing (launch + 6 mo)", "रू 5–10L", 22],
                    ["Cloud, SMS, payments", "रू 2.7–6.2L", 12],
                    ["Legal, office, working capital", "रू 7.8–12.8L", 26],
                  ].map(([t, v, w], k) => (
                    <div key={t as string} className="fade-in rounded-xl border border-ivory/12 bg-ivory/5 p-4" style={{ animationDelay: `${k * 100}ms` }}>
                      <div className="flex justify-between text-[13px]"><span className="font-semibold">{t}</span><span className="font-mono text-marigold">{v}</span></div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ivory/10">
                        <div className={`h-full rounded-full bg-gradient-to-r from-forest to-marigold ${i === 9 ? "bar-grow" : ""}`} style={{ width: `${w}%`, animationDelay: `${k * 130}ms` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[13px] text-ivory/55">Total startup cost <strong className="text-ivory">रू 42–75L</strong> (≈ USD 31–56K) · monthly burn रू 4.7–8.85L</p>
              </div>
            }
            right={
              <div className="fade-in space-y-4" style={{ animationDelay: "220ms" }}>
                <div className="rounded-2xl border border-ivory/12 bg-ivory/5 p-6">
                  <div className="flex items-end justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">Monthly revenue · NPR lakh</p>
                    <p className="font-display text-3xl font-semibold text-marigold"><Counter to={25.2} decimals={1} />L</p>
                  </div>
                  <div className="mt-3"><AreaMini data={ADMIN_REVENUE} unit="रू lakh / month" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["108", "orders / day to break even"],
                    ["0.54", "per vendor / day @ 200 vendors"],
                    ["Mo 18–24", "estimated break-even"],
                  ].map(([v, l]) => (
                    <div key={l} className="rounded-xl border border-marigold/40 bg-marigold/10 p-4 text-center">
                      <p className="font-display text-2xl text-marigold">{v}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ivory/55">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            }
          />
        </Slide>

        {/* 11 — impact */}
        <Slide active={i === 10} dev={DEV[10]}>
          <Grid
            leftSpan={5}
            left={
              <div className="fade-in">
                <Kick>11 · Impact</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  A <em className="italic text-marigold">women-first</em>
                  <br />economy.
                </h2>
                <p className="mt-6 max-w-md text-lg text-ivory/65">
                  Over 90% of Nepal's beauty professionals are women. Verified skills,
                  digital clientele, income without a storefront.
                </p>
                <div className="mt-7 grid grid-cols-2 gap-5">
                  <Stat v="2,225–3,845" label="livelihoods in 3 years" tone="gold" />
                  <Stat v="90%+" label="women beneficiaries" tone="gold" />
                </div>
                <p className="mt-7 text-[12.5px] uppercase tracking-[0.18em] text-ivory/50">
                  Aligned · Digital Nepal Framework · CTEVT mandate · National Skill Development Policy
                </p>
              </div>
            }
            right={
              <div className="fade-in space-y-4" style={{ animationDelay: "200ms" }}>
                <div className="flex flex-wrap gap-2">
                  {["SDG 4 · Quality education", "SDG 5 · Gender equality", "SDG 8 · Decent work", "SDG 9 · Innovation", "SDG 10 · Reduced inequality", "SDG 12 · Responsible consumption"].map((s, k) => (
                    <span key={s} className="fade-in rounded-full border border-marigold/40 bg-marigold/10 px-4 py-2 text-[12.5px] font-bold text-marigold" style={{ animationDelay: `${k * 80}ms` }}>{s}</span>
                  ))}
                </div>
                <div className="overflow-hidden rounded-2xl border border-ivory/12">
                  {[
                    ["Vendor jobs created", "100–200", "600–1,000"],
                    ["Freelancer livelihoods", "50–100", "400–700"],
                    ["Student placements", "30–50", "300–500"],
                    ["Platform jobs", "8–12", "25–35"],
                  ].map(([c, y1, y3], k) => (
                    <div key={c} className={`grid grid-cols-[1.6fr_1fr_1fr] items-center px-5 py-3 text-[13px] ${k % 2 ? "bg-ivory/[0.03]" : ""}`}>
                      <span className="font-semibold text-ivory/80">{c}</span>
                      <span className="text-ivory/50">{y1}</span>
                      <span className="text-right font-display text-lg text-marigold">{y3}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-[1.6fr_1fr_1fr] border-t border-marigold/30 bg-marigold/10 px-5 py-3 text-[12px] font-bold uppercase tracking-wider text-marigold">
                    <span>Year 1 → Year 3</span><span>Yr 1</span><span className="text-right">Yr 3</span>
                  </div>
                </div>
              </div>
            }
          />
        </Slide>

        {/* 12 — the ask */}
        <Slide active={i === 11} dev={DEV[11]}>
          <Grid
            leftSpan={5}
            left={
              <div className="fade-in">
                <Kick>12 · The ask</Kick>
                <h2 className="mt-5 font-display text-6xl font-semibold leading-[0.98] md:text-7xl">
                  USD <em className="italic text-marigold">50–100K.</em>
                  <br />18-month runway.
                </h2>
                <p className="mt-6 max-w-md text-lg text-ivory/65">
                  Funds the MVP, the 100-vendor Kathmandu beachhead and the first national
                  expansion — to a platform already projected at रू 25L monthly revenue by Month 24.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <button onClick={() => go("home")} className="group flex items-center gap-2 rounded-full bg-marigold px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-pine transition hover:bg-sun">
                    Open the live product <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button onClick={() => window.print()} className="flex items-center gap-2 rounded-full border border-ivory/30 px-6 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:border-marigold hover:text-marigold">
                    <Printer className="h-4 w-4" /> Print this deck
                  </button>
                </div>
              </div>
            }
            right={
              <div className="fade-in space-y-4" style={{ animationDelay: "200ms" }}>
                <div className="rounded-2xl border border-ivory/12 bg-ivory/5 p-7">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">Use of funds · NPR 67–135 lakh</p>
                  <div className="mt-5">
                    <Donut
                      centerTop="18 mo"
                      centerBottom="runway"
                      segments={[
                        { pct: 45, color: "#ffb800", label: "Technology & product" },
                        { pct: 25, color: "#ea5240", label: "Go-to-market" },
                        { pct: 20, color: "#2b52e1", label: "Operations" },
                        { pct: 10, color: "#ffd36b", label: "Working capital buffer" },
                      ]}
                    />
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-dashed border-marigold/50 p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-marigold">BPI Strategic Consulting</p>
                  <p className="mt-2 font-display text-xl italic">heerabohara80@gmail.com</p>
                  <p className="mt-1 text-[12.5px] text-ivory/55">Dhangadhi-1, Kailali · Sukedhara-4, Kathmandu · Master Plan v1.0, April 2026</p>
                </div>
              </div>
            }
          />
        </Slide>
      </div>

      {/* chrome — bottom rail */}
      <div className="deck-chrome absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-pine via-pine/85 to-transparent px-6 pb-4 pt-8 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <button onClick={prev} disabled={i === 0} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-ivory/25 text-ivory/70 transition enabled:hover:border-marigold enabled:hover:text-marigold disabled:opacity-30" aria-label="Previous slide">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex flex-1 items-center gap-1.5">
            {TITLES.map((t, k) => (
              <button
                key={t}
                onClick={() => setI(k)}
                title={`${k + 1}. ${t}`}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${k === i ? "bg-marigold" : k < i ? "bg-marigold/40" : "bg-ivory/15 hover:bg-ivory/30"}`}
                aria-label={`Go to slide ${k + 1}: ${t}`}
              />
            ))}
          </div>
          <button onClick={next} disabled={i === 11} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-marigold text-pine transition enabled:hover:bg-sun disabled:opacity-30" aria-label="Next slide">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2.5 hidden text-center text-[10px] font-bold uppercase tracking-[0.26em] text-ivory/35 md:block">
          {TITLES[i]} · ← → to navigate · P to print · ESC to exit
        </p>
      </div>
    </div>
  );
}
