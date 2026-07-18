import { sanityClient } from "../sanity";

export interface SanityPromotion {
  title: string;
  body: any[];
  startDate: string;
  endDate: string;
}

// Only promotions whose date range covers "now" are returned — expired or
// not-yet-started ones are excluded server-side, no history is ever shown.
const ACTIVE_QUERY = `*[_type == "promotion" && startDate <= now() && endDate >= now()] | order(startDate desc) {
  title, body, startDate, endDate
}`;

export async function getActivePromotions(): Promise<SanityPromotion[]> {
  return sanityClient.fetch<SanityPromotion[]>(ACTIVE_QUERY);
}
