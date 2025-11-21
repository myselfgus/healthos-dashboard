import { DurableObject } from 'cloudflare:workers';
import { Env } from '../core-utils';

interface TerminalMessage {
  type: 'command' | 'output' | 'error' | 'welcome';
  data: string;
  timestamp?: number;
}

export class TerminalSession extends DurableObject<Env> {
  private websockets: Set<WebSocket>;
  private commandHistory: string[];
  private currentDirectory: string;

  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    this.websockets = new Set();
    this.commandHistory = [];
    this.currentDirectory = '/';

    // Load history from storage
    this.ctx.blockConcurrencyWhile(async () => {
      const history = await this.ctx.storage.get<string[]>('history');
      if (history) {
        this.commandHistory = history;
      }
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // WebSocket upgrade for real-time terminal
    if (request.headers.get('Upgrade') === 'websocket') {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      await this.handleSession(server);

      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }

    // HTTP API for terminal state
    if (url.pathname.endsWith('/history')) {
      return Response.json({
        success: true,
        data: this.commandHistory,
      });
    }

    if (url.pathname.endsWith('/execute') && request.method === 'POST') {
      try {
        const { command } = await request.json<{ command: string }>();
        const result = await this.executeCommand(command);
        return Response.json({ success: true, data: result });
      } catch (error: any) {
        return Response.json({
          success: false,
          error: error.message,
        }, 400);
      }
    }

    if (url.pathname.endsWith('/clear') && request.method === 'POST') {
      this.commandHistory = [];
      await this.ctx.storage.delete('history');
      return Response.json({ success: true });
    }

    return new Response('Not found', { status: 404 });
  }

  private async handleSession(ws: WebSocket): Promise<void> {
    this.websockets.add(ws);

    ws.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data as string) as TerminalMessage;

        if (data.type === 'command') {
          const result = await this.executeCommand(data.data);
          ws.send(JSON.stringify({
            type: 'output',
            data: result,
            timestamp: Date.now(),
          } as TerminalMessage));
        }
      } catch (error: any) {
        ws.send(JSON.stringify({
          type: 'error',
          data: `Error: ${error.message}`,
          timestamp: Date.now(),
        } as TerminalMessage));
      }
    });

    ws.addEventListener('close', () => {
      this.websockets.delete(ws);
    });

    ws.addEventListener('error', () => {
      this.websockets.delete(ws);
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'welcome',
      data: 'Connected to HealthOS Terminal (WebSocket)',
      timestamp: Date.now(),
    } as TerminalMessage));
  }

  private async executeCommand(command: string): Promise<string> {
    this.commandHistory.push(command);

    // Keep only last 100 commands
    if (this.commandHistory.length > 100) {
      this.commandHistory = this.commandHistory.slice(-100);
    }

    // Store in durable storage
    await this.ctx.storage.put('history', this.commandHistory);

    // Simulate command execution
    const timestamp = new Date().toLocaleTimeString();
    const output = `[${timestamp}] Executed: ${command}`;

    // Broadcast to all connected clients
    this.broadcast({
      type: 'output',
      data: output,
      timestamp: Date.now(),
    });

    return output;
  }

  private broadcast(message: TerminalMessage): void {
    const data = JSON.stringify(message);
    this.websockets.forEach(ws => {
      try {
        ws.send(data);
      } catch (error) {
        this.websockets.delete(ws);
      }
    });
  }

  async alarm(): Promise<void> {
    // Cleanup old history after 24 hours
    const history = await this.ctx.storage.get<string[]>('history') || [];
    if (history.length > 1000) {
      this.commandHistory = history.slice(-500);
      await this.ctx.storage.put('history', this.commandHistory);
    }

    // Schedule next cleanup in 24 hours
    await this.ctx.storage.setAlarm(Date.now() + 24 * 60 * 60 * 1000);
  }
}
