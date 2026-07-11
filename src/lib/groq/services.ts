import { sanityClient } from "../sanity";

export interface SanityService {
  icon: string;
  title: string;
  description: string;
}

const QUERY = `*[_type == "service"] | order(order asc) { icon, title, description }`;

export async function getServices(): Promise<SanityService[]> {
  return sanityClient.fetch<SanityService[]>(QUERY);
}
