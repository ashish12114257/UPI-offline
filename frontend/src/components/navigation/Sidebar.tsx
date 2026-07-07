import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Network, Receipt, X, Send, Info } from 'lucide-react';
import { staggerContainer, slideLeft } from '../../utils/motionConfig';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { to: '/overview', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/overview/send-payment', label: 'Send Payment', icon: Send },
  { to: '/overview/mesh-simulator', label: 'Mesh Network', icon: Network },
  { to: '/overview/ledger', label: 'Transaction History', icon: Receipt },
  { to: '/overview/about', label: 'About Project', icon: Info },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[var(--bg-overlay)] backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside aria-label="Main navigation" className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--border)] bg-[var(--sidebar-bg)] backdrop-blur-xl transition-all duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex h-16 items-center justify-between px-6 border-b border-[var(--border)]"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-900/30">
              <Network className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-[var(--text-primary)] uppercase">UPI Mesh</span>
              <span className="block text-[10px] text-violet-400 font-mono font-semibold tracking-widest leading-none">OFFLINE</span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] lg:hidden cursor-pointer transition-colors duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>

        <motion.nav
          className="flex-1 space-y-1 px-4 py-6"
          aria-label="Main navigation"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <motion.div key={link.to} variants={slideLeft}>
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-violet-600/20 to-indigo-500/10 text-violet-300 border-l-2 border-violet-400 shadow-sm shadow-violet-900/20'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] border-l-2 border-transparent'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-4.5 w-4.5 transition-all duration-200 ${
                        isActive ? 'text-violet-400 drop-shadow-sm' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                      }`} />
                      <span>{link.label}</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="p-4 border-t border-[var(--border)]"
        >
          <div className="rounded-xl bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-card-alt)] p-4 border border-[var(--border)]">
            <span className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono">System Mode</span>
            <span className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Local Simulation
            </span>
            <p className="mt-1.5 text-[10px] leading-relaxed text-[var(--text-muted)]">
              Running in UI Mock state. API services are currently disconnected.
            </p>
          </div>
        </motion.div>
      </aside>
    </>
  );
};
