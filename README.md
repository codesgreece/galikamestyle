# Γερμανικά με Στυλ

Premium landing page για μαθήματα Γερμανικών & Αγγλικών από τη Βιργινία Πανάκη, με ενσωματωμένο custom admin CMS στο `/admingermanika`.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- PostgreSQL + Prisma
- Custom admin panel (auth, offers, blog, content, media, analytics)

## Environment

Αντίγραψε το `.env.example` σε `.env` και συμπλήρωσε:

```bash
cp .env.example .env
```

Απαιτούμενα:

- `DATABASE_URL`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` (μόνο για seed)
- `SESSION_SECRET`
- `MEDIA_STORAGE` (`database` προτείνεται για Vercel)
- `NEXT_PUBLIC_SITE_URL`

## Database setup

```bash
npm install
npm run db:migrate
npm run db:seed
```

## Development

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admingermanika`

## Production

```bash
npm run build
npm start
```

Στο hosting (π.χ. Vercel):

1. Πρόσθεσε PostgreSQL και τα env vars.
2. Τρέξε `npm run db:migrate` και `npm run db:seed` μία φορά (local με production `DATABASE_URL`, ή CI/release command).
3. `MEDIA_STORAGE=database` ώστε τα uploads να είναι persistent χωρίς εξωτερικό object storage.

## Configuration

Τα επικοινωνιακά defaults και fallbacks βρίσκονται στο `src/lib/config.ts` / `src/lib/defaults.ts`.
Η καθημερινή επεξεργασία γίνεται από το admin panel.
