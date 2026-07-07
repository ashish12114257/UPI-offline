import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import type { Transaction } from '../types';
import { TransactionDetailsModal } from '../components/ledger/TransactionDetailsModal';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';
import {
  Receipt,
  Search,
  CheckCircle2,
  XCircle,
  Database,
  Filter,
} from 'lucide-react';
import { fadeInUp, staggerFast } from '../utils/motionConfig';

type FilterStatus = 'ALL' | 'SETTLED' | 'REJECTED';

export const Ledger: React.FC = () => {
  const { transactions, loading, error, refetch } = useTransactions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedTx(null);
    setIsModalOpen(false);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch =
        tx.senderVpa.toLowerCase().includes(search.toLowerCase()) ||
        tx.receiverVpa.toLowerCase().includes(search.toLowerCase()) ||
        tx.id.toString().includes(search);

      const matchStatus =
        statusFilter === 'ALL' ||
        tx.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, transactions]);

  if (loading && transactions.length === 0) {
    return <Loading variant="table" message="Loading transactions..." />;
  }

  if (error && transactions.length === 0) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-8">

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Receipt className="h-5 w-5 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Transaction History</h1>
        </div>
        <p className="text-[var(--text-secondary)] text-sm ml-8">
          Browse the central ledger audit trail. View transaction state histories, hops traversed, and cryptographic proofs.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4 backdrop-blur-md"
      >

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search VPA or Ingestion ID..."
            aria-label="Search transactions by VPA or ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          <Filter className="h-3.5 w-3.5 text-[var(--text-muted)] mr-1 hidden sm:block" />
          <span className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider font-mono mr-1 hidden sm:inline">
            Status:
          </span>

          {(['ALL', 'SETTLED', 'REJECTED'] as FilterStatus[]).map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              aria-pressed={statusFilter === filter}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                statusFilter === filter
                  ? 'bg-violet-600 text-white font-bold shadow-sm shadow-violet-900/30'
                  : 'border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </div>

      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 backdrop-blur-md"
      >
        <h2 className="text-sm font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--border)] pb-4 flex items-center gap-2">
          <Receipt className="h-4 w-4 text-violet-400" /> Ledger Records
          <span className="ml-auto text-[10px] font-mono text-[var(--text-muted)] font-normal">{filteredTransactions.length} entries</span>
        </h2>

        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-xs text-[var(--text-secondary)] border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] font-mono">
                  <th className="pb-3 pr-2 uppercase tracking-wider font-semibold text-[10px]">ID</th>
                  <th className="pb-3 pr-2 uppercase tracking-wider font-semibold text-[10px]">Sender VPA</th>
                  <th className="pb-3 pr-2 uppercase tracking-wider font-semibold text-[10px]">Receiver VPA</th>
                  <th className="pb-3 pr-2 uppercase tracking-wider font-semibold text-[10px]">Amount</th>
                  <th className="pb-3 pr-2 uppercase tracking-wider font-semibold text-[10px]">Hops</th>
                  <th className="pb-3 pr-2 uppercase tracking-wider font-semibold text-[10px]">Settled</th>
                  <th className="pb-3 pr-2 uppercase tracking-wider font-semibold text-[10px]">Status</th>
                  <th className="pb-3 text-right uppercase tracking-wider font-semibold text-[10px]">Action</th>
                </tr>
              </thead>
              <motion.tbody
                className="divide-y divide-[var(--border)]"
                variants={staggerFast}
                initial="hidden"
                animate="visible"
              >
                {filteredTransactions.map((tx) => (
                  <motion.tr
                    key={tx.id}
                    variants={fadeInUp}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-[var(--bg-subtle)] group transition-colors duration-150"
                  >
                    <td className="py-4 pr-2 text-violet-400 font-bold">#{tx.id}</td>
                    <td className="py-4 pr-2 font-bold text-[var(--text-primary)]">{tx.senderVpa}</td>
                    <td className="py-4 pr-2 font-bold text-[var(--text-primary)]">{tx.receiverVpa}</td>
                    <td className="py-4 pr-2 font-bold text-[var(--text-primary)] font-mono">₹{tx.amount.toFixed(2)}</td>
                    <td className="py-4 pr-2 text-[var(--text-secondary)]">
                      <span className="font-bold text-[var(--text-primary)]">{tx.hopCount} hops</span>
                      <span className="text-[10px] text-[var(--text-muted)] block">via {tx.bridgeNodeId}</span>
                    </td>
                    <td className="py-4 pr-2 text-[var(--text-muted)] text-[10px] font-mono">
                      {new Date(tx.settledAt).toLocaleDateString()} {new Date(tx.settledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 pr-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        tx.status === 'SETTLED'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                          : 'bg-rose-950/40 text-rose-400 border border-rose-900/30'
                      }`}>
                        {tx.status === 'SETTLED' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <XCircle className="w-2.5 h-2.5" />}
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <motion.button
                        onClick={() => handleOpenDetails(tx)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-1.5 text-[10px] font-bold text-[var(--text-secondary)] hover:text-white hover:bg-violet-600 hover:border-violet-600 transition-colors duration-200 cursor-pointer"
                      >
                        Inspect
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 animate-fadeIn">
            <Database className="mx-auto h-10 w-10 text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-muted)] font-mono text-sm">
              {search || statusFilter !== 'ALL'
                ? 'No transactions match your search criteria.'
                : 'No transactions have been processed yet.'}
            </p>
            {search || statusFilter !== 'ALL' ? (
              <button
                onClick={() => { setSearch(''); setStatusFilter('ALL'); }}
                className="mt-4 text-xs text-violet-400 hover:text-violet-300 transition-colors font-semibold"
              >
                Clear filters
              </button>
            ) : (
              <span className="block text-[10px] text-[var(--text-muted)] font-mono mt-2">
                Transactions appear here once bridge nodes upload mesh packets.
              </span>
            )}
          </motion.div>
        )}
      </motion.div>

      <TransactionDetailsModal
        transaction={selectedTx}
        isOpen={isModalOpen}
        onClose={handleCloseDetails}
      />

    </div>
  );
};
export default Ledger;
