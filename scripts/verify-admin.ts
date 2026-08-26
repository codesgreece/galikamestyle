import { PrismaClient } from "@prisma/client";
import {
  verifyPassword,
  createSessionToken,
  hashToken,
} from "../src/lib/crypto";
import { uploadMedia, deleteMedia } from "../src/services/media";
import { renderBlogContent } from "../src/lib/sanitize";

const prisma = new PrismaClient();
const base = "http://localhost:3000";

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error("ASSERT: " + msg);
  console.log("✓", msg);
}

async function main() {
  const admin = await prisma.adminUser.findFirst();
  assert(admin, "admin exists");
  assert(
    verifyPassword("ChangeMe_Admin_2026!", admin!.passwordHash),
    "password verifies",
  );

  const offer = await prisma.offer.findFirst({ where: { title: "Ιδιαίτερα" } });
  assert(offer, "private offer exists");

  const token = createSessionToken();
  await prisma.session.create({
    data: {
      userId: admin!.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 86400000),
    },
  });
  const cookie = `gms_admin_session=${token}`;

  const dash = await fetch(`${base}/admingermanika/dashboard`, {
    headers: { cookie },
    redirect: "manual",
  });
  assert(dash.status === 200, "dashboard accessible with session");
  assert((await dash.text()).includes("Dashboard"), "dashboard renders");

  const offersPage = await fetch(`${base}/admingermanika/offers`, {
    headers: { cookie },
  });
  assert(offersPage.status === 200, "offers page ok");

  await prisma.offer.update({
    where: { id: offer!.id },
    data: { currentPrice: 88 },
  });
  const refreshed = await prisma.offer.findUnique({ where: { id: offer!.id } });
  assert(Number(refreshed!.currentPrice) === 88, "offer price persisted as 88");

  const draft = await prisma.blogPost.create({
    data: {
      title: "Draft Secret",
      slug: "draft-secret-verify",
      excerpt: "hidden",
      content: "## Draft",
      status: "DRAFT",
      authorId: admin!.id,
    },
  });
  const published = await prisma.blogPost.create({
    data: {
      title: "Δημοσιευμένο Άρθρο Verify",
      slug: "dimosievmeno-verify",
      excerpt: "public excerpt",
      content: "## Hello\n\nPublic body with **bold**.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin!.id,
    },
  });

  assert(
    (await prisma.blogPost.count({ where: { status: "PUBLISHED", slug: "dimosievmeno-verify" } })) === 1,
    "published post in DB",
  );
  assert(
    (await prisma.blogPost.count({ where: { status: "PUBLISHED", slug: "draft-secret-verify" } })) === 0,
    "draft is not published",
  );

  const html = await renderBlogContent(published.content);
  assert(html.includes("<strong>") || html.includes("<h2>"), "blog content renders safely");

  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const file = new File([png], "pixel.png", { type: "image/png" });
  const media = await uploadMedia({
    file,
    uploadedById: admin!.id,
    altText: "test pixel",
  });
  assert(media.storagePath.includes("/api/media/by-id/"), "media path set");
  const mediaRes = await fetch(`${base}${media.storagePath}`);
  assert(mediaRes.status === 200, "media served");
  assert(
    (mediaRes.headers.get("content-type") || "").includes("image"),
    "media content-type",
  );

  await fetch(`${base}/api/analytics/collect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: "/verify",
      referrer: "https://facebook.com/",
      deviceType: "mobile",
    }),
  });
  assert((await prisma.pageView.count()) >= 1, "page views recorded");
  const fb = await prisma.pageView.findFirst({ where: { path: "/verify" } });
  assert(fb?.referrerCategory === "facebook", "referrer categorized privacy-safe");

  const home = await fetch(`${base}/`);
  assert(home.status === 200, "home page ok");
  assert((await home.text()).includes("Ιδιαίτερα"), "home shows offers");

  await prisma.siteContent.update({
    where: { key: "hero.cta_primary" },
    data: { value: "Test CTA →" },
  });
  assert(
    (await prisma.siteContent.findUnique({ where: { key: "hero.cta_primary" } }))
      ?.value === "Test CTA →",
    "content save persisted",
  );
  await prisma.siteContent.update({
    where: { key: "hero.cta_primary" },
    data: { value: "Πάμε να γνωριστούμε →" },
  });

  await prisma.offer.update({
    where: { id: offer!.id },
    data: { currentPrice: 90 },
  });
  await prisma.blogPost.delete({ where: { id: draft.id } });
  await prisma.blogPost.delete({ where: { id: published.id } });
  await deleteMedia(media.id);

  await prisma.session.deleteMany({ where: { userId: admin!.id } });
  const afterLogout = await fetch(`${base}/admingermanika/dashboard`, {
    headers: { cookie },
    redirect: "manual",
  });
  assert(
    afterLogout.status === 307 || afterLogout.status === 302,
    "expired/missing session redirects",
  );

  console.log("\nALL CHECKS PASSED");
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
