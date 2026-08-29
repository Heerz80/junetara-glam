import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context";
import { COURSES, TIERS, CITIES, npr, type Course, type Tier } from "../data";
import { Kicker, Masked, Reveal, Stars, GatewayChips } from "./ui";
import { ArrowRight, Check, Clock, GradCap, Pin, Qr, Search, ShieldCheck, Users, X, Briefcase, Sparkle } from "./Icons";

const CATS = ["All", "Makeup", "Hair", "Skin", "Nails", "Bridal", "Business"];

function TierBadge({ tier, small = false }: { tier: Tier; small?: boolean }) {
  const t = TIERS[tier];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-[0.1em] text-ivory ${small ? "px-2.5 py-1 text-[9.5px]" : "px-3 py-1.5 text-[10.5px]"}`}
      style={{ background: t.color }}
    >
      {t.label}
    </span>
  );
}

/* ---------------- course detail + enrollment modal ---------------- */
export function CourseModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const { enrollments, enroll, go, toast } = useApp();
  const enrolled = enrollments.some((e) => e.courseId === course.id);
  const [phase, setPhase] = useState<"detail" | "pay" | "done">("detail");
  const [gateway, setGateway] = useState("eSewa");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const pay = () => {
    if (phone.replace(/\D/g, "").length < 9) {
      toast("Enter a valid mobile number for the payment OTP");
      return;
    }
    enroll(course.id, gateway);
    setPhase("done");
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={course.title}>
      <button className="absolute inset-0 bg-pine/80 backdrop-blur-sm" onClick={onClose} aria-label="Close" />
      <div className="modal-in relative flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-ivory shadow-2xl sm:rounded-2xl">
        {phase === "done" ? (
          <div className="fade-in flex flex-col items-center overflow-y-auto p-8 text-center sm:p-12">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-forest text-sun"><Check className="h-9 w-9" /></span>
            <h3 className="mt-6 font-display text-4xl italic text-pine">Namaste — seat confirmed!</h3>
            <p className="mt-3 max-w-md text-ink/65">
              You are enrolled in <strong className="text-pine">{course.title}</strong> at {course.center}.
              Payment of <strong className="text-pine">{npr(course.fee)}</strong> will be collected via {gateway}.
              Your syllabus, attendance and skill tracker now live in My Space.
            </p>
            <div className="mt-6 rounded-xl border border-dashed border-marigold/60 bg-marigold/10 px-6 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-crimson">On completion you receive</p>
              <p className="mt-1 flex items-center justify-center gap-2 font-display text-xl italic text-pine"><Qr className="h-5 w-5 text-forest" /> QR-verified digital certificate</p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={() => { onClose(); go("space"); }} className="rounded-full bg-pine px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-forest">
                Go to My Space
              </button>
              <button onClick={onClose} className="rounded-full border border-ink/20 px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-ink/60 transition hover:border-crimson hover:text-crimson">
                Keep browsing
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative h-44 shrink-0 sm:h-52">
              <img src={course.img} alt={course.title} className="h-full w-full object-cover" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-pine/85 via-pine/30 to-transparent" />
              <button onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ivory/90 text-pine transition hover:bg-crimson hover:text-ivory" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <TierBadge tier={course.tier} small />
                  <h3 className="mt-2 font-display text-3xl italic leading-tight text-ivory">{course.title}</h3>
                </div>
                <p className="font-display text-3xl text-marigold">{npr(course.fee)}</p>
              </div>
            </div>

            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink/60">
                <span className="flex items-center gap-1.5"><Pin className="h-4 w-4 text-crimson" /> {course.center} · {course.city}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-crimson" /> {course.months} months</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-crimson" /> {course.students.toLocaleString()} trained · {course.seats} seats left</span>
                <span className="flex items-center gap-1.5"><Stars rating={course.rating} /> <b className="text-forest">{course.rating}</b> ({course.reviews})</span>
                {course.ctevt && (
                  <span className="flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1 font-bold uppercase tracking-wide text-forest">
                    <ShieldCheck className="h-4 w-4" /> CTEVT-aligned
                  </span>
                )}
              </div>

              {phase === "detail" ? (
                <div className="mt-6 grid gap-8 md:grid-cols-5">
                  <div className="md:col-span-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">Week-by-week syllabus</p>
                    <ol className="mt-3 space-y-2">
                      {course.syllabus.map((s, i) => (
                        <li key={s} className="flex items-start gap-3 rounded-lg border border-ink/10 bg-white/70 px-4 py-2.5 text-[14px] text-ink/75">
                          <span className="mt-0.5 font-display text-[13px] italic text-marigold">{String(i + 1).padStart(2, "0")}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                    <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">Lead trainer</p>
                    <p className="mt-2 flex items-center gap-2 text-[14px] text-ink/75"><GradCap className="h-4 w-4 text-forest" /> {course.trainer}</p>
                  </div>
                  <div className="md:col-span-2">
                    <div className="rounded-xl border border-ink/10 bg-white/70 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">You will walk out with</p>
                      <ul className="mt-3 space-y-2.5">
                        {course.outcomes.map((o) => (
                          <li key={o} className="flex items-start gap-2.5 text-[13.5px] text-ink/70">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-marigold/25 text-forest"><Check className="h-3 w-3" /></span>
                            {o}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">Fee includes</p>
                      <ul className="mt-3 space-y-1.5">
                        {course.includes.map((o) => (
                          <li key={o} className="flex items-start gap-2 text-[13px] text-ink/65"><Sparkle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-marigold" /> {o}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 rounded-xl bg-sand/80 p-5">
                      <p className="text-[13px] font-semibold text-ink/70">
                        Installments: <strong className="text-pine">{course.installment} × {npr(Math.round(course.fee / course.installment))}</strong>
                      </p>
                      <p className="mt-1 text-[12px] text-ink/50">Pay via eSewa, Khalti or Fonepay — no bank queue.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="fade-in mt-6 max-w-md">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-crimson">Secure enrollment · Junetara transaction layer</p>
                  <div className="mt-4 rounded-xl border border-ink/10 bg-white/80 p-5">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-ink/60">Course fee</span>
                      <span className="font-bold text-pine">{npr(course.fee)}</span>
                    </div>
                    <div className="mt-1 flex justify-between text-[14px]">
                      <span className="text-ink/60">Platform facilitation (incl.)</span>
                      <span className="font-bold text-forest">{npr(0)}</span>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-dashed border-ink/20 pt-3 font-display text-xl">
                      <span className="italic">Total today</span>
                      <span className="text-crimson">{npr(course.fee)}</span>
                    </div>
                  </div>
                  <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/50">Choose payment gateway</p>
                  <div className="mt-2"><GatewayChips value={gateway} onChange={setGateway} /></div>
                  <label className="mt-4 block">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">Mobile number (for OTP)</span>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      inputMode="tel"
                      className="mt-1.5 w-full rounded-lg border border-ink/15 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-marigold"
                    />
                  </label>
                  <p className="mt-3 flex items-center gap-2 text-[12px] text-ink/50"><ShieldCheck className="h-4 w-4 text-forest" /> Regulated by Nepal Rastra Bank payment guidelines.</p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-ink/10 bg-sand/70 px-6 py-4 sm:px-8">
              {enrolled ? (
                <button onClick={() => { onClose(); go("space"); }} className="flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory">
                  <Check className="h-4 w-4" /> Already enrolled — open My Space
                </button>
              ) : phase === "detail" ? (
                <>
                  <button onClick={onClose} className="rounded-full border border-ink/20 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ink/60 transition hover:border-crimson hover:text-crimson">
                    Not yet
                  </button>
                  <button onClick={() => setPhase("pay")} className="group flex items-center gap-2 rounded-full bg-crimson px-7 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-pine">
                    Enroll now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setPhase("detail")} className="rounded-full border border-ink/20 px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-ink/60 transition hover:border-forest hover:text-forest">
                    Back
                  </button>
                  <button onClick={pay} className="group flex items-center gap-2 rounded-full bg-forest px-7 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-pine">
                    <Briefcase className="h-4 w-4" /> Pay {npr(course.fee)} via {gateway}
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- Training view ---------------- */
export default function Training() {
  const { searchSeed } = useApp();
  const [q, setQ] = useState(searchSeed.training ?? "");
  const [tier, setTier] = useState<"all" | Tier>("all");
  const [cat, setCat] = useState("All");
  const [city, setCity] = useState("All cities");
  const [selected, setSelected] = useState<Course | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return COURSES.filter((c) => {
      if (tier !== "all" && c.tier !== tier) return false;
      if (cat !== "All" && c.cat !== cat) return false;
      if (city !== "All cities" && c.city !== city) return false;
      if (needle && !`${c.title} ${c.center} ${c.cat} ${c.tags.join(" ")} ${TIERS[c.tier].label}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [q, tier, cat, city]);

  return (
    <div>
      {/* header */}
      <section className="relative overflow-hidden bg-sand/70">
        <p aria-hidden className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[180px] font-bold leading-none text-marigold/15">प्रशिक्षण</p>
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-16 md:px-8">
          <Reveal><Kicker>प्रशिक्षण · The Académie of Nepal</Kicker></Reveal>
          <Masked as="h1" className="mt-5 font-display text-6xl font-semibold leading-[1.0] text-pine md:text-7xl" lines={[<>Learn it right,</>, <><em className="italic text-crimson">once</em>.</>]} />
          <Reveal delay={200}>
            <p className="mt-5 max-w-2xl text-lg text-ink/65">
              {COURSES.length} verified courses across four CTEVT-aligned tiers — each with a published syllabus,
              certified trainer, installment fees and a QR-verifiable certificate. No more guessing which of
              Nepal's 500+ centres is worth your money.
            </p>
          </Reveal>

          {/* filters */}
          <Reveal delay={300}>
            <div data-tour="tiers" className="mt-8 flex flex-col gap-3 rounded-xl border border-ink/10 bg-white/80 p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[220px] flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search course, centre, skill…" className="w-full rounded-lg border border-ink/15 bg-ivory py-2.5 pl-10 pr-3 text-[14px] outline-none transition focus:border-marigold focus:bg-white" />
                </div>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="rounded-lg border border-ink/15 bg-ivory px-3 py-2.5 text-[13.5px] font-semibold text-ink/75 outline-none focus:border-marigold">
                  <option>All cities</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button onClick={() => setTier("all")} className={`rounded-full px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wider transition-all ${tier === "all" ? "bg-pine text-marigold" : "bg-sand text-ink/60 hover:text-pine"}`}>All tiers</button>
                {(Object.keys(TIERS) as Tier[]).map((t) => (
                  <button key={t} onClick={() => setTier(t)} className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11.5px] font-bold uppercase tracking-wider transition-all ${tier === t ? "text-ivory" : "bg-sand text-ink/60 hover:text-pine"}`} style={tier === t ? { background: TIERS[t].color } : undefined}>
                    <span className="h-2 w-2 rounded-full" style={{ background: tier === t ? "#fff" : TIERS[t].color }} />
                    {TIERS[t].label}
                  </button>
                ))}
                <span className="mx-2 hidden h-5 w-px bg-ink/15 sm:block" />
                {CATS.map((c) => (
                  <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-wider transition-all ${cat === c ? "bg-crimson text-ivory" : "text-ink/55 hover:text-crimson"}`}>{c}</button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* tier legend */}
      <div className="border-y border-ink/10 bg-pine py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-5 text-[12px] font-semibold text-ivory/80 md:px-8">
          {(Object.keys(TIERS) as Tier[]).map((t, i) => (
            <span key={t} className="flex items-center gap-2">
              <span className="font-display italic text-marigold">T{i + 1}</span>
              {TIERS[t].label} · <span className="text-marigold">{TIERS[t].range}</span>
            </span>
          ))}
        </div>
      </div>

      {/* course grid */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <p className="mb-6 text-[13px] font-semibold text-ink/55">
          Showing <strong className="text-pine">{filtered.length}</strong> of {COURSES.length} courses
          {q && <> for “<em className="text-crimson">{q}</em>”</>}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink/25 bg-white/50 p-14 text-center">
            <GradCap className="mx-auto h-10 w-10 text-marigold" />
            <p className="mt-4 font-display text-2xl italic text-pine">No course matches that filter — yet.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">New centres onboard every week as we roll out beyond Kathmandu. Clear a filter or two?</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filtered.map((c, i) => (
              <Reveal key={c.id} delay={(i % 2) * 90}>
                <article className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-ink/10 bg-white/80 transition-all duration-500 hover:-translate-y-1 hover:border-marigold/60 hover:shadow-[0_30px_60px_-30px_rgba(14,43,38,0.45)]" onClick={() => setSelected(c)}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={c.img} alt={c.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-pine/70 via-transparent to-transparent" />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <TierBadge tier={c.tier} small />
                      {c.ctevt && <span className="flex items-center gap-1 rounded-full bg-ivory/90 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-forest"><ShieldCheck className="h-3 w-3" /> CTEVT</span>}
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                      <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ivory/90"><Pin className="h-3.5 w-3.5 text-marigold" /> {c.center} · {c.city}</span>
                      <span className="flex items-center gap-1 rounded-full bg-pine/70 px-2.5 py-1 text-[11.5px] font-bold text-sun"><Stars rating={c.rating} className="h-3 w-3" /> {c.rating}</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-[22px] leading-tight text-pine transition-colors group-hover:text-crimson">{c.title}</h3>
                      <span className="shrink-0 rounded-full bg-crimson/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-crimson">{c.cat}</span>
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink/60">{TIERS[c.tier].desc}. {c.syllabus.length}-module syllabus, {c.months} months, taught by {c.trainer.split("·")[0].trim()}.</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.tags.map((t) => <span key={t} className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-semibold text-ink/60">{t}</span>)}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-dashed border-ink/15 pt-4" style={{ marginTop: "auto" }}>
                      <div>
                        <p className="font-display text-[22px] font-semibold text-forest">{npr(c.fee)}</p>
                        <p className="text-[11.5px] text-ink/50">or {c.installment} × {npr(Math.round(c.fee / c.installment))} · {c.seats} seats left</p>
                      </div>
                      <span className="flex items-center gap-2 rounded-full bg-pine px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-marigold transition-colors group-hover:bg-crimson group-hover:text-ivory">
                        Details <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* why standardised */}
      <section className="border-t border-ink/10 bg-sand/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-8 lg:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Verified quality", d: "Every listed centre passes a curriculum, trainer-credential and hygiene audit. 80% of Nepal's centres are unstandardised — ours aren't." },
            { icon: Qr, t: "Certificates that travel", d: "Digital certificates with unique QR codes. Employers scan, verify and hire — no more 'who trained you?' interviews." },
            { icon: Briefcase, t: "Training with an exit", d: "Every course plugs into the talent layer: internship matching, trainer endorsements and a public skill portfolio." },
          ].map((b, i) => (
            <Reveal key={b.t} delay={i * 110}>
              <div className="flex gap-5 rounded-xl border border-ink/10 bg-ivory p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pine text-marigold"><b.icon className="h-5 w-5" /></span>
                <div>
                  <h3 className="font-display text-xl text-pine">{b.t}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink/60">{b.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {selected && <CourseModal course={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
