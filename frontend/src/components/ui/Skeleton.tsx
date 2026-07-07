import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'table-row';
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
}) => {
  const base = 'animate-shimmer rounded bg-gradient-to-r from-[var(--skeleton-from)] via-[var(--skeleton-via)] to-[var(--skeleton-to)] bg-[length:200%_100%]';

  const variants: Record<string, string> = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'h-32 w-full rounded-2xl',
    'table-row': 'h-10 w-full rounded-lg',
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 backdrop-blur-md transition-[background-color,border-color] duration-250">
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="text" className="w-24 h-3" />
      <Skeleton variant="rectangular" className="w-8 h-8 rounded-lg" />
    </div>
    <Skeleton variant="text" className="w-32 h-8 mb-2" />
    <Skeleton variant="text" className="w-20 h-3" />
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 py-4 border-b border-[var(--border)]">
    <Skeleton variant="text" className="w-16 h-4" />
    <Skeleton variant="text" className="w-24 h-4" />
    <Skeleton variant="text" className="w-24 h-4" />
    <Skeleton variant="text" className="w-16 h-4" />
    <Skeleton variant="text" className="w-12 h-4" />
    <Skeleton variant="text" className="w-20 h-4" />
    <Skeleton variant="rectangular" className="w-14 h-6 rounded-full" />
    <Skeleton variant="rectangular" className="w-16 h-6 rounded-lg ml-auto" />
  </div>
);
