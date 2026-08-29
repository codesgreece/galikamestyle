import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { getDashboardData } from "@/services/dashboard";
import { EmptyState, PageHeader, StatCard } from "@/components/admin/ui";
import { formatGreekShortDate } from "@/lib/timezone";

export const metadata = { title: "Dashboard" };

const languageLabels: Record<string, string> = {
  GERMAN: "🇩🇪 Γερμανικά",
  ENGLISH: "🇬🇧 Αγγλικά",
};

const typeLabels: Record<string, string> = {
  PRIVATE: "👤 Ιδιαίτερο",
  GROUP: "👥 Ομαδικό",
};

export default async function DashboardPage() {
  await requireSession();

  let data: Awaited<ReturnType<typeof getDashboardData>> | null = null;
  try {
    data = await getDashboardData();
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <EmptyState
        title="Η βάση δεν είναι διαθέσιμη"
        description="Έλεγξε το DATABASE_URL και δοκίμασε ξανά σε λίγο."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Σήμερα, bookings, επισκέψεις και γρήγορες ενέργειες."
        actions={
          <>
            <Link href="/admingermanika/availability" className="admin-btn admin-btn-primary">
              + Availability
            </Link>
            <Link href="/admingermanika/bookings" className="admin-btn admin-btn-accent">
              Bookings
            </Link>
            <Link href="/admingermanika/blog/new" className="admin-btn admin-btn-ghost">
              + Νέο άρθρο
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost">
              Προβολή website
            </a>
          </>
        }
      />

      <h2 className="admin-display mb-3 text-xl">Σήμερα</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Επισκέψεις σήμερα" value={data.visitsToday} />
        <StatCard label="Νέα bookings" value={data.bookingStats.todayCount} />
        <StatCard label="Pending bookings" value={data.bookingStats.pending} />
        <StatCard label="Confirmed bookings" value={data.bookingStats.confirmed} />
      </div>

      <h2 className="admin-display mb-3 mt-8 text-xl">Γενικά</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Επισκέψεις 7 ημερών" value={data.visits7} />
        <StatCard label="Επισκέψεις 30 ημερών" value={data.visits30} />
        <StatCard label="Conversion rate (σήμερα)" value={`${data.bookingStats.conversionRate}%`} />
        <StatCard label="Δημοσιευμένα άρθρα" value={data.published} />
        <StatCard label="Πρόχειρα άρθρα" value={data.drafts} />
        <StatCard label="Ενεργές προσφορές" value={data.activeOffers} />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="admin-display text-2xl">Επόμενες πρώτες συναντήσεις</h2>
          <Link href="/admingermanika/bookings" className="admin-btn admin-btn-ghost text-sm">
            Όλες →
          </Link>
        </div>
        <div className="admin-card divide-y divide-[var(--admin-line)]">
          {data.upcoming.length === 0 ? (
            <p className="p-5 text-sm text-[var(--admin-muted)]">
              Δεν υπάρχουν επερχόμενες επιβεβαιωμένες συναντήσεις.
            </p>
          ) : (
            data.upcoming.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{booking.name || "—"}</p>
                  <p className="text-sm text-[var(--admin-muted)]">
                    {languageLabels[booking.language]} · {typeLabels[booking.lessonType]}
                  </p>
                </div>
                <div className="text-sm">
                  <p>{formatGreekShortDate(booking.date.toISOString().slice(0, 10))}</p>
                  <p className="text-[var(--admin-muted)]">{booking.startTime}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="admin-display text-2xl">Πρόσφατη δραστηριότητα</h2>
        <div className="admin-card mt-4 divide-y divide-[var(--admin-line)]">
          {data.activity.length === 0 ? (
            <p className="p-5 text-sm text-[var(--admin-muted)]">
              Δεν υπάρχει ακόμη δραστηριότητα.
            </p>
          ) : (
            data.activity.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{item.summary}</p>
                  <p className="text-xs text-[var(--admin-muted)]">
                    {item.user?.name ?? "Σύστημα"}
                  </p>
                </div>
                <time className="text-xs text-[var(--admin-muted)]">
                  {item.createdAt.toLocaleString("el-GR")}
                </time>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
