import { sanityClient, urlFor } from "../sanity";

export interface SanityActivityImage {
  url: string;
  alt: string;
  caption?: string;
}

// defined(asset) guards: skip an image slot rather than let urlFor() throw and
// fail the whole page if an editor added a slot without uploading a file yet.
const QUERY = `*[_type == "activityGallery"][0]{
  "items": items[]{
    caption,
    "images": images[]{ ..., "hasAsset": defined(asset) }
  }
}`;

type RawItem = {
  caption?: string;
  images?: ({ hasAsset: boolean } | null)[];
};

export async function getActivityGalleryImages(): Promise<SanityActivityImage[]> {
  const raw = await sanityClient.fetch<{ items?: RawItem[] } | null>(QUERY);
  if (!raw?.items?.length) return [];

  const result: SanityActivityImage[] = [];
  for (const item of raw.items) {
    if (!item.images?.length) continue;
    const caption = item.caption?.trim() || undefined;
    for (const img of item.images) {
      if (!img?.hasAsset) continue;
      result.push({
        url: urlFor(img).width(1600).height(1200).url(),
        alt: caption || "Hoạt động maybedding",
        caption,
      });
    }
  }
  return result;
}
