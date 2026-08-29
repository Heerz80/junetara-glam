import { useMemo, useState, type FormEvent } from "react";
import { useApp } from "../context";
import { LEDGER_ENTITIES, LEDGER_CATS, npr } from "../data";
import { Reveal } from "./ui";
import { Check, Download, Plus, Sync, TableIcon, Trash, X } from "./Icons";

const APPS_SCRIPT_SNIPPET = `function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName("Junetara Books") || ss.insertSheet("Junetara Books");
  if (sh.getLastRow() === 0) sh.appendRow(["Entity","Date","Type","Category","Description","Amount NPR"]);
  body.rows.forEach(r => sh.appendRow(r));
  return ContentService.createTextOutput(JSON.stringify({ ok: true }));
}`;

function loadGscript(): string {
  try {
    return localStorage.getItem("jg-gscript") ?? "";
  } catch {
    return "";
  }
}

export default function Ledger() {
  const { ledger, addLedgerEntry, deleteLedgerEntry, toast } = useApp();
  const [entity, setEntity] = useState(LEDGER_ENTITIES[0]);
  const [showForm, setShowForm] = useState(false);
  const [fType, setFType] = useState<"income" | "expense">("income");
  const [fCat, setFCat] = useState(LEDGER_CATS.income[0]);
  const [fNote, setFNote] = useState("");
  const [fAmount, setFAmount] = useState("");
  const [fDate, setFDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [gscript, setGscript] = useState(loadGscript);
  const [showSetup, setShowSetup] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const rows = useMemo(() => ledger.filter((r) => r.entity === entity), [ledger, entity]);
  const income = rows.filter((r) => r.type === "income").reduce((s, r) => s + r.amount, 0);
  const expense = rows.filter((r) => r.type === "expense").reduce((s, r) => s + r.amount, 0);
  const net = income - expense;
  const margin = income > 0 ? Math.round((net / income) * 100) : 0;

  /* monthly buckets for the mini chart */
  const months = useMemo(() => {
    const map = new Map<string, { inc: number; exp: number }>();
    rows.forEach((r) => {
      const m = r.date.slice(0, 7);
      const b = map.get(m) ?? { inc: 0, exp: 0 };
      if (r.type === "income") b.inc += r.amount;
      else b.exp += r.amount;
      map.set(m, b);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0])).slice(-4);
  }, [rows]);
  const maxMonth = Math.max(1, ...months.map(([, b]) => Math.max(b.inc, b.exp)));

  const exportCSV = () => {
    const head = "Entity,Date,Type,Category,Description,Amount NPR";
    const body = rows
      .map((r) => [r.entity, r.date, r.type, r.category, `"${r.note.replace(/"/g, '""')}"`, r.amount].join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + head + "\n" + body + "\n"], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = `junetara-books-${entity.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
    document.body.appendChild(el);
    el.click();
    el.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast("Excel/CSV downloaded — opens directly in Excel or Google Sheets (File → Import)");
  };

  const copyTSV = () => {
    const head = ["Entity", "Date", "Type", "Category", "Description", "Amount NPR"].join("\t");
    const body = rows.map((r) => [r.entity, r.date, r.type, r.category, r.note, r.amount].join("\t")).join("\n");
    navigator.clipboard?.writeText(head + "\n" + body).then(
      () => toast("Copied — paste into cell A1 of a Google Sheet"),
      () => toast("Clipboard blocked — use the CSV download instead")
    );
  };

  const syncSheets = async () => {
    if (!gscript.startsWith("https://script.google.com")) {
      toast("Paste your Google Apps Script web-app URL first (setup below)");
      setShowSetup(true);
      return;
    }
    try {
      localStorage.setItem("jg-gscript", gscript);
    } catch { /* sandboxed */ }
    setSyncing(true);
    try {
      await fetch(gscript, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ entity, rows: rows.map((r) => [r.entity, r.date, r.type, r.category, r.note, r.amount]) }),
      });
      toast(`Synced ${rows.length} rows → Google Sheet “Junetara Books” ✓`);
    } catch {
      toast("Sync failed — check the web-app URL and deployment access");
    } finally {
      setSyncing(false);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const amt = Number(fAmount);
    if (!amt || amt <= 0 || !fNote.trim()) {
      toast("Add a description and a valid amount");
      return;
    }
    addLedgerEntry({ entity, date: fDate, type: fType, category: fCat, note: fNote.trim(), amount: Math.round(amt) });
    setFNote("");
    setFAmount("");
    setShowForm(false);
  };

  const stats = [
    { l: "Income", v: income, cls: "text-forest" },
    { l: "Expense", v: expense, cls: "text-crimson" },
    { l: "Net", v: net, cls: net >= 0 ? "text-forest" : "text-crimson" },
    { l: "Margin", v: null, extra: `${margin}%`, cls: "text-marigold" },
  ];

  return (
    <Reveal>
      <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white/70">
        {/* head */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 bg-pine px-6 py-5 text-ivory">
          <div>
            <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.22em] text-marigold">
              <TableIcon className="h-4 w-4" /> Business management · Books
            </p>
            <h3 className="mt-1 font-display text-2xl italic">Junetara ledger</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportCSV} className="flex items-center gap-1.5 rounded-full border border-ivory/25 px-4 py-2 text-[10.5px] font-bold uppercase tracking-wider text-ivory/85 transition hover:border-marigold hover:text-marigold">
              <Download className="h-3.5 w-3.5" /> Excel (CSV)
            </button>
            <button onClick={copyTSV} className="flex items-center gap-1.5 rounded-full border border-ivory/25 px-4 py-2 text-[10.5px] font-bold uppercase tracking-wider text-ivory/85 transition hover:border-marigold hover:text-marigold">
              <Check className="h-3.5 w-3.5" /> Copy → Sheets
            </button>
            <button onClick={syncSheets} disabled={syncing} className="flex items-center gap-1.5 rounded-full bg-marigold px-4 py-2 text-[10.5px] font-bold uppercase tracking-wider text-pine transition hover:bg-sun disabled:opacity-50">
              <Sync className={`h-3.5 w-3.5 ${syncing ? "spin-slow" : ""}`} /> {syncing ? "Syncing…" : "Sync → Sheets"}
            </button>
          </div>
        </div>

        {/* entity tabs + stats */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-ink/10 bg-sand/50 px-6 py-3.5">
          {LEDGER_ENTITIES.map((e) => (
            <button
              key={e}
              onClick={() => setEntity(e)}
              className={`rounded-full px-4 py-2 text-[11.5px] font-bold uppercase tracking-wider transition-all ${entity === e ? "bg-pine text-marigold shadow-sm" : "bg-white/60 text-ink/55 hover:bg-white hover:text-pine"}`}
            >
              {e}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-px border-b border-ink/10 bg-ink/10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-ivory px-6 py-4">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink/45">{s.l}</p>
              <p className={`mt-1 font-display text-2xl ${s.cls}`}>{s.extra ?? npr(s.v!)}</p>
            </div>
          ))}
        </div>

        {/* month bars + add form */}
        <div className="grid gap-6 border-b border-dashed border-ink/15 p-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">Monthly · income vs expense</p>
            <div className="mt-4 flex h-32 items-end gap-6">
              {months.length === 0 && <p className="text-[13px] text-ink/45">No entries yet for this entity.</p>}
              {months.map(([m, b]) => (
                <div key={m} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-24 w-full items-end justify-center gap-1.5">
                    <div className="bar-grow w-1/2 max-w-8 rounded-t bg-forest" style={{ height: `${(b.inc / maxMonth) * 100}%` }} title={`Income ${npr(b.inc)}`} />
                    <div className="bar-grow w-1/2 max-w-8 rounded-t bg-crimson/80" style={{ height: `${(b.exp / maxMonth) * 100}%`, animationDelay: "120ms" }} title={`Expense ${npr(b.exp)}`} />
                  </div>
                  <span className="font-mono text-[10.5px] font-bold tracking-wider text-ink/45">{m}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 flex gap-4 text-[11px] font-bold uppercase tracking-wider text-ink/45">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-forest" /> Income</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-crimson/80" /> Expense</span>
            </p>
          </div>

          <div className="lg:col-span-5">
            {!showForm ? (
              <button onClick={() => setShowForm(true)} className="group flex h-full min-h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/20 transition hover:border-forest hover:bg-forest/5">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-forest text-sun transition-transform group-hover:scale-110"><Plus className="h-5 w-5" /></span>
                <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-ink/55 group-hover:text-forest">Record an entry</span>
              </button>
            ) : (
              <form onSubmit={submit} className="fade-in rounded-xl border border-ink/15 bg-ivory p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">New entry · {entity}</p>
                  <button type="button" onClick={() => setShowForm(false)} className="text-ink/40 transition hover:text-crimson" aria-label="Close form"><X className="h-4 w-4" /></button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2.5">
                  <select value={fType} onChange={(e) => { const t = e.target.value as "income" | "expense"; setFType(t); setFCat(LEDGER_CATS[t][0]); }} className="rounded-lg border border-ink/15 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-marigold">
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <select value={fCat} onChange={(e) => setFCat(e.target.value)} className="rounded-lg border border-ink/15 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-marigold">
                    {LEDGER_CATS[fType].map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} className="rounded-lg border border-ink/15 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-marigold" />
                  <input type="number" min="1" value={fAmount} onChange={(e) => setFAmount(e.target.value)} placeholder="Amount (NPR)" className="rounded-lg border border-ink/15 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-marigold" />
                </div>
                <input value={fNote} onChange={(e) => setFNote(e.target.value)} placeholder="Description — e.g. Dashain bridal packages ×12" className="mt-2.5 w-full rounded-lg border border-ink/15 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-marigold" />
                <button type="submit" className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-pine py-3 text-[11.5px] font-bold uppercase tracking-[0.14em] text-marigold transition hover:bg-crimson hover:text-ivory">
                  <Plus className="h-4 w-4" /> Record
                </button>
              </form>
            )}
          </div>
        </div>

        {/* entries table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-[13.5px]">
            <thead className="bg-sand/70 text-ink/55">
              <tr>
                <th className="px-6 py-3 text-[10.5px] font-bold uppercase tracking-[0.16em]">Date</th>
                <th className="px-3 py-3 text-[10.5px] font-bold uppercase tracking-[0.16em]">Category</th>
                <th className="px-3 py-3 text-[10.5px] font-bold uppercase tracking-[0.16em]">Description</th>
                <th className="px-3 py-3 text-right text-[10.5px] font-bold uppercase tracking-[0.16em]">Amount</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-ink/45">No entries for this entity — record the first one above.</td></tr>
              )}
              {rows.map((r, i) => (
                <tr key={r.id} className={`border-t border-ink/8 transition-colors hover:bg-sand/50 ${i % 2 ? "bg-white/40" : ""}`}>
                  <td className="px-6 py-3 font-mono text-[12.5px] text-ink/55">{r.date}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${r.type === "income" ? "bg-forest/12 text-forest" : "bg-crimson/12 text-crimson"}`}>{r.category}</span>
                  </td>
                  <td className="max-w-[280px] truncate px-3 py-3 text-ink/75" title={r.note}>{r.note}</td>
                  <td className={`px-3 py-3 text-right font-display text-[15.5px] ${r.type === "income" ? "text-forest" : "text-crimson"}`}>
                    {r.type === "income" ? "+" : "−"} {npr(r.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteLedgerEntry(r.id)} className="text-ink/30 transition hover:text-crimson" aria-label="Delete entry"><Trash className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Google Sheets setup */}
        <div className="border-t border-ink/10 bg-sand/40 px-6 py-5">
          <button onClick={() => setShowSetup((s) => !s)} className="flex items-center justify-between gap-3 text-left">
            <span>
              <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-forest">
                <Sync className="h-4 w-4" /> Google Sheets auto-sync · one-time setup
              </span>
              <span className="mt-1 block text-[12.5px] text-ink/55">
                {gscript ? "Web-app URL saved on this device — Sync pushes every entry to your Sheet." : "Connect a Google Sheet in ~2 minutes (free, no server)."}
              </span>
            </span>
            <span className={`shrink-0 rounded-full border border-ink/15 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider text-ink/55 transition ${showSetup ? "bg-pine text-marigold" : ""}`}>
              {showSetup ? "Hide" : "Setup"}
            </span>
          </button>
          {showSetup && (
            <div className="fade-in mt-4 grid gap-5 lg:grid-cols-2">
              <ol className="space-y-2 text-[13px] text-ink/70">
                {[
                  ["1", "Create a Google Sheet → Extensions → Apps Script."],
                  ["2", "Paste the script on the right → Deploy → New deployment → Web app."],
                  ["3", "“Execute as”: Me · “Who has access”: Anyone → Deploy."],
                  ["4", "Copy the /exec URL, paste it here and save."],
                ].map(([n, t]) => (
                  <li key={n} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest font-display text-[13px] italic text-sun">{n}</span>
                    <span className="pt-0.5">{t}</span>
                  </li>
                ))}
                <li className="pt-1">
                  <input
                    value={gscript}
                    onChange={(e) => setGscript(e.target.value)}
                    placeholder="https://script.google.com/macros/s/…/exec"
                    className="w-full rounded-lg border border-ink/15 bg-white/80 px-3.5 py-2.5 font-mono text-[12px] outline-none focus:border-marigold"
                  />
                </li>
                <li>
                  <button
                    onClick={() => { try { localStorage.setItem("jg-gscript", gscript); } catch { /* sandboxed */ } toast("Web-app URL saved on this device"); }}
                    className="rounded-full bg-forest px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-sun transition hover:bg-pine"
                  >
                    Save URL
                  </button>
                </li>
              </ol>
              <pre className="overflow-x-auto rounded-xl bg-pine p-5 font-mono text-[11.5px] leading-relaxed text-sun">{APPS_SCRIPT_SNIPPET}</pre>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
