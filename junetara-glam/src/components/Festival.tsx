import { useEffect, useMemo, useState } from "react";
import { useApp } from "../context";
import { DASHAIN_TARGET } from "../data";
import { Flower } from "./Icons";

/* ---------- marigold toran garland (draped under nav when festival mode is on) ---------- */
export function Garland() {
  const flowers = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        x: 20 + i * 46,
        y: 22 + Math.sin(i * 0.85) * 9,
        r: 9 + (i % 3) * 2,
        tone: i % 3 === 0 ? "#ea5240" : i % 3 === 1 ? "#ffb800" : "#ff7a68",
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none relative h-12 overflow-hidden">
      <svg viewBox="0 0 1200 52" preserveAspectRatio="none" className="h-full w-full">
        <path
          d="M0,14 C200,44 400,2 600,26 C800,50 1000,8 1200,20"
          fill="none"
          stroke="#1a3b8b"
          strokeOpacity="0.35"
          strokeWidth="1.6"
          strokeDasharray="1 5"
          strokeLinecap="round"
        />
        {flowers.map((f, i) => (
          <g key={i} transform={`translate(${f.x} ${f.y})`} opacity="0.95">
            <circle r={f.r} fill={f.tone} />
            <circle r={f.r * 0.55} fill="#ffd36b" />
            <circle r={f.r * 0.22} fill="#1a3b8b" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <circle key={a} cx={Math.cos((a * Math.PI) / 180) * f.r * 0.82} cy={Math.sin((a * Math.PI) / 180) * f.r * 0.82} r={f.r * 0.2} fill="#ffb800" opacity="0.8" />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ---------- live countdown to Vijaya Dashami ---------- */
export function DashainCountdown({ light = false }: { light?: boolean }) {
  const target = useMemo(() => new Date(DASHAIN_TARGET).getTime(), []);
  const [left, setLeft] = useState(() => Math.max(0, target - Date.now()));

  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, target - Date.now())), 1000);
    return () => clearInterval(t);
  }, [target]);

  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  const cells: [string, string, string][] = [
    [String(d).padStart(2, "0"), "days", "दिन"],
    [String(h).padStart(2, "0"), "hrs", "घण्टा"],
    [String(m).padStart(2, "0"), "min", "मिनेट"],
    [String(s).padStart(2, "0"), "sec", "सेकेन्ड"],
  ];
  const label = light ? "text-marigold" : "text-crimson";
  const box = light ? "border-marigold/40 bg-pine/60" : "border-crimson/25 bg-white/70";
  const num = light ? "text-ivory" : "text-pine";
  const sub = light ? "text-ivory/50" : "text-ink/45";

  return (
    <div className="flex items-center gap-2" role="timer" aria-label="Countdown to Vijaya Dashami 2083">
      {cells.map(([v, en, ne], i) => (
        <span key={en} className="flex items-center gap-2">
          <span className={`rounded-lg border px-2.5 py-1.5 text-center ${box}`}>
            <span className={`block font-display text-xl font-semibold leading-none tabular-nums ${num} md:text-2xl`}>{v}</span>
            <span className={`mt-0.5 block text-[8.5px] font-bold uppercase tracking-[0.14em] ${label}`}>
              {en} <span className={sub}>· {ne}</span>
            </span>
          </span>
          {i < 3 && <span className={`font-display text-lg ${label}`}>:</span>}
        </span>
      ))}
    </div>
  );
}

/* ---------- festival banner strip (full width, shown when festival mode is on) ---------- */
export function FestivalStrip() {
  const { toast, go } = useApp();
  return (
    <section aria-label="Dashain 2083 festival strip" className="relative overflow-hidden border-b border-marigold/40 bg-pine text-ivory">
      <p aria-hidden className="pointer-events-none absolute -right-4 -top-9 select-none font-display text-[120px] font-bold leading-none text-marigold/[0.08]">
        दशैं
      </p>
      <div aria-hidden className="pointer-events-none absolute -left-16 -top-10 h-40 w-40 rounded-full bg-crimson/25 blur-3xl" />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-4 px-5 py-5 md:px-8">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-marigold text-pine shadow-[0_0_34px_rgba(255,184,0,0.4)]">
          <Flower className="diya-flame h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-marigold">
            <span className="diya-flame inline-block h-1.5 w-1.5 rounded-full bg-coral" /> शुभ दशैं २०८३ · Vijaya Dashami
          </p>
          <p className="font-display text-xl italic leading-tight md:text-2xl">
            The valley glows — festive bookings <em className="text-marigold">25% off</em>
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-4">
          <DashainCountdown light />
          <button
            onClick={() => {
              navigator.clipboard?.writeText("DASHAIN25").catch(() => {});
              toast("DASHAIN25 copied — apply it in your bag 🪔");
            }}
            className="group flex items-center gap-2 rounded-full border-2 border-dashed border-marigold/60 bg-marigold/10 px-4 py-2.5 font-mono text-[13px] font-bold tracking-widest text-marigold transition-all hover:bg-marigold hover:text-pine"
          >
            DASHAIN25
          </button>
          <button
            onClick={() => go("services")}
            className="rounded-full bg-crimson px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-coral hover:text-pine"
          >
            Book festive glow
          </button>
        </div>
      </div>
    </section>
  );
}
