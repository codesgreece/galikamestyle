import { requireSession } from "@/lib/auth/session";
import { listContentAdmin } from "@/services/content";
import { DEFAULT_CONTENT } from "@/lib/defaults";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { ContentManager } from "@/components/admin/ContentManager";

export const metadata = { title: "Περιεχόμενο" };

export default async function ContentPage() {
  await requireSession();

  let rows: Awaited<ReturnType<typeof listContentAdmin>> | null = null;
  try {
    rows = await listContentAdmin();
  } catch {
    rows = null;
  }

  if (!rows) {
    return (
      <EmptyState
        title="Αδυναμία φόρτωσης περιεχομένου"
        description="Η βάση δεδομένων δεν είναι διαθέσιμη αυτή τη στιγμή."
      />
    );
  }

  const values: Record<string, string> = { ...DEFAULT_CONTENT };
  for (const row of rows) values[row.key] = row.value;

  return (
    <div>
      <PageHeader
        title="Περιεχόμενο Site"
        description="Άλλαξε μόνο τα βασικά κείμενα και στοιχεία επικοινωνίας — χωρίς να αγγίζεις τον κώδικα."
      />
      <ContentManager initialValues={values} />
    </div>
  );
}
