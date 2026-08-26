import { PrismaClient } from "@prisma/client";

async function main() {
  const p = new PrismaClient();
  const admin = await p.adminUser.findFirstOrThrow();
  const post = await p.blogPost.create({
    data: {
      title: "Live HTTP Post",
      slug: "live-http-post",
      excerpt: "x",
      content: "Hello **world**",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });
  const draft = await p.blogPost.create({
    data: {
      title: "Hidden Draft",
      slug: "hidden-draft-live",
      content: "nope",
      status: "DRAFT",
      authorId: admin.id,
    },
  });

  const index = await (await fetch("http://localhost:3000/blog")).text();
  const page = await fetch("http://localhost:3000/blog/live-http-post");
  const draftPage = await fetch("http://localhost:3000/blog/hidden-draft-live");

  console.log("index has live?", index.includes("Live HTTP Post"));
  console.log("index has draft?", index.includes("Hidden Draft"));
  console.log("slug status", page.status);
  console.log("draft status", draftPage.status);

  let failed = false;
  if (!index.includes("Live HTTP Post")) failed = true;
  if (index.includes("Hidden Draft")) failed = true;
  if (page.status !== 200 || draftPage.status !== 404) failed = true;

  await p.blogPost.delete({ where: { id: post.id } });
  await p.blogPost.delete({ where: { id: draft.id } });
  await p.$disconnect();

  if (failed) {
    console.error("BLOG HTTP CHECKS FAILED");
    process.exit(1);
  }
  console.log("BLOG HTTP CHECKS PASSED");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
