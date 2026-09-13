"use client";

import { useState } from "react";
import Image from "next/image";
import type { Occurrence } from "@/lib/chess-data";
import { dateParts, weekdayPL, initials } from "@/lib/chess-data";

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
      <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-9 p-5">
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 lg:w-[130px] shrink-0">
          <p className="font-display text-[length:var(--fs-card-title)] font-bold leading-tight text-ink">
            {day} {monthShort.slice(0, 1) + monthShort.slice(1).toLowerCase()}
          </p>
          <div className="font-body text-[length:var(--fs-body-lg)] text-ink">
            <p>{weekdayPL(occ.effIso)}</p>
            <p>{occ.time}</p>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          <h3 className="font-display text-[length:var(--fs-card-title)] font-bold leading-tight text-ink">
            {occ.effTitle} sezon „{occ.seasonName}”
          </h3>

          <div className="flex flex-col gap-0.5 font-body text-[length:var(--fs-body-lg)] text-ink">
            <p className="font-bold">{occ.name}</p>
            <p>
              {occ.district}, {occ.address}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {occ.players.length ? (
              <>
                <div className="flex">
                  {avatars.map((p, i) => (
                    <div
                      key={p}
                      className="size-6 rounded-full bg-surface-2 border-[1.5px] border-surface outline outline-border-strong flex items-center justify-center font-mono-data text-[length:var(--fs-avatar)] font-semibold text-ink"
                      style={{ marginLeft: i === 0 ? 0 : -8 }}
                    >
                      {initials(p)}
                    </div>
                  ))}
                  {restCount > 0 && (
                    <div
                      className="size-6 rounded-full bg-surface-2 border-[1.5px] border-surface outline outline-border-strong flex items-center justify-center font-mono-data text-[length:var(--fs-avatar)] font-semibold text-ink"
                      style={{ marginLeft: -8 }}
                    >
                      +{restCount}
                    </div>
                  )}
                </div>
                <span className="font-body text-[length:var(--fs-body-lg)] text-ink whitespace-nowrap">
                  {occ.registered}/{occ.capacity} śr. poziom {occ.avgLevel}
                </span>
              </>
            ) : (
              <span className="font-body text-[length:var(--fs-body-lg)] text-ink">Bądź pierwszym zapisanym</span>
            )}
          </div>

          <div className="font-body text-[length:var(--fs-card-title)] font-bold text-ink">{occ.price}</div>

          <div className="flex flex-wrap gap-3.5 items-center pt-0.5">
            {signedUp ? (
              <div className="flex flex-col gap-1">
                <button
                  disabled
                  className="bg-accent text-accent-ink px-7 py-3.5 text-[length:var(--fs-body)] font-bold font-body opacity-60 cursor-default"
                >
                  Przechodzę do logowania…
                </button>
                <span className="text-[length:var(--fs-caption)] text-faint font-body">
                  Ostatni krok: krótki ekran logowania, potem wracasz dokładnie tutaj.
                </span>
              </div>
            ) : (
              <button
                onClick={() => setSignedUp(true)}
                className="flex items-center gap-2 bg-accent text-accent-ink px-7 py-3.5 text-[length:var(--fs-body)] font-bold font-body hover:opacity-90 transition-opacity"
              >
                Zapisz się na turniej
                <svg viewBox="0 0 16 16" fill="none" className="size-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.3328 8H12.6672M8 12.6672L12.6672 8L8 3.3328" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <button
              onClick={() => onOpenDetails(occ.id, occ.effIso)}
              className="border border-border-strong text-ink bg-surface px-7 py-3.5 text-[length:var(--fs-body)] font-bold font-body hover:bg-surface-2 transition-colors"
            >
              Szczegóły
            </button>
          </div>
        </div>

        <div className="p-2.5 shrink-0">
          <div className="border border-border-strong size-[120px] relative overflow-hidden bg-surface-2">
            {occ.logo ? (
              <Image src={occ.logo} alt={occ.name} fill sizes="120px" className="object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center font-mono-data text-[length:var(--fs-card-title)] font-bold text-faint">
                {initials(occ.name)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
