const BACKOFFICE_API_URL = process.env.BACKOFFICE_API_URL || "http://localhost:3001";

export interface ServiceCategory { id: string; name: string; icon: string; color: string; bgColor: string; slug: string; showInMenu: boolean; order: number; serviceCount?: number; }
export interface ContactInfo { office: string; phone: string; email: string; }
export interface FAQ { question: string; answer: string; }
export interface DownloadForm { type: "file" | "url"; name: string; value: string; fileId?: string; }
export interface ServiceImageRelation { id: string; type: string; order: number; file: ServiceImage; }
export interface ServiceAgency { id: string; slug: string; name: string; nickname: string; logo?: { cdnUrl?: string | null } | null; }
export interface RelatedOpd { opd: ServiceAgency; }
export interface RelatedAgency { agency: ServiceAgency; }
export interface DownloadAppLink { platform: string; url?: string | null; }
export interface OperatingHoursItem { days: string; hours: string; }
export interface SocialMediaLinks { facebook?: string | null; instagram?: string | null; twitter?: string | null; youtube?: string | null; tiktok?: string | null; linkedin?: string | null; website?: string | null; }
export interface ServiceImage { id: string; cdnUrl?: string | null; serveUrl?: string | null; originalFilename: string; mimeType: string; size: number; }
export interface Service { id: string; slug: string; icon: string; name: string; description: string; detailedDescription?: string | null; categoryId: string; agencyId?: string | null; badge?: string | null; stats?: string | null; showInMenu?: boolean; order?: number; isIntegrated?: boolean; requirements?: string[] | null; process?: string[] | null; duration?: string | null; cost?: string | null; contactInfo?: ContactInfo | null; downloadForms?: DownloadForm[] | null; relatedServices?: Array<string | { id?: string; slug?: string }> | null; faqs?: FAQ[] | null; status: string; images?: ServiceImage[] | null; serviceImages?: ServiceImageRelation[] | null; serviceLink?: string | null; downloadAppLinks?: DownloadAppLink[] | null; operatingHours?: OperatingHoursItem[] | null; socialMedia?: SocialMediaLinks | null; opd?: ServiceAgency | null; relatedOpds?: RelatedOpd[] | null; agency?: ServiceAgency | null; relatedAgencies?: RelatedAgency[] | null; logoImage?: ServiceImage | null; bannerImage?: ServiceImage | null; category: ServiceCategory; }
export interface ServiceWithCategory extends Service { category: ServiceCategory; }
export interface ServicesResponse { services: Service[]; pagination: { page: number; pageSize: number; total: number; totalPages: number; }; }
export interface CategoriesResponse { categories: ServiceCategory[]; }

function normalizeProxyPath(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return `/api/proxy${parsed.pathname}${parsed.search}`.replace('/api/proxy/api/public', '/api/proxy/public');
  } catch {
    if (url.startsWith('/api/public/')) return url.replace('/api/public/', '/api/proxy/public/');
    return url;
  }
}

function normalizeImage(file: ServiceImage | null | undefined): ServiceImage | null {
  if (!file) return null;
  return {
    ...file,
    cdnUrl: normalizeProxyPath(file.cdnUrl),
    serveUrl: normalizeProxyPath(file.serveUrl),
  };
}

function normalizeService(raw: Service): Service {
  const directImages = raw.images?.map((img) => normalizeImage(img)).filter(Boolean) as ServiceImage[] | undefined;
  const relationImages = raw.serviceImages?.map((relation) => normalizeImage(relation.file)).filter(Boolean) as ServiceImage[] | undefined;

  return {
    ...raw,
    images: directImages?.length ? directImages : relationImages?.length ? relationImages : undefined,
    logoImage: normalizeImage(raw.logoImage) ?? undefined,
    bannerImage: normalizeImage(raw.bannerImage) ?? undefined,
    opd: raw.opd ? { ...raw.opd, logo: raw.opd.logo ? { cdnUrl: normalizeProxyPath(raw.opd.logo.cdnUrl) } : raw.opd.logo } : null,
    agency: raw.agency ? { ...raw.agency, logo: raw.agency.logo ? { cdnUrl: normalizeProxyPath(raw.agency.logo.cdnUrl) } : raw.agency.logo } : null,
  };
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BACKOFFICE_API_URL}/api/public${endpoint}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
  return await response.json();
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try { const response = await fetchAPI<CategoriesResponse>('/services/categories'); return response.categories.sort((a, b) => a.order - b.order); } catch { return []; }
}
export async function getVisibleServiceCategories(): Promise<ServiceCategory[]> {
  try { const response = await fetchAPI<CategoriesResponse>('/services/categories?showInMenu=true'); return response.categories.sort((a, b) => a.order - b.order); } catch { return []; }
}
export async function getVisibleServicesGroupedByCategory(): Promise<Array<ServiceCategory & { services: Service[] }>> {
  try { const categories = await getVisibleServiceCategories(); return await Promise.all(categories.map(async (category) => ({ ...category, services: await getServicesByCategory(category.id) }))); } catch { return []; }
}
export async function getServicesGroupedByCategory(): Promise<Array<ServiceCategory & { services: Service[] }>> { return getVisibleServicesGroupedByCategory(); }
export async function getServicesByCategory(categoryId: string): Promise<Service[]> {
  try { const response = await fetchAPI<ServicesResponse>(`/services?categoryId=${categoryId}&showInMenu=true&sortBy=order&sortOrder=asc`); return response.services.map(normalizeService); } catch { return []; }
}
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try { const response = await fetchAPI<Service>(`/services/${slug}`); return normalizeService(response); } catch { return null; }
}
