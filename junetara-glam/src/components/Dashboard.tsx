import { useEffect, useState } from "react";
import { useApp, type Role } from "../context";
import {
  COURSES, PRODUCTS, npr, TIERS,
  CENTER_STUDENTS, CENTER_REVENUE, ADMIN_REVENUE,
  SALON_SCHEDULE, SALON_RATINGS, SALON_REVENUE,
  INVENTORY, VENDOR_ORDERS, VENDOR_SALES,
} from "../data";
import { Kicker, Masked, Reveal } from "./ui";
import {
  ArrowRight, Bag, Briefcase, Calendar, Check, Clock, Coins, Flower, GradCap, Heart,
  HomeVisit, Pen, Pin, Qr, Seal, ShieldCheck, Sparkle, Star, Store, Trash, Users, Wallet, X,
} from "./Icons";
import { ProductCard } from "./Market";
import Ledger from "./Ledger";
import { LEGAL_DOCS, executedCopy, downloadText } from "../legal";

function CustomerSpace() {
  const {
    enrollments, completeLesson, bookings, cancelBooking, orders, wishlist, toggleWish,
    addToCart, applications, partnerLeads, agreements, go, cartCount, toast,
  } = useApp();

  const lessonsDone = enrollments.reduce((s, e) => s + e.done, 0);
  const lessonsTotal = enrollments.reduce((s, e) => s + (COURSES.find((c) => c.id === e.courseId)?.syllabus.length ?? 0), 0);
  const wishProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));
  const upcoming = bookings.length;

  const tiles = [
    { icon: GradCap, label: "Courses enrolled", value: `${enrollments.length}`, accent: "bg-pine text-marigold" },
    { icon: Check, label: "Lessons complete", value: `${lessonsDone}/${lessonsTotal || 0}`, accent: "bg-forest text-sun" },
    { icon: Calendar, label: "Bookings & orders", value: `${upcoming + orders.length}`, accent: "bg-crimson text-ivory" },
    { icon: Heart, label: "Wishlist & bag", value: `${wishlist.length} · ${cartCount}`, accent: "bg-marigold text-pine" },
  ];

  return (
    <div>
      {/* header */}
      <section className="relative overflow-hidden bg-pine pb-20 pt-16 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -right-6 -top-14 select-none font-display text-[200px] font-bold leading-none text-ivory/[0.045]">मेरो स्पेस</p>
        <div aria-hidden className="pointer-events-none absolute -left-20 top-0 h-80 w-80 rounded-full bg-crimson/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><Kicker tone="light">मेरो स्पेस · Your dossier</Kicker></Reveal>
          <Masked as="h1" className="mt-5 font-display text-6xl font-semibold leading-[1.0] md:text-7xl" lines={[<>Namaste — <em className="italic text-marigold">everything's here</em>.</>]} />
          <Reveal delay={200}>
            <p className="mt-4 max-w-xl text-lg text-ivory/70">
              Training progress, QR certificates, bookings, orders and applications — one dashboard,
              saved on this device so it survives a refresh.
            </p>
          </Reveal>
        </div>
      </section>

      {/* tiles */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="-mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.label} delay={i * 80}>
              <div className="flex items-center gap-4 rounded-xl border border-ink/10 bg-ivory p-5 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_-26px_rgba(14,43,38,0.4)]">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${t.accent}`}><t.icon className="h-5 w-5" /></span>
                <div>
                  <p className="font-display text-[26px] leading-none text-pine">{t.value}</p>
                  <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/50">{t.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* training progress */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal><Kicker>Continue learning</Kicker></Reveal>
            <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>Your academy, <em className="italic text-crimson">in progress</em>.</>]} />
          </div>
          <Reveal delay={150}>
            <button onClick={() => go("training")} className="link-sweep flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-crimson">
              Browse more courses <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>
        </div>

        {enrollments.length === 0 ? (
          <Reveal>
            <div className="rounded-xl border-2 border-dashed border-ink/20 bg-white/50 p-12 text-center">
              <GradCap className="mx-auto h-10 w-10 text-marigold" />
              <p className="mt-4 font-display text-2xl italic text-pine">No courses yet — the academy awaits.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">Enroll in any CTEVT-aligned course and your syllabus, progress and QR certificate will live here.</p>
              <button onClick={() => go("training")} className="mt-6 rounded-full bg-pine px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-forest">
                Explore training
              </button>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {enrollments.map((e, i) => {
              const course = COURSES.find((c) => c.id === e.courseId);
              if (!course) return null;
              const total = course.syllabus.length;
              const pct = Math.round((e.done / total) * 100);
              const done = e.done >= total;
              return (
                <Reveal key={e.courseId} delay={i * 90}>
                  <article className="flex h-full gap-5 rounded-xl border border-ink/10 bg-white/80 p-5 transition-all duration-500 hover:shadow-[0_26px_55px_-28px_rgba(14,43,38,0.42)]">
                    <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-lg">
                      <img src={course.img} alt={course.title} className="h-full w-full object-cover" loading="lazy" />
                      {done && (
                        <span className="absolute inset-0 grid place-items-center bg-pine/65 backdrop-blur-[2px]">
                          <Seal className="h-9 w-9 text-marigold" />
                        </span>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-crimson">{TIERS[course.tier].label} · {course.months} months</p>
                      <h3 className="mt-1 truncate font-display text-xl text-pine" title={course.title}>{course.title}</h3>
                      <p className="mt-1 text-[13px] text-ink/55">
                        {done ? "Complete — certificate issued ✳" : `Next module: ${course.syllabus[e.done]}`}
                      </p>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-ink/50">
                          <span>{e.done}/{total} modules</span>
                          <span className="text-crimson">{pct}%</span>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sand">
                          <div className={`h-full rounded-full transition-all duration-700 ${done ? "bg-marigold" : "bg-forest"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {done && e.certId ? (
                          <button
                            onClick={() => { navigator.clipboard?.writeText(e.certId!).catch(() => {}); toast(`Certificate ${e.certId} copied — verify it under Careers`); }}
                            className="inline-flex items-center gap-2 rounded-full bg-marigold px-4 py-2.5 font-mono text-[11.5px] font-bold tracking-wider text-pine transition hover:bg-sun"
                          >
                            <Qr className="h-4 w-4" /> {e.certId} · copy
                          </button>
                        ) : (
                          <button onClick={() => completeLesson(course.id)} className="group inline-flex items-center gap-2 rounded-full bg-pine px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-marigold transition hover:bg-forest">
                            <Check className="h-3.5 w-3.5" /> Log practical hour
                          </button>
                        )}
                        <span className="text-[11px] font-semibold text-ink/45">Paid via {e.gateway} · {e.date}</span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* bookings + orders */}
      <section className="border-y border-ink/10 bg-sand/60">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <Reveal><Kicker>Bookings & orders</Kicker></Reveal>
              <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>On your <em className="italic text-crimson">calendar</em>.</>]} />
            </div>
            <Reveal delay={150}>
              <button onClick={() => go("services")} className="link-sweep flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-crimson">
                Book another service <ArrowRight className="h-4 w-4" />
              </button>
            </Reveal>
          </div>

          {bookings.length === 0 && orders.length === 0 ? (
            <Reveal>
              <div className="rounded-xl border-2 border-dashed border-ink/20 bg-ivory/70 p-12 text-center">
                <Calendar className="mx-auto h-10 w-10 text-marigold" />
                <p className="mt-4 font-display text-2xl italic text-pine">Nothing on the book yet.</p>
                <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">A facial in Thamel or a home mehndi session is 60 seconds away.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button onClick={() => go("services")} className="rounded-full bg-crimson px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-pine">See services</button>
                  <button onClick={() => go("market")} className="rounded-full border border-ink/20 px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-ink/60 transition hover:border-crimson hover:text-crimson">Shop products</button>
                </div>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Service bookings · {bookings.length}</p>
                {bookings.length === 0 && <p className="rounded-xl border border-ink/10 bg-ivory/80 p-5 text-[13.5px] text-ink/55">No service bookings yet.</p>}
                {bookings.map((b, i) => (
                  <Reveal key={b.id} delay={i * 80}>
                    <article className="ticket flex items-center gap-4 rounded-xl border border-ink/10 bg-ivory p-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-pine text-center">
                        {b.mode === "home" ? <HomeVisit className="h-5 w-5 text-marigold" /> : <Calendar className="h-5 w-5 text-marigold" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-display text-lg text-pine">{b.service}</h3>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[12px] text-ink/55">
                          <span className="flex items-center gap-1"><Pin className="h-3 w-3 text-crimson" />{b.venue}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-crimson" />{b.date} · {b.time}</span>
                          {b.artist && <span className="flex items-center gap-1"><Sparkle className="h-3 w-3 text-crimson" />{b.artist}</span>}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-lg text-crimson">{npr(b.price)}</p>
                        <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink/45">via {b.gateway}</p>
                      </div>
                      <button onClick={() => cancelBooking(b.id)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/15 text-ink/50 transition hover:border-crimson hover:bg-crimson hover:text-ivory" aria-label={`Cancel ${b.service}`}>
                        <X className="h-4 w-4" />
                      </button>
                    </article>
                  </Reveal>
                ))}
              </div>

              <div className="space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Marketplace orders · {orders.length}</p>
                {orders.length === 0 && <p className="rounded-xl border border-ink/10 bg-ivory/80 p-5 text-[13.5px] text-ink/55">No orders yet — the bazaar awaits.</p>}
                {orders.map((o, i) => (
                  <Reveal key={o.id} delay={i * 80}>
                    <article className="flex items-center gap-4 rounded-xl border border-ink/10 bg-ivory p-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-marigold/25 text-forest"><Bag className="h-5 w-5" /></span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg text-pine">{o.id}</h3>
                        <p className="text-[12px] text-ink/55">{o.items} item{o.items === 1 ? "" : "s"} · placed {o.date} · paid via {o.gateway}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-lg text-pine">{npr(o.total)}</p>
                        <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">Processing</span>
                      </div>
                    </article>
                  </Reveal>
                ))}

                {applications.length > 0 && (
                  <div className="rounded-xl border border-ink/10 bg-ivory p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Career applications · {applications.length}</p>
                    <div className="mt-3 space-y-2">
                      {applications.map((a) => (
                        <p key={a.id} className="flex items-center gap-2 text-[13px] text-ink/70">
                          {a.kind === "internship" ? <GradCap className="h-4 w-4 text-forest" /> : <Briefcase className="h-4 w-4 text-crimson" />}
                          {a.title} — {a.org}
                          <span className="ml-auto rounded-full bg-marigold/25 px-2 py-0.5 text-[10px] font-bold uppercase text-forest">under review</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {partnerLeads.length > 0 && (
                  <div className="rounded-xl border border-ink/10 bg-ivory p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Partner applications · {partnerLeads.length}</p>
                    <div className="mt-3 space-y-2">
                      {partnerLeads.map((p) => (
                        <p key={p.id} className="flex items-center gap-2 text-[13px] text-ink/70">
                          <Flower className="h-4 w-4 text-marigold" />
                          {p.type} — {p.name}, {p.city}
                          <span className="ml-auto font-mono text-[11px] font-bold text-crimson">{p.id}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* executed agreements */}
      {agreements.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-xl border border-ink/10 bg-white/70">
              <p className="flex items-center gap-2 border-b border-ink/10 bg-sand/60 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-forest">
                <Pen className="h-4 w-4" /> Your executed agreements · {agreements.length}
              </p>
              <div className="divide-y divide-ink/8">
                {agreements.map((a) => {
                  const doc = LEGAL_DOCS.find((d) => d.id === a.docId);
                  return (
                    <div key={a.id} className="flex flex-wrap items-center gap-4 px-6 py-3.5">
                      <Seal className="h-5 w-5 shrink-0 text-forest" />
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[13px] font-bold tracking-wider text-crimson">{a.ref}</p>
                        <p className="truncate text-[12.5px] text-ink/60">{a.docTitle} · signed {a.signedAt}</p>
                      </div>
                      {doc && (
                        <button
                          onClick={() => downloadText(`${a.ref}-executed.txt`, executedCopy(doc, a))}
                          className="rounded-full border border-forest/40 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-forest transition hover:bg-forest hover:text-sun"
                        >
                          Download
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* wishlist */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal><Kicker>Saved for later</Kicker></Reveal>
            <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>Your <em className="italic text-crimson">wishlist</em>.</>]} />
          </div>
          <Reveal delay={150}>
            <button onClick={() => go("market")} className="link-sweep flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-crimson">
              Back to the bazaar <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>
        </div>

        {wishProducts.length === 0 ? (
          <Reveal>
            <div className="rounded-xl border-2 border-dashed border-ink/20 bg-white/50 p-12 text-center">
              <Heart className="mx-auto h-10 w-10 text-marigold" filled={false} />
              <p className="mt-4 font-display text-2xl italic text-pine">Nothing saved yet.</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">Tap the heart on any product and it will wait for you here.</p>
              <button onClick={() => go("market")} className="mt-6 inline-flex items-center gap-2 rounded-full bg-pine px-7 py-3.5 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-forest">
                <Bag className="h-4 w-4" /> Browse the marketplace
              </button>
            </div>
          </Reveal>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {wishProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                {wishProducts.map((p) => (
                  <button key={p.id} onClick={() => toggleWish(p.id)} className="group flex items-center gap-1.5 rounded-full bg-sand px-3.5 py-1.5 text-[12px] font-semibold text-ink/70 transition hover:bg-crimson hover:text-ivory">
                    {p.name.split(" ").slice(0, 2).join(" ")} <Trash className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                  </button>
                ))}
                <button
                  onClick={() => wishProducts.forEach((p) => addToCart(p.id))}
                  className="flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-crimson hover:text-ivory"
                >
                  <Wallet className="h-4 w-4" /> Add all to bag
                </button>
              </div>
            </Reveal>
          </>
        )}
      </section>
    </div>
  );
}

/* ---------- shared mini bar chart ---------- */
function BarChart({ data, color }: { data: { m: string; v: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((d, i) => (
        <div key={d.m} className="group flex flex-1 flex-col items-center gap-2">
          <span className="text-[11px] font-bold text-ink/50 opacity-0 transition group-hover:opacity-100">{d.v}L</span>
          <div
            className="bar-grow w-full rounded-t-md transition-all duration-500 group-hover:opacity-80"
            style={{ height: `${(d.v / max) * 100}%`, background: color, animationDelay: `${i * 90}ms` }}
          />
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-ink/45">{d.m}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Training Center dashboard ---------- */
function CenterSpace() {
  const { enrollments } = useApp();
  const [paused, setPaused] = useState<string[]>([]);
  const myCourses = COURSES.slice(0, 4);
  const totalFees = CENTER_STUDENTS.reduce((s, x) => s + x.feePaid, 0);

  const tiles = [
    { icon: GradCap, label: "Active students", value: `${CENTER_STUDENTS.filter((s) => s.status === "active").length}`, accent: "bg-pine text-marigold" },
    { icon: Store, label: "Courses live", value: `${myCourses.length - paused.length}`, accent: "bg-forest text-sun" },
    { icon: Coins, label: "Fees collected", value: npr(totalFees), accent: "bg-marigold text-pine" },
    { icon: Star, label: "Center rating", value: "4.7★", accent: "bg-crimson text-ivory" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-forest pb-16 pt-14 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -right-4 -top-12 select-none font-display text-[170px] font-bold leading-none text-ivory/[0.045]">केन्द्र</p>
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><Kicker tone="light">Training Center · प्रशिक्षण केन्द्र</Kicker></Reveal>
          <Masked as="h1" className="mt-4 font-display text-5xl font-semibold leading-[1.02] md:text-6xl" lines={[<>Himalayan Beauty Academy,</>, <><em className="italic text-sun">control room</em>.</>]} />
          <Reveal delay={200}><p className="mt-3 max-w-xl text-ivory/70">Students, fees, course status and revenue — your centre's live operations on Junetara.</p></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="-mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.label} delay={i * 80}>
              <div className="flex items-center gap-4 rounded-xl border border-ink/10 bg-ivory p-5 shadow-sm">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${t.accent}`}><t.icon className="h-5 w-5" /></span>
                <div>
                  <p className="font-display text-[22px] leading-none text-pine">{t.value}</p>
                  <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/50">{t.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-12">
        {/* student roster */}
        <div className="lg:col-span-7">
          <Reveal><Kicker>Student roster</Kicker></Reveal>
          <Masked className="mt-2 font-display text-3xl font-semibold text-pine md:text-4xl" lines={[<>Your learners, <em className="italic text-crimson">tracked</em>.</>]} />
          <Reveal delay={120}>
            <div className="mt-5 overflow-hidden rounded-xl border border-ink/10 bg-white/70">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-[13.5px]">
                  <thead className="bg-pine text-marigold">
                    <tr>
                      <th className="px-4 py-3 font-bold">Student</th>
                      <th className="px-3 py-3 font-bold">Course</th>
                      <th className="px-3 py-3 font-bold">Progress</th>
                      <th className="px-3 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 text-right font-bold">Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CENTER_STUDENTS.map((s, i) => (
                      <tr key={s.id} className={i % 2 ? "bg-sand/50" : "bg-white/60"}>
                        <td className="px-4 py-3 font-semibold text-ink">{s.name}</td>
                        <td className="px-3 py-3 text-ink/65">{s.course}<span className="block text-[11px] uppercase tracking-wider text-ink/40">{s.tier}</span></td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-sand"><div className="h-full rounded-full bg-forest" style={{ width: `${s.progress}%` }} /></div>
                            <span className="text-[11.5px] font-bold text-ink/55">{s.progress}%</span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${s.status === "active" ? "bg-forest/15 text-forest" : s.status === "at-risk" ? "bg-crimson/15 text-crimson" : "bg-marigold/25 text-forest"}`}>{s.status}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-pine">{npr(s.feePaid)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>

        {/* revenue + course toggles */}
        <div className="space-y-6 lg:col-span-5">
          <Reveal delay={100}>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Enrollment revenue · NPR (lakh)</p>
              <div className="mt-4"><BarChart data={CENTER_REVENUE} color="#2b52e1" /></div>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Your live courses</p>
              <div className="mt-3 space-y-2.5">
                {myCourses.map((c) => {
                  const isPaused = paused.includes(c.id);
                  return (
                    <div key={c.id} className="flex items-center justify-between gap-3 border-b border-dashed border-ink/10 pb-2.5 last:border-0 last:pb-0">
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-semibold text-ink">{c.title}</span>
                        <span className="text-[11.5px] text-ink/50">{npr(c.fee)} · {c.seats} seats</span>
                      </span>
                      <button
                        onClick={() => setPaused((p) => (isPaused ? p.filter((x) => x !== c.id) : [...p, c.id]))}
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider transition ${isPaused ? "bg-crimson/15 text-crimson" : "bg-forest/15 text-forest"}`}
                      >
                        {isPaused ? "Paused" : "Live"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <span className="hidden">{enrollments.length}</span>
    </div>
  );
}

/* ---------- Admin dashboard ---------- */
function AdminSpace() {
  const { pendingVendors, approveVendor, rejectVendor, disputes, resolveDispute, bookings, orders } = useApp();

  const tiles = [
    { icon: Users, label: "Registered users", value: "12,480", accent: "bg-pine text-marigold" },
    { icon: Store, label: "Active vendors", value: "312", accent: "bg-forest text-sun" },
    { icon: Calendar, label: "Bookings (30d)", value: `${240 + bookings.length}`, accent: "bg-crimson text-ivory" },
    { icon: Coins, label: "GMV this month", value: "रू 15.2L", accent: "bg-marigold text-pine" },
  ];

  return (
    <div>
      <section className="relative overflow-hidden bg-pine pb-16 pt-14 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -right-4 -top-12 select-none font-display text-[170px] font-bold leading-none text-ivory/[0.045]">एडमिन</p>
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><Kicker tone="light">Admin · व्यवस्थापक</Kicker></Reveal>
          <Masked as="h1" className="mt-4 font-display text-5xl font-semibold leading-[1.02] md:text-6xl" lines={[<>Mission control,</>, <><em className="italic text-marigold">whole ecosystem</em>.</>]} />
          <Reveal delay={200}><p className="mt-3 max-w-xl text-ivory/70">Approve vendors, resolve disputes and watch platform revenue — the Junetara ops console.</p></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="-mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.label} delay={i * 80}>
              <div className="flex items-center gap-4 rounded-xl border border-ink/10 bg-ivory p-5 shadow-sm">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${t.accent}`}><t.icon className="h-5 w-5" /></span>
                <div>
                  <p className="font-display text-[22px] leading-none text-pine">{t.value}</p>
                  <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/50">{t.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-12">
        {/* vendor queue + disputes */}
        <div className="space-y-6 lg:col-span-7">
          <div>
            <Reveal><Kicker>Vendor approval queue</Kicker></Reveal>
            <Masked className="mt-2 font-display text-3xl font-semibold text-pine md:text-4xl" lines={[<>New partners, <em className="italic text-crimson">review</em>.</>]} />
            <Reveal delay={120}>
              <div className="mt-5 space-y-3">
                {pendingVendors.length === 0 && (
                  <p className="rounded-xl border border-dashed border-ink/20 bg-white/50 p-6 text-center text-[13.5px] text-ink/55">Queue clear — every applicant has been actioned. ✓</p>
                )}
                {pendingVendors.map((v) => (
                  <div key={v.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 bg-white/70 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sand text-forest"><Store className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{v.name}</p>
                      <p className="text-[11.5px] text-ink/55">{v.type} · {v.city} · applied {v.date} · {v.docs ? "docs verified" : "docs pending"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveVendor(v.id)} className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-sun transition hover:bg-pine"><Check className="h-3.5 w-3.5" /> Approve</button>
                      <button onClick={() => rejectVendor(v.id)} className="flex items-center gap-1.5 rounded-full border border-crimson/40 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-crimson transition hover:bg-crimson hover:text-ivory"><X className="h-3.5 w-3.5" /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal><Kicker>Dispute resolution</Kicker></Reveal>
            <Reveal delay={120}>
              <div className="mt-4 space-y-3">
                {disputes.length === 0 && (
                  <p className="rounded-xl border border-dashed border-ink/20 bg-white/50 p-6 text-center text-[13.5px] text-ink/55">No open disputes. The ecosystem is at peace. ✳</p>
                )}
                {disputes.map((d) => (
                  <div key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-crimson/25 bg-crimson/5 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-crimson/15 text-crimson"><ShieldCheck className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink">{d.parties} · {npr(d.amount)}</p>
                      <p className="text-[11.5px] text-ink/55">{d.booking} · {d.reason} · {d.date}</p>
                    </div>
                    <button onClick={() => resolveDispute(d.id)} className="rounded-full bg-crimson px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ivory transition hover:bg-pine">Refund & resolve</button>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* platform revenue + rollout */}
        <div className="space-y-6 lg:col-span-5">
          <Reveal delay={100}>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Platform revenue · NPR (lakh)</p>
              <div className="mt-4"><BarChart data={ADMIN_REVENUE} color="#ea5240" /></div>
              <p className="mt-3 text-right font-display text-lg italic text-crimson">Break-even pace: Month 18–24 ✓</p>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">City rollout</p>
              <div className="mt-3 space-y-2.5">
                {[
                  { city: "Kathmandu Valley", pct: 100, live: true },
                  { city: "Pokhara", pct: 62, live: true },
                  { city: "Bharatpur", pct: 34, live: false },
                  { city: "Biratnagar / Dharan", pct: 12, live: false },
                ].map((c) => (
                  <div key={c.city}>
                    <div className="flex items-center justify-between text-[12.5px]">
                      <span className="font-semibold text-ink">{c.city}</span>
                      <span className={`text-[10.5px] font-bold uppercase tracking-wider ${c.live ? "text-forest" : "text-ink/40"}`}>{c.live ? "Live" : "Onboarding"} · {c.pct}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sand"><div className="bar-grow h-full rounded-full bg-marigold" style={{ width: `${c.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <span className="hidden">{orders.length}</span>
        </div>
      </section>

      {/* business management */}
      <section className="mx-auto max-w-7xl px-5 pb-14 md:px-8">
        <div className="mb-6">
          <Reveal><Kicker>Books · हिसाब-किताब</Kicker></Reveal>
          <Masked className="mt-2 font-display text-3xl font-semibold text-pine md:text-4xl" lines={[<>Business management, <em className="italic text-crimson">live</em>.</>]} />
          <Reveal delay={120}>
            <p className="mt-2 max-w-2xl text-[13.5px] text-ink/55">
              One ledger for the whole ecosystem — switch entities, record entries, then export to
              <strong className="text-forest"> Excel (CSV)</strong> or sync straight into a <strong className="text-forest">Google Sheet</strong> via the built-in Apps Script bridge.
            </p>
          </Reveal>
        </div>
        <Ledger />
      </section>
    </div>
  );
}

/* ---------- Service provider (salon) dashboard ---------- */
const SLOT_HOURS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const FILLED_SLOTS = [0, 1, 3, 5, 7, 8];

function ServiceSpace() {
  const { toast } = useApp();
  const [extra, setExtra] = useState(0);
  const [homeReq, setHomeReq] = useState<"pending" | "accepted" | "declined">("pending");
  const schedule = SALON_SCHEDULE;

  /* a live booking lands every ~12s */
  useEffect(() => {
    const t = setInterval(() => setExtra((e) => (e < 4 ? e + 1 : e)), 12000);
    return () => clearInterval(t);
  }, []);

  const todayBookings = 14 + extra;
  const todayRevenue = 18400 + extra * 1500;

  const tiles = [
    { icon: Calendar, label: "Today's bookings", value: `${todayBookings}`, accent: "bg-crimson text-ivory", live: true },
    { icon: Clock, label: "Chair utilization", value: "78%", accent: "bg-pine text-marigold" },
    { icon: Star, label: "Salon rating", value: "4.8★", accent: "bg-marigold text-pine" },
    { icon: Coins, label: "Revenue today", value: npr(todayRevenue), accent: "bg-forest text-sun" },
  ];

  const statusChip = (s: string) =>
    s === "done" ? "bg-forest/15 text-forest" : s === "in-chair" ? "bg-marigold/30 text-forest" : "bg-sand text-ink/60";

  return (
    <div>
      <section className="relative overflow-hidden bg-crimson pb-16 pt-14 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -right-4 -top-12 select-none font-display text-[170px] font-bold leading-none text-ivory/[0.06]">सलून</p>
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><Kicker tone="light">Service provider · सेवा प्रदायक</Kicker></Reveal>
          <Masked as="h1" className="mt-4 font-display text-5xl font-semibold leading-[1.02] md:text-6xl" lines={[<>Asha Beauty Lounge,</>, <><em className="italic text-sun">front desk live</em>.</>]} />
          <Reveal delay={200}><p className="mt-3 max-w-xl text-ivory/80">Thamel · Level 2 partner · the day's chairs, requests and takings — updating in real time.</p></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="-mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.label} delay={i * 80}>
              <div className="flex items-center gap-4 rounded-xl border border-ink/10 bg-ivory p-5 shadow-sm">
                <span className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-full ${t.accent}`}>
                  <t.icon className="h-5 w-5" />
                  {t.live && <span className="blink absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-crimson ring-2 ring-ivory" />}
                </span>
                <div>
                  <p className="font-display text-[22px] leading-none text-pine">{t.value}</p>
                  <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/50">{t.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-12">
        {/* schedule + home request */}
        <div className="lg:col-span-7">
          <Reveal><Kicker>Today's chairs</Kicker></Reveal>
          <Masked className="mt-2 font-display text-3xl font-semibold text-pine md:text-4xl" lines={[<>The floor, <em className="italic text-crimson">hour by hour</em>.</>]} />

          {homeReq === "pending" && (
            <Reveal delay={100}>
              <div className="mt-5 flex flex-wrap items-center gap-4 rounded-xl border-2 border-dashed border-marigold/70 bg-marigold/10 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-marigold text-pine"><HomeVisit className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-crimson">
                    <span className="blink h-1.5 w-1.5 rounded-full bg-crimson" /> New home-service request
                  </p>
                  <p className="mt-0.5 text-[14px] font-semibold text-ink">Full Body Spa Massage — Naxal · tomorrow 11:00 · {npr(3500)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setHomeReq("accepted"); toast("Home visit accepted — artist Anita assigned, client notified"); }} className="flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-sun transition hover:bg-pine"><Check className="h-3.5 w-3.5" /> Accept</button>
                  <button onClick={() => { setHomeReq("declined"); toast("Request declined — rerouted to Kasturi Salon & Spa"); }} className="flex items-center gap-1.5 rounded-full border border-ink/20 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ink/55 transition hover:border-crimson hover:text-crimson"><X className="h-3.5 w-3.5" /> Decline</button>
                </div>
              </div>
            </Reveal>
          )}
          {homeReq === "accepted" && (
            <p className="fade-in mt-5 flex items-center gap-2 rounded-xl bg-forest/10 p-4 text-[13.5px] font-semibold text-forest">
              <Check className="h-4 w-4" /> Home visit accepted — Anita will reach Naxal tomorrow 11:00. Added to tomorrow's roster.
            </p>
          )}

          <Reveal delay={140}>
            <div className="mt-5 overflow-hidden rounded-xl border border-ink/10 bg-white/70">
              <div className="divide-y divide-ink/8">
                {schedule.map((b) => (
                  <div key={b.time} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-sand/50">
                    <span className="w-14 shrink-0 font-mono text-[13px] font-bold text-crimson">{b.time}</span>
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${b.status === "done" ? "bg-forest" : b.status === "in-chair" ? "blink bg-marigold" : "bg-sand ring-1 ring-ink/20"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-ink">{b.service}</p>
                      <p className="text-[11.5px] text-ink/50">with {b.artist}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusChip(b.status)}`}>{b.status}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-ink/10 bg-sand/60 px-5 py-3">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink/50">Slot map</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {SLOT_HOURS.map((h, i) => (
                    <span key={h} className={`rounded-md px-2.5 py-1.5 font-mono text-[11px] font-bold ${FILLED_SLOTS.includes(i) ? "bg-crimson text-ivory" : "bg-ivory text-ink/45 ring-1 ring-ink/15"}`}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ratings + revenue */}
        <div className="space-y-6 lg:col-span-5">
          <Reveal delay={120}>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Multi-dimensional ratings</p>
              <div className="mt-4 space-y-3.5">
                {SALON_RATINGS.map((r, i) => (
                  <div key={r.dim}>
                    <div className="flex justify-between text-[12.5px]"><span className="font-semibold text-ink">{r.dim}</span><span className="font-bold text-crimson">{(r.pct / 20).toFixed(1)}</span></div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-sand">
                      <div className="bar-grow h-full rounded-full bg-gradient-to-r from-crimson to-marigold" style={{ width: `${r.pct}%`, animationDelay: `${i * 110}ms` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[12px] text-ink/50">421 verified reviews · quality, hygiene, punctuality & value tracked separately</p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">This week · NPR (thousand)</p>
              <div className="mt-4"><BarChart data={SALON_REVENUE} color="#ea5240" /></div>
              <p className="mt-3 text-right font-display text-lg italic text-crimson">Saturday peak — bridal season ✓</p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ---------- Product vendor dashboard ---------- */
function VendorSpace() {
  const lowStock = INVENTORY.filter((i) => i.stock / i.cap < 0.25).length;
  const b2bShare = 62;

  const tiles = [
    { icon: Store, label: "Live SKUs", value: `${INVENTORY.length}`, accent: "bg-pine text-marigold" },
    { icon: Sparkle, label: "Low-stock alerts", value: `${lowStock}`, accent: "bg-crimson text-ivory" },
    { icon: Bag, label: "Orders this week", value: "37", accent: "bg-forest text-sun" },
    { icon: Coins, label: "B2B share", value: `${b2bShare}%`, accent: "bg-marigold text-pine" },
  ];

  const orderChip = (s: string) =>
    s === "Processing" ? "bg-marigold/25 text-forest" : s === "Shipped" ? "bg-forest/15 text-forest" : "bg-sand text-ink/55";

  return (
    <div>
      <section className="relative overflow-hidden bg-marigold pb-16 pt-14 text-pine">
        <p aria-hidden className="pointer-events-none absolute -right-4 -top-12 select-none font-display text-[170px] font-bold leading-none text-pine/[0.07]">भण्डार</p>
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><Kicker tone="dark">Product vendor · उत्पादक</Kicker></Reveal>
          <Masked as="h1" className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-pine md:text-6xl" lines={[<>Chiya Beauty Supplies,</>, <><em className="italic text-crimson">warehouse live</em>.</>]} />
          <Reveal delay={200}><p className="mt-3 max-w-xl text-pine/75">Inventory, B2B wholesale and retail orders — one screen between you and the whole valley.</p></Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="-mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.label} delay={i * 80}>
              <div className="flex items-center gap-4 rounded-xl border border-ink/10 bg-ivory p-5 shadow-sm">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${t.accent}`}><t.icon className="h-5 w-5" /></span>
                <div>
                  <p className="font-display text-[22px] leading-none text-pine">{t.value}</p>
                  <p className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink/50">{t.label}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:px-8 lg:grid-cols-12">
        {/* inventory */}
        <div className="lg:col-span-7">
          <Reveal><Kicker>Inventory</Kicker></Reveal>
          <Masked className="mt-2 font-display text-3xl font-semibold text-pine md:text-4xl" lines={[<>Stock that <em className="italic text-crimson">never sleeps</em>.</>]} />
          <Reveal delay={120}>
            <div className="mt-5 overflow-hidden rounded-xl border border-ink/10 bg-white/70">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-[13.5px]">
                  <thead className="bg-pine text-marigold">
                    <tr>
                      <th className="px-4 py-3 font-bold">Product</th>
                      <th className="px-3 py-3 font-bold">Stock</th>
                      <th className="px-3 py-3 font-bold">Status</th>
                      <th className="px-4 py-3 text-right font-bold">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INVENTORY.map((item, i) => {
                      const ratio = item.stock / item.cap;
                      const status = ratio >= 0.5 ? "In stock" : ratio >= 0.25 ? "Low" : "Restock now";
                      return (
                        <tr key={item.sku} className={i % 2 ? "bg-sand/50" : "bg-white/60"}>
                          <td className="px-4 py-3">
                            <span className="font-semibold text-ink">{item.name}</span>
                            <span className="block font-mono text-[10.5px] tracking-wider text-ink/40">{item.sku}</span>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-sand">
                                <div className={`h-full rounded-full ${ratio >= 0.5 ? "bg-forest" : ratio >= 0.25 ? "bg-marigold" : "bg-crimson"}`} style={{ width: `${ratio * 100}%` }} />
                              </div>
                              <span className="text-[11.5px] font-bold text-ink/55">{item.stock}/{item.cap}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${ratio >= 0.5 ? "bg-forest/15 text-forest" : ratio >= 0.25 ? "bg-marigold/30 text-forest" : "bg-crimson/15 text-crimson"}`}>{status}</span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-pine">{npr(item.price)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </div>

        {/* orders + split + sales */}
        <div className="space-y-6 lg:col-span-5">
          <Reveal delay={120}>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Order pipeline</p>
              <div className="mt-3 space-y-2.5">
                {VENDOR_ORDERS.map((o) => (
                  <div key={o.id} className="flex items-center gap-3 border-b border-dashed border-ink/10 pb-2.5 last:border-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold text-ink">{o.buyer}</p>
                      <p className="font-mono text-[10.5px] tracking-wider text-ink/45">{o.id} · {o.type} · {o.items} items</p>
                    </div>
                    <span className="font-display text-[15px] text-pine">{npr(o.total)}</span>
                    <span className={`w-24 shrink-0 rounded-full px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wider ${orderChip(o.status)}`}>{o.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">B2B vs B2C split</p>
              <div className="mt-4 flex h-3.5 overflow-hidden rounded-full">
                <div className="bar-grow bg-crimson" style={{ width: `${b2bShare}%` }} />
                <div className="bar-grow bg-marigold" style={{ width: `${100 - b2bShare}%`, animationDelay: "200ms" }} />
              </div>
              <div className="mt-3 flex justify-between text-[12px] font-semibold">
                <span className="text-crimson">Wholesale · {b2bShare}%</span>
                <span className="text-forest">Retail · {100 - b2bShare}%</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div className="rounded-xl border border-ink/10 bg-white/70 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest">Sales trend · NPR (lakh)</p>
              <div className="mt-4"><BarChart data={VENDOR_SALES} color="#ffb800" /></div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ---------- role-switching wrapper ---------- */
const ROLES: { id: Role; label: string; nep: string }[] = [
  { id: "customer", label: "Customer", nep: "ग्राहक" },
  { id: "center", label: "Training Center", nep: "प्रशिक्षण केन्द्र" },
  { id: "service", label: "Salon", nep: "सलून" },
  { id: "vendor", label: "Vendor", nep: "उत्पादक" },
  { id: "admin", label: "Admin", nep: "व्यवस्थापक" },
];

export default function Dashboard() {
  const { role, setRole } = useApp();
  return (
    <div>
      <div data-tour="roles" className="sticky top-[68px] z-40 border-b border-ink/10 bg-ivory/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-5 py-2.5 md:px-8">
          <span className="mr-2 hidden text-[10.5px] font-bold uppercase tracking-[0.2em] text-ink/40 sm:block">View as</span>
          {ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition-all ${role === r.id ? "bg-pine text-marigold shadow-sm" : "bg-sand/70 text-ink/55 hover:bg-sand hover:text-pine"}`}
            >
              {r.label} <span className={`ml-1 ${role === r.id ? "text-sun" : "text-ink/35"}`}>· {r.nep}</span>
            </button>
          ))}
        </div>
      </div>
      <div key={role} className="view-enter">
        {role === "customer" && <CustomerSpace />}
        {role === "center" && <CenterSpace />}
        {role === "service" && <ServiceSpace />}
        {role === "vendor" && <VendorSpace />}
        {role === "admin" && <AdminSpace />}
      </div>
    </div>
  );
}
