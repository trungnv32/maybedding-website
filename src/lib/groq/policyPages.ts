import { sanityClient } from "../sanity";

export interface SanityPolicyPageSummary {
  slug: string;
  title: string;
}

export interface SanityPolicyPage extends SanityPolicyPageSummary {
  body: any[];
  updatedAt?: string;
}

const LIST_QUERY = `*[_type == "policyPage"] | order(title asc) { "slug": slug.current, title }`;
const SLUGS_QUERY = `*[_type == "policyPage"].slug.current`;
const DETAIL_QUERY = `*[_type == "policyPage" && slug.current == $slug][0] {
  "slug": slug.current, title, body, updatedAt
}`;

export async function getPolicyPages(): Promise<SanityPolicyPageSummary[]> {
  return sanityClient.fetch<SanityPolicyPageSummary[]>(LIST_QUERY);
}

export async function getPolicyPageSlugs(): Promise<string[]> {
  return sanityClient.fetch<string[]>(SLUGS_QUERY);
}

export async function getPolicyPageBySlug(slug: string): Promise<SanityPolicyPage | null> {
  return sanityClient.fetch<SanityPolicyPage | null>(DETAIL_QUERY, { slug });
}
