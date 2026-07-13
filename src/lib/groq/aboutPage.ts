import { sanityClient, urlFor } from "../sanity";

export interface SanityAboutPage {
  heading?: string;
  quote?: string;
  shortIntro?: string;
  body: any[];
  image1?: string;
  image1Alt?: string;
  image2?: string;
  image2Alt?: string;
}

// defined(imageN.asset) guards: skip an image field rather than let urlFor() throw
// and fail the whole build if an editor hasn't uploaded it yet.
const QUERY = `*[_type == "aboutPage"][0]{
  heading, quote, shortIntro, body,
  "image1": image1{...,"hasAsset": defined(asset)},
  "image2": image2{...,"hasAsset": defined(asset)}
}`;

export async function getAboutPage(): Promise<SanityAboutPage | null> {
  const raw = await sanityClient.fetch<{
    heading?: string;
    quote?: string;
    shortIntro?: string;
    body?: any[];
    image1?: { hasAsset: boolean; alt?: string } | null;
    image2?: { hasAsset: boolean; alt?: string } | null;
  } | null>(QUERY);

  if (!raw) return null;

  return {
    heading: raw.heading,
    quote: raw.quote,
    shortIntro: raw.shortIntro,
    body: raw.body ?? [],
    image1: raw.image1?.hasAsset ? urlFor(raw.image1).width(1280).height(720).url() : undefined,
    image1Alt: raw.image1?.alt,
    image2: raw.image2?.hasAsset ? urlFor(raw.image2).width(1280).height(720).url() : undefined,
    image2Alt: raw.image2?.alt,
  };
}
