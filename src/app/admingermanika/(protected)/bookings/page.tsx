import { requireSession } from "@/lib/auth/session";
import { listBookings } from "@/services/booking";
import { BookingsManager } from "@/components/admin/BookingsManager";
import { EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Bookings" };

export default async function BookingsPage() {
  await requireSession();

  let bookings: Awaited<ReturnType<typeof listBookings>> = [];
  try {
    bookings = await listBookings();
  } catch {
    return (
      <EmptyState
        title="Η βάση δεν είναι διαθέσιμη"
        description="Έλεγξε το DATABASE_URL."
      />
    );
  }

  return <BookingsManager bookings={bookings} />;
}
