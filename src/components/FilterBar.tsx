"use client";

import { useState } from "react";
import { CAFES, type Difficulty } from "@/lib/chess-data";

export function FilterBar({
  q,
  onQ,
  cafeFilter,
  onCafeFilter,
  diff,
  onDiff,
}: {
  q: string;
  onQ: (v: string) => void;
  cafeFilter: string;
  onCafeFilter: (v: string) => void;
  diff: Difficulty | "all";
  onDiff: (v: Difficulty | "all") => void;
}) {
  const [open, setOpen] = useState(false);

  const fields = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 border border-border bg-surface-2 p-3">
      <div className="flex items-center gap-1.5 bg-surface border border-border w-full">
        <span className="font-mono-data pl-2.5 text-sm text-muted">⌕</span>
        <input
          value={q}
          onChange={(e) => onQ(e.target.value)}
          type="text"
          placeholder="Szukaj kawiarni lub dzielnicy…"
          className="w-full bg-transparent outline-none text-sm py-2 pr-2.5 pl-1.5 text-ink"
        />
      </div>
      <select
        value={cafeFilter}
        onChange={(e) => onCafeFilter(e.target.value)}
        className="w-full bg-surface border border-border px-2.5 py-2 text-sm text-ink"
      >
        <option value="all">Wszystkie kawiarnie</option>
        {CAFES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <select
        value={diff}
        onChange={(e) => onDiff(e.target.value as Difficulty | "all")}
        className="w-full bg-surface border border-border px-2.5 py-2 text-sm text-ink"
      >
        <option value="all">Wszystkie poziomy</option>
        <option value="poczatkujacy">Początkujący</option>
        <option value="sredni">Średni</option>
        <option value="zaawansowany">Zaawansowany</option>
      </select>
    </div>
  );

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="sm:hidden w-full flex justify-between items-center bg-surface-2 border border-border px-3.5 py-2.5 text-sm font-semibold text-ink"
      >
        <span>Filtrowanie</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      <div className={open ? "mt-2 block sm:mt-0" : "hidden sm:block"}>{fields}</div>
    </div>
  );
}
