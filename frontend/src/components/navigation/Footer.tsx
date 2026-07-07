import React from 'react';
import { Cpu, ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between border-t border-[var(--border)] bg-[var(--bg-card-alt)] backdrop-blur-sm px-6 py-4 text-[var(--text-secondary)] text-xs transition-[background-color,border-color] duration-250">
      <div className="flex items-center gap-1.5 font-mono mb-2 sm:mb-0">
        <Cpu className="h-3.5 w-3.5 text-violet-500" />
        <span>UPI Offline Mesh Network Simulator v1.0.0</span>
      </div>

      <div className="flex items-center gap-4 text-center sm:text-right leading-relaxed max-w-lg">
        <div className="flex items-center gap-1.5 text-[10px] text-amber-500/80 font-semibold uppercase tracking-wider">
          <ShieldAlert className="h-3 w-3" />
          <span>Deferred Settlement Simulation Mode</span>
        </div>
      </div>
    </footer>
  );
};
