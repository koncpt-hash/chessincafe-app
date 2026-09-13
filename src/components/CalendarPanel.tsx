"use client";

import { CAFES, TODAY, monthLabel, roundsFor, type Cafe } from "@/lib/chess-data";

const DOW = ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"];

export function CalendarPanel({
  year,
  month,
  cafeFilter,
  selectedDate,
  onNavMonth,
  onSelectDate,
}: {
  year: number;
  month: number;
  cafeFilter: string;
  selectedDate: string | null;
  onNavMonth: (dir: 1 | -1) => void;
  onSelectDate: (iso: string) => void;
}) {
  const eligible: Cafe[] = CAFES.filter((c) => cafeFilter === "all" || c.id === cafeFilter);
  const marks: Record<string, string[]> = {};
  eligible.forEach((c) => {
    roundsFor(c).forEach((r) => {
      const [ry, rm] = r.iso.split("-").map(Number);
      if (ry === year && rm - 1 === month) {
        (marks[r.iso] ||= []).push(c.name);
      }
    });
  });

  const firstDow = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="border border-border p-3.5 flex flex-col gap-2.5">
      <div className="flex justify-between items-center text-sm font-semibold text-ink">
        <button
          onClick={() => onNavMonth(-1)}
          aria-label="Poprzedni miesiąc"
          className="border border-border-strong size-[22px] text-xs text-muted hover:bg-surface-2"
        >
          ‹
        </button>
        <span className="font-mono-data capitalize">{monthLabel(year, month)}</span>
        <button
          onClick={() => onNavMonth(1)}
          aria-label="Następny miesiąc"
          className="border border-border-strong size-[22px] text-xs text-muted hover:bg-surface-2"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[3px] text-[11px] text-center">
        {DOW.map((d) => (
          <span key={d} className="text-faint text-[10px] pb-0.5">
            {d}
          </span>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <span key={`e${i}`} className="invisible" />;
          const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const hasEvents = marks[iso];
          const isToday = iso === TODAY;
          const isSelected = selectedDate === iso;
          return (
            <button
              key={iso}
              disabled={!hasEvents}
              title={hasEvents?.join(", ")}
              onClick={() => onSelectDate(iso)}
              className={[
                "py-1.5 pb-2 border",
                hasEvents
                  ? "bg-surface-2 border-border-strong font-bold text-ink hover:bg-surface-3"
                  : "border-transparent text-faint",
                isToday ? "border-ink" : "",
                isSelected ? "!bg-accent !text-ink" : "",
              ].join(" ")}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
