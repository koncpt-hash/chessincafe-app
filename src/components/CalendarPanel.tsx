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
    <div className="border border-border bg-surface p-3.5 flex flex-col gap-2.5 w-[404px] max-w-full">
      <div className="flex justify-between items-center font-body text-[length:var(--fs-body)] font-bold text-ink">
        <button onClick={() => onNavMonth(-1)} aria-label="Poprzedni miesiąc" className="text-muted hover:text-ink">
          ‹
        </button>
        <span className="font-body text-[length:var(--fs-heading-sm)] font-bold capitalize">
          {monthLabel(year, month)}
        </span>
        <button onClick={() => onNavMonth(1)} aria-label="Następny miesiąc" className="text-muted hover:text-ink">
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[3px] text-[length:var(--fs-label)] text-center font-body font-bold">
        {DOW.map((d) => (
          <span key={d} className="text-[#333333] pb-0.5">
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
                "py-1.5 border",
                hasEvents
                  ? "bg-surface-2 border-border-strong text-ink hover:bg-surface-3"
                  : "border-transparent text-[#333333]",
                isToday ? "underline" : "",
                isSelected ? "!bg-accent !border-accent !text-accent-ink" : "",
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
