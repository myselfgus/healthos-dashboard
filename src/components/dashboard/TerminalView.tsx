import React, { useEffect, useRef } from 'react';
export const TerminalView = ({ logs }: { logs: string[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);
  return (
    <div className="bg-muted/50 rounded-lg border p-4 font-mono text-xs h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-2 pb-2 border-b text-muted-foreground uppercase tracking-wider text-[10px]">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
        </div>
        <span>System Output</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scroll space-y-1 pr-2">
        {logs.length === 0 && (
          <div className="text-muted-foreground italic text-center mt-10 opacity-50">
            Aguardando comandos...
          </div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="text-foreground/80 border-l-2 border-transparent hover:border-primary/50 pl-2 py-0.5 animate-fade-in">
            <span className="opacity-50 mr-2">{i + 1}</span>
            {log}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};