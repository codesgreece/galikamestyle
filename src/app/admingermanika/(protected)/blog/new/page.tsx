import { requireSession } from "@/lib/auth/session";
import { listMediaAdmin } from "@/services/media";
import { PageHeader } from "@/components/admin/ui";
import { BlogEditor } from "@/components/admin/BlogEditor";

export const metadata = { title: "Νέο άρθρο" };

export default async function NewBlogPage() {
  await requireSession();
  const media = await listMediaAdmin().catch(() => []);

  return (
    <div>
      <PageHeader
        title="Νέο άρθρο"
        description="Αποθήκευσε ως πρόχειρο ή δημοσίευσε απευθείας."
      />
      <BlogEditor mode="new" media={media} />
    </div>
  );
}
