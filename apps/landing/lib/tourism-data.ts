import { headers } from "next/headers";

async function getOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  return host ? `${proto}://${host}` : "http://127.0.0.1:3900";
}

async function apiUrl(path: string) {
  return new URL(path, await getOrigin()).toString();
}

async function fetchFromApi(endpoint: string, options?: RequestInit) {
  try {
    const res = await fetch(await apiUrl(`/api/proxy/public${endpoint}`), {
      ...options,
      next: { revalidate: 60, ...((options as any)?.next || {}) },
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Fetch Error: ${endpoint}`, error);
    return null;
  }
}

export async function getTourismDestinations(options?: { page?: number; pageSize?: number; categoryId?: string; featured?: boolean; search?: string; }) {
  const params = new URLSearchParams();
  if (options?.page) params.set('page', options.page.toString());
  if (options?.pageSize) params.set('pageSize', options.pageSize.toString());
  if (options?.categoryId) params.set('categoryId', options.categoryId);
  if (options?.featured !== undefined) params.set('featured', options.featured.toString());
  if (options?.search) params.set('search', options.search);
  const endpoint = `/api/public/tourism${params.toString() ? `?${params.toString()}` : ''}`;
  return fetchFromApi(endpoint, { next: { tags: ['tourism'] } });
}

export async function getTourismCategories() { return fetchFromApi('/api/public/tourism-categories', { next: { tags: ['tourism-categories'] } }); }
export async function getTourismDestinationBySlug(slug: string) { return fetchFromApi(`/api/public/tourism/${slug}`, { next: { tags: ['tourism', `tourism-${slug}`] } }); }
