import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/constants";
import { DEFAULT_OFFERS, mapOffer, type PublicOffer } from "@/lib/defaults";

async function fetchActiveOffers(): Promise<PublicOffer[]> {
  const now = new Date();
  const offers = await prisma.offer.findMany({
    where: {
      isActive: true,
      OR: [{ startDate: null }, { startDate: { lte: now } }],
      AND: [
        {
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
      ],
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return offers.map(mapOffer);
}

export const getPublicOffers = unstable_cache(
  async () => {
    try {
      const offers = await fetchActiveOffers();
      return offers.length > 0 ? offers : DEFAULT_OFFERS;
    } catch {
      return DEFAULT_OFFERS;
    }
  },
  ["public-offers"],
  { tags: [CACHE_TAGS.offers], revalidate: 60 },
);

export async function listOffersAdmin() {
  return prisma.offer.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export async function getOfferById(id: string) {
  return prisma.offer.findUnique({ where: { id } });
}
