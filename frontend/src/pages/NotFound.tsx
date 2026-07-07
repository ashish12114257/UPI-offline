import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[var(--bg-page)] p-6 text-center text-[var(--text-primary)] transition-[background-color] duration-250">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-violet-600/5 blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8 backdrop-blur-md shadow-2xl animate-scaleIn transition-[background-color,border-color] duration-250">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-950/30 text-violet-400 border border-violet-800/30 shadow-lg shadow-violet-950/20">
          <HelpCircle className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-[var(--text-primary)]">Route Not Found</h1>

        <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed font-mono">
          The requested path does not map to any active controller or router configuration inside this offline mesh gateway instance.
        </p>

        <button
          onClick={() => navigate('/overview')}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-900/40 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[var(--bg-page)] transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </button>
      </div>
    </div>
  );
};
