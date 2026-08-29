import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { getAnalyticsSummary } from "@/services/analytics";
import { getBookingStats } from "@/services/booking";
import { EmptyState, PageHeader, StatCard } from "@/components/admin/ui";

export const metadata = { title: "Στατιστικά" };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  await requireSession();
  const params = await searchParams;
  const range = Number(params.range || 30);
  const rangeDays = [7, 30, 90].includes(range) ? range : 30;

  let data: Awaited<ReturnType<typeof getAnalyticsSummary>> | null = null;
  let bookingStats: Awaited<ReturnType<typeof getBookingStats>> | null = null;
  try {
    [data, bookingStats] = await Promise.all([
      getAnalyticsSummary(rangeDays),
      getBookingStats(),
    ]);
  } catch {
    data = null;
    bookingStats = null;
  }

  if (!data) {
    return (
      <EmptyState
        title="Αδυναμία φόρτωσης στατιστικών"
        description="Η βάση δεδομένων δεν είναι διαθέσιμη αυτή τη στιγμή."
      />
    );
  }

  const maxSeries = Math.max(...data.series.map((s) => s.count), 1);

  return (
    <div>
      <PageHeader
        title="Στατιστικά"
        description="Privacy-conscious analytics για το δημόσιο website."
        actions={
          <div className="flex flex-wrap gap-2">
            {[7, 30, 90].map((days) => (
              <Link
                key={days}
                href={`/admingermanika/analytics?range=${days}`}
                className={`admin-btn ${
                  rangeDays === days ? "admin-btn-primary" : "admin-btn-ghost"
                }`}
              >
                {days} ημέρες
              </Link>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Σήμερα" value={data.todayCount} />
        <StatCard label="7 ημέρες" value={data.last7Count} />
        <StatCard label="30 ημέρες" value={data.last30Count} />
        <StatCard label="Συνολικά" value={data.total} />
      </div>

      {bookingStats ? (
        <>
          <h2 className="admin-display mb-3 mt-8 text-xl">Booking Analytics</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Booking requests (σήμερα)" value={bookingStats.totalStarts} />
            <StatCard label="Confirmed (σήμερα)" value={bookingStats.confirmedToday} />
            <StatCard label="Conversion rate" value={`${bookingStats.conversionRate}%`} />
            <StatCard label="Cancelled" value={bookingStats.cancelled} />
            <StatCard label="Expired holds" value={bookingStats.expired} />
            <StatCard label="Pending holds" value={bookingStats.pending} />
            <StatCard label="Total confirmed" value={bookingStats.confirmed} />
          </div>
        </>
      ) : null}

      <section className="admin-card mt-6 p-5">
        <h2 className="admin-display text-2xl">Επισκέψεις ανά ημέρα</h2>
        {data.rangeCount === 0 ? (
          <p className="mt-4 text-sm text-[var(--admin-muted)]">
            Δεν υπάρχουν ακόμη δεδομένα για αυτό το διάστημα.
          </p>
        ) : (
          <div className="mt-5 flex h-48 items-end gap-1 overflow-x-auto">
            {data.series.map((point) => (
              <div
                key={point.date}
                className="flex min-w-[10px] flex-1 flex-col items-center justify-end"
                title={`${point.date}: ${point.count}`}
              >
                <div
                  className="w-full rounded-t-md bg-[var(--admin-navy)]"
                  style={{
                    height: `${Math.max((point.count / maxSeries) * 100, point.count > 0 ? 6 : 2)}%`,
                    opacity: point.count > 0 ? 1 : 0.2,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="admin-card p-5">
          <h2 className="admin-display text-2xl">Δημοφιλείς σελίδες</h2>
          <ul className="mt-4 divide-y divide-[var(--admin-line)]">
            {data.topPages.length === 0 ? (
              <li className="py-3 text-sm text-[var(--admin-muted)]">Χωρίς δεδομένα</li>
            ) : (
              data.topPages.map((page) => (
                <li
                  key={page.path}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <span className="truncate font-medium">{page.path}</span>
                  <span className="text-[var(--admin-muted)]">{page.count}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="admin-card p-5">
          <h2 className="admin-display text-2xl">Δημοφιλή άρθρα</h2>
          <ul className="mt-4 divide-y divide-[var(--admin-line)]">
            {data.topBlog.length === 0 ? (
              <li className="py-3 text-sm text-[var(--admin-muted)]">Χωρίς δεδομένα blog</li>
            ) : (
              data.topBlog.map((page) => (
                <li
                  key={page.path}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <span className="truncate font-medium">{page.path}</span>
                  <span className="text-[var(--admin-muted)]">{page.count}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="admin-card p-5">
          <h2 className="admin-display text-2xl">Συσκευές</h2>
          <ul className="mt-4 space-y-2">
            {data.devices.map((d) => (
              <li key={d.type} className="flex justify-between text-sm">
                <span className="capitalize">{d.type}</span>
                <span className="text-[var(--admin-muted)]">{d.count}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card p-5">
          <h2 className="admin-display text-2xl">Πηγές traffic</h2>
          <ul className="mt-4 space-y-2">
            {data.sources.length === 0 ? (
              <li className="text-sm text-[var(--admin-muted)]">Χωρίς δεδομένα</li>
            ) : (
              data.sources.map((s) => (
                <li key={s.source} className="flex justify-between text-sm">
                  <span className="capitalize">{s.source}</span>
                  <span className="text-[var(--admin-muted)]">{s.count}</span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
