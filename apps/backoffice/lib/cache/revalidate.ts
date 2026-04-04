import { clearCachePattern, clearCacheKey } from './cache';

/**
 * Landing page URL for revalidation endpoint
 */
const LANDING_URL = process.env.LANDING_URL || 'http://localhost:3000';

/**
 * Revalidate a specific path on the landing page
 * @param path - Path to revalidate (e.g., '/informasi-publik/berita')
 * @returns Promise indicating success
 */
export async function revalidatePath(path: string): Promise<boolean> {
  try {
    const response = await fetch(`${LANDING_URL}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });

    if (!response.ok) {
      console.error(`[Revalidate] Failed to revalidate ${path}: ${response.statusText}`);
      return false;
    }

    console.log(`[Revalidate] Successfully revalidated: ${path}`);
    return true;
  } catch (error) {
    console.error(`[Revalidate] Error revalidating ${path}:`, error);
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

  // Revalidate news pages
  await revalidatePath('/informasi-publik/berita');
  await revalidatePath('/informasi-publik/berita/[slug]');

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

  // Revalidate tourism pages
  await revalidatePath('/informasi-publik/pariwisata');
  await revalidatePath('/informasi-publik/pariwisata/[slug]');

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

  // Revalidate events pages
  await revalidatePath('/informasi-publik/agenda');
  await revalidatePath('/informasi-publik/agenda/[slug]');

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

  // Revalidate services pages
  await revalidatePath('/layanan');
  await revalidatePath('/layanan/[slug]');

  console.log('[Revalidate] Services cache invalidated');
}

/**
 * Invalidate all cache and revalidate all major paths
 * @returns Promise with count of cleared keys
 */
export async function invalidateAllCache(): Promise<number> {
  console.log('[Revalidate] Invalidating all cache...');

  // Clear all cache entries
  const count = await clearCachePattern('*');

  // Revalidate all major paths in parallel
  await Promise.all([
    revalidatePath('/'),
    revalidatePath('/informasi-publik/berita'),
    revalidatePath('/informasi-publik/berita/[slug]'),
    revalidatePath('/informasi-publik/pariwisata'),
    revalidatePath('/informasi-publik/pariwisata/[slug]'),
    revalidatePath('/informasi-publik/agenda'),
    revalidatePath('/informasi-publik/agenda/[slug]'),
    revalidatePath('/layanan'),
    revalidatePath('/layanan/[slug]'),
  ]);

  console.log(`[Revalidate] All cache invalidated (${count} keys cleared)`);
  return count;
}
