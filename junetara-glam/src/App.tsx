import { Component, type ErrorInfo, type ReactNode } from "react";
import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Training from "./components/Training";
import Services from "./components/Services";
import Market from "./components/Market";
import Dashboard from "./components/Dashboard";
import LiveMap from "./components/LiveMap";
import { Careers, Partner } from "./components/CareersPartner";
import Collaborate from "./components/Collaborate";
import Deck from "./components/Deck";
import Legal from "./components/Legal";
import { FestivalStrip, Garland } from "./components/Festival";
import Autopilot from "./components/Autopilot";
import Tour from "./components/Tour";
import NepalHub from "./components/Social";
import CartDrawer from "./components/CartDrawer";
import { Flower, Mail, Phone, Pin, Sparkle, Qr } from "./components/Icons";
import { Marquee } from "./components/ui";
import { TICKER_ITEMS, FESTIVAL_TICKER } from "./data";

/* live ecosystem ticker — sits above the nav */
function LiveTicker() {
  const { festival } = useApp();
  const items = festival ? [...FESTIVAL_TICKER, ...TICKER_ITEMS] : TICKER_ITEMS;
  return (
    <div className={`marquee border-b py-2 text-marigold ${festival ? "border-crimson/50 bg-[#14275e]" : "border-marigold/30 bg-pine"}`}>
      <div className="marquee-track" style={{ ["--mq-dur" as string]: festival ? "46s" : "38s" }}>
        {[false, true].map((hidden) => (
          <div key={String(hidden)} className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
            {items.map((t, i) => (
              <span key={i} className="flex items-center whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.14em]">
                <span className="blink mx-4 inline-block h-1.5 w-1.5 rounded-full bg-marigold" />
                {t}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const { go } = useApp();
  return (
    <footer className="relative overflow-hidden bg-pine text-ivory">
      <div className="border-b border-ivory/10 py-5 text-marigold/80">
        <Marquee items={["प्रशिक्षण", "Training", "सेवा", "Services", "बजार", "Marketplace", "अवसर", "Careers", "साझेदार", "Partners"]} dur={44} reverse />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-marigold text-pine"><Flower className="h-6 w-6" /></span>
            <span className="leading-none">
              <span className="block font-display text-[26px] font-semibold italic tracking-tight">Junetara Glam</span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.4em] text-marigold/80">जुनेतारा ग्ल्याम · Nepal</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-ivory/60">
            Nepal's first integrated beauty ecosystem — verified training, salon & home services, B2C/B2B
            marketplace and career pathways on one mobile-first platform. Kathmandu first, then national.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Instagram", "TikTok", "Facebook"].map((s) => (
              <span key={s} className="cursor-pointer rounded-full border border-ivory/25 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory/75 transition hover:border-marigold hover:text-marigold">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-marigold">Explore</p>
          <ul className="mt-5 space-y-3 text-[14px] text-ivory/70">
            <li>
              <button
                onClick={() => {
                  go("home");
                  setTimeout(() => document.getElementById("live-now")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }), 150);
                }}
                className="link-sweep flex items-center gap-2"
              >
                <span className="blink h-1.5 w-1.5 rounded-full bg-coral" /> Live sessions
              </button>
            </li>
            {(
              [
                ["Live Map & bidding", "map"],
                ["Investor deck", "deck"],
                ["Training", "training"],
                ["Book services", "services"],
                ["Marketplace", "market"],
                ["Careers & verify", "careers"],
                ["Brands & affiliate", "collaborate"],
                ["Nepal network", "nepal"],
                ["Partner with us", "partner"],
                ["Legal centre", "legal"],
                ["My Space (5 roles)", "space"],
              ] as const
            ).map(([label, v]) => (
              <li key={v}><button onClick={() => go(v)} className="link-sweep">{label}</button></li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-marigold">Rollout</p>
          <ul className="mt-5 space-y-3 text-[14px] text-ivory/70">
            <li className="flex gap-2.5"><Pin className="mt-0.5 h-4 w-4 shrink-0 text-marigold" /> Phase 1 · Kathmandu Valley</li>
            <li>Phase 2 · Pokhara, Bharatpur</li>
            <li>Phase 3 · Biratnagar, Dharan</li>
            <li>Phase 4 · Semi-urban & rural</li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-marigold">Contact</p>
          <ul className="mt-5 space-y-3 text-[14px] text-ivory/70">
            <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-marigold" /> heerabohara80@gmail.com</li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-marigold" /> Dhangadhi-1, Kailali</li>
            <li className="flex gap-2.5"><Pin className="mt-0.5 h-4 w-4 shrink-0 text-marigold" /> Sukedhara-4, Kathmandu</li>
          </ul>
          <div className="mt-6 rounded-xl border border-marigold/25 bg-ivory/5 p-4">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-marigold"><Qr className="h-4 w-4" /> Payments accepted</p>
            <div className="mt-2.5 flex gap-2">
              {[["eSewa", "#3d7d3c"], ["Khalti", "#5c2d91"], ["Fonepay", "#2e3192"]].map(([n, c]) => (
                <span key={n} className="flex items-center gap-1.5 rounded-full bg-ivory/10 px-3 py-1.5 text-[11px] font-bold text-ivory/85">
                  <span className="h-2 w-2 rounded-full" style={{ background: c }} /> {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-[12px] text-ivory/40 md:px-8">
          <p>© 2026 Junetara Glam · Prepared with BPI Strategic Consulting · President: Heera Bohara Bhandari</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Sparkle className="h-3.5 w-3.5 text-marigold" /> in Dhangadhi & Kathmandu · Master Plan v1.0 · Confidential
          </p>
        </div>
      </div>
    </footer>
  );
}

function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[100] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="toast-in flex items-center gap-2.5 rounded-full bg-pine/95 px-5 py-3 text-[13px] font-semibold text-ivory shadow-[0_18px_40px_-12px_rgba(14,43,38,0.6)]"
        >
          <Flower className="h-4 w-4 shrink-0 text-marigold" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ---------- brand splash on load ---------- */
function Splash() {
  const [gone, setGone] = useState(false);
  const [removed, setRemoved] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRemoved(true);
      return;
    }
    const t1 = setTimeout(() => setGone(true), 900);
    const t2 = setTimeout(() => setRemoved(true), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  if (removed) return null;
  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[120] grid place-items-center bg-pine transition-opacity duration-500 ${gone ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div className="text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-marigold text-pine shadow-[0_0_70px_rgba(255,184,0,0.45)]" style={{ animation: gone ? "none" : "stampIn 0.7s var(--ease) both" }}>
          <Flower className="h-10 w-10" />
        </span>
        <p className="mt-5 font-display text-3xl font-semibold italic tracking-tight text-ivory">Junetara Glam</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.4em] text-marigold">नेपालको ग्ल्याम इकोसिस्टम</p>
      </div>
    </div>
  );
}

/* ---------- reading progress bar ---------- */
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[75] h-[3px] bg-transparent">
      <div className="h-full bg-gradient-to-r from-crimson via-coral to-marigold" style={{ width: `${p}%` }} />
    </div>
  );
}

/* ---------- back to top ---------- */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-pine text-marigold shadow-[0_16px_36px_-10px_rgba(26,59,139,0.6)] transition-all duration-300 hover:bg-crimson hover:text-ivory ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <Flower className="h-5 w-5" />
    </button>
  );
}

function Shell() {
  const { view, go, festival } = useApp();

  if (view === "deck") {
    return (
      <div className="grain min-h-screen bg-pine font-body">
        <Deck />
      </div>
    );
  }

  return (
    <div className="grain min-h-screen bg-ivory font-body text-ink">
      <Splash />
      <ScrollProgress />
      <BackToTop />
      <LiveTicker />
      {/* permanent deck entry — vertical edge tab */}
      <button
        onClick={() => go("deck")}
        className="deck-edge group fixed right-0 top-1/2 z-40 -translate-y-1/2 rounded-l-full bg-pine py-5 pl-2.5 pr-3 text-marigold shadow-[0_18px_40px_-12px_rgba(26,59,139,0.6)] transition-all hover:bg-crimson hover:pr-4 hover:text-ivory"
        style={{ writingMode: "vertical-rl" }}
        aria-label="Open the investor deck"
      >
        <span className="flex items-center gap-2.5 text-[10.5px] font-bold uppercase tracking-[0.3em]">
          <span className="blink h-1.5 w-1.5 rounded-full bg-marigold group-hover:bg-ivory" />
          The Deck ✳
        </span>
      </button>
      <Nav />
      {festival && (
        <div className="fade-in">
          <FestivalStrip />
          <Garland />
        </div>
      )}
      <main key={view} className="view-enter">
        {view === "home" && <Home />}
        {view === "map" && <LiveMap />}
        {view === "training" && <Training />}
        {view === "services" && <Services />}
        {view === "market" && <Market />}
        {view === "careers" && <Careers />}
        {view === "collaborate" && <Collaborate />}
        {view === "partner" && <Partner />}
        {view === "legal" && <Legal />}
        {view === "nepal" && <NepalHub />}
        {view === "space" && <Dashboard />}
      </main>
      <Footer />
      <CartDrawer />
      <Toasts />
      <Autopilot />
      <Tour />
    </div>
  );
}

/* Visible error boundary — a crash shows a diagnostic card instead of a blank page */
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Junetara Glam render error:", error, info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center bg-ivory p-6 font-body text-ink">
          <div className="max-w-lg rounded-xl border-2 border-crimson/40 bg-white p-8 shadow-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-crimson">Rendering issue detected</p>
            <h1 className="mt-3 font-display text-3xl italic text-pine">Something slipped in the atelier.</h1>
            <p className="mt-3 text-sm text-ink/65">
              The page hit a runtime error. Try a hard refresh (Ctrl/Cmd + Shift + R) to load the latest build.
            </p>
            <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-pine p-4 text-[12px] leading-relaxed text-marigold">
              {String(this.state.error?.message ?? this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-pine px-6 py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-forest"
            >
              Reload the platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Shell />
      </AppProvider>
    </ErrorBoundary>
  );
}
