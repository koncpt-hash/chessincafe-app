"use client";

import { useMemo, useState } from "react";
import {
  CAFES,
  TODAY,
  monthLabel,
  occurrencesInMonth,
  type Cafe,
  type Difficulty,
} from "@/lib/chess-data";
import { FilterBar } from "@/components/FilterBar";
import { EventCard } from "@/components/EventCard";
import { CalendarPanel } from "@/components/CalendarPanel";
import { DetailPanel } from "@/components/DetailPanel";

const TODAY_YEAR = Number(TODAY.slice(0, 4));
const TODAY_MONTH = Number(TODAY.slice(5, 7)) - 1;

export default function Home() {
  const [q, setQ] = useState("");
  const [cafeFilter, setCafeFilter] = useState("all");
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calYear, setCalYear] = useState(TODAY_YEAR);
  const [calMonth, setCalMonth] = useState(TODAY_MONTH);
  const [panel, setPanel] = useState<{ id: string; iso: string } | null>(null);

  const filteredCafes: Cafe[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    return CAFES.filter((c) => {
      if (cafeFilter !== "all" && c.id !== cafeFilter) return false;
      if (
        query &&
        !(
          c.name.toLowerCase().includes(query) ||
          c.district.toLowerCase().includes(query) ||
          c.address.toLowerCase().includes(query)
        )
      )
        return false;
      if (diff !== "all" && c.difficulty !== diff) return false;
      return true;
    });
  }, [q, cafeFilter, diff]);

  const list = useMemo(() => {
    if (selectedDate) {
      const [y, m] = selectedDate.split("-").map(Number);
      return occurrencesInMonth(y, m - 1, filteredCafes).filter((o) => o.effIso === selectedDate);
    }
    return occurrencesInMonth(calYear, calMonth, filteredCafes);
  }, [selectedDate, filteredCafes, calYear, calMonth]);

  function navMonth(dir: 1 | -1) {
    let m = calMonth + dir;
    let y = calYear;
    if (m < 0) {
      m = 11;
      y--;
    }
    if (m > 11) {
      m = 0;
      y++;
    }
    setCalMonth(m);
    setCalYear(y);
  }

  function selectDate(iso: string) {
    setSelectedDate((cur) => (cur === iso ? null : iso));
  }

  function openDetails(id: string, iso: string) {
    setPanel({ id, iso });
  }

  const heading = selectedDate
    ? `Wybierz termin gry · ${new Date(selectedDate).toLocaleDateString("pl-PL")}`
    : `Wybierz termin gry`;

  return (
    <div className="max-w-[1440px] w-full mx-auto px-11 py-10 flex flex-col gap-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-[length:var(--fs-page-title)] font-bold text-ink">
          {heading}{" "}
          {!selectedDate && (
            <span className="capitalize font-normal">
              &middot; {monthLabel(calYear, calMonth)}
            </span>
          )}
        </h1>
        <p className="font-body text-[length:var(--fs-body-lg)] text-ink">
          Zapisz się na pojedyncze spotkanie albo dołącz do sezonu w swojej kawiarni.
        </p>
      </header>

      <FilterBar
        q={q}
        onQ={setQ}
        cafeFilter={cafeFilter}
        onCafeFilter={setCafeFilter}
        diff={diff}
        onDiff={setDiff}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_404px] gap-8 items-start">
        <div className="flex flex-col gap-2.5 order-2 lg:order-1">
          {list.length ? (
            list.map((occ) => (
              <EventCard key={`${occ.id}-${occ.effIso}`} occ={occ} onOpenDetails={openDetails} />
            ))
          ) : (
            <div className="border border-dashed border-border text-center text-[length:var(--fs-body)] text-faint py-10 px-3">
              Brak wydarzeń pasujących do filtrów w tym miesiącu. Spróbuj innego miesiąca lub usuń
              część kryteriów.
            </div>
          )}
        </div>

        <div className="order-1 lg:order-2">
          <CalendarPanel
            year={calYear}
            month={calMonth}
            cafeFilter={cafeFilter}
            selectedDate={selectedDate}
            onNavMonth={navMonth}
            onSelectDate={selectDate}
          />
        </div>
      </div>

      <DetailPanel cafeId={panel?.id ?? null} iso={panel?.iso ?? null} onClose={() => setPanel(null)} />
    </div>
  );
}
