import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
  }).toString("hex");
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, salt, hash] = parts;
  const derived = scryptSync(password, salt, KEYLEN, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  const secret = process.env.SESSION_SECRET ?? "dev-insecure-secret";
  return createHash("sha256").update(`${secret}:${token}`).digest("hex");
}

export function hashVisitorId(raw: string): string {
  const secret = process.env.SESSION_SECRET ?? "dev-insecure-secret";
  return createHash("sha256").update(`visitor:${secret}:${raw}`).digest("hex").slice(0, 32);
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9α-ωάέήίόύώ\s-]/gi, "")
    .replace(/[αά]/gi, "a")
    .replace(/[β]/gi, "v")
    .replace(/[γ]/gi, "g")
    .replace(/[δ]/gi, "d")
    .replace(/[εέ]/gi, "e")
    .replace(/[ζ]/gi, "z")
    .replace(/[ηή]/gi, "i")
    .replace(/[θ]/gi, "th")
    .replace(/[ιίϊΐ]/gi, "i")
    .replace(/[κ]/gi, "k")
    .replace(/[λ]/gi, "l")
    .replace(/[μ]/gi, "m")
    .replace(/[ν]/gi, "n")
    .replace(/[ξ]/gi, "x")
    .replace(/[οό]/gi, "o")
    .replace(/[π]/gi, "p")
    .replace(/[ρ]/gi, "r")
    .replace(/[σς]/gi, "s")
    .replace(/[τ]/gi, "t")
    .replace(/[υύϋΰ]/gi, "y")
    .replace(/[φ]/gi, "f")
    .replace(/[χ]/gi, "ch")
    .replace(/[ψ]/gi, "ps")
    .replace(/[ωώ]/gi, "o")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
