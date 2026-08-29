import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { AvailabilityManager } from "@/components/admin/AvailabilityManager";
import { EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Availability" };

async function loadAvailabilityData() {
  const [schedules, blockedDates] = await Promise.all([
    prisma.availabilitySchedule.findMany({
      include: { rules: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.blockedDate.findMany({ orderBy: { date: "asc" } }),
  ]);
  return { schedules, blockedDates };
}

export default async function AvailabilityPage() {
  await requireSession();

  let data: Awaited<ReturnType<typeof loadAvailabilityData>> | null = null;
  try {
    data = await loadAvailabilityData();
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <EmptyState
        title="Η βάση δεν είναι διαθέσιμη"
        description="Έλεγξε το DATABASE_URL."
      />
    );
  }

  return (
    <AvailabilityManager schedules={data.schedules} blockedDates={data.blockedDates} />
  );
}
