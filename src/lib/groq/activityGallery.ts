import { sanityClient, urlFor } from "../sanity";

export interface SanityActivityImage {
  url: string;
  alt: string;
  caption?: string;
}

// defined(asset) guards: skip an image slot rather than let urlFor() throw and
// fail the whole page if an editor added a slot without uploading a file yet.
const QUERY = `*[_type == "activityGallery"][0]{
  caption,
  "images": images[]{ ..., "hasAsset": defined(asset) }
}`;

export async function getActivityGalleryImages(): Promise<SanityActivityImage[]> {
  const raw = await sanityClient.fetch<{ caption?: string; images?: ({ hasAsset: boolean } | null)[] } | null>(QUERY);
  if (!raw?.images?.length) return [];

  const caption = raw.caption?.trim() || undefined;
  return raw.images
    .filter((img): img is { hasAsset: boolean } => !!img?.hasAsset)
    .map((img) => ({
      url: urlFor(img).width(1600).height(1200).url(),
      alt: caption || "Hoạt động maybedding",
      caption,
    }));
}
