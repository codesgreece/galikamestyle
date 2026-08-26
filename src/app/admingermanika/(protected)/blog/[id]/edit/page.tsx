import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { getPostByIdAdmin } from "@/services/blog";
import { listMediaAdmin } from "@/services/media";
import { PageHeader } from "@/components/admin/ui";
import { BlogEditor } from "@/components/admin/BlogEditor";

export const metadata = { title: "Επεξεργασία άρθρου" };

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;
  const [post, media] = await Promise.all([
    getPostByIdAdmin(id),
    listMediaAdmin().catch(() => []),
  ]);
  if (!post) notFound();

  return (
    <div>
      <PageHeader
        title="Επεξεργασία άρθρου"
        description={post.title}
      />
      <BlogEditor
        mode="edit"
        media={media}
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          coverAlt: post.coverAlt,
          status: post.status,
        }}
      />
    </div>
  );
}
