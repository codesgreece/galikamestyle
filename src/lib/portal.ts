export const PORTAL_SESSION_KEY = "gms-word-portal-v1";

export const OPENING_WORDS = [
  { text: "HALLO", personality: "letters", color: "var(--yellow)" },
  { text: "HELLO", personality: "stretch", color: "var(--blue-bright)" },
  { text: "GUTEN TAG", personality: "tilt", color: "var(--coral)" },
  { text: "LET’S GO", personality: "zoom", color: "var(--green)" },
  { text: "WUNDERBAR", personality: "scatter", color: "var(--lilac)" },
] as const;

export type WordPersonality = (typeof OPENING_WORDS)[number]["personality"];

export type FieldWord = {
  text: string;
  x: number;
  y: number;
  s: number;
  c: string;
  r: number;
  ring: 0 | 1 | 2;
};

export const FIELD_WORDS: FieldWord[] = [
  { text: "HALLO", x: -38, y: -22, s: 6.2, c: "#ffe14a", r: -14, ring: 0 },
  { text: "HELLO", x: 34, y: -28, s: 4.4, c: "#5aa2ff", r: 10, ring: 1 },
  { text: "DANKE", x: -10, y: 30, s: 3.6, c: "#ff5d7a", r: -6, ring: 2 },
  { text: "THANK YOU", x: 30, y: 20, s: 2.1, c: "#7dffb2", r: 8, ring: 0 },
  { text: "BITTE", x: -44, y: 10, s: 4.0, c: "#b48cff", r: -18, ring: 1 },
  { text: "PLEASE", x: 10, y: -36, s: 2.3, c: "#ffe14a", r: 4, ring: 2 },
  { text: "JA", x: 42, y: -10, s: 7.1, c: "#ff5d7a", r: 12, ring: 0 },
  { text: "YES", x: -26, y: -34, s: 2.9, c: "#5aa2ff", r: -8, ring: 1 },
  { text: "NEIN", x: 20, y: 34, s: 3.8, c: "#b48cff", r: 16, ring: 2 },
  { text: "NO", x: -40, y: 26, s: 5.2, c: "#2fd67b", r: -10, ring: 0 },
  { text: "WUNDERBAR", x: 6, y: 8, s: 2.0, c: "#ffe14a", r: 7, ring: 1 },
  { text: "AMAZING", x: -18, y: 6, s: 1.7, c: "#5aa2ff", r: -4, ring: 2 },
  { text: "GENAU", x: 38, y: 30, s: 2.5, c: "#ff5d7a", r: 11, ring: 0 },
  { text: "LOS", x: -50, y: -14, s: 3.2, c: "#7dffb2", r: -20, ring: 1 },
  { text: "A1", x: 48, y: 8, s: 1.9, c: "#ffe14a", r: 22, ring: 2 },
  { text: "C1", x: -8, y: -44, s: 2.2, c: "#b48cff", r: -15, ring: 0 },
  { text: "GUTEN TAG", x: 24, y: -18, s: 1.6, c: "#ff5d7a", r: 5, ring: 1 },
  { text: "LET’S GO", x: -32, y: 36, s: 1.8, c: "#5aa2ff", r: -9, ring: 2 },
  { text: "STYL", x: 14, y: 42, s: 3.1, c: "#ffe14a", r: 14, ring: 0 },
  { text: "ΣΤΥΛ", x: -22, y: -8, s: 2.6, c: "#ff5d7a", r: -11, ring: 1 },
  { text: "HALLO", x: 46, y: -32, s: 1.5, c: "#7dffb2", r: 19, ring: 2 },
  { text: "HELLO", x: -46, y: 18, s: 1.4, c: "#b48cff", r: -7, ring: 0 },
];

export const RING_RADIUS = [22, 32, 44] as const;

export const TIMING = {
  wordMs: 300,
  multiplyMs: 520,
  vortexMs: 680,
  stillMs: 200,
  brandMs: 400,
  enterMs: 400,
  holdCapMs: 1200,
  shortHalloMs: 150,
  shortHelloMs: 150,
  shortBrandMs: 220,
  shortEnterMs: 160,
} as const;

export function openingTotalMs() {
  return OPENING_WORDS.length * TIMING.wordMs;
}

export function fullIntroMs() {
  return (
    openingTotalMs() +
    TIMING.multiplyMs +
    TIMING.vortexMs +
    TIMING.stillMs +
    TIMING.brandMs +
    TIMING.enterMs
  );
}
