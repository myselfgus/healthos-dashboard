import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { compress } from 'hono/compress';
import { Env } from './core-utils';

// Import routes
import patientsRoutes from './routes/patients';
import agentsRoutes from './routes/agents';
import { userRoutes } from './userRoutes';

// Import middleware
import { rateLimitMiddleware } from './middleware/auth';

// Import Durable Objects
export { TerminalSession } from './durable-objects/TerminalSession';
export { AgentExecutor } from './durable-objects/AgentExecutor';

export interface ClientErrorReport {
  message: string;
  url: string;
  timestamp: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: boolean;
  errorBoundaryProps?: Record<string, unknown>;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: unknown;
}

const app = new Hono<{ Bindings: Env }>();

// Global middleware
app.use('*', logger());
app.use('*', compress());

// CORS for API routes
app.use('/api/*', cors({
  origin: '*', // In production, whitelist specific origins
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Rate limiting on API routes (optional, comment out for development)
// app.use('/api/*', rateLimitMiddleware);

// Public routes
app.get('/api/health', (c) => c.json({
  success: true,
  data: {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  },
}));

// Client error reporting (public)
app.post('/api/client-errors', async (c) => {
  try {
    const error = await c.req.json<ClientErrorReport>();
    console.error('[CLIENT ERROR]', JSON.stringify({
      timestamp: error.timestamp || new Date().toISOString(),
      message: error.message,
      url: error.url,
      stack: error.stack,
      componentStack: error.componentStack,
      errorBoundary: error.errorBoundary,
    }, null, 2));

    // Optionally store in KV for analysis
    if (c.env.CACHE) {
      await c.env.CACHE.put(
        `error:${Date.now()}:${crypto.randomUUID()}`,
        JSON.stringify(error),
        { expirationTtl: 86400 } // 24 hours
      );
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('[CLIENT ERROR HANDLER] Failed:', error);
    return c.json({ success: false, error: 'Failed to process' }, 500);
  }
});

// Mount route modules
app.route('/api/patients', patientsRoutes);
app.route('/api/agents', agentsRoutes);

// Durable Object routes - Terminal
app.all('/api/terminal/:id/*', async (c) => {
  if (!c.env.TERMINAL_SESSION) {
    return c.json({
      success: false,
      error: 'Terminal not configured',
    }, 503);
  }

  const sessionId = c.req.param('id');
  const id = c.env.TERMINAL_SESSION.idFromName(sessionId);
  const stub = c.env.TERMINAL_SESSION.get(id);

  // Forward the request to the Durable Object
  const url = new URL(c.req.url);
  const doUrl = new URL(url.pathname.replace(`/api/terminal/${sessionId}`, ''), 'http://internal');
  doUrl.search = url.search;

  return stub.fetch(new Request(doUrl, c.req.raw));
});

// Durable Object routes - Agent Executor (already handled in agents routes)

// User routes (from original setup)
userRoutes(app);

// Error handlers
app.notFound((c) => c.json({ success: false, error: 'Not Found' }, 404));

app.onError((err, c) => {
  console.error(`[ERROR] ${err.stack || err.message}`);

  const isDev = c.env.ENVIRONMENT === 'development';

  return c.json({
    success: false,
    error: isDev ? err.message : 'Internal Server Error',
    ...(isDev && { stack: err.stack }),
  }, 500);
});

console.log('HealthOS Worker is running');

// Export handler
export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>;