const BACKOFFICE_API_URL = process.env.BACKOFFICE_API_URL || "http://localhost:3001";

export interface NewsArticle {
  id: string; slug: string; title: string; excerpt: string; content?: string; category: string; categorySlug?: string; categoryColor?: string; date: string; image: string | null; author: string | null; readTime: string | null; featured: boolean; tags: string[];
}

async function fetchNews(path: string): Promise<any[]> {
  try {
    const res = await fetch(`${BACKOFFICE_API_URL}/api/public${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error("Error loading news articles:", error);
    return [];
  }
}

export async function getAllNews(): Promise<NewsArticle[]> { return fetchNews("/news"); }
export async function getFeaturedNews(): Promise<NewsArticle[]> { return fetchNews("/news?featured=true"); }
export async function getRecentNews(limit: number = 6): Promise<NewsArticle[]> { return fetchNews(`/news?limit=${limit}`); }
export async function getNewsByCategory(category: string): Promise<NewsArticle[]> { return fetchNews(`/news?category=${category}`); }
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try { const res = await fetch(`${BACKOFFICE_API_URL}/api/public/news/${slug}`, { next: { revalidate: 3600 } }); if (!res.ok) return null; return await res.json(); } catch { return null; }
}
export async function getNewsCategories(): Promise<string[]> { return []; }
export async function getNewsCategoriesWithDetails(): Promise<Array<{ id: string; name: string; slug: string; color: string; order: number }>> { return []; }
