
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AuthDebugger() {
  const { session, loading } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Adiciona log quando o estado de loading muda
    setLogs(prev => [...prev, `[${new Date().toISOString()}] Loading: ${loading}`]);
  }, [loading]);

  useEffect(() => {
    // Adiciona log quando a sessão muda
    setLogs(prev => [...prev, `[${new Date().toISOString()}] Session changed: ${session ? 'Logged in' : 'Not logged in'}`]);
  }, [session]);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-1 rounded-b-md text-sm hover:bg-gray-700 transition-colors"
      >
        Debug {isOpen ? '▼' : '▲'}
      </button>
      
      {isOpen && (
        <div className="bg-gray-800 text-white p-4 rounded-b-md shadow-lg max-w-2xl">
          <ScrollArea className="h-[200px]">
            <div className="space-y-1 text-xs font-mono">
              {logs.map((log, index) => (
                <div key={index} className="border-b border-gray-700 pb-1">
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
