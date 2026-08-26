import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { getDashboardData } from "@/services/dashboard";
import { EmptyState, PageHeader, StatCard } from "@/components/admin/ui";

export const metadata = { title: "Dashboard" };

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
        description="Γρήγορη εικόνα για επισκέψεις, περιεχόμενο και προσφορές."
        actions={
          <>
            <Link href="/admingermanika/offers" className="admin-btn admin-btn-primary">
              + Νέα προσφορά
            </Link>
            <Link href="/admingermanika/blog/new" className="admin-btn admin-btn-accent">
              + Νέο άρθρο
            </Link>
            <Link href="/admingermanika/content" className="admin-btn admin-btn-ghost">
              Αλλαγή περιεχομένου
            </Link>
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-ghost">
              Προβολή website
            </a>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Επισκέψεις σήμερα" value={data.visitsToday} />
        <StatCard label="Επισκέψεις 7 ημερών" value={data.visits7} />
        <StatCard label="Επισκέψεις 30 ημερών" value={data.visits30} />
        <StatCard label="Δημοσιευμένα άρθρα" value={data.published} />
        <StatCard label="Πρόχειρα άρθρα" value={data.drafts} />
        <StatCard label="Ενεργές προσφορές" value={data.activeOffers} />
      </div>

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
