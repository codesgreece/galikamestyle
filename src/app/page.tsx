import { getPublicOffers } from "@/services/offers";
import { getPublicContent } from "@/services/content";
import { HomeClient } from "./HomeClient";

export default async function HomePage() {
  const [offers, content] = await Promise.all([
    getPublicOffers(),
    getPublicContent(),
  ]);

  return <HomeClient offers={offers} content={content} />;
}
