import { Hono } from 'hono';
import { Env } from '../core-utils';

const agents = new Hono<{ Bindings: Env }>();

// List available agent types
agents.get('/types', (c) => {
  return c.json({
    success: true,
    data: [
      {
        type: 'transcribe',
        name: 'Audio Transcription',
        description: 'Transcribe audio files using ElevenLabs STT',
        enabled: !!c.env.ELEVENLABS_API_KEY,
      },
      {
        type: 'process',
        name: 'Document Processing',
        description: 'Process patient dossiers and documents',
        enabled: true,
      },
      {
        type: 'asl',
        name: 'ASL Analysis',
        description: 'Linguistic analysis using ASL framework',
        enabled: !!c.env.CLAUDE_API_KEY,
      },
      {
        type: 'dim',
        name: 'Dimensional Analysis',
        description: 'Multi-dimensional psychological analysis',
        enabled: !!c.env.CLAUDE_API_KEY,
      },
      {
        type: 'gem',
        name: 'GEM Profiling',
        description: 'Generate GEM psychological profiles',
        enabled: !!c.env.CLAUDE_API_KEY,
      },
      {
        type: 'anon',
        name: 'Anonymization',
        description: 'Anonymize patient data and documents',
        enabled: true,
      },
    ],
  });
});

// Submit agent job via Durable Object
agents.post('/jobs', async (c) => {
  try {
    const { type, data } = await c.req.json<{ type: string, data: any }>();

    if (!c.env.AGENT_EXECUTOR) {
      return c.json({
        success: false,
        error: 'Agent executor not configured',
      }, 503);
    }

    // Get or create durable object
    const id = c.env.AGENT_EXECUTOR.idFromName('default');
    const stub = c.env.AGENT_EXECUTOR.get(id);

    // Submit job
    const response = await stub.fetch(new Request('http://internal/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    }));

    const result = await response.json<any>();

    return c.json(result, response.status);
  } catch (error: any) {
    console.error('[AGENTS] Job submission error:', error);
    return c.json({
      success: false,
      error: 'Failed to submit job',
    }, 500);
  }
});

// Get job status
agents.get('/jobs/:id', async (c) => {
  const jobId = c.req.param('id');

  try {
    if (!c.env.AGENT_EXECUTOR) {
      return c.json({
        success: false,
        error: 'Agent executor not configured',
      }, 503);
    }

    const id = c.env.AGENT_EXECUTOR.idFromName('default');
    const stub = c.env.AGENT_EXECUTOR.get(id);

    const response = await stub.fetch(new Request(`http://internal/jobs/${jobId}`, {
      method: 'GET',
    }));

    const result = await response.json<any>();

    return c.json(result, response.status);
  } catch (error: any) {
    console.error('[AGENTS] Job status error:', error);
    return c.json({
      success: false,
      error: 'Failed to get job status',
    }, 500);
  }
});

// List all jobs
agents.get('/jobs', async (c) => {
  const { limit = '50', status } = c.req.query();

  try {
    if (!c.env.AGENT_EXECUTOR) {
      return c.json({
        success: false,
        error: 'Agent executor not configured',
      }, 503);
    }

    const id = c.env.AGENT_EXECUTOR.idFromName('default');
    const stub = c.env.AGENT_EXECUTOR.get(id);

    const url = new URL('http://internal/jobs');
    url.searchParams.set('limit', limit);
    if (status) url.searchParams.set('status', status);

    const response = await stub.fetch(new Request(url, {
      method: 'GET',
    }));

    const result = await response.json<any>();

    return c.json(result, response.status);
  } catch (error: any) {
    console.error('[AGENTS] Jobs list error:', error);
    return c.json({
      success: false,
      error: 'Failed to list jobs',
    }, 500);
  }
});

// Get system stats
agents.get('/stats', async (c) => {
  try {
    if (!c.env.AGENT_EXECUTOR) {
      return c.json({
        success: true,
        data: {
          totalJobs: 0,
          pendingJobs: 0,
          runningJobs: 0,
          completedJobs: 0,
          failedJobs: 0,
        },
      });
    }

    const id = c.env.AGENT_EXECUTOR.idFromName('default');
    const stub = c.env.AGENT_EXECUTOR.get(id);

    const response = await stub.fetch(new Request('http://internal/jobs?limit=1000', {
      method: 'GET',
    }));

    const result = await response.json<any>();

    if (!result.success) {
      throw new Error('Failed to fetch jobs');
    }

    const jobs = result.data || [];
    const stats = {
      totalJobs: jobs.length,
      pendingJobs: jobs.filter((j: any) => j.status === 'pending').length,
      runningJobs: jobs.filter((j: any) => j.status === 'running').length,
      completedJobs: jobs.filter((j: any) => j.status === 'completed').length,
      failedJobs: jobs.filter((j: any) => j.status === 'failed').length,
    };

    return c.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    console.error('[AGENTS] Stats error:', error);
    return c.json({
      success: false,
      error: 'Failed to get stats',
    }, 500);
  }
});

export default agents;
