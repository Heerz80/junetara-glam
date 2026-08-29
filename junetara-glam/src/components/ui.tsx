import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Flower } from "./Icons";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- scroll reveal ---------- */
export function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ---------- line-mask headline reveal ---------- */
export function Masked({
  lines,
  className = "",
  as: Tag = "h2",
  startDelay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  startDelay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as never} className={`masked ${inView ? "in" : ""} ${className}`}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <span style={{ transitionDelay: `${startDelay + i * 130}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/* ---------- animated counter ---------- */
export function Counter({ to, suffix = "", prefix = "", decimals = 0, duration = 1400 }: { to: number; suffix?: string; prefix?: string; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(to * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {val.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/* ---------- marquee strip ---------- */
export function Marquee({ items, className = "", dur = 32, reverse = false }: { items: string[]; className?: string; dur?: number; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="font-display text-xl italic tracking-wide md:text-2xl">{it}</span>
          <Flower className="mx-6 h-4 w-4 shrink-0 text-marigold md:mx-8" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`marquee ${reverse ? "marquee-rev" : ""} ${className}`}>
      <div className="marquee-track" style={{ "--mq-dur": `${dur}s` } as CSSProperties}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/* ---------- orbiting circular text badge ---------- */
export function OrbitBadge({ text, className = "" }: { text: string; className?: string }) {
  const id = useId();
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 120 120" className="spin-slow h-full w-full">
        <defs>
          <path id={id} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" fill="none" />
        </defs>
        <text className="fill-current" style={{ fontSize: 10.4, letterSpacing: 2.2, fontFamily: "Mukta, sans-serif", fontWeight: 700 }}>
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <Flower className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-marigold" />
    </div>
  );
}

/* ---------- small caps kicker with Devanagari support ---------- */
export function Kicker({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" | "gold" | "crimson" }) {
  const color = tone === "light" ? "text-sun" : tone === "gold" ? "text-marigold" : tone === "crimson" ? "text-crimson" : "text-forest";
  const rule = tone === "light" ? "bg-marigold/60" : "bg-forest/40";
  return (
    <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] ${color}`}>
      <span className={`h-px w-10 ${rule}`} />
      {children}
      <Flower className="h-3.5 w-3.5 text-marigold" />
    </p>
  );
}

/* ---------- rating stars ---------- */
export function Stars({ rating, className = "h-3.5 w-3.5" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-marigold" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 24 24" className={className} fill={i <= Math.round(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.4">
          <path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 16.9 6.3 20l1.2-6.3L2.8 9.3l6.4-.8L12 2.6z" />
        </svg>
      ))}
    </span>
  );
}

/* ---------- payment gateway chips ---------- */
export function GatewayChips({ value, onChange }: { value: string; onChange: (g: string) => void }) {
  const gws = [
    { id: "eSewa", color: "#3d7d3c", hint: "Wallet" },
    { id: "Khalti", color: "#5c2d91", hint: "Wallet" },
    { id: "Fonepay", color: "#2e3192", hint: "QR / Bank" },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {gws.map((g) => {
        const active = value === g.id;
        return (
          <button
            type="button"
            key={g.id}
            onClick={() => onChange(g.id)}
            className={`flex flex-col items-center gap-1 rounded-lg border-2 px-3 py-3 transition-all ${
              active ? "border-forest bg-forest/5 shadow-sm" : "border-ink/10 bg-white/60 hover:border-forest/40"
            }`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: g.color }} />
            <span className={`text-[13px] font-bold ${active ? "text-forest" : "text-ink/70"}`}>{g.id}</span>
            <span className="text-[10px] uppercase tracking-wider text-ink/40">{g.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
