import { useEffect, useState, type FormEvent } from "react";
import { useApp } from "../context";
import { CITIES, npr } from "../data";
import { LEGAL_DOCS, docToText, executedCopy, downloadText, type LegalDoc } from "../legal";
import { Kicker, Masked, Reveal } from "./ui";
import { ArrowRight, Check, Download, FileText, Pen, Seal, ShieldCheck, X } from "./Icons";

/* ---------- document reader overlay ---------- */
function Reader({ doc, onClose }: { doc: LegalDoc; onClose: () => void }) {
  const { agreements } = useApp();
  const mine = agreements.find((a) => a.docId === doc.id) ?? null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label={doc.title}>
      <button className="absolute inset-0 bg-pine/80 backdrop-blur-sm" onClick={onClose} aria-label="Close document" />
      <div className="modal-in absolute inset-x-0 bottom-0 top-10 mx-auto flex max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-ivory shadow-2xl sm:inset-y-10 sm:rounded-2xl">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-ink/10 bg-pine px-7 py-5 text-ivory">
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[0.2em] text-marigold">{doc.code} · {doc.version} · {doc.updated}</p>
            <h2 className="mt-1 font-display text-2xl italic md:text-3xl">{doc.title}</h2>
            <p className="text-[12px] text-ivory/55">{doc.nep} · Applies to {doc.audience}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadText(doc.file, mine ? executedCopy(doc, mine) : docToText(doc))}
              className="flex items-center gap-2 rounded-full border border-ivory/25 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-ivory/80 transition hover:border-marigold hover:text-marigold"
            >
              <Download className="h-4 w-4" /> .txt
            </button>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-crimson text-ivory transition hover:bg-marigold hover:text-pine" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-6 md:px-10">
          <p className="border-l-2 border-marigold pl-4 font-display text-[17px] italic leading-relaxed text-ink">{doc.intro}</p>
          <div className="mt-7 space-y-6">
            {doc.sections.map((s) => (
              <section key={s.h}>
                <h3 className="font-display text-lg font-semibold text-pine">{s.h}</h3>
                <p className="mt-1.5 max-w-2xl text-[14.5px] leading-relaxed text-ink/70">{s.b}</p>
              </section>
            ))}
          </div>

          {mine && (
            <div className="relative mt-10 overflow-hidden rounded-xl border-2 border-forest/40 bg-forest/5 p-6">
              <span className="stamp-in pointer-events-none absolute right-4 top-3 rounded border-[3px] border-crimson/70 px-3 py-1 font-display text-lg font-bold uppercase tracking-[0.2em] text-crimson/80">
                Executed
              </span>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-forest">
                <Seal className="h-4 w-4" /> Digitally executed
              </p>
              <p className="mt-2 font-mono text-[14px] font-bold text-pine">{mine.ref}</p>
              <p className="mt-1 text-[13px] text-ink/65">
                Signed by <strong>{mine.party}</strong> · {mine.org || "individual"} · {mine.city} · {mine.signedAt}
              </p>
              <button
                onClick={() => downloadText(mine.ref + "-executed.txt", executedCopy(doc, mine))}
                className="mt-4 flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-sun transition hover:bg-pine"
              >
                <Download className="h-4 w-4" /> Download executed copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- sign flow ---------- */
function SignFlow({ doc, onClose }: { doc: LegalDoc; onClose: () => void }) {
  const { signAgreement } = useApp();
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [agree, setAgree] = useState(false);
  const [ref, setRef] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3 || !agree) return;
    const r = signAgreement(doc, name.trim(), org.trim(), city);
    setRef(r);
  };

  return (
    <div className="fixed inset-0 z-[86] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <button className="absolute inset-0 bg-pine/80 backdrop-blur-sm" onClick={onClose} aria-label="Close signing" />
      <div className="modal-in relative w-full max-w-lg overflow-hidden rounded-t-2xl bg-ivory shadow-2xl sm:rounded-2xl">
        {ref ? (
          <div className="fade-in relative p-8 text-center">
            <span className="stamp-in pointer-events-none absolute right-6 top-6 rounded border-[3px] border-crimson/70 px-3 py-1 font-display text-lg font-bold uppercase tracking-[0.2em] text-crimson/80">
              Executed
            </span>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest text-sun"><Check className="h-7 w-7" /></span>
            <h3 className="mt-5 font-display text-3xl italic text-pine">Agreement executed ✳</h3>
            <p className="mt-2 font-mono text-lg font-bold tracking-wider text-crimson">{ref}</p>
            <p className="mx-auto mt-3 max-w-sm text-[13.5px] text-ink/60">
              Recorded in the Legal Centre and My Space. The executed copy is ready to download —
              a filed copy should also be stored in your Drive records folder.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  const mine = { ref, party: name.trim(), org: org.trim(), city, signedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) };
                  downloadText(`${ref}-executed.txt`, executedCopy(doc, mine));
                }}
                className="flex items-center gap-2 rounded-full bg-pine px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-marigold transition hover:bg-crimson hover:text-ivory"
              >
                <Download className="h-4 w-4" /> Executed copy
              </button>
              <button onClick={onClose} className="rounded-full border border-ink/20 px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-ink/60 transition hover:border-crimson hover:text-crimson">
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="p-8">
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-crimson">
              <Pen className="h-4 w-4" /> Digital execution
            </p>
            <h3 className="mt-2 font-display text-2xl italic text-pine">{doc.title}</h3>
            <p className="mt-1 text-[13px] text-ink/55">{doc.code} · {doc.version} — signing as a provider/partner on Junetara Glam</p>
            <div className="mt-5 space-y-3.5">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full legal name *"
                className="w-full rounded-lg border border-ink/15 bg-white/70 px-4 py-3 text-[14px] outline-none transition focus:border-marigold"
              />
              <input
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder="Business / salon / academy name"
                className="w-full rounded-lg border border-ink/15 bg-white/70 px-4 py-3 text-[14px] outline-none transition focus:border-marigold"
              />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-ink/15 bg-white/70 px-4 py-3 text-[14px] outline-none transition focus:border-marigold"
              >
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-ink/15 bg-sand/60 p-4">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 accent-crimson" />
                <span className="text-[13px] leading-relaxed text-ink/70">
                  I have read the full text of <strong>{doc.code}</strong> and accept it as a record admissible under the
                  Electronic Transactions Act 2063 (2008).
                </span>
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 rounded-full border border-ink/20 px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ink/60 transition hover:border-crimson hover:text-crimson">
                Cancel
              </button>
              <button
                type="submit"
                disabled={name.trim().length < 3 || !agree}
                className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-crimson px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.12em] text-ivory transition enabled:hover:bg-pine disabled:opacity-40"
              >
                <Pen className="h-4 w-4 transition-transform group-hover:-rotate-12" /> Sign & execute
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------- Legal Centre view ---------- */
export default function Legal() {
  const { agreements, toast } = useApp();
  const [reading, setReading] = useState<LegalDoc | null>(null);
  const [signing, setSigning] = useState<LegalDoc | null>(null);

  const executedCount = agreements.length;

  return (
    <div>
      {/* registry header */}
      <section className="relative overflow-hidden bg-pine pb-16 pt-16 text-ivory">
        <p aria-hidden className="pointer-events-none absolute -right-4 -top-16 select-none font-display text-[190px] font-bold leading-none text-ivory/[0.045]">कानुनी</p>
        <div aria-hidden className="pointer-events-none absolute -left-24 top-8 h-80 w-80 rounded-full bg-crimson/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <Reveal><Kicker tone="light">कानुनी केन्द्र · Legal Centre</Kicker></Reveal>
          <Masked
            as="h1"
            className="mt-5 font-display text-6xl font-semibold leading-[1.0] md:text-7xl"
            lines={[<>The paper trail,</>, <><em className="italic text-marigold">done properly</em>.</>]}
          />
          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-ivory/70">
              Every agreement and policy that governs the ecosystem — readable in-app, downloadable as hosted files at
              <code className="mx-1.5 rounded bg-ivory/10 px-2 py-0.5 font-mono text-[14px] text-marigold">junetaraglam.com/legal/…</code>
              after deploy, and e-signable with a platform reference number.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {[
                { v: `${LEGAL_DOCS.length}`, l: "governing documents" },
                { v: "3", l: "e-signable agreements" },
                { v: `${executedCount}`, l: "executed by you" },
                { v: "NEPCA", l: "arbitration seat · Kathmandu" },
              ].map((s) => (
                <div key={s.l} className="border-l-2 border-marigold/70 pl-3">
                  <p className="font-display text-3xl font-semibold leading-none text-marigold">{s.v}</p>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ivory/55">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* document registry */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Reveal><Kicker>Document registry</Kicker></Reveal>
            <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>Filed & <em className="italic text-crimson">current</em>.</>]} />
          </div>
          <Reveal delay={150}>
            <p className="flex items-center gap-2 text-[12.5px] text-ink/55 lg:text-right">
              <ShieldCheck className="h-4 w-4 text-forest" /> Review cycle: quarterly · next review Jul 2026
            </p>
          </Reveal>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white/60">
          {LEGAL_DOCS.map((d, i) => {
            const mine = agreements.find((a) => a.docId === d.id) ?? null;
            return (
              <Reveal key={d.id} delay={i * 70}>
                <div
                  className={`group grid gap-4 p-6 transition-colors duration-300 hover:bg-sand/70 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-7 md:p-7 ${i > 0 ? "border-t border-ink/10" : ""}`}
                >
                  <span className="grid h-14 w-14 place-items-center rounded-lg bg-pine text-marigold transition-transform duration-500 group-hover:-rotate-6">
                    <FileText className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-ink/5 px-2 py-0.5 font-mono text-[11px] font-bold tracking-widest text-forest">{d.code}</span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${d.kind === "Agreement" ? "bg-crimson/10 text-crimson" : "bg-forest/10 text-forest"}`}>{d.kind}</span>
                      {mine && (
                        <span className="flex items-center gap-1 rounded bg-marigold/25 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                          <Seal className="h-3 w-3" /> Executed · {mine.ref}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-display text-2xl text-pine transition-colors group-hover:text-crimson">{d.title}</h3>
                    <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-ink/60">{d.summary}</p>
                    <p className="mt-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-ink/40">
                      {d.audience} · {d.version} · updated {d.updated}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button onClick={() => setReading(d)} className="flex items-center gap-2 rounded-full border border-pine px-4.5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-pine transition hover:bg-pine hover:text-marigold">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={`/legal/${d.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-ink/60 transition hover:border-forest hover:text-forest"
                      title="Hosted copy (available after deploy) — falls back to download"
                      onClick={(e) => {
                        if (window.location.protocol === "file:") {
                          e.preventDefault();
                          downloadText(d.file, docToText(d));
                          toast(`${d.code} downloaded`);
                        }
                      }}
                    >
                      <Download className="h-3.5 w-3.5" /> .txt
                    </a>
                    {d.signable && !mine && (
                      <button onClick={() => setSigning(d)} className="flex items-center gap-2 rounded-full bg-crimson px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-ivory transition hover:bg-pine">
                        <Pen className="h-3.5 w-3.5" /> Sign
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* how documents are stored — the Drive story */}
      <section className="border-y border-ink/10 bg-sand/60">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal><Kicker>Where the paper lives</Kicker></Reveal>
              <Masked className="mt-3 font-display text-4xl font-semibold text-pine md:text-5xl" lines={[<>Hosted, filed,</>, <><em className="italic text-crimson">verifiable</em>.</>]} />
              <Reveal delay={200}>
                <p className="mt-4 max-w-md text-ink/65">
                  Reference copies are bundled with the app and served from <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-[12.5px] text-forest">/legal/</code> on your domain.
                  Executed copies download to your device and are logged in My Space with their reference numbers.
                </p>
              </Reveal>
              <Reveal delay={280}>
                <div className="mt-6 space-y-3">
                  {[
                    ["Now", "Hosted /legal files + in-app e-sign + executed .txt downloads"],
                    ["Phase 2", "Google Apps Script webhook auto-files every execution to a Drive folder + Sheets log"],
                    ["Phase 3", "eSign Nepal / DocuSign binding signatures + S3 vault with signed URLs"],
                  ].map(([p, d]) => (
                    <div key={p} className="flex items-start gap-4 rounded-xl border border-ink/10 bg-ivory p-4">
                      <span className="shrink-0 rounded-full bg-pine px-3 py-1 text-[10.5px] font-bold uppercase tracking-wider text-marigold">{p}</span>
                      <p className="text-[13px] leading-relaxed text-ink/65">{d}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={150}>
                <div className="overflow-hidden rounded-2xl border border-ink/10 bg-ivory">
                  <p className="border-b border-ink/10 bg-pine px-6 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-marigold">
                    Executions on record · this device
                  </p>
                  {agreements.length === 0 ? (
                    <div className="p-10 text-center">
                      <Pen className="mx-auto h-9 w-9 text-marigold" />
                      <p className="mt-3 font-display text-xl italic text-pine">Nothing executed yet.</p>
                      <p className="mx-auto mt-1 max-w-sm text-[13px] text-ink/55">Sign a provider, center or vendor agreement above — it will be recorded here with a reference number.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-ink/8">
                      {agreements.map((a) => {
                        const doc = LEGAL_DOCS.find((d) => d.id === a.docId);
                        return (
                          <div key={a.id} className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-sand/50">
                            <Seal className="h-6 w-6 shrink-0 text-forest" />
                            <div className="min-w-0 flex-1">
                              <p className="font-mono text-[13.5px] font-bold tracking-wider text-crimson">{a.ref}</p>
                              <p className="truncate text-[13px] text-ink/65">{a.docTitle} — {a.party}{a.org ? ` · ${a.org}` : ""} · {a.city}</p>
                            </div>
                            <span className="text-[12px] font-semibold text-ink/45">{a.signedAt}</span>
                            {doc && (
                              <button
                                onClick={() => downloadText(`${a.ref}-executed.txt`, executedCopy(doc, a))}
                                className="flex items-center gap-1.5 rounded-full border border-forest/40 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-forest transition hover:bg-forest hover:text-sun"
                              >
                                <Download className="h-3 w-3" /> Copy
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <p className="border-t border-dashed border-ink/15 px-6 py-3.5 text-[11.5px] text-ink/45">
                    Commission references inside agreements: salon 10–15% · home 12% · events 15% · enrollment 8–12% · products 5–10% — e.g. a {npr(25000)} bridal package settles {npr(21250)} to the artist at 15%.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {reading && <Reader doc={reading} onClose={() => setReading(null)} />}
      {signing && <SignFlow doc={signing} onClose={() => setSigning(null)} />}
    </div>
  );
}
