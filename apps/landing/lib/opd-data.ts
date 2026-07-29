import { headers } from "next/headers";

export interface PublicOpd {
  id: string;
  slug: string;
  name: string;
  nickname: string;
  category: string;
  address: string | null;
  logo: { cdnUrl: string } | null;
  description?: string;
  contactInfo?: { phone?: string; email?: string; website?: string; } | null;
  operatingHours?: string | null;
  location?: { lat?: number; lng?: number; } | null;
  socialMedia?: { facebook?: string; twitter?: string; instagram?: string; youtube?: string; } | null;
}

export interface PublicOpdDetail extends PublicOpd {
  servicesAsOwner: Array<{ id: string; slug: string; name: string; description: string; icon: string; category: { name: string; slug: string; }; }>;
  serviceRelatedOpds: Array<{ service: { id: string; slug: string; name: string; description: string; icon: string; category: { name: string; slug: string; }; }; }>;
}

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return host ? `${proto}://${host}` : "http://127.0.0.1:3900";
}

async function apiUrl(path: string) { return new URL(path, await getOrigin()).toString(); }

async function fetchFromBackoffice<T>(endpoint: string): Promise<T | null> {
  try {
    const res = await fetch(await apiUrl(`/api/proxy/public${endpoint}`), { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Error loading OPD endpoint ${endpoint}:`, error);
    return null;
  }
}

export async function getPublicOpdList(params?: { category?: string; search?: string; page?: number; pageSize?: number; }) {
  const query = new URLSearchParams();
  if (params?.category) query.set("category", params.category);
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.pageSize) query.set("pageSize", String(params.pageSize));
  const endpoint = `/api/public/opd${query.toString() ? `?${query.toString()}` : ""}`;
  return fetchFromBackoffice<{ items: PublicOpd[]; total: number; page: number; pageSize: number; totalPages: number }>(endpoint);
}

export async function getPublicOpdBySlug(slug: string) { return fetchFromBackoffice<PublicOpdDetail>(`/api/public/opd/${slug}`); }
