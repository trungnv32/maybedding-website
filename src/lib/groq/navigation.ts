import { sanityClient } from "../sanity";

export interface SanityMenuItem {
  label: string;
  href: string;
  icon?: string;
}

export interface SanityNavigation {
  headerMenu: SanityMenuItem[];
  footerExploreMenu: SanityMenuItem[];
  footerQuickMenu: SanityMenuItem[];
}

const QUERY = `*[_type == "navigation"][0]{ headerMenu, footerExploreMenu, footerQuickMenu }`;

export async function getNavigation(): Promise<SanityNavigation | null> {
  return sanityClient.fetch<SanityNavigation | null>(QUERY);
}
