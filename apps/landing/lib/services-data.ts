/**
 * Services Data Module
 *
 * Fetches services and categories from the Backoffice API.
 * Provides cached data access with cache invalidation support.
 *
 * Environment variables required:
 * - BACKOFFICE_API_URL: URL of the backoffice API (default: http://localhost:3001)
 */

// Types for service data structure (matching the API response)
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  slug: string;
  showInMenu: boolean;
  order: number;
  serviceCount?: number;
}

export interface ContactInfo {
  office: string;
  phone: string;
  email: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface DownloadForm {
  type: 'file' | 'url';
  name: string;
  value: string;
  fileId?: string;
}

export interface Service {
  id: string;
  slug: string;
  icon: string;
  name: string;
  description: string;
  detailedDescription?: string | null;
  categoryId: string;
  badge?: string | null;
  stats?: string | null;
  showInMenu?: boolean;
  order?: number;
  isIntegrated?: boolean;
  requirements?: string[] | null;
  process?: string[] | null;
  duration?: string | null;
  cost?: string | null;
  contactInfo?: ContactInfo | null;
  downloadForms?: DownloadForm[] | null;
  relatedServices?: string[] | null;
  faqs?: FAQ[] | null;
  status: string;
  category: ServiceCategory;
}

export interface ServiceWithCategory extends Service {
  category: ServiceCategory;
}

export interface ServicesResponse {
  services: Service[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoriesResponse {
  categories: ServiceCategory[];
}

// Get the backoffice API URL from environment variable
const BACKOFFICE_API_URL = process.env.BACKOFFICE_API_URL || 'http://localhost:3001';

// Cache duration in seconds (30 seconds - for near realtime updates)
const CACHE_DURATION = 30;

// In-memory cache for development (use Next.js cache with revalidation in production)
const cache = new Map<string, { data: unknown; expires: number }>();

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    expires: Date.now() + CACHE_DURATION * 1000,
  });
}

function clearCache(pattern?: string): void {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.startsWith(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

/**
 * Fetch with error handling and caching
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
  cacheKey?: string
): Promise<T> {
  const url = `${BACKOFFICE_API_URL}/api/public${endpoint}`;

  // Check cache if cacheKey provided
  if (cacheKey) {
    const cached = getFromCache<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Don't cache on the fetch level - we handle it ourselves
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the response if cacheKey provided
    if (cacheKey) {
      setCache(cacheKey, data);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

/**
 * Fetch all service categories from the API
 */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const response = await fetchAPI<CategoriesResponse>('/services/categories', undefined, 'categories');
    return response.categories.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error loading service categories:', error);
    return [];
  }
}

/**
 * Fetch only visible service categories (showInMenu: true)
 * This is used for mega menu display
 */
export async function getVisibleServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const categories = await getServiceCategories();
    return categories
      .filter(cat => cat.showInMenu)
      .sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error loading visible service categories:', error);
    return [];
  }
}

/**
 * Fetch visible service categories with their services
 * This is used for mega menu display
 */
export async function getVisibleServicesGroupedByCategory(): Promise<Array<ServiceCategory & { services: Service[] }>> {
  try {
    const categories = await getVisibleServiceCategories();
    const categoriesWithServices = await Promise.all(
      categories.map(async (category) => {
        const services = await getServicesByCategory(category.id);
        // Filter services that should be shown in menu
        const visibleServices = services
          .filter(service => service.showInMenu !== false)
          .sort((a, b) => (a.order || 999) - (b.order || 999));

        return {
          ...category,
          services: visibleServices
        };
      })
    );
    return categoriesWithServices;
  } catch (error) {
    console.error('Error loading visible services grouped by category:', error);
    return [];
  }
}

/**
 * Fetch services for a specific category by ID
 */
export async function getServicesByCategory(categoryId: string): Promise<Service[]> {
  try {
    const response = await fetchAPI<ServicesResponse>(
      `/services?categoryId=${categoryId}&showInMenu=true&sortBy=order&sortOrder=asc`,
      undefined,
      `services-category-${categoryId}`
    );
    return response.services.sort((a, b) => (a.order || 999) - (b.order || 999));
  } catch (error) {
    console.error(`Error loading services for category ${categoryId}:`, error);
    return [];
  }
}

/**
 * Fetch all published services across all categories with their category information
 */
export async function getAllServices(): Promise<ServiceWithCategory[]> {
  try {
    const response = await fetchAPI<ServicesResponse>(
      '/services?sortBy=order&sortOrder=asc',
      undefined,
      'all-services'
    );
    return response.services as ServiceWithCategory[];
  } catch (error) {
    console.error('Error loading all services:', error);
    return [];
  }
}

/**
 * Get service categories with their services (all categories)
 */
export async function getServicesGroupedByCategory(): Promise<Array<ServiceCategory & { services: Service[] }>> {
  try {
    const categories = await getServiceCategories();
    const categoriesWithServices = await Promise.all(
      categories.map(async (category) => {
        const services = await getServicesByCategory(category.id);
        return {
          ...category,
          services
        };
      })
    );
    return categoriesWithServices;
  } catch (error) {
    console.error('Error loading services grouped by category:', error);
    return [];
  }
}

/**
 * Get a single service by slug
 */
export async function getServiceBySlug(slug: string): Promise<ServiceWithCategory | null> {
  try {
    const response = await fetchAPI<{ service: ServiceWithCategory }>(
      `/services/${slug}`,
      undefined,
      `service-${slug}`
    );
    return response.service;
  } catch (error) {
    console.error(`Error loading service ${slug}:`, error);
    return null;
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
  try {
    const categories = await getServiceCategories();
    return categories.find(category => category.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading category ${slug}:`, error);
    return null;
  }
}

/**
 * Get integrated services (isIntegrated: true)
 */
export async function getIntegratedServices(): Promise<ServiceWithCategory[]> {
  try {
    const response = await fetchAPI<ServicesResponse>(
      '/services?sortBy=order&sortOrder=asc',
      undefined,
      'integrated-services'
    );
    return response.services.filter(service => service.isIntegrated === true) as ServiceWithCategory[];
  } catch (error) {
    console.error('Error loading integrated services:', error);
    return [];
  }
}

/**
 * Get non-integrated services (isIntegrated: false)
 */
export async function getNonIntegratedServices(): Promise<ServiceWithCategory[]> {
  try {
    const response = await fetchAPI<ServicesResponse>(
      '/services?sortBy=order&sortOrder=asc',
      undefined,
      'non-integrated-services'
    );
    return response.services.filter(service => service.isIntegrated === false) as ServiceWithCategory[];
  } catch (error) {
    console.error('Error loading non-integrated services:', error);
    return [];
  }
}

/**
 * Clear the services cache
 * Call this after receiving a revalidation webhook from backoffice
 */
export async function clearServicesCache(): Promise<void> {
  clearCache('categories');
  clearCache('all-services');
  clearCache('integrated-services');
  clearCache('non-integrated-services');
  clearCache('service-');
  clearCache('services-category-');
}

/**
 * Revalidate all service-related pages
 * Call this from the revalidate API route
 */
export async function revalidateServicesPaths(): Promise<void> {
  // This will trigger Next.js to revalidate all service pages
  // The actual revalidation happens in the API route
  clearServicesCache();
}
