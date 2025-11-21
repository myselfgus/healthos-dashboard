import { DurableObject } from 'cloudflare:workers';
import { Env } from '../core-utils';

interface AgentJob {
  id: string;
  type: 'transcribe' | 'process' | 'asl' | 'dim' | 'gem' | 'anon';
  status: 'pending' | 'running' | 'completed' | 'failed';
  data: any;
  createdAt: number;
  completedAt?: number;
  error?: string;
  result?: any;
}

export class AgentExecutor extends DurableObject<Env> {
  private jobs: Map<string, AgentJob>;
  private activeWebSockets: Set<WebSocket>;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.jobs = new Map();
    this.activeWebSockets = new Set();

    this.ctx.blockConcurrencyWhile(async () => {
      const stored = await this.ctx.storage.get<Record<string, AgentJob>>('jobs');
      if (stored) {
        this.jobs = new Map(Object.entries(stored));
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // WebSocket for real-time updates
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      this.activeWebSockets.add(server);

      server.addEventListener('close', () => {
        this.activeWebSockets.delete(server);
      });

      server.addEventListener('error', () => {
        this.activeWebSockets.delete(server);
      });

      // Send initial job list
      server.send(JSON.stringify({
        type: 'jobs_list',
        data: Array.from(this.jobs.values()),
      }));

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // Submit new job
    if (path.endsWith('/jobs') && request.method === 'POST') {
      try {
        const { type, data } = await request.json<{ type: AgentJob['type'], data: any }>();
        const job = await this.createJob(type, data);
        return Response.json({ success: true, data: job }, 201);
      } catch (error: any) {
        return Response.json({
          success: false,
          error: error.message,
        }, 400);
      }
    }

    // Get job status
    const jobMatch = path.match(/\/jobs\/([^\/]+)$/);
    if (jobMatch && request.method === 'GET') {
      const jobId = jobMatch[1];
      const job = this.jobs.get(jobId);

      if (!job) {
        return Response.json({
          success: false,
          error: 'Job not found',
        }, 404);
      }

      return Response.json({ success: true, data: job });
    }

    // List all jobs
    if (path.endsWith('/jobs') && request.method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const status = url.searchParams.get('status') as AgentJob['status'] | null;

      let jobsList = Array.from(this.jobs.values());

      if (status) {
        jobsList = jobsList.filter(j => j.status === status);
      }

      // Sort by creation date (newest first)
      jobsList.sort((a, b) => b.createdAt - a.createdAt);

      return Response.json({
        success: true,
        data: jobsList.slice(0, limit),
        total: jobsList.length,
      });
    }

    return new Response('Not found', { status: 404 });
  }

  private async createJob(type: AgentJob['type'], data: any): Promise<AgentJob> {
    const job: AgentJob = {
      id: crypto.randomUUID(),
      type,
      status: 'pending',
      data,
      createdAt: Date.now(),
    };

    this.jobs.set(job.id, job);
    await this.saveJobs();

    // Execute job asynchronously
    this.ctx.waitUntil(this.executeJob(job.id));

    return job;
  }

  private async executeJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'running';
    await this.saveJobs();
    this.broadcast({ type: 'job_update', data: job });

    try {
      // Simulate agent execution
      // In production, call Claude API, ElevenLabs, etc.
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      const result = this.simulateAgentResult(job.type);

      job.status = 'completed';
      job.completedAt = Date.now();
      job.result = result;

      await this.saveJobs();
      this.broadcast({ type: 'job_completed', data: job });
    } catch (error: any) {
      job.status = 'failed';
      job.error = error.message;
      job.completedAt = Date.now();

      await this.saveJobs();
      this.broadcast({ type: 'job_failed', data: job });
    }
  }

  private simulateAgentResult(type: AgentJob['type']): any {
    const results: Record<string, any> = {
      transcribe: {
        text: 'Sample transcription output...',
        duration: '2m 34s',
        speakers: 2,
      },
      process: {
        documents: 5,
        processed: 5,
        errors: 0,
      },
      asl: {
        analysis: 'Linguistic analysis complete',
        features: ['feature1', 'feature2'],
      },
      dim: {
        dimensions: 12,
        scores: [0.8, 0.6, 0.9],
      },
      gem: {
        profile: 'Profile generated',
        traits: ['trait1', 'trait2'],
      },
      anon: {
        anonymized: true,
        redacted: 23,
      },
    };

    return results[type] || { message: 'Job completed successfully' };
  }

  private async saveJobs(): Promise<void> {
    const jobsObject = Object.fromEntries(this.jobs);
    await this.ctx.storage.put('jobs', jobsObject);
  }

  private broadcast(message: any): void {
    const data = JSON.stringify(message);
    this.activeWebSockets.forEach(ws => {
      try {
        ws.send(data);
      } catch (error) {
        this.activeWebSockets.delete(ws);
      }
    });
  }

  async alarm(): Promise<void> {
    // Clean up old completed jobs (> 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const jobsToDelete: string[] = [];

    this.jobs.forEach((job, id) => {
      if (job.completedAt && job.completedAt < sevenDaysAgo) {
        jobsToDelete.push(id);
      }
    });

    jobsToDelete.forEach(id => this.jobs.delete(id));

    if (jobsToDelete.length > 0) {
      await this.saveJobs();
    }

    // Schedule next cleanup in 24 hours
    await this.ctx.storage.setAlarm(Date.now() + 24 * 60 * 60 * 1000);
  }
}
