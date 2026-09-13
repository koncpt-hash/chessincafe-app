// Deterministyczne dane demo dla terminarza ChessInCafe.
// "today" jest celowo ustawione na sztywno, żeby demo (sezon do końca grudnia 2026) było powtarzalne.

export const TODAY = "2026-09-13";
const MONTHS_SHORT = [
  "STY", "LUT", "MAR", "KWI", "MAJ", "CZE",
  "LIP", "SIE", "WRZ", "PAŹ", "LIS", "GRU",
];

export type Difficulty = "poczatkujacy" | "sredni" | "zaawansowany";

export interface Cafe {
  id: string;
  name: string;
  district: string;
  address: string;
  titlePool: string[];
  difficulty: Difficulty;
  difficultyLabel: string;
  time: string;
  price: string;
  age: string;
  tempo: string;
  seasonName: string;
  registered: number;
  capacity: number;
  avgLevel: number | null;
  players: string[];
  desc: string;
  events: string[];
  eventTitles: string[];
  nextDate: string;
  seasonRound: number;
  seasonTotal: number;
}

export interface Occurrence extends Cafe {
  effIso: string;
  effRound: number;
  effTitle: string;
}

// --- pomocnicze funkcje dat (wszystko liczone w UTC, żeby uniknąć przesunięć strefy czasowej) ---

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function dateRangeISO(startISO: string, endISO: string): string[] {
  const out: string[] = [];
  let cur = startISO;
  while (cur <= endISO) {
    out.push(cur);
    cur = addDaysISO(cur, 1);
  }
  return out;
}

export function formatPL(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const s = dt.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function weekdayPL(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const s = dt.toLocaleDateString("pl-PL", { weekday: "long", timeZone: "UTC" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function monthLabel(y: number, m: number): string {
  const s = new Date(Date.UTC(y, m, 1)).toLocaleDateString("pl-PL", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function dateParts(iso: string): { day: number; monthShort: string } {
  const [, m, d] = iso.split("-").map(Number);
  return { day: d, monthShort: MONTHS_SHORT[m - 1] };
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// --- generator liczb pseudolosowych (deterministyczny, żeby SSR i klient dały ten sam wynik) ---

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(rng: () => number, arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomSplit(rng: () => number, total: number, n: number): number[] {
  const weights = Array.from({ length: n }, () => rng() + 0.2);
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (w / sum) * total);
  const floors = raw.map(Math.floor);
  const remainder = total - floors.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - floors[i] }))
    .sort((a, b) => b.frac - a.frac);
  const counts = floors.slice();
  for (let k = 0; k < remainder; k++) counts[order[k].i]++;
  return counts;
}

function difficultyLabel(d: Difficulty): string {
  return { poczatkujacy: "Początkujący", sredni: "Średniozaawansowany", zaawansowany: "Zaawansowany" }[d];
}

function buildCafes(): Cafe[] {
  const base: Omit<
    Cafe,
    "events" | "eventTitles" | "nextDate" | "seasonRound" | "seasonTotal" | "difficultyLabel"
  >[] = [
    {
      id: "dobroczynna",
      name: "Dobroczynna",
      district: "Mokotów",
      address: "ul. Jarosława Dąbrowskiego 30, Warszawa",
      titlePool: [
        "Szachy dla Całej Rodziny",
        "Poranek z Szachami",
        "Turniej Rodzinny",
        "Szachowe Sobotki",
        "Rodzinna Szachownica",
      ],
      difficulty: "poczatkujacy",
      time: "10:00–12:30",
      price: "15–20 zł",
      age: "7+",
      tempo: "10 min",
      seasonName: "Jesień 2026",
      registered: 0,
      capacity: 20,
      avgLevel: null,
      players: [],
      desc: "W cenę turnieju wliczony jest napój do odebrania przy kasie. Grasz tyle partii, na ile masz ochotę, bez pośpiechu — bez sędziego, fair play, w miłej atmosferze.",
    },
    {
      id: "czytelnik",
      name: "Kawiarnia Czytelnik Nowe Wydanie",
      district: "Śródmieście",
      address: "ul. Wiejska 12A, Warszawa",
      titlePool: [
        "Szachowy Wieczór",
        "Wieczorne Szachy",
        "Turniej przy Kawie",
        "Szachowa Wieczornica",
        "Wieczór z Gambitem",
      ],
      difficulty: "sredni",
      time: "18:00–20:00",
      price: "20 zł",
      age: "10–90",
      tempo: "15 min",
      seasonName: "Jesień 2026",
      registered: 5,
      capacity: 16,
      avgLevel: 650,
      players: ["Marek Nowak", "Ola Wiśniewska", "Kuba Zieliński", "Nina Kowalczyk", "Tomek Baran"],
      desc: "Kameralne spotkania w klimatycznej kawiarni przy Wiejskiej. Gramy w parach dobranych w miarę możliwości pod poziom, żeby partie były wyrównane.",
    },
    {
      id: "cdk",
      name: "Centrum Dobrej Kultury",
      district: "Targówek",
      address: "Księcia Ziemowita 39, Warszawa",
      titlePool: [
        "Liga Mistrzów",
        "Turniej Mistrzów",
        "Szachowe Starcie",
        "Klasyk Targówka",
        "Bitwa o Koronę",
      ],
      difficulty: "zaawansowany",
      time: "17:00–19:00",
      price: "20 zł",
      age: "12+",
      tempo: "15 min",
      seasonName: "Jesień 2026",
      registered: 5,
      capacity: 12,
      avgLevel: 900,
      players: ["Ala Grabowska", "Bartek Sikora", "Celina Wolska", "Darek Pawlak", "Ewa Sobczak"],
      desc: "Turniej dla graczy szukających mocniejszej konkurencji. Klasyfikacja liczy się do rankingu sezonowego kawiarni.",
    },
  ];

  const rng = mulberry32(20260913);
  const pool = dateRangeISO(TODAY, "2026-12-31");
  const counts = randomSplit(rng, 36, base.length).sort((a, b) => b - a);
  const [rest2, rest3] = shuffle(rng, [counts[1], counts[2]]);
  const countById: Record<string, number> = {
    dobroczynna: counts[0],
    czytelnik: rest2,
    cdk: rest3,
  };

  return base.map((c) => {
    const picked = shuffle(rng, pool).slice(0, countById[c.id]).sort();
    const eventTitles = picked.map(() => c.titlePool[Math.floor(rng() * c.titlePool.length)]);
    const upcoming = picked.find((iso) => iso >= TODAY) || picked[picked.length - 1];
    return {
      ...c,
      difficultyLabel: difficultyLabel(c.difficulty),
      events: picked,
      eventTitles,
      nextDate: upcoming,
      seasonRound: picked.indexOf(upcoming) + 1,
      seasonTotal: picked.length,
    };
  });
}

export const CAFES: Cafe[] = buildCafes();

export function roundsFor(c: Cafe): { round: number; iso: string; title: string }[] {
  return c.events.map((iso, i) => ({ round: i + 1, iso, title: c.eventTitles[i] }));
}

export function occurrencesInMonth(y: number, m: number, cafes: Cafe[]): Occurrence[] {
  const occ: Occurrence[] = [];
  cafes.forEach((c) => {
    roundsFor(c).forEach((r) => {
      const [ry, rm] = r.iso.split("-").map(Number);
      if (ry === y && rm - 1 === m) {
        occ.push({ ...c, effIso: r.iso, effRound: r.round, effTitle: r.title });
      }
    });
  });
  occ.sort((a, b) => a.effIso.localeCompare(b.effIso) || a.name.localeCompare(b.name));
  return occ;
}

export function occurrenceOn(cafe: Cafe, iso: string) {
  return roundsFor(cafe).find((r) => r.iso === iso);
}
