import { useCallback, useEffect, useRef, useState } from "react";
import { useApp, type Role, type View } from "../context";
import { ArrowLeft, ArrowRight, Flower, Play, Sparkle, X } from "./Icons";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface Step {
  tour: string | null;
  view?: View;
  role?: Role;
  kicker: string;
  title: string;
  body: string;
}

const STEPS: Step[] = [
  { tour: "console", view: "home", kicker: "Discovery", title: "One search, the whole industry", body: "Courses, services, products and careers — type once and Junetara searches all four verticals at the same time." },
  { tour: "live", view: "home", kicker: "Live now", title: "Learning happens on air", body: "Masters stream real classes with ticking timers and live viewers. Join with one tap — it lands in your notifications." },
  { tour: "tiers", view: "training", kicker: "Training", title: "From threading to teaching", body: "Four CTEVT-aligned tiers with NPR pricing, installment plans and QR-verified digital certificates." },
  { tour: "booking", view: "services", kicker: "Services", title: "Book in sixty seconds", body: "Live slots at verified salons — or an artist at your door. Pay with eSewa, Khalti or Fonepay." },
  { tour: "bazaar", view: "market", kicker: "Marketplace", title: "The bazaar, digitised", body: "Retail for everyone, wholesale for vendors. Promo codes from the Collaborate page work right in the bag." },
  { tour: "bidding", view: "map", kicker: "Live map", title: "Bid like InDrive", body: "Name your price and nearby artists accept or counter in real time. Accepted offers become real bookings." },
  { tour: "roles", view: "space", role: "customer", kicker: "My Space", title: "Five dashboards, one ecosystem", body: "Customer, training center, salon, product vendor and admin — the same platform, five points of view." },
  { tour: "bell", kicker: "Notifications", title: "The ecosystem talks back", body: "Every booking, certificate, order and signed agreement lands here — unread until you see it." },
  { tour: "autopilot", kicker: "Autopilot", title: "Or let it drive itself", body: "Hit play and watch the entire journey — enroll, bid, book, shop, sign — run hands-free in forty seconds." },
  { tour: null, kicker: "Namaste", title: "Your turn 🙏", body: "Everything you just saw is real and saved on this device. Explore freely — or launch the autopilot and sit back." },
];

function useSeen() {
  const [seen, setSeen] = useState(() => {
    try { return localStorage.getItem("jg-tour-seen") === "1"; } catch { return false; }
  });
  const mark = useCallback(() => {
    try { localStorage.setItem("jg-tour-seen", "1"); } catch { /* sandboxed */ }
    setSeen(true);
  }, []);
  return { seen, mark };
}

export default function Tour() {
  const { go, setRole, autopilot } = useApp();
  const { seen, mark } = useSeen();
  const [open, setOpen] = useState(false);
  const [invite, setInvite] = useState(false);
  const [idx, setIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  /* first-visit invite */
  useEffect(() => {
    if (seen || open) return;
    const t = window.setTimeout(() => setInvite(true), 2600);
    return () => clearTimeout(t);
  }, [seen, open]);
  useEffect(() => { if (autopilot) setInvite(false); }, [autopilot]);

  const measure = useCallback((step: Step) => {
    if (!step.tour) { setRect(null); return; }
    const el = document.querySelector(`[data-tour="${step.tour}"]`);
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ block: "center", behavior: reduced() ? "auto" : "smooth" });
    window.setTimeout(() => setRect(el.getBoundingClientRect()), reduced() ? 0 : 350);
  }, []);

  /* navigate + measure on step change */
  useEffect(() => {
    if (!open) return;
    const step = STEPS[idx];
    if (step.view) go(step.view);
    if (step.role) setRole(step.role);
    clearTimers();
    timers.current.push(window.setTimeout(() => measure(step), step.view ? 500 : 60));
    return clearTimers;
  }, [open, idx, go, setRole, measure]);

  /* keep the hole glued while scrolling / resizing / content shifts */
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const remeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => measure(STEPS[idx]));
    };
    const interval = window.setInterval(remeasure, 900);
    window.addEventListener("scroll", remeasure, { passive: true });
    window.addEventListener("resize", remeasure);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      window.removeEventListener("scroll", remeasure);
      window.removeEventListener("resize", remeasure);
    };
  }, [open, idx, measure]);

  const start = useCallback(() => { setInvite(false); setIdx(0); setOpen(true); }, []);
  const close = useCallback(() => { setOpen(false); setRect(null); mark(); }, [mark]);
  const next = useCallback(() => { if (idx >= STEPS.length - 1) close(); else setIdx(idx + 1); }, [idx, close]);
  const prev = useCallback(() => setIdx((v) => Math.max(0, v - 1)), []);

  /* keyboard */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev, close]);

  return (
    <>
      {/* ---------- invite card ---------- */}
      {invite && !open && !autopilot && (
    <div className="fade-in fixed bottom-6 left-6 z-[80] w-[320px] max-w-[calc(100vw-3rem)] rounded-xl border border-marigold/40 bg-pine p-5 text-ivory shadow-[0_28px_60px_-20px_rgba(26,59,139,0.65)]">
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-marigold text-pine"><Flower className="diya-flame h-5 w-5" /></span>
        <button onClick={() => { setInvite(false); mark(); }} className="text-ivory/50 transition hover:text-ivory" aria-label="Dismiss tour invite"><X className="h-4 w-4" /></button>
      </div>
      <p className="mt-3 font-display text-xl italic leading-tight">New to the ecosystem?</p>
      <p className="mt-1 text-[13px] text-ivory/65">A 60-second spotlight tour of training, booking, bidding and the five dashboards.</p>
      <div className="mt-4 flex gap-2">
        <button onClick={start} className="flex-1 rounded-full bg-marigold px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-pine transition hover:bg-sun">Start tour</button>
        <button onClick={() => { setInvite(false); mark(); }} className="rounded-full border border-ivory/25 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory/70 transition hover:border-ivory/60">Later</button>
      </div>
    </div>
  )}

  {/* ---------- spotlight overlay ---------- */}
  {open && (() => {
    const step = STEPS[idx];
    const PAD = 10;
    const r = rect && step.tour ? { top: rect.top - PAD, left: rect.left - PAD, w: rect.width + PAD * 2, h: rect.height + PAD * 2 } : null;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const shade = "fixed bg-pine/[0.82] transition-all duration-500 ease-out";

    /* tooltip placement */
    const CARD_W = Math.min(380, vw - 32);
    let cx = vw / 2 - CARD_W / 2;
    let cy = vh / 2 - 130;
    let align = "center";
    if (r) {
      cx = Math.max(16, Math.min(r.left + r.w / 2 - CARD_W / 2, vw - CARD_W - 16));
      const below = r.top + r.h + 250 < vh;
      cy = below ? r.top + r.h + 18 : Math.max(16, r.top - 18 - 236);
      align = below ? "below" : "above";
    }

    return (
      <div role="dialog" aria-modal="true" aria-label="Guided tour">
        {r ? (
          <>
            <div className={shade} style={{ top: 0, left: 0, right: 0, height: Math.max(0, r.top) }} onClick={close} />
            <div className={shade} style={{ top: r.top + r.h, left: 0, right: 0, bottom: 0 }} onClick={close} />
            <div className={shade} style={{ top: r.top, left: 0, height: r.h, width: Math.max(0, r.left) }} onClick={close} />
            <div className={shade} style={{ top: r.top, right: 0, height: r.h, left: r.left + r.w }} onClick={close} />
            {/* pulse ring around the hole */}
            <div
              aria-hidden
              className="pointer-events-none fixed rounded-xl border-2 border-marigold transition-all duration-500 ease-out"
              style={{ top: r.top, left: r.left, width: r.w, height: r.h, boxShadow: "0 0 0 6px rgba(255,184,0,0.12), 0 0 44px rgba(255,184,0,0.25)" }}
            >
              <span className="absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-marigold px-2.5 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-pine">
                <Sparkle className="h-3 w-3" /> {step.kicker}
              </span>
            </div>
          </>
        ) : (
          <div className={shade} style={{ inset: 0 }} onClick={idx === STEPS.length - 1 ? undefined : close} />
        )}

        {/* card */}
        <div
          key={idx}
          className="fade-in fixed z-[96] rounded-xl border border-ink/10 bg-ivory p-6 shadow-[0_36px_80px_-24px_rgba(26,59,139,0.55)]"
          style={{ left: cx, top: cy, width: CARD_W }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-crimson">{String(idx + 1).padStart(2, "0")} / {STEPS.length}</span>
            <div className="flex items-center gap-1">
              {STEPS.map((s, i) => (
                <button key={i} onClick={() => setIdx(i)} aria-label={`Go to step ${i + 1}`} className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? "w-5 bg-crimson" : i < idx ? "w-2.5 bg-crimson/40" : "w-2.5 bg-ink/15 hover:bg-ink/30"}`} />
              ))}
            </div>
          </div>
          <h3 className="mt-3 font-display text-[26px] font-semibold italic leading-tight text-pine">{step.title}</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/65">{step.body}</p>

          {idx === STEPS.length - 1 && (
            <button
              onClick={() => { close(); }}
              className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-pine px-5 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-crimson hover:text-ivory"
            >
              <Play className="h-4 w-4" /> Try the autopilot next
            </button>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <button onClick={close} className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45 transition hover:text-crimson">Skip</button>
            <div className="flex gap-2">
              <button onClick={prev} disabled={idx === 0} className="grid h-10 w-10 place-items-center rounded-full border border-ink/20 text-ink/60 transition enabled:hover:border-pine enabled:hover:text-pine disabled:opacity-30" aria-label="Previous step">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button onClick={next} className="flex items-center gap-2 rounded-full bg-crimson px-5 h-10 text-[12px] font-bold uppercase tracking-[0.12em] text-ivory transition hover:bg-pine">
                {idx === STEPS.length - 1 ? "Finish" : "Next"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-3 hidden text-center text-[10px] font-bold uppercase tracking-[0.22em] text-ink/35 sm:block">← → to navigate · ESC to skip {align === "above" ? "· card flipped up" : ""}</p>
        </div>
      </div>
    );
  })()}

  {/* always-available re-launch: tiny flower handle bottom-left once seen */}
  {seen && !open && !invite && !autopilot && (
    <button
      onClick={start}
      aria-label="Replay the guided tour"
      title="Replay tour"
      className="group fixed bottom-6 left-6 z-[60] grid h-11 w-11 place-items-center rounded-full border border-marigold/50 bg-ivory text-marigold shadow-[0_14px_34px_-12px_rgba(26,59,139,0.45)] transition-all hover:-translate-y-0.5 hover:bg-pine"
    >
      <Flower className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
    </button>
  )}
    </>
  );
}
