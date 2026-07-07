import React from 'react';
import { Loader2 } from 'lucide-react';
import { CardSkeleton, TableRowSkeleton } from './Skeleton';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  variant?: 'spinner' | 'cards' | 'table';
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  fullScreen = false,
  variant = 'spinner',
}) => {
  if (variant === 'cards') {
    return (
      <div className="w-full space-y-6 animate-fadeIn">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`stagger-${i} opacity-0 animate-fadeIn`}>
              <CardSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="w-full space-y-4 animate-fadeIn">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 backdrop-blur-md transition-[background-color,border-color] duration-250">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-[var(--skeleton-from)] animate-shimmer bg-[length:200%_100%]" />
              <div className="h-4 w-32 rounded bg-[var(--skeleton-from)] animate-shimmer bg-[length:200%_100%]" />
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`stagger-${i} opacity-0 animate-fadeIn`}>
              <TableRowSkeleton />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-page)] text-[var(--text-primary)] transition-[background-color] duration-250'
    : 'flex min-h-[300px] w-full flex-col items-center justify-center text-[var(--text-primary)]';

  return (
    <div className={containerClasses} role="status" aria-label="Loading">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-violet-600/20 blur-xl" />
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
      </div>
      <p className="mt-4 font-mono text-sm tracking-widest text-[var(--text-muted)] uppercase animate-pulse">
        {message}
      </p>
      <span className="sr-only">Loading content, please wait.</span>
    </div>
  );
};
