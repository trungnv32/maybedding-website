import { sanityClient, urlFor } from "../sanity";

export interface SanityHomepage {
  heroHeadline?: string;
  heroSubtext?: string;
  heroImage?: string;
  heroImageAlt?: string;
}

// defined(heroImage.asset) guard: skip the image field entirely if not uploaded yet,
// rather than throwing inside urlFor() and failing the whole build.
const QUERY = `*[_type == "homepage"][0]{
  heroHeadline, heroSubtext, "heroImage": heroImage{...,"hasAsset": defined(asset)}
}`;

export async function getHomepage(): Promise<SanityHomepage | null> {
  const raw = await sanityClient.fetch<{
    heroHeadline?: string;
    heroSubtext?: string;
    heroImage?: { hasAsset: boolean; alt?: string } | null;
  } | null>(QUERY);

  if (!raw) return null;

  return {
    heroHeadline: raw.heroHeadline,
    heroSubtext: raw.heroSubtext,
    heroImage: raw.heroImage?.hasAsset ? urlFor(raw.heroImage).width(1600).url() : undefined,
    heroImageAlt: raw.heroImage?.alt,
  };
}
