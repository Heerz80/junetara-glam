import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const Sparkle = (props: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2c.7 4.6 2.7 6.6 7.3 7.3-4.6.7-6.6 2.7-7.3 7.3-.7-4.6-2.7-6.6-7.3-7.3C9.3 8.6 11.3 6.6 12 2z" />
    <path d="M19 14.5c.35 2.3 1.35 3.3 3.65 3.65-2.3.35-3.3 1.35-3.65 3.65-.35-2.3-1.35-3.3-3.65-3.65 2.3-.35 3.3-1.35 3.65-3.65z" opacity=".7" />
  </svg>
);

/* marigold flower — the maison mark */
export const Flower = (props: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2.2c1.1 2.6 1.1 4.3 0 5.6-1.1-1.3-1.1-3 0-5.6z" />
    <path d="M12 21.8c-1.1-2.6-1.1-4.3 0-5.6 1.1 1.3 1.1 3 0 5.6z" />
    <path d="M2.2 12c2.6-1.1 4.3-1.1 5.6 0-1.3 1.1-3 1.1-5.6 0z" />
    <path d="M21.8 12c-2.6 1.1-4.3 1.1-5.6 0 1.3-1.1 3-1.1 5.6 0z" />
    <path d="M5.1 5.1c2.7.6 4.1 1.5 4.7 3.2-1.7-.6-3.2-.9-4.7-3.2z" opacity=".85" />
    <path d="M18.9 18.9c-2.7-.6-4.1-1.5-4.7-3.2 1.7.6 3.2.9 4.7 3.2z" opacity=".85" />
    <path d="M18.9 5.1c-.6 2.7-1.5 4.1-3.2 4.7.6-1.7.9-3.2 3.2-4.7z" opacity=".85" />
    <path d="M5.1 18.9c.6-2.7 1.5-4.1 3.2-4.7-.6 1.7-.9 3.2-3.2 4.7z" opacity=".85" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Star = (props: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 16.9 6.3 20l1.2-6.3L2.8 9.3l6.4-.8L12 2.6z" />
  </svg>
);

export const Heart = ({ filled, ...props }: P & { filled?: boolean }) => (
  <svg {...base(props)} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.3S3.5 15.2 3.5 9.3a4.6 4.6 0 0 1 8.5-2.5A4.6 4.6 0 0 1 20.5 9.3c0 5.9-8.5 11-8.5 11z" />
  </svg>
);

export const Bag = (props: P) => (
  <svg {...base(props)}>
    <path d="M5 8.5h14l-1.1 11a1.8 1.8 0 0 1-1.8 1.6H7.9a1.8 1.8 0 0 1-1.8-1.6L5 8.5z" />
    <path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" />
  </svg>
);

export const ArrowRight = (props: P) => (
  <svg {...base(props)}>
    <path d="M3.5 12h16M14 6.5l5.5 5.5-5.5 5.5" />
  </svg>
);

export const FileText = (props: P) => (
  <svg {...base(props)}>
    <path d="M7 3.5h7L19 8.5v10A1.5 1.5 0 0 1 17.5 20h-10A1.5 1.5 0 0 1 6 18.5v-13A1.5 1.5 0 0 1 7.5 3.5z" />
    <path d="M13.5 3.5V9H19M9.5 12.5h5M9.5 15.5h5" />
  </svg>
);

export const Download = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 4v10.5M7.5 10.5L12 15l4.5-4.5M4.5 19.5h15" />
  </svg>
);

export const Pen = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 20l.9-3.6L16.4 4.9a1.8 1.8 0 0 1 2.6 0l.1.1a1.8 1.8 0 0 1 0 2.6L7.6 19.1 4 20z" />
    <path d="M14.5 6.8l2.7 2.7" />
  </svg>
);

export const TableIcon = (props: P) => (
  <svg {...base(props)}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17M9.5 9.5v10M15.5 9.5v10" />
  </svg>
);

export const Sync = (props: P) => (
  <svg {...base(props)}>
    <path d="M4.5 12a7.5 7.5 0 0 1 13-5.2M19.5 12a7.5 7.5 0 0 1-13 5.2" />
    <path d="M17.5 3.5v3.8h-3.8M6.5 20.5v-3.8h3.8" />
  </svg>
);

export const ArrowLeft = (props: P) => (
  <svg {...base(props)}>
    <path d="M20.5 12h-16M10 6.5L4.5 12l5.5 5.5" />
  </svg>
);

export const ArrowUpRight = (props: P) => (
  <svg {...base(props)}>
    <path d="M6.5 17.5L17.5 6.5M8.5 6.5h9v9" />
  </svg>
);

export const MapIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
);

export const Check = (props: P) => (
  <svg {...base(props)}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);

export const X = (props: P) => (
  <svg {...base(props)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Plus = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Minus = (props: P) => (
  <svg {...base(props)}>
    <path d="M5 12h14" />
  </svg>
);

export const Trash = (props: P) => (
  <svg {...base(props)}>
    <path d="M4.5 6.5h15M9.5 6V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3V6M7 6.5l.8 12.2a1.8 1.8 0 0 0 1.8 1.8h4.8a1.8 1.8 0 0 0 1.8-1.8L17 6.5M10 10.5v6M14 10.5v6" />
  </svg>
);

export const Clock = (props: P) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2.5" />
  </svg>
);

export const Calendar = (props: P) => (
  <svg {...base(props)}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v3.5M16 3v3.5" />
  </svg>
);

export const Pin = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 21s6.5-5.6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21z" />
    <circle cx="12" cy="10.3" r="2.4" />
  </svg>
);

export const Phone = (props: P) => (
  <svg {...base(props)}>
    <path d="M5.5 4h3l1.5 4-2 1.5a12.5 12.5 0 0 0 6.5 6.5L16 14l4 1.5v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.5 6.1 2 2 0 0 1 5.5 4z" />
  </svg>
);

export const Mail = (props: P) => (
  <svg {...base(props)}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
    <path d="M4.5 7.5l7.5 6 7.5-6" />
  </svg>
);

export const Search = (props: P) => (
  <svg {...base(props)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);

export const Wallet = (props: P) => (
  <svg {...base(props)}>
    <rect x="3.5" y="6" width="17" height="13" rx="2.5" />
    <path d="M16 12.5h4.5M3.5 9h13a0 0 0 0 1 0 0" />
    <circle cx="16" cy="12.5" r="0.4" fill="currentColor" />
  </svg>
);

export const Truck = (props: P) => (
  <svg {...base(props)}>
    <path d="M3 6.5h11v9H3zM14 9.5h3.5l3 3v3H14" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);

export const Users = (props: P) => (
  <svg {...base(props)}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 19.5c.6-3.4 2.8-5 5.5-5s4.9 1.6 5.5 5M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.9c1.7.7 2.7 2.2 3 4.6" />
  </svg>
);

export const ShieldCheck = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 3l7 2.5v5.2c0 4.6-3 8-7 9.8-4-1.8-7-5.2-7-9.8V5.5L12 3z" />
    <path d="M9 11.8l2.2 2.2 4-4.5" />
  </svg>
);

export const Leaf = (props: P) => (
  <svg {...base(props)}>
    <path d="M4.5 19.5C4.5 10 10 4.5 19.5 4.5c0 9.5-5.5 15-15 15z" />
    <path d="M4.5 19.5C8 14 12 10.5 16.5 8" />
  </svg>
);

export const Pulse = (props: P) => (
  <svg {...base(props)}>
    <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
  </svg>
);

export const Building = (props: P) => (
  <svg {...base(props)}>
    <rect x="4.5" y="4" width="15" height="16" rx="1.5" />
    <path d="M9 8h2M13 8h2M9 12h2M13 12h2M10 20v-4h4v4" />
  </svg>
);

export const HomeVisit = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 11l8-6.5L20 11M6.5 9.5V19h11V9.5" />
    <path d="M10.5 15.5l1.5 1.5 3-3.5" />
  </svg>
);

export const Qr = (props: P) => (
  <svg {...base(props)}>
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <path d="M14 14h3v3h-3zM20 14v.5M14 20h.5M17 20h3" />
  </svg>
);

/* -------- discipline icons -------- */
export const Brush = (props: P) => (
  <svg {...base(props)}>
    <path d="M19.5 4.5c-3.5 1-7.5 4.5-9.5 7.5l2 2c3-2 6.5-6 7.5-9.5z" />
    <path d="M9.5 12.5c-1.8.3-3 1.6-3.3 3.7-.2 1.4-.7 2.3-2.2 2.8 1.3 1.3 4.3 1.7 6 .4 1.5-1.1 2-2.8 1.5-4.9" />
  </svg>
);

export const Droplet = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 3.5s6 6.6 6 11a6 6 0 1 1-12 0c0-4.4 6-11 6-11z" />
    <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
  </svg>
);

export const Scissors = (props: P) => (
  <svg {...base(props)}>
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="6.5" cy="17.5" r="2.5" />
    <path d="M8.7 7.8L20 16M8.7 16.2L20 8" />
  </svg>
);

export const Nail = (props: P) => (
  <svg {...base(props)}>
    <path d="M9 3.5h6v10a3 3 0 0 1-6 0v-10z" />
    <path d="M9 8h6M12 16.5V21M9.5 21h5" />
  </svg>
);

export const Eye = (props: P) => (
  <svg {...base(props)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2.5v1.5M7 3.5l.7 1.3M17 3.5l-.7 1.3" />
  </svg>
);

export const Coins = (props: P) => (
  <svg {...base(props)}>
    <ellipse cx="12" cy="6" rx="7" ry="3" />
    <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
    <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
  </svg>
);

export const Seal = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 3l2 1.7 2.6-.3 1 2.4 2.4 1-.3 2.6L21.4 12l-1.7 2 .3 2.6-2.4 1-1 2.4-2.6-.3-2 1.7-2-1.7-2.6.3-1-2.4-2.4-1 .3-2.6L2.6 12l1.7-2-.3-2.6 2.4-1 1-2.4 2.6.3L12 3z" />
    <path d="M9 12.2l2.2 2.2L15.5 9.8" />
  </svg>
);

export const Gem = (props: P) => (
  <svg {...base(props)}>
    <path d="M7 4h10l4 5-9 11L3 9l4-5z" />
    <path d="M3 9h18M12 20L8.5 9l2-5M12 20l3.5-11-2-5" />
  </svg>
);

export const GradCap = (props: P) => (
  <svg {...base(props)}>
    <path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5z" />
    <path d="M6.5 11.5v4.5c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4.5M21.5 9.5v5" />
  </svg>
);

export const Store = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 9.5L5.2 4.5h13.6L20 9.5M4 9.5v9.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5M4 9.5h16" />
    <path d="M9.5 20v-6h5v6" />
  </svg>
);

export const Briefcase = (props: P) => (
  <svg {...base(props)}>
    <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
    <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 12.5h17M12 11v3" />
  </svg>
);

export const Copy = (props: P) => (
  <svg {...base(props)}>
    <rect x="8.5" y="8.5" width="12" height="12" rx="2.5" />
    <path d="M15.5 5.5v-.7A1.8 1.8 0 0 0 13.7 3H5.3a1.8 1.8 0 0 0-1.8 1.8v8.4a1.8 1.8 0 0 0 1.8 1.8h.7" />
  </svg>
);

export const Printer = (props: P) => (
  <svg {...base(props)}>
    <path d="M7 8V3.5h10V8" />
    <rect x="3.5" y="8" width="17" height="9" rx="2" />
    <path d="M7 13.5h10V21H7v-7.5z" />
  </svg>
);

export const Megaphone = (props: P) => (
  <svg {...base(props)}>
    <path d="M3.5 10v4a1 1 0 0 0 1 1h2l4 4.5V4.5L6.5 9h-2a1 1 0 0 0-1 1z" />
    <path d="M14 9.5a3.5 3.5 0 0 1 0 5M17 7a7 7 0 0 1 0 10M7.5 15.5l1 4.5" />
  </svg>
);

export const Signal = (props: P) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    <path d="M8.5 15.5a5 5 0 0 1 0-7M15.5 8.5a5 5 0 0 1 0 7" />
    <path d="M6 18a9 9 0 0 1 0-12M18 6a9 9 0 0 1 0 12" />
  </svg>
);

export const Play = (props: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M8 5.5v13l11-6.5-11-6.5z" />
  </svg>
);

export const Bell = (props: P) => (
  <svg {...base(props)}>
    <path d="M6 16v-5.5a6 6 0 1 1 12 0V16l1.5 2.5h-15L6 16z" />
    <path d="M10 21a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const MenuIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
