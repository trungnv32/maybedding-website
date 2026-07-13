import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  // The site now runs as a live Node.js server (SSR) that queries Sanity on every
  // request, so freshness matters more than the CDN's ~60s cache — go straight
  // to the live API so a publish in Studio is reflected on the very next request.
  useCdn: false,
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: Parameters<typeof builder.image>[0]) {
  return builder.image(source);
}
