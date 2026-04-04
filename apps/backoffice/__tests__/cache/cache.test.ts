import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateCacheKey,
  cachedQuery,
  clearCachePattern,
  clearCacheKey,
  getCacheStats,
} from '@/lib/cache/cache';
import { getRedisClient } from '@/lib/cache/redis';

// Mock Redis client
const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  keys: vi.fn(),
  info: vi.fn(),
};

// Mock getRedisClient
vi.mock('@/lib/cache/redis', () => ({
  getRedisClient: vi.fn(() => mockRedis as any),
}));

describe('Cache Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateCacheKey', () => {
    it('should generate simple cache key without params', () => {
      const key = generateCacheKey('news');
      expect(key).toBe('cache::news');
    });

    it('should generate cache key with params', () => {
      const key = generateCacheKey('news', { page: 1, limit: 10 });
      expect(key).toBe('cache::news:limit=10&page=1');
    });

    it('should sort params alphabetically', () => {
      const key1 = generateCacheKey('news', { z: 1, a: 2 });
      const key2 = generateCacheKey('news', { a: 2, z: 1 });
      expect(key1).toBe(key2);
      expect(key1).toBe('cache::news:a=2&z=1');
    });

    it('should filter out undefined and null values', () => {
      const key = generateCacheKey('news', { page: 1, limit: undefined, foo: null });
      expect(key).toBe('cache::news:page=1');
    });

    it('should sanitize cache keys', () => {
      const key = generateCacheKey('news', { search: 'hello world', sort: 'date:desc' });
      expect(key).toBe('cache::news:search=helloworld&sort=date:desc');
    });

    it('should handle special characters in params', () => {
      const key = generateCacheKey('news', { id: 'test@#$%', name: 'user!@#' });
      expect(key).toBe('cache::news:id=test&name=user');
    });

    it('should handle empty params object', () => {
      const key = generateCacheKey('news', {});
      expect(key).toBe('cache::news');
    });
  });

  describe('cachedQuery', () => {
    it('should return cached data on cache hit', async () => {
      const mockData = { id: 1, title: 'Test News' };
      mockRedis.get.mockResolvedValueOnce(JSON.stringify(mockData));

      const queryFn = vi.fn().mockResolvedValue({ id: 2, title: 'Fresh Data' });
      const result = await cachedQuery('cache:news:test', queryFn);

      expect(result).toEqual(mockData);
      expect(queryFn).not.toHaveBeenCalled();
      expect(mockRedis.get).toHaveBeenCalledWith('cache:news:test');
    });

    it('should execute query on cache miss', async () => {
      const mockData = { id: 1, title: 'Fresh Data' };
      mockRedis.get.mockResolvedValueOnce(null);
      mockRedis.set.mockResolvedValueOnce('OK');

      const queryFn = vi.fn().mockResolvedValue(mockData);
      const result = await cachedQuery('cache:news:test', queryFn);

      expect(result).toEqual(mockData);
      expect(queryFn).toHaveBeenCalledOnce();
      expect(mockRedis.set).toHaveBeenCalledWith(
        'cache:news:test',
        JSON.stringify(mockData),
        'EX',
        300
      );
    });

    it('should use custom TTL', async () => {
      const mockData = { id: 1, title: 'Test' };
      mockRedis.get.mockResolvedValueOnce(null);
      mockRedis.set.mockResolvedValueOnce('OK');

      const queryFn = vi.fn().mockResolvedValue(mockData);
      await cachedQuery('cache:news:test', queryFn, 600);

      expect(mockRedis.set).toHaveBeenCalledWith(
        'cache:news:test',
        JSON.stringify(mockData),
        'EX',
        600
      );
    });

    it('should handle invalid JSON in cache', async () => {
      const mockData = { id: 1, title: 'Fresh Data' };
      mockRedis.get.mockResolvedValueOnce('invalid json');
      mockRedis.set.mockResolvedValueOnce('OK');

      const queryFn = vi.fn().mockResolvedValue(mockData);
      const result = await cachedQuery('cache:news:test', queryFn);

      expect(result).toEqual(mockData);
      expect(queryFn).toHaveBeenCalledOnce();
    });

    it('should fail-open when Redis is unavailable', async () => {
      (getRedisClient as any).mockReturnValueOnce(null);

      const mockData = { id: 1, title: 'Fresh Data' };
      const queryFn = vi.fn().mockResolvedValue(mockData);
      const result = await cachedQuery('cache:news:test', queryFn);

      expect(result).toEqual(mockData);
      expect(queryFn).toHaveBeenCalledOnce();
    });

    it('should fail-open on Redis error', async () => {
      mockRedis.get.mockRejectedValueOnce(new Error('Redis connection error'));

      const mockData = { id: 1, title: 'Fresh Data' };
      const queryFn = vi.fn().mockResolvedValue(mockData);
      const result = await cachedQuery('cache:news:test', queryFn);

      expect(result).toEqual(mockData);
      expect(queryFn).toHaveBeenCalledOnce();
    });

    it('should not fail when cache set fails', async () => {
      const mockData = { id: 1, title: 'Fresh Data' };
      mockRedis.get.mockResolvedValueOnce(null);
      mockRedis.set.mockRejectedValueOnce(new Error('Set failed'));

      const queryFn = vi.fn().mockResolvedValue(mockData);
      const result = await cachedQuery('cache:news:test', queryFn);

      expect(result).toEqual(mockData);
      expect(queryFn).toHaveBeenCalledOnce();
    });
  });

  describe('clearCachePattern', () => {
    it('should clear all keys matching pattern', async () => {
      mockRedis.keys.mockResolvedValueOnce(['cache:news:1', 'cache:news:2', 'cache:news:3']);
      mockRedis.del.mockResolvedValueOnce(3);

      const result = await clearCachePattern('news');

      expect(result).toBe(3);
      expect(mockRedis.keys).toHaveBeenCalledWith('cache:news*');
      expect(mockRedis.del).toHaveBeenCalledWith('cache:news:1', 'cache:news:2', 'cache:news:3');
    });

    it('should return 0 when no keys match', async () => {
      mockRedis.keys.mockResolvedValueOnce([]);

      const result = await clearCachePattern('news');

      expect(result).toBe(0);
      expect(mockRedis.del).not.toHaveBeenCalled();
    });

    it('should return 0 when Redis is unavailable', async () => {
      (getRedisClient as any).mockReturnValueOnce(null);

      const result = await clearCachePattern('news');

      expect(result).toBe(0);
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedis.keys.mockRejectedValueOnce(new Error('Redis error'));

      const result = await clearCachePattern('news');

      expect(result).toBe(0);
    });
  });

  describe('clearCacheKey', () => {
    it('should clear specific cache key', async () => {
      mockRedis.del.mockResolvedValueOnce(1);

      const result = await clearCacheKey('cache:news:123');

      expect(result).toBe(true);
      expect(mockRedis.del).toHaveBeenCalledWith('cache:news:123');
    });

    it('should add prefix if missing', async () => {
      mockRedis.del.mockResolvedValueOnce(1);

      const result = await clearCacheKey('news:123');

      expect(result).toBe(true);
      expect(mockRedis.del).toHaveBeenCalledWith('cache:news:123');
    });

    it('should return false when key not found', async () => {
      mockRedis.del.mockResolvedValueOnce(0);

      const result = await clearCacheKey('cache:news:nonexistent');

      expect(result).toBe(false);
    });

    it('should return false when Redis is unavailable', async () => {
      (getRedisClient as any).mockReturnValueOnce(null);

      const result = await clearCacheKey('cache:news:123');

      expect(result).toBe(false);
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedis.del.mockRejectedValueOnce(new Error('Redis error'));

      const result = await clearCacheKey('cache:news:123');

      expect(result).toBe(false);
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', async () => {
      mockRedis.keys.mockResolvedValueOnce(['cache:news:1', 'cache:news:2']);
      mockRedis.info.mockResolvedValueOnce('used_memory:2097152\r\nredis_version:7.0.0\r\nuptime_in_seconds:3600');

      const stats = await getCacheStats();

      expect(stats).toEqual({
        keyCount: 2,
        memoryUsage: 2,
        connected: true,
      });
    });

    it('should return zero stats when Redis is unavailable', async () => {
      (getRedisClient as any).mockReturnValueOnce(null);

      const stats = await getCacheStats();

      expect(stats).toEqual({
        keyCount: 0,
        memoryUsage: 0,
        connected: false,
      });
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedis.keys.mockRejectedValueOnce(new Error('Redis error'));

      const stats = await getCacheStats();

      expect(stats).toEqual({
        keyCount: 0,
        memoryUsage: 0,
        connected: false,
      });
    });

    it('should handle missing memory info', async () => {
      mockRedis.keys.mockResolvedValueOnce(['cache:news:1']);
      mockRedis.info.mockResolvedValueOnce('no_memory_info_here');

      const stats = await getCacheStats();

      expect(stats).toEqual({
        keyCount: 1,
        memoryUsage: 0,
        connected: true,
      });
    });

    it('should handle empty keys array', async () => {
      mockRedis.keys.mockResolvedValueOnce([]);
      mockRedis.info.mockResolvedValueOnce('used_memory:1048576');

      const stats = await getCacheStats();

      expect(stats).toEqual({
        keyCount: 0,
        memoryUsage: 1,
        connected: true,
      });
    });
  });
});
