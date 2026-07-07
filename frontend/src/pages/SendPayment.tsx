import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Key, Coins, ShieldAlert, Cpu, CheckCircle, ArrowLeft } from 'lucide-react';
import { meshApi } from '../services/meshApi';
import toast from 'react-hot-toast';
import { staggerContainer, fadeInUp } from '../utils/motionConfig';

export const SendPayment: React.FC = () => {
  const [senderVpa, setSenderVpa] = useState('alice@demo');
  const [receiverVpa, setReceiverVpa] = useState('bob@demo');
  const [amount, setAmount] = useState('500');
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPacket, setGeneratedPacket] = useState<{
    packetId: string;
    ciphertextPreview: string;
    injectedAt: string;
    ttl: number;
  } | null>(null);

  const handleInject = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (!amount || parsedAmount <= 0) {
      toast.error('Amount must be positive');
      return;
    }

    if (senderVpa === receiverVpa) {
      toast.error('Sender and receiver VPAs must be different');
      return;
    }

    if (!pin || pin.length < 4) {
      toast.error('PIN must be at least 4 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await meshApi.injectPacket({
        senderVpa,
        receiverVpa,
        amount: parsedAmount,
        pin,
      });

      setGeneratedPacket({
        packetId: result.packetId,
        ciphertextPreview: result.ciphertextPreview,
        injectedAt: result.injectedAt,
        ttl: result.ttl,
      });

      toast.success(`Packet ${result.packetId} injected at ${result.injectedAt}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to inject packet';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setGeneratedPacket(null);
    setAmount('500');
    setPin('');
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <div className="flex items-center gap-3 mb-1">
          <Coins className="h-5 w-5 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Send Payment</h1>
        </div>
        <p className="text-[var(--text-secondary)] text-sm ml-8">
          Compose a payment instruction. This simulates an offline client encrypting a payload using the server's public key.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="md:col-span-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 lg:p-8 backdrop-blur-md"
        >
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--border)] pb-4 flex items-center gap-2">
            <Coins className="h-4 w-4 text-violet-400" /> Compile Payment
          </h2>

          <AnimatePresence mode="wait">
            {!generatedPacket ? (
              <motion.form
                key="form"
                onSubmit={handleInject}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="space-y-5"
                >
                  <motion.div variants={fadeInUp}>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">
                      Sender Account (Offline Phone)
                    </label>
                    <select
                      value={senderVpa}
                      onChange={(e) => setSenderVpa(e.target.value)}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
                    >
                      <option value="alice@demo">Alice Johnson (alice@demo)</option>
                      <option value="bob@demo">Bob Smith (bob@demo)</option>
                      <option value="carol@demo">Carol White (carol@demo)</option>
                      <option value="dave@demo">Dave Miller (dave@demo)</option>
                    </select>
                  </motion.div>

                  <motion.div variants={fadeInUp}>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">
                      Receiver VPA (Virtual Payment Address)
                    </label>
                    <select
                      value={receiverVpa}
                      onChange={(e) => setReceiverVpa(e.target.value)}
                      className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
                    >
                      <option value="bob@demo">Bob Smith (bob@demo)</option>
                      <option value="alice@demo">Alice Johnson (alice@demo)</option>
                      <option value="carol@demo">Carol White (carol@demo)</option>
                      <option value="dave@demo">Dave Miller (dave@demo)</option>
                    </select>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono font-bold text-emerald-400"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 font-mono">
                        UPI Secure PIN
                      </label>
                      <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono tracking-widest text-violet-400"
                        placeholder="xxxx"
                        maxLength={4}
                      />
                    </div>
                  </motion.div>
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/30 hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-900/40 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Cpu className="h-4 w-4 animate-spin" />
                      Encrypting Cryptographic Envelope...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Inject Payment Packet Into Mesh
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/30 text-emerald-400 border border-emerald-800/30 shadow-lg shadow-emerald-950/20"
                >
                  <CheckCircle className="h-8 w-8" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">Packet Injected Successfully</h3>
                  <p className="text-[var(--text-secondary)] text-xs mt-1 font-mono">
                    Envelope generated and cached at {generatedPacket.injectedAt}.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-left text-xs font-mono space-y-2.5"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-between border-b border-[var(--border)] pb-2"
                  >
                    <span className="text-[var(--text-muted)]">Packet Identifier:</span>
                    <span className="text-sky-400 font-bold">{generatedPacket.packetId}</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex justify-between border-b border-[var(--border)] pb-2"
                  >
                    <span className="text-[var(--text-muted)]">Injected Device:</span>
                    <span className="text-[var(--text-primary)]">{generatedPacket.injectedAt}</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-between border-b border-[var(--border)] pb-2"
                  >
                    <span className="text-[var(--text-muted)]">TTL:</span>
                    <span className="text-violet-400 font-bold">{generatedPacket.ttl} hops</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                  >
                    <span className="block text-[var(--text-muted)] mb-1">Ciphertext (RSA+AES):</span>
                    <div className="bg-[var(--bg-elevated)] p-2.5 rounded-lg border border-[var(--border)] select-all overflow-x-auto text-[10px] text-[var(--text-secondary)] whitespace-nowrap">
                      {generatedPacket.ciphertextPreview}
                    </div>
                  </motion.div>
                </motion.div>

                <motion.button
                  onClick={handleResetForm}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-all duration-200 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Create Another Transaction
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="md:col-span-2 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -2, transition: { duration: 0.25 } }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 backdrop-blur-md card-hover"
          >
            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 mb-3 text-sm">
              <Key className="h-4 w-4 text-violet-400" /> Hybrid Crypto Loop
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Upon clicking inject, the simulated client pulls the server's cached RSA key, produces a unique transaction key via cryptographic randomizer (AES-256), locks the payload JSON with AES-GCM, encrypts the session key under RSA-OAEP, and packs them together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            whileHover={{ y: -2, transition: { duration: 0.25 } }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 backdrop-blur-md card-hover"
          >
            <h3 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 mb-3 text-sm">
              <ShieldAlert className="h-4 w-4 text-amber-500" /> Offline Balance Validation
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Notice: The client cannot verify whether the sender possesses sufficient funds while offline. The transaction remains in the mesh as an encrypted, deferred IOU. Balance queries and UPI PIN validation only execute once a bridge node uploads the envelope to the central gateway database.
            </p>
          </motion.div>
        </div>

      </div>

    </div>
  );
};
export default SendPayment;
