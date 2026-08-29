import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context";
import { LIVE_SESSIONS, type LiveSession } from "../data";
import { Kicker, Masked, Reveal } from "./ui";
import { ArrowRight, Calendar, Check, Clock, Play, Signal, Users } from "./Icons";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- real-time helpers ---------- */
function useTick(ms: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

function fmtElapsed(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

/* viewer count drifts like a real stream */
function useViewers(base: number) {
  const [v, setV] = useState(base);
  useEffect(() => {
    if (reduced()) return;
    const t = setInterval(() => setV((x) => Math.max(15, x + Math.floor(Math.random() * 9) - 3)), 2800);
    return () => clearInterval(t);
  }, []);
  return v;
}

/* ---------- on-air session card ---------- */
export function LiveCard({ s, delay = 0 }: { s: LiveSession; delay?: number }) {
  const { toast } = useApp();
  const now = useTick(1000);
  const viewers = useViewers(s.viewers);
  const [watching, setWatching] = useState(false);

  const start = useMemo(() => Date.now() - (s.startedMinAgo ?? 0) * 60000, [s.startedMinAgo]);
  const totalSec = s.durationMin * 60;
  const elapsed = Math.min((now - start) / 1000, totalSec);
  const pct = Math.round((elapsed / totalSec) * 100);
  const wrapping = pct >= 92;

  return (
    <Reveal delay={delay}>
      <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-white/80 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-26px_rgba(26,59,139,0.45)]">
        <div className="relative h-48 overflow-hidden">
          <img src={s.img} alt={s.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-pine/70 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-coral px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ivory shadow-sm">
            <span className="blink h-1.5 w-1.5 rounded-full bg-ivory" /> Live
          </span>
          <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-pine/85 px-3 py-1.5 text-[11.5px] font-bold text-ivory backdrop-blur-sm">
            <Users className="h-3.5 w-3.5 text-marigold" /> {viewers.toLocaleString("en-IN")}
          </span>
          <span className="absolute bottom-3 right-4 flex items-center gap-1.5 rounded-lg bg-pine/85 px-3 py-1.5 font-mono text-[12px] font-bold text-sun backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5" /> {fmtElapsed(elapsed)}
            <span className="text-ivory/50">/ {s.durationMin}m</span>
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-marigold/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-forest">{s.cat} · {s.tier}</span>
            <span className={`font-mono text-[11px] font-bold ${wrapping ? "text-coral" : "text-ink/45"}`}>{wrapping ? "wrapping up" : `${pct}% through`}</span>
          </div>
          <h3 className="mt-3 font-display text-xl leading-tight text-pine">{s.title}</h3>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest font-display text-[13px] italic text-ivory">{s.initials}</span>
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-bold text-ink">{s.trainer}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-coral">on air now</p>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sand">
            <div className="h-full rounded-full bg-gradient-to-r from-coral to-marigold transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
          <button
            onClick={() => {
              if (!watching) {
                setWatching(true);
                toast(`Joined "${s.title}" — stream opens in the mobile app at launch`);
              }
            }}
            className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all ${
              watching
                ? "bg-coral/15 text-coral ring-1 ring-coral/50"
                : "bg-pine text-ivory hover:bg-forest"
            }`}
          >
            {watching ? (<><Check className="h-4 w-4" /> Watching — see you inside</>) : (<><Play className="h-4 w-4" /> Join the session free</>)}
          </button>
        </div>
      </article>
    </Reveal>
  );
}

/* ---------- upcoming session row ---------- */
function UpcomingCard({ s, delay = 0 }: { s: LiveSession; delay?: number }) {
  const { toast } = useApp();
  const [reminded, setReminded] = useState(false);
  return (
    <Reveal delay={delay}>
      <div className="flex h-full items-center gap-4 rounded-xl border border-ink/10 bg-white/70 p-4 transition-all duration-300 hover:border-forest/50 hover:bg-ivory">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-sand text-forest">
          <Calendar className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-forest">
            <Signal className="h-3.5 w-3.5" /> {s.startsIn}
          </p>
          <p className="mt-0.5 truncate font-display text-[17px] leading-tight text-pine" title={s.title}>{s.title}</p>
          <p className="truncate text-[12px] text-ink/55">{s.trainer} · {s.cat} · {s.durationMin} min · {s.viewers} registered</p>
        </div>
        <button
          onClick={() => {
            if (!reminded) {
              setReminded(true);
              toast(`Reminder set — we'll SMS you 10 min before "${s.title}"`);
            }
          }}
          className={`shrink-0 rounded-full px-4 py-2 text-[10.5px] font-bold uppercase tracking-wider transition-all ${
            reminded ? "bg-forest/15 text-forest" : "border border-pine/40 text-pine hover:bg-pine hover:text-ivory"
          }`}
        >
          {reminded ? "✓ Reminded" : "Remind me"}
        </button>
      </div>
    </Reveal>
  );
}

/* ---------- full section for Home ---------- */
export function LiveSessionsSection() {
  const live = LIVE_SESSIONS.filter((s) => s.status === "live");
  const upcoming = LIVE_SESSIONS.filter((s) => s.status === "upcoming");
  const totalWatching = live.reduce((t, s) => t + s.viewers, 0);

  return (
    <section id="live-now" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-4 pt-16 md:px-8">
      <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
        <div>
          <Reveal>
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] text-coral">
              <span className="blink h-2 w-2 rounded-full bg-coral" />
              प्रत्यक्ष · Live right now
            </p>
          </Reveal>
          <Masked className="mt-4 font-display text-5xl font-semibold leading-[1.02] text-pine md:text-6xl" lines={[<>Learn from masters,</>, <><em className="italic text-coral">on air</em>.</>]} />
        </div>
        <Reveal delay={200}>
          <div className="flex flex-wrap gap-2.5">
            <span className="flex items-center gap-2 rounded-full bg-coral/12 px-4 py-2 text-[12px] font-bold text-coral">
              <Signal className="h-4 w-4" /> {live.length} sessions on air
            </span>
            <span className="flex items-center gap-2 rounded-full bg-forest/10 px-4 py-2 text-[12px] font-bold text-forest">
              <Users className="h-4 w-4" /> {totalWatching.toLocaleString("en-IN")}+ watching
            </span>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {live.map((s, i) => (
          <LiveCard key={s.id} s={s} delay={i * 110} />
        ))}
      </div>

      <div className="mt-10">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em] text-forest">
            <span className="h-px w-10 bg-forest/40" /> Up next on the schedule
          </p>
        </Reveal>
        <div className="grid gap-3 lg:grid-cols-3">
          {upcoming.map((s, i) => (
            <UpcomingCard key={s.id} s={s} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- compact on-air strip for the hero ---------- */
export function LiveStrip() {
  const { toast } = useApp();
  const s = LIVE_SESSIONS[0];
  const now = useTick(1000);
  const viewers = useViewers(s.viewers);
  const [watching, setWatching] = useState(false);

  const start = useMemo(() => Date.now() - (s.startedMinAgo ?? 0) * 60000, [s.startedMinAgo]);
  const elapsed = Math.min((now - start) / 1000, s.durationMin * 60);

  const jumpToLive = () => {
    document.getElementById("live-now")?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  };

  return (
    <div data-tour="live" className="ticket relative flex flex-wrap items-center gap-4 rounded-xl bg-pine p-4 text-ivory shadow-[0_30px_60px_-24px_rgba(26,59,139,0.55)] md:gap-5 md:p-5">
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
        <img src={s.img} alt="" className="h-full w-full object-cover" />
        <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-coral px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-ivory">
          <span className="blink h-1 w-1 rounded-full bg-ivory" /> Live
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-coral">
          <Signal className="h-3.5 w-3.5" /> On air · {s.cat} masterclass
        </p>
        <p className="mt-0.5 truncate font-display text-lg italic leading-tight" title={s.title}>{s.title}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[12px] text-ivory/60">
          <span className="font-semibold text-ivory/85">{s.trainer}</span>
          <span className="flex items-center gap-1 font-mono text-sun"><Clock className="h-3 w-3" /> {fmtElapsed(elapsed)}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3 text-marigold" /> {viewers.toLocaleString("en-IN")} watching</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <button
          onClick={() => {
            if (!watching) {
              setWatching(true);
              toast(`Joined "${s.title}" — stream opens in the mobile app at launch`);
            } else {
              jumpToLive();
            }
          }}
          className={`flex items-center gap-2 rounded-full px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
            watching ? "bg-coral/20 text-coral ring-1 ring-coral/60" : "bg-coral text-ivory hover:bg-marigold hover:text-pine"
          }`}
        >
          {watching ? <><Check className="h-4 w-4" /> Watching</> : <><Play className="h-4 w-4" /> Join free</>}
        </button>
        <button onClick={jumpToLive} className="link-sweep hidden items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-marigold sm:flex">
          All {LIVE_SESSIONS.filter((x) => x.status === "live").length} live <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
