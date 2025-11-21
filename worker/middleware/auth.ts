import { createMiddleware } from 'hono/factory';
import { Env } from '../core-utils';

// Simple authentication middleware
// In production, implement proper JWT verification
export const authMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      error: 'Unauthorized - Missing or invalid token',
    }, 401);
  }

  const token = authHeader.substring(7);

  // For development, accept any non-empty token
  // In production, verify JWT with c.env.JWT_SECRET
  if (!token || token === 'undefined' || token === 'null') {
    return c.json({
      success: false,
      error: 'Unauthorized - Invalid token',
    }, 401);
  }

  // Store user info in context
  c.set('userId', 'user-' + token.substring(0, 8));

  await next();
});

// Rate limiting middleware
export const rateLimitMiddleware = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') || 'unknown';
  const key = `ratelimit:${ip}`;

  if (c.env.CACHE) {
    const count = await c.env.CACHE.get(key);
    const currentCount = count ? parseInt(count) : 0;

    if (currentCount > 100) {
      // 100 requests per minute
      return c.json({
        success: false,
        error: 'Rate limit exceeded',
      }, 429);
    }

    await c.env.CACHE.put(key, (currentCount + 1).toString(), {
      expirationTtl: 60,
    });
  }

  await next();
});

// HIPAA compliance logging
export const hipaaLogger = createMiddleware<{ Bindings: Env }>(async (c, next) => {
  const startTime = Date.now();
  const userId = c.get('userId') || 'anonymous';
  const path = c.req.path;
  const method = c.req.method;

  await next();

  const duration = Date.now() - startTime;

  // Log PHI access
  if (path.includes('/patients/') || path.includes('/files/')) {
    console.log(`[HIPAA] ${method} ${path} - User: ${userId} - Duration: ${duration}ms`);

    if (c.env.ANALYTICS) {
      c.env.ANALYTICS.writeDataPoint({
        blobs: [method, path, userId],
        doubles: [duration],
        indexes: [userId],
      });
    }
  }
});
