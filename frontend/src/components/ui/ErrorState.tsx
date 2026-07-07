import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Connection Outage',
  message = 'Failed to establish connectivity with the server gateway. Check your terminal execution status.',
  onRetry
}) => {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md rounded-2xl border border-rose-900/40 bg-rose-950/10 p-8 backdrop-blur-md shadow-lg shadow-rose-950/5 animate-scaleIn">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-950/30 text-rose-500 border border-rose-800/40">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-lg font-bold tracking-tight text-rose-400">{title}</h3>
        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed font-mono">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-rose-900/25 hover:bg-rose-500 hover:shadow-xl hover:shadow-rose-900/30 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-page)] transition-all duration-200 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
};
