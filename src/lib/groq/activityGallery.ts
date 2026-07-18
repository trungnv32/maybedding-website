import { sanityClient, urlFor } from "../sanity";

export interface SanityActivityImage {
  url: string;
  alt: string;
}

// defined(asset) guards: skip an image slot rather than let urlFor() throw and
// fail the whole page if an editor added a slot without uploading a file yet.
const QUERY = `*[_type == "activityGallery"][0]{
  "images": images[]{ ..., "hasAsset": defined(asset) }
}`;

export async function getActivityGalleryImages(): Promise<SanityActivityImage[]> {
  const raw = await sanityClient.fetch<{ images?: ({ hasAsset: boolean; alt?: string } | null)[] } | null>(QUERY);
  if (!raw?.images?.length) return [];
  return raw.images
    .filter((img): img is { hasAsset: boolean; alt?: string } => !!img?.hasAsset)
    .map((img) => ({
      url: urlFor(img).width(1200).height(900).url(),
      alt: img.alt ?? "Hoạt động maybedding",
    }));
}
