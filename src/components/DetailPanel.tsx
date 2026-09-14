"use client";

import { useEffect, useState } from "react";
import {
  CAFES,
  formatPL,
  initials,
  roundsFor,
  type Cafe,
} from "@/lib/chess-data";
import { PinIcon } from "./PinIcon";

export function DetailPanel({
  cafeId,
  iso,
  onClose,
}: {
  cafeId: string | null;
  iso: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && cafeId) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [cafeId, onClose]);

  const open = Boolean(cafeId && iso);
  const cafe = cafeId ? CAFES.find((c) => c.id === cafeId) : undefined;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-ink/30 transition-opacity z-40 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-surface border-l border-border shadow-xl overflow-y-auto z-50 p-5 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {cafe && iso && (
          <DetailPanelBody key={`${cafeId}-${iso}`} cafe={cafe} iso={iso} onClose={onClose} />
        )}
      </aside>
    </>
  );
}

function DetailPanelBody({
  cafe,
  iso,
  onClose,
}: {
  cafe: Cafe;
  iso: string;
  onClose: () => void;
}) {
  const [signedUp, setSignedUp] = useState(false);
  const [seasonOpen, setSeasonOpen] = useState(false);

  const rounds = roundsFor(cafe);
  const matched = rounds.find((r) => r.iso === iso);
  const currentRound = matched?.round ?? cafe.seasonRound;
  const dateLabel = formatPL(iso);

  return (
    <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[length:var(--fs-label)] uppercase tracking-wide text-faint font-semibold">
                Szczegóły wydarzenia
              </span>
              <button
                onClick={onClose}
                aria-label="Zamknij"
                className="border border-border-strong size-[26px] text-[length:var(--fs-body)] text-muted hover:bg-surface-2"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between gap-4 items-start flex-wrap">
              <div>
                <h3 className="font-display text-[length:var(--fs-panel-title)] font-semibold text-ink">{cafe.name}</h3>
                <p className="text-[length:var(--fs-body)] text-muted mt-0.5">{cafe.address}</p>
                <p className="text-[length:var(--fs-body)] text-muted">
                  {dateLabel}, {cafe.time}
                </p>
              </div>
              <span className="text-[length:var(--fs-micro)] px-2 py-1 border border-border-strong bg-surface-2 text-muted font-mono-data whitespace-nowrap">
                {cafe.difficultyLabel}
              </span>
            </div>

            <div className="flex items-center gap-2.5 border border-border bg-surface-2 px-3.5 py-2.5 text-[length:var(--fs-label)] text-muted flex-wrap">
              <span>
                Sezon „{cafe.seasonName}” &middot; runda {currentRound} z {cafe.seasonTotal}
              </span>
              <div className="flex gap-1">
                {rounds.map((r) => (
                  <span
                    key={r.round}
                    className={`size-[9px] rounded-full border-[1.5px] ${
                      r.round < currentRound
                        ? "bg-border-strong border-border-strong"
                        : r.round === currentRound
                          ? "bg-ink border-ink"
                          : "bg-surface border-border-strong"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-border border border-border">
              {[
                ["Data", dateLabel],
                ["Godzina", cafe.time],
                ["Cena", cafe.price],
                ["Wiek", cafe.age],
                ["Tempo gry", cafe.tempo],
                ["Miejsca", `${cafe.registered}/${cafe.capacity}`],
              ].map(([label, val]) => (
                <div key={label} className="bg-surface p-3">
                  <span className="block text-[length:var(--fs-caption)] uppercase tracking-wide text-faint font-semibold mb-1">
                    {label}
                  </span>
                  <b className="text-[length:var(--fs-body)] font-mono-data">{val}</b>
                </div>
              ))}
            </div>

            <div className="relative flex flex-col gap-1.5 pt-1 border-t border-border">
              {signedUp ? (
                <>
                  <button
                    disabled
                    className="bg-accent text-ink py-2.5 text-[length:var(--fs-body)] font-semibold opacity-60"
                  >
                    Przechodzę do logowania…
                  </button>
                  <span className="text-[length:var(--fs-label)] text-faint">
                    W pełnej wersji: ekran logowania z jednym polem, potem powrót dokładnie tutaj.
                  </span>
                </>
              ) : (
                <button
                  onClick={() => setSignedUp(true)}
                  className="bg-accent text-ink py-2.5 text-[length:var(--fs-body)] font-semibold hover:bg-ink hover:text-accent transition-colors max-w-[340px]"
                >
                  Zapisz się na turniej
                </button>
              )}
              <button
                onClick={() => setSeasonOpen((o) => !o)}
                className="text-[length:var(--fs-body)] text-muted underline underline-offset-2 text-left"
              >
                Wolisz grać regularnie? Zobacz cały sezon w tej kawiarni →
              </button>
              {seasonOpen && (
                <div className="text-[length:var(--fs-label)] text-muted border border-border p-3.5 mt-1.5">
                  <span className="text-[length:var(--fs-caption)] uppercase tracking-wide text-faint font-semibold">
                    Terminy sezonu „{cafe.seasonName}”
                  </span>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {rounds.map((r) => (
                      <li key={r.round} className="flex gap-2 items-center">
                        <span
                          className={`size-[9px] rounded-full border-[1.5px] shrink-0 ${
                            r.round < currentRound
                              ? "bg-border-strong border-border-strong"
                              : r.round === currentRound
                                ? "bg-ink border-ink"
                                : "bg-surface border-border-strong"
                          }`}
                        />
                        Runda {r.round} &middot; {formatPL(r.iso)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <p className="text-[length:var(--fs-body)] text-muted max-w-[62ch]">{cafe.desc}</p>

            <div className="border border-border p-3.5">
              <h4 className="text-[length:var(--fs-label)] uppercase tracking-wide text-faint font-semibold mb-2">
                Kto już gra
              </h4>
              <div className="flex flex-wrap gap-2">
                {cafe.players.length ? (
                  cafe.players.map((p) => (
                    <span
                      key={p}
                      className="flex items-center gap-1.5 text-[length:var(--fs-label)] bg-surface-2 border border-border pr-2.5 pl-1"
                    >
                      <span className="size-[22px] rounded-full bg-surface border border-border-strong flex items-center justify-center font-mono-data text-[length:var(--fs-avatar)] font-semibold">
                        {initials(p)}
                      </span>
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-[length:var(--fs-caption)] text-faint">Bądź pierwszym zapisanym na tę rundę</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div
                className="h-[150px] border border-border flex items-center justify-center"
                style={{
                  backgroundColor: "var(--surface-2)",
                  backgroundImage:
                    "repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, var(--border) 0 1px, transparent 1px 34px)",
                }}
              >
                <PinIcon className="size-8 text-ink" />
              </div>
              <div className="flex justify-between items-baseline gap-2.5 text-[length:var(--fs-label)] text-muted flex-wrap">
                <span>{cafe.address}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${cafe.name}, ${cafe.address}`
                  )}`}
                  target="_blank"
                  rel="noopener"
                  className="text-ink underline underline-offset-2 whitespace-nowrap"
                >
                  Otwórz w Google Maps ↗
                </a>
              </div>
            </div>
    </div>
  );
}
