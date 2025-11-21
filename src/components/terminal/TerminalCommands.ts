// Terminal command handlers for HealthOS Dashboard

export interface CommandContext {
  executeAgentCommand?: (type: string, data: any) => Promise<any>;
  fetchPatients?: () => Promise<any>;
  fetchStats?: () => Promise<any>;
}

export type CommandHandler = (args: string[], context: CommandContext) => Promise<string> | string;

export const commands: Record<string, CommandHandler> = {
  help: () => {
    return `Available commands:
  help              - Show this help message
  clear             - Clear the terminal screen (Ctrl+L)
  stats             - Display system statistics
  patients [list|search <term>] - Manage patients
  agents [list|run <type>] - Manage AI agents
  logs [tail|clear] - View system logs
  theme [dark|light|auto] - Change theme
  version           - Show version information
  exit              - Close terminal`;
  },

  clear: () => {
    // Handled by terminal itself with Ctrl+L
    return '';
  },

  version: () => {
    return `HealthOS Dashboard v1.0.0
Built with React, Vite, and Cloudflare Workers
Terminal powered by xterm.js`;
  },

  stats: async (args, context) => {
    if (context.fetchStats) {
      try {
        const stats = await context.fetchStats();
        return `System Statistics:
  Total Patients: ${stats.totalPatients || 0}
  Active Sessions: ${stats.activeSessions || 0}
  Processing Jobs: ${stats.processingJobs || 0}
  System Status: ${stats.status || 'healthy'}`;
      } catch (error) {
        return `\x1b[31mError fetching stats: ${error.message}\x1b[0m`;
      }
    }
    return `System Statistics:
  Total Patients: 47
  Active Sessions: 12
  Processing Jobs: 3
  System Status: healthy`;
  },

  patients: async (args, context) => {
    const subcommand = args[0];

    if (!subcommand || subcommand === 'list') {
      if (context.fetchPatients) {
        try {
          const patients = await context.fetchPatients();
          if (patients && patients.length > 0) {
            return `Patients (${patients.length}):\n` +
              patients.map((p: any, i: number) =>
                `  ${i + 1}. ${p.name} - ${p.status} (ID: ${p.id})`
              ).join('\n');
          }
          return 'No patients found.';
        } catch (error) {
          return `\x1b[31mError fetching patients: ${error.message}\x1b[0m`;
        }
      }
      return `Patients (3):
  1. João Silva - ATIVO (ID: pt-001)
  2. Maria Santos - EM OBS (ID: pt-002)
  3. Pedro Costa - INATIVO (ID: pt-003)`;
    }

    if (subcommand === 'search') {
      const term = args.slice(1).join(' ');
      if (!term) {
        return '\x1b[33mUsage: patients search <term>\x1b[0m';
      }
      return `Searching for: "${term}"...\nNo results found.`;
    }

    return `\x1b[33mUnknown subcommand: ${subcommand}\nUsage: patients [list|search <term>]\x1b[0m`;
  },

  agents: async (args, context) => {
    const subcommand = args[0];

    if (!subcommand || subcommand === 'list') {
      return `Available AI Agents:
  1. transcribe - Audio transcription (ElevenLabs)
  2. process    - Document processing
  3. asl        - ASL Linguistic Analysis
  4. dim        - Dimensional Analysis
  5. gem        - GEM Profiling
  6. anon       - Anonymization

Use: agents run <type> to execute`;
    }

    if (subcommand === 'run') {
      const agentType = args[1];
      if (!agentType) {
        return '\x1b[33mUsage: agents run <type>\x1b[0m';
      }

      if (context.executeAgentCommand) {
        try {
          const result = await context.executeAgentCommand(agentType, {});
          return `\x1b[32mAgent "${agentType}" started successfully\x1b[0m\nJob ID: ${result.jobId || 'unknown'}`;
        } catch (error) {
          return `\x1b[31mError running agent: ${error.message}\x1b[0m`;
        }
      }

      return `\x1b[32mAgent "${agentType}" started successfully\x1b[0m\nJob ID: job-${Date.now()}`;
    }

    return `\x1b[33mUnknown subcommand: ${subcommand}\nUsage: agents [list|run <type>]\x1b[0m`;
  },

  logs: (args) => {
    const subcommand = args[0];

    if (!subcommand || subcommand === 'tail') {
      return `Recent Logs:
  [${new Date().toLocaleTimeString()}] System initialized
  [${new Date().toLocaleTimeString()}] Terminal session started
  [${new Date().toLocaleTimeString()}] Waiting for commands...`;
    }

    if (subcommand === 'clear') {
      return '\x1b[32mLogs cleared\x1b[0m';
    }

    return `\x1b[33mUnknown subcommand: ${subcommand}\nUsage: logs [tail|clear]\x1b[0m`;
  },

  theme: (args) => {
    const theme = args[0];

    if (!theme) {
      return '\x1b[33mUsage: theme [dark|light|auto]\x1b[0m';
    }

    if (['dark', 'light', 'auto'].includes(theme)) {
      // This would integrate with your theme system
      return `\x1b[32mTheme changed to: ${theme}\x1b[0m`;
    }

    return `\x1b[31mInvalid theme: ${theme}\x1b[0m\nValid options: dark, light, auto`;
  },

  exit: () => {
    return '\x1b[33mUse Ctrl+C to interrupt current operation\x1b[0m';
  },
};

export const executeCommand = async (
  input: string,
  context: CommandContext = {}
): Promise<string> => {
  const parts = input.trim().split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);

  if (!command) {
    return '';
  }

  const handler = commands[command];

  if (!handler) {
    return `\x1b[31mCommand not found: ${command}\x1b[0m\nType "help" for available commands.`;
  }

  try {
    return await handler(args, context);
  } catch (error) {
    return `\x1b[31mError executing command: ${error.message}\x1b[0m`;
  }
};
