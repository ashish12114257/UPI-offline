import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Menu, ShieldCheck, Key, Copy, Check, ExternalLink, RefreshCw, AlertTriangle, Moon, Sun } from 'lucide-react';
import { meshApi } from '../../services/meshApi';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const [pubKey, setPubKey] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [keyLoading, setKeyLoading] = useState(true);
  const [keyError, setKeyError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchKey = () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setKeyLoading(true);
    setKeyError(false);

    meshApi.getServerKey({ signal: controller.signal })
      .then(data => {
        if (!controller.signal.aborted && data?.publicKey) {
          setPubKey(data.publicKey);
          setKeyError(false);
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setPubKey('');
          setKeyError(true);
          if (err instanceof Error && err.name !== 'CanceledError') {
            toast.error('Unable to fetch server RSA key. The server may be offline.');
          }
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setKeyLoading(false);
      });
  };

  useEffect(() => {
    fetchKey();
    return () => abortRef.current?.abort();
  }, []);

  const handleCopyKey = () => {
    if (!pubKey) return;
    navigator.clipboard.writeText(pubKey);
    setCopied(true);
    toast.success('RSA Public Key copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedKey = useMemo(() => {
    if (keyLoading) return null;
    if (keyError) return null;
    return pubKey
      ? `${pubKey.substring(0, 16)}...${pubKey.substring(pubKey.length - 16)}`
      : null;
  }, [pubKey, keyLoading, keyError]);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-[var(--border)] bg-[var(--navbar-bg)] backdrop-blur-xl px-4 lg:px-6 sticky top-0 z-30 transition-[background-color,border-color] duration-250">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] lg:hidden cursor-pointer transition-all duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-900/30 bg-emerald-950/20 px-3.5 py-1 text-[11px] font-semibold text-emerald-400 dark:bg-emerald-950/20">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span className="flex items-center gap-1">
            Gateway: Connected
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-3">
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all duration-200 cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-2.5 lg:px-3 py-1.5 font-mono text-xs transition-[background-color,border-color] duration-250">
          <Key className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <span className="text-[var(--text-muted)] hidden lg:inline whitespace-nowrap">Server RSA Key:</span>

          {keyLoading ? (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-24 rounded bg-[var(--skeleton-from)] animate-shimmer bg-[length:200%_100%]" />
            </span>
          ) : keyError ? (
            <span className="flex items-center gap-1.5 text-rose-400">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-[11px]">Unavailable</span>
              <button
                onClick={fetchKey}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded bg-[var(--bg-subtle)] hover:bg-[var(--skeleton-via)] transition-colors"
                aria-label="Retry fetching server key"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            </span>
          ) : (
            <span className="text-[var(--text-primary)] select-all text-[11px] truncate max-w-[120px] lg:max-w-none">
              {truncatedKey}
            </span>
          )}

          {pubKey && (
            <button
              onClick={handleCopyKey}
              aria-label="Copy RSA public key to clipboard"
              className="ml-0.5 flex h-6 w-6 items-center justify-center rounded bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors duration-200 cursor-pointer shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>

        <a
          href="http://localhost:8080/h2-console"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="H2 Database Console (opens in new tab)"
          className="hidden lg:flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors duration-200 cursor-pointer"
        >
          <span>H2 Console</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </header>
  );
};
