import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';
import { useTheme } from '@/hooks/use-theme';

interface XTerminalProps {
  onCommand?: (command: string) => Promise<string> | string;
  welcomeMessage?: string;
  prompt?: string;
  className?: string;
}

export const XTerminal: React.FC<XTerminalProps> = ({
  onCommand,
  welcomeMessage = 'Welcome to HealthOS Terminal\r\nType "help" for available commands\r\n\r\n',
  prompt = '$ ',
  className = '',
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const currentLineRef = useRef<string>('');
  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const { theme } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Create terminal instance
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: theme === 'dark' ? {
        background: '#0a0a0a',
        foreground: '#f0f0f0',
        cursor: '#f0f0f0',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#bd93f9',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#f8f8f2',
        brightBlack: '#4d4d4d',
        brightRed: '#ff6e6e',
        brightGreen: '#69ff94',
        brightYellow: '#ffffa5',
        brightBlue: '#d6acff',
        brightMagenta: '#ff92df',
        brightCyan: '#a4ffff',
        brightWhite: '#ffffff',
      } : {
        background: '#ffffff',
        foreground: '#24292e',
        cursor: '#24292e',
        selection: 'rgba(0, 0, 0, 0.2)',
        black: '#24292e',
        red: '#d73a49',
        green: '#22863a',
        yellow: '#b08800',
        blue: '#005cc5',
        magenta: '#5a32a3',
        cyan: '#032f62',
        white: '#6a737d',
      },
      cols: 80,
      rows: 24,
      scrollback: 1000,
    });

    // Add addons
    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    // Open terminal
    term.open(terminalRef.current);
    fitAddon.fit();

    // Store refs
    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome message
    term.write(welcomeMessage);
    term.write(prompt);

    setIsReady(true);

    // Handle input
    term.onData((data) => {
      const code = data.charCodeAt(0);

      // Handle special keys
      if (code === 13) {
        // Enter key
        const command = currentLineRef.current.trim();
        term.write('\r\n');

        if (command) {
          historyRef.current.push(command);
          historyIndexRef.current = historyRef.current.length;

          if (onCommand) {
            Promise.resolve(onCommand(command)).then((response) => {
              if (response) {
                term.write(response + '\r\n');
              }
              term.write(prompt);
            }).catch((error) => {
              term.write(`\x1b[31mError: ${error.message}\x1b[0m\r\n`);
              term.write(prompt);
            });
          } else {
            term.write(prompt);
          }
        } else {
          term.write(prompt);
        }

        currentLineRef.current = '';
      } else if (code === 127) {
        // Backspace
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          term.write('\b \b');
        }
      } else if (code === 27) {
        // Arrow keys (ESC sequence)
        const seq = data.substring(1);
        if (seq === '[A') {
          // Up arrow - previous command
          if (historyIndexRef.current > 0) {
            // Clear current line
            term.write('\r' + ' '.repeat(currentLineRef.current.length + prompt.length) + '\r');
            historyIndexRef.current--;
            currentLineRef.current = historyRef.current[historyIndexRef.current];
            term.write(prompt + currentLineRef.current);
          }
        } else if (seq === '[B') {
          // Down arrow - next command
          if (historyIndexRef.current < historyRef.current.length - 1) {
            // Clear current line
            term.write('\r' + ' '.repeat(currentLineRef.current.length + prompt.length) + '\r');
            historyIndexRef.current++;
            currentLineRef.current = historyRef.current[historyIndexRef.current];
            term.write(prompt + currentLineRef.current);
          } else if (historyIndexRef.current === historyRef.current.length - 1) {
            // Clear current line
            term.write('\r' + ' '.repeat(currentLineRef.current.length + prompt.length) + '\r');
            historyIndexRef.current = historyRef.current.length;
            currentLineRef.current = '';
            term.write(prompt);
          }
        }
      } else if (code === 3) {
        // Ctrl+C
        term.write('^C\r\n');
        currentLineRef.current = '';
        term.write(prompt);
      } else if (code === 12) {
        // Ctrl+L - clear screen
        term.clear();
        term.write(prompt + currentLineRef.current);
      } else if (code >= 32 && code <= 126) {
        // Printable characters
        currentLineRef.current += data;
        term.write(data);
      }
    });

    // Handle resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
      xtermRef.current = null;
      fitAddonRef.current = null;
    };
  }, [welcomeMessage, prompt, onCommand, theme]);

  // Expose terminal methods
  useEffect(() => {
    if (isReady && xtermRef.current) {
      // Terminal is ready, can be used by parent components
    }
  }, [isReady]);

  return (
    <div className={`w-full h-full ${className}`}>
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
};

// Hook for terminal API access
export const useTerminal = () => {
  const [terminal, setTerminal] = useState<Terminal | null>(null);

  return {
    terminal,
    setTerminal,
    writeLine: (text: string) => {
      if (terminal) {
        terminal.write(text + '\r\n');
      }
    },
    clear: () => {
      if (terminal) {
        terminal.clear();
      }
    },
  };
};
