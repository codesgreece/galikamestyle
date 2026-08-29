import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/crypto";
import { CONTENT_FIELDS } from "../src/lib/content-keys";
import { DEFAULT_CONTENT, DEFAULT_OFFERS } from "../src/lib/defaults";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Βιργινία Πανάκη";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed.");
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  }

  const passwordHash = hashPassword(password);

  const admin = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: {
      name,
      passwordHash,
      role: "OWNER",
    },
    create: {
      email: email.toLowerCase(),
      name,
      passwordHash,
      role: "OWNER",
    },
  });

  const offerCount = await prisma.offer.count();
  if (offerCount === 0) {
    await prisma.offer.createMany({
      data: DEFAULT_OFFERS.map((o, index) => ({
        title: o.title,
        description: o.description,
        originalPrice: o.originalPrice,
        currentPrice: o.currentPrice,
        billingPeriod: o.billingPeriod,
        badgeText: o.badgeText,
        accent: o.accent,
        sortOrder: index,
        isActive: true,
      })),
    });
  }

  for (const field of CONTENT_FIELDS) {
    await prisma.siteContent.upsert({
      where: { key: field.key },
      update: {},
      create: {
        key: field.key,
        value: DEFAULT_CONTENT[field.key],
        group: field.group,
        label: field.label,
      },
    });
  }

  console.log(`Seeded admin: ${admin.email}`);
  console.log("Seeded default offers and site content.");

  const scheduleCount = await prisma.availabilitySchedule.count();
  if (scheduleCount === 0) {
    await prisma.availabilitySchedule.create({
      data: {
        name: "Κανονικό πρόγραμμα",
        isActive: true,
        rules: {
          create: [
            { dayOfWeek: 1, startTime: "16:00", endTime: "20:00" },
            { dayOfWeek: 2, startTime: "16:00", endTime: "20:00" },
            { dayOfWeek: 3, startTime: "17:00", endTime: "21:00" },
            { dayOfWeek: 4, startTime: "16:00", endTime: "20:00" },
            { dayOfWeek: 5, startTime: "16:00", endTime: "20:00" },
            { dayOfWeek: 6, startTime: "10:00", endTime: "14:00" },
          ],
        },
      },
    });
    console.log("Seeded default availability schedule.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
