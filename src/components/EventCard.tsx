"use client";

import { useState } from "react";
import type { Occurrence } from "@/lib/chess-data";
import { dateParts, weekdayPL, initials } from "@/lib/chess-data";
import { PinIcon } from "./PinIcon";

export function EventCard({
  occ,
  onOpenDetails,
}: {
  occ: Occurrence;
  onOpenDetails: (id: string, iso: string) => void;
}) {
  const { day, monthShort } = dateParts(occ.effIso);
  const [signedUp, setSignedUp] = useState(false);

  const avatars = occ.players.slice(0, 4);
  const restCount = occ.players.length - avatars.length;

  return (
    <div className="border border-border bg-surface">
      <div className="flex flex-row items-start gap-4 p-4">
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <span className="font-mono-data text-[length:var(--fs-label)] text-faint">
            {day} {monthShort} &middot; {weekdayPL(occ.effIso)}, {occ.time}
          </span>

          <h3 className="font-display text-[length:var(--fs-card-title)] font-semibold leading-snug text-ink">
            {occ.effTitle}
          </h3>
          <span className="text-[length:var(--fs-label)] font-semibold text-muted">
            Sezon „{occ.seasonName}” &middot; runda {occ.effRound} z {occ.seasonTotal}
          </span>

          <div className="flex items-start gap-1.5 text-[length:var(--fs-label)] text-muted">
            <PinIcon className="size-3.5 mt-0.5 shrink-0 text-faint" />
            <span>
              {occ.name} &middot; {occ.district} &middot; {occ.address}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            {occ.players.length ? (
              <>
                <div className="flex">
                  {avatars.map((p, i) => (
                    <div
                      key={p}
                      className="size-[22px] rounded-full bg-surface-2 border-[1.5px] border-surface outline outline-border-strong flex items-center justify-center font-mono-data text-[length:var(--fs-avatar)] font-semibold text-ink"
                      style={{ marginLeft: i === 0 ? 0 : -6 }}
                    >
                      {initials(p)}
                    </div>
                  ))}
                  {restCount > 0 && (
                    <div
                      className="size-[22px] rounded-full bg-surface-2 border-[1.5px] border-surface outline outline-border-strong flex items-center justify-center font-mono-data text-[length:var(--fs-avatar)] font-semibold text-ink"
                      style={{ marginLeft: -6 }}
                    >
                      +{restCount}
                    </div>
                  )}
                </div>
                <small className="text-[length:var(--fs-caption)] text-faint">
                  {occ.registered}/{occ.capacity} &middot; śr. poziom {occ.avgLevel}
                </small>
              </>
            ) : (
              <small className="text-[length:var(--fs-caption)] text-faint">Bądź pierwszym zapisanym</small>
            )}
          </div>

          <div className="text-[length:var(--fs-body)] font-semibold text-ink">Cena: {occ.price}</div>

          <div className="flex flex-wrap gap-2 pt-1.5">
            {signedUp ? (
              <div className="flex flex-col gap-1">
                <button
                  disabled
                  className="bg-accent text-ink px-3 py-2 text-[length:var(--fs-body)] font-semibold opacity-60 cursor-default"
                >
                  Przechodzę do logowania…
                </button>
                <span className="text-[length:var(--fs-caption)] text-faint">
                  Ostatni krok: krótki ekran logowania, potem wracasz dokładnie tutaj.
                </span>
              </div>
            ) : (
              <button
                onClick={() => setSignedUp(true)}
                className="bg-accent text-ink px-3 py-2 text-[length:var(--fs-body)] font-semibold hover:bg-ink hover:text-accent transition-colors"
              >
                Zapisz się na turniej
              </button>
            )}
            <button
              onClick={() => onOpenDetails(occ.id, occ.effIso)}
              className="border border-border-strong text-ink px-3 py-2 text-[length:var(--fs-body)] font-semibold hover:bg-surface-2 transition-colors"
            >
              Szczegóły
            </button>
          </div>
        </div>

        <div
          className="flex shrink-0 size-16 border border-border-strong items-center justify-center font-mono-data text-[length:var(--fs-body)] font-bold text-faint"
          style={{
            backgroundColor: "var(--surface-2)",
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--surface-3) 0 6px, var(--surface-2) 6px 12px)",
          }}
        >
          {initials(occ.name)}
        </div>
      </div>
    </div>
  );
}
