import { clearCachePattern, clearCacheKey } from './cache';

/**
 * Landing page URL for revalidation endpoint
 */
const LANDING_URL = process.env.LANDING_URL || 'http://localhost:3000';

/**
 * Revalidate cache by tag on the landing page
 * @param tag - Tag to revalidate (e.g., 'news', 'events', 'services', 'all')
 * @returns Promise indicating success
 */
export async function revalidatePath(tag: string): Promise<boolean> {
  try {
    const secret = process.env.REVALIDATE_SECRET || 'dev-secret-change-in-production';

    const response = await fetch(`${LANDING_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': secret,
      },
      body: JSON.stringify({ tag }),
    });

    if (response.ok) {
      console.log(`[Revalidate] Success for tag: ${tag}`);
      return true;
    } else {
      console.error(`[Revalidate] Failed for tag ${tag}: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error(`[Revalidate] Error for tag ${tag}:`, error);
    return false;
  }
}

/**
 * Invalidate news cache and revalidate news pages
 * @param newsId - Optional specific news ID to invalidate
 */
export async function invalidateNewsCache(newsId?: string): Promise<void> {
  console.log('[Revalidate] Invalidating news cache...');

  // Clear all news cache
  await clearCachePattern('news:*');

  // Clear specific news item if provided
  if (newsId) {
    await clearCacheKey(`news:${newsId}`);
  }

  // Revalidate news pages using tag-based revalidation
  await revalidatePath('news');

  console.log('[Revalidate] News cache invalidated');
}

/**
 * Invalidate tourism cache and revalidate tourism pages
 */
export async function invalidateTourismCache(): Promise<void> {
  console.log('[Revalidate] Invalidating tourism cache...');

  // Clear tourism and tourism categories cache
  await clearCachePattern('tourism:*');
  await clearCachePattern('tourism-categories:*');

  // Revalidate tourism pages using tag-based revalidation
  // Note: Using 'news' tag as tourism is part of news/information
  await revalidatePath('news');

  console.log('[Revalidate] Tourism cache invalidated');
}

/**
 * Invalidate events cache and revalidate events pages
 */
export async function invalidateEventsCache(): Promise<void> {
  console.log('[Revalidate] Invalidating events cache...');

  // Clear events and event categories cache
  await clearCachePattern('events:*');
  await clearCachePattern('event-categories:*');

  // Revalidate events pages using tag-based revalidation
  await revalidatePath('events');

  console.log('[Revalidate] Events cache invalidated');
}

/**
 * Invalidate services cache and revalidate services pages
 */
export async function invalidateServicesCache(): Promise<void> {
  console.log('[Revalidate] Invalidating services cache...');

  // Clear services and service categories cache
  await clearCachePattern('services:*');
  await clearCachePattern('service-categories:*');

  // Revalidate services pages using tag-based revalidation
  await revalidatePath('services');

  console.log('[Revalidate] Services cache invalidated');
}

/**
 * Invalidate all cache and revalidate all major tags
 * @returns Promise with count of cleared keys
 */
export async function invalidateAllCache(): Promise<number> {
  console.log('[Revalidate] Invalidating all cache...');

  // Clear all cache entries
  const count = await clearCachePattern('*');

  // Revalidate all major tags in parallel
  await Promise.all([
    revalidatePath('all'),
  ]);

  console.log(`[Revalidate] All cache invalidated (${count} keys cleared)`);
  return count;
}
