const BACKOFFICE_URL = process.env.NEXT_PUBLIC_BACKOFFICE_URL || 'http://localhost:3001';

// Utility to fetch from the backoffice public APIs
async function fetchFromApi(endpoint: string, options?: RequestInit) {
    try {
        const res = await fetch(`${BACKOFFICE_URL}${endpoint}`, {
            ...options,
            // Add sensible cache defaults if needed, Next.js handles this well in App Router
            next: { revalidate: 60, ...options?.next },
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            console.error(`API Error ${res.status}: ${endpoint}`);
            return null;
        }

        return res.json();
    } catch (error) {
        console.error(`Fetch Error: ${endpoint}`, error);
        return null;
    }
}

export async function getTourismDestinations(options?: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
    featured?: boolean;
    search?: string;
}) {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', options.page.toString());
    if (options?.pageSize) params.set('pageSize', options.pageSize.toString());
    if (options?.categoryId) params.set('categoryId', options.categoryId);
    if (options?.featured !== undefined) params.set('featured', options.featured.toString());
    if (options?.search) params.set('search', options.search);

    const queryString = params.toString();
    const endpoint = `/api/public/tourism${queryString ? `?${queryString}` : ''}`;

    return fetchFromApi(endpoint, { next: { tags: ['tourism'] } });
}

export async function getTourismCategories() {
    return fetchFromApi('/api/public/tourism-categories', { next: { tags: ['tourism-categories'] } });
}

export async function getTourismDestinationBySlug(slug: string) {
    return fetchFromApi(`/api/public/tourism/${slug}`, { next: { tags: ['tourism', `tourism-${slug}`] } });
}
