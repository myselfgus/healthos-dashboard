import { createMiddleware } from 'hono/factory';
import { Env } from '../core-utils';

export const cacheMiddleware = (ttl: number = 300) => {
  return createMiddleware<{ Bindings: Env }>(async (c, next) => {
    // Only cache GET requests
    if (c.req.method !== 'GET') {
      await next();
      return;
    }

    if (!c.env.CACHE) {
      await next();
      return;
    }

    const cacheKey = `cache:${c.req.url}`;

    // Try to get from cache
    try {
      const cached = await c.env.CACHE.get(cacheKey, 'json');
      if (cached) {
        c.header('X-Cache', 'HIT');
        return c.json(cached);
      }
    } catch (error) {
      console.error('[CACHE] Read error:', error);
    }

    // Execute request
    await next();

    // Cache successful responses
    if (c.res.status === 200) {
      try {
        const body = await c.res.clone().json();
        await c.env.CACHE.put(cacheKey, JSON.stringify(body), {
          expirationTtl: ttl,
        });
        c.header('X-Cache', 'MISS');
      } catch (error) {
        console.error('[CACHE] Write error:', error);
      }
    }
  });
};
