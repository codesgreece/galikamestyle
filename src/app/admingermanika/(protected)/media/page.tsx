import { requireSession } from "@/lib/auth/session";
import { listMediaAdmin } from "@/services/media";
import { PageHeader, EmptyState } from "@/components/admin/ui";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  await requireSession();

  let items: Awaited<ReturnType<typeof listMediaAdmin>> | null = null;
  try {
    items = await listMediaAdmin();
  } catch {
    items = null;
  }

  if (!items) {
    return (
      <EmptyState
        title="Αδυναμία φόρτωσης media"
        description="Η βάση δεδομένων δεν είναι διαθέσιμη αυτή τη στιγμή."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Media"
        description="Βιβλιοθήκη εικόνων για blog covers και περιεχόμενο."
      />
      <MediaLibrary
        initialItems={items.map((item) => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
