import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useMeshState } from '../hooks/useMeshState';
import { meshApi } from '../services/meshApi';
import type { VirtualDeviceState } from '../types';
import { Loading } from '../components/ui/Loading';
import { ErrorState } from '../components/ui/ErrorState';
import {
  Network,
  Cpu,
  Wifi,
  WifiOff,
  Trash2,
  Smartphone,
  Share2,
  FolderOpen,
  Radio,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { staggerContainer, fadeInUp } from '../utils/motionConfig';

const DeviceCard: React.FC<{
  device: VirtualDeviceState;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}> = ({ device, isSelected, onSelect, delay }) => (
  <motion.button
    type="button"
    onClick={onSelect}
    aria-pressed={isSelected}
    variants={fadeInUp}
    transition={{ duration: 0.35, delay }}
    whileHover={{ y: -3, transition: { duration: 0.2 } }}
    whileTap={{ scale: 0.98 }}
    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
      device.hasInternet
        ? 'bg-gradient-to-b from-emerald-950/15 to-emerald-950/5 border-emerald-900/40 hover:border-emerald-500/60'
        : 'bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-card-alt)] border-[var(--border)] hover:border-violet-500/40'
    } ${
      isSelected ? 'ring-2 ring-violet-500/80 border-transparent shadow-lg shadow-violet-900/20' : ''
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <Smartphone className={`h-5 w-5 ${
          device.hasInternet ? 'text-emerald-400' : 'text-[var(--text-muted)]'
        }`} />
        <span className="font-bold text-sm text-[var(--text-primary)]">{device.deviceId}</span>
      </div>

      <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
        device.hasInternet
          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
          : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] border border-[var(--border)]'
      }`}>
        {device.hasInternet ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
        {device.hasInternet ? '4G Bridge' : 'Offline'}
      </span>
    </div>

    <p className="text-xs text-[var(--text-secondary)]">
      Holding <span className="font-semibold text-[var(--text-primary)] font-mono">{device.packetCount}</span> packet(s)
    </p>

    {device.packetIds.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-3">
        {device.packetIds.map(id => (
          <span key={id} className="text-[10px] font-mono bg-[var(--bg-elevated)] border border-[var(--border)] px-2 py-0.5 rounded text-sky-400 shadow-sm">
            {id}
          </span>
        ))}
      </div>
    )}
  </motion.button>
);

export const MeshSimulator: React.FC = () => {
  const { meshState, loading, error, refetch } = useMeshState();
  const [selectedDevice, setSelectedDevice] = useState<VirtualDeviceState | null>(null);
  const [gossipRounds, setGossipRounds] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const initialSelectionDone = useRef(false);

  useEffect(() => {
    if (meshState.devices.length > 0 && !initialSelectionDone.current) {
      setSelectedDevice(meshState.devices[0]);
      initialSelectionDone.current = true;
    }
  }, [meshState.devices]);

  const handleInject = async () => {
    setActionLoading('inject');
    try {
      await meshApi.injectPacket({
        senderVpa: 'alice@demo',
        receiverVpa: 'bob@demo',
        amount: 500,
        pin: '1234',
      });
      toast.success('Packet injected at phone-alice');
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to inject packet');
    } finally {
      setActionLoading(null);
    }
  };

  const handleGossip = async () => {
    setActionLoading('gossip');
    try {
      const result = await meshApi.triggerGossip();
      setGossipRounds(prev => prev + 1);
      toast.success(`Gossip completed: ${result.transfers} packet transfers`);
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to run gossip');
    } finally {
      setActionLoading(null);
    }
  };

  const handleFlush = async () => {
    setActionLoading('flush');
    try {
      const result = await meshApi.flushBridges();
      const settled = result.results.filter(r => r.outcome === 'SETTLED').length;
      const dropped = result.results.filter(r => r.outcome === 'DUPLICATE_DROPPED').length;
      toast.success(`Uploaded ${result.uploadsAttempted} packet(s). Settled: ${settled}, Duplicates: ${dropped}`);
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to flush bridges');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReset = async () => {
    setActionLoading('reset');
    try {
      await meshApi.resetMesh();
      setGossipRounds(0);
      toast.success('Mesh and idempotency cache cleared');
      await refetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to reset mesh');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <Loading message="Loading mesh state..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  const devices = meshState.devices;

  return (
    <div className="space-y-8">

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Radio className="h-5 w-5 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Mesh Network</h1>
        </div>
        <p className="text-[var(--text-secondary)] text-sm ml-8">
          Interact with the Bluetooth mesh simulator. Gossip transactions node-by-node and upload them to the settlement gateway.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 lg:p-8 backdrop-blur-md"
      >
        <h2 className="text-sm font-bold text-[var(--text-primary)] mb-5 border-b border-[var(--border)] pb-4 flex items-center gap-2">
          <Cpu className="h-4 w-4 text-violet-400" /> Mesh Gossip Controls
        </h2>

        <div className="flex flex-wrap gap-3">
          <motion.button
            onClick={handleInject}
            disabled={actionLoading !== null}
            whileHover={{ scale: actionLoading ? 1 : 1.02 }}
            whileTap={{ scale: actionLoading ? 1 : 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-900/40 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {actionLoading === 'inject' ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Injecting...</>
            ) : (
              'Create & Inject Packet'
            )}
          </motion.button>

          <motion.button
            onClick={handleGossip}
            disabled={actionLoading !== null}
            whileHover={{ scale: actionLoading ? 1 : 1.02 }}
            whileTap={{ scale: actionLoading ? 1 : 0.98 }}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Share2 className="h-3.5 w-3.5" />
            {actionLoading === 'gossip' ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Gossiping...</>
            ) : (
              <>Run Gossip Round ({gossipRounds})</>
            )}
          </motion.button>

          <motion.button
            onClick={handleFlush}
            disabled={actionLoading !== null}
            whileHover={{ scale: actionLoading ? 1 : 1.02 }}
            whileTap={{ scale: actionLoading ? 1 : 0.98 }}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-5 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wifi className="h-3.5 w-3.5" />
            {actionLoading === 'flush' ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Flushing...</>
            ) : (
              'Flush Bridges (Upload)'
            )}
          </motion.button>

          <motion.button
            onClick={handleReset}
            disabled={actionLoading !== null}
            whileHover={{ scale: actionLoading ? 1 : 1.02 }}
            whileTap={{ scale: actionLoading ? 1 : 0.98 }}
            className="flex items-center gap-2 rounded-xl border border-rose-900/40 bg-rose-950/10 px-5 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/20 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {actionLoading === 'reset' ? (
              <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Resetting...</>
            ) : (
              'Reset State'
            )}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 backdrop-blur-md lg:col-span-2 space-y-5"
        >
          <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Network className="h-4 w-4 text-violet-400" /> Bluetooth Gossip Topology
          </h2>

          {devices.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {devices.map((dev, idx) => (
                <DeviceCard
                  key={dev.deviceId}
                  device={dev}
                  isSelected={selectedDevice?.deviceId === dev.deviceId}
                  onSelect={() => setSelectedDevice(dev)}
                  delay={0.05 + idx * 0.03}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <Network className="mx-auto h-8 w-8 text-[var(--text-muted)] mb-3" />
              <p className="text-[var(--text-muted)] italic text-xs font-mono">No devices in the mesh.</p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 backdrop-blur-md lg:col-span-1 flex flex-col"
        >
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-4 mb-5">
            <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-violet-400" /> Device Inspector
            </h2>
          </div>

          {selectedDevice ? (
            <motion.div
              key={selectedDevice.deviceId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5 text-xs"
            >
              <div className="space-y-2.5 border-b border-[var(--border)] pb-5">
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-muted)]">Device:</span>
                  <span className="text-[var(--text-primary)] font-bold">{selectedDevice.deviceId}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-muted)]">Internet:</span>
                  <span className={selectedDevice.hasInternet ? 'text-emerald-400 font-bold' : 'text-[var(--text-secondary)] font-bold'}>
                    {selectedDevice.hasInternet ? 'Online (4G)' : 'Offline (Basement)'}
                  </span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-[var(--text-muted)]">Packets:</span>
                  <span className="text-[var(--text-primary)] font-bold">{selectedDevice.packetCount}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <span className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono">Packet Queue</span>

                {selectedDevice.packetIds.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDevice.packetIds.map(id => (
                      <motion.div
                        key={id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                        className="rounded-lg bg-[var(--bg-elevated)] p-2.5 border border-[var(--border)] hover:border-[var(--skeleton-via)] transition-colors"
                      >
                        <span className="block font-bold text-sky-400 font-mono">{id}</span>
                        <span className="block text-[9px] text-[var(--text-muted)] font-mono mt-1 select-all break-all">
                          ciphertext: base64(RSA_OAEP_AES_GCM[...])
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[var(--text-muted)] italic py-6 text-center font-mono text-[11px]">
                    No packets in buffer.
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <p className="text-[var(--text-muted)] italic py-8 text-center font-mono">
              Click a device to inspect.
            </p>
          )}
        </motion.div>
      </div>

    </div>
  );
};
export default MeshSimulator;
