import { sanityClient } from "../sanity";

export interface SanityStore {
  name: string;
  isMain: boolean;
  address: string;
  phone?: string;
  openingHours?: string;
}

const QUERY = `*[_type == "storeLocation"] | order(isMain desc) { name, isMain, address, phone, openingHours }`;

export async function getStoreLocations(): Promise<SanityStore[]> {
  return sanityClient.fetch<SanityStore[]>(QUERY);
}
