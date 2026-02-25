import fs from 'fs';
import path from 'path';

// Types for news data structure
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  author: string;
  readTime: string;
  featured: boolean;
  tags: string[];
}

// Path to news data directory
const NEWS_DATA_PATH = path.join(process.cwd(), 'data', 'news');

/**
 * Fetch all news articles
 */
export async function getAllNews(): Promise<NewsArticle[]> {
  try {
    const articlesPath = path.join(NEWS_DATA_PATH, 'articles.json');
    const fileContents = fs.readFileSync(articlesPath, 'utf8');
    const articles: NewsArticle[] = JSON.parse(fileContents);

    // Sort by date (newest first)
    return articles.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error loading news articles:', error);
    return [];
  }
}

/**
 * Fetch featured news articles
 */
export async function getFeaturedNews(): Promise<NewsArticle[]> {
  try {
    const allNews = await getAllNews();
    return allNews.filter(article => article.featured);
  } catch (error) {
    console.error('Error loading featured news:', error);
    return [];
  }
}

/**
 * Fetch recent news articles (limit)
 */
export async function getRecentNews(limit: number = 6): Promise<NewsArticle[]> {
  try {
    const allNews = await getAllNews();
    return allNews.slice(0, limit);
  } catch (error) {
    console.error('Error loading recent news:', error);
    return [];
  }
}

/**
 * Fetch news by category
 */
export async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const allNews = await getAllNews();
    return allNews.filter(article =>
      article.category.toLowerCase() === category.toLowerCase()
    );
  } catch (error) {
    console.error(`Error loading news for category ${category}:`, error);
    return [];
  }
}

/**
 * Fetch a single news article by slug
 */
export async function getNewsBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const allNews = await getAllNews();
    return allNews.find(article => article.slug === slug) || null;
  } catch (error) {
    console.error(`Error loading news article ${slug}:`, error);
    return null;
  }
}

/**
 * Get all unique news categories
 */
export async function getNewsCategories(): Promise<string[]> {
  try {
    const allNews = await getAllNews();
    const categories = new Set(allNews.map(article => article.category));
    return Array.from(categories).sort();
  } catch (error) {
    console.error('Error loading news categories:', error);
    return [];
  }
}
