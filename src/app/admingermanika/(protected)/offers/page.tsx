import { requireSession } from "@/lib/auth/session";
import { listOffersAdmin } from "@/services/offers";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { OffersManager } from "@/components/admin/OffersManager";

export const metadata = { title: "Προσφορές" };

export default async function OffersPage() {
  await requireSession();

  let offers: Awaited<ReturnType<typeof listOffersAdmin>> | null = null;
  try {
    offers = await listOffersAdmin();
  } catch {
    offers = null;
  }

  if (!offers) {
    return (
      <EmptyState
        title="Αδυναμία φόρτωσης προσφορών"
        description="Η βάση δεδομένων δεν είναι διαθέσιμη αυτή τη στιγμή."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Προσφορές & Τιμές"
        description="Άλλαξε τιμές και λεπτομέρειες. Οι αλλαγές εμφανίζονται αμέσως στο δημόσιο site."
      />
      <OffersManager
        initialOffers={offers.map((o) => ({
          ...o,
          originalPrice: Number(o.originalPrice),
          currentPrice: Number(o.currentPrice),
        }))}
      />
    </div>
  );
}
