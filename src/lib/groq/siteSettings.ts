import { sanityClient } from "../sanity";

export interface SanitySiteSettings {
  siteName?: string;
  tagline?: string;
  hotline?: string;
  zaloNumber?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    tiktok?: string;
    youtube?: string;
    zalo?: string;
  };
  footerBlurb?: string;
}

const QUERY = `*[_type == "siteSettings"][0]`;

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return sanityClient.fetch<SanitySiteSettings | null>(QUERY);
}
