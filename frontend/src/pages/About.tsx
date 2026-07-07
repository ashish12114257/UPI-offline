import React from 'react';
import {
  Info,
  ShieldCheck,
  AlertOctagon,
  Shuffle,
  Server,
  BookOpen,
} from 'lucide-react';

const ChallengeCard: React.FC<{
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgClass: string;
  delay: number;
}> = ({ number, title, description, icon, bgClass, delay }) => (
  <div
    className="rounded-xl border border-[var(--border)] bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-card-alt)] p-5 space-y-3 card-hover opacity-0 animate-fadeIn"
    style={{ animationDelay: `${delay}s` }}
  >
    <span className={`inline-flex rounded-lg p-2 border ${bgClass}`}>
      {icon}
    </span>
    <h3 className="font-bold text-sm text-[var(--text-primary)]">{number}. {title}</h3>
    <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">{description}</p>
  </div>
);

export const About: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">

      <div className="opacity-0 animate-fadeIn">
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="h-5 w-5 text-violet-400" />
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">About</h1>
        </div>
        <p className="text-[var(--text-secondary)] text-sm ml-8">
          Technical specifications behind the mesh-routed deferred settlement payment paradigm.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 lg:p-8 backdrop-blur-md space-y-4 opacity-0 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Info className="h-4 w-4 text-violet-400" /> Core Payment Design
        </h2>
        <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
          The system allows peer-to-peer digital transactions to be initiated and verified without either party requiring active cellular connectivity at the time of payment. The transaction is formulated as a cryptographically sealed, tamper-proof packet on the sender's device. Using Bluetooth Low Energy (BLE) or Wi-Fi Direct protocols, this packet hop-by-hop gossips across neighboring devices until it reaches a node with internet accessibility (a "bridge"). The bridge node pushes it to the backend ledger for final verification, PIN check, and settlement.
        </p>
      </div>

      <div className="space-y-5">
        <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 opacity-0 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
          <ShieldCheck className="h-4 w-4 text-violet-400" /> Hard Challenges &amp; Solutions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ChallengeCard
            number="1"
            title="Untrusted Nodes"
            description="Transactions are carried by random stranger phones. Senders secure their payload using Hybrid Cryptography (RSA-OAEP + AES-GCM). The intermediate carrier cannot decode the amounts, nor can they tamper with contents without breaking the AES authentication tags."
            icon={<ShieldCheck className="h-4.5 w-4.5 text-violet-400" />}
            bgClass="bg-violet-950/40 text-violet-400 border-violet-900/20"
            delay={0.2}
          />
          <ChallengeCard
            number="2"
            title="Duplicate Storms"
            description="Multiple bridge devices might upload the identical transaction at the same instant. The backend computes a SHA-256 hash of the ciphertext and uses atomic compare-and-set (Redis SETNX logic) to settle exactly once."
            icon={<Shuffle className="h-4.5 w-4.5 text-emerald-400" />}
            bgClass="bg-emerald-950/40 text-emerald-400 border-emerald-900/20"
            delay={0.25}
          />
          <ChallengeCard
            number="3"
            title="Replay Attacks"
            description="Intercepted packages could be replayed by attackers. The system mandates a 24-hour freshness time limit checked against the signedAt field inside the encrypted envelope, along with UUID nonces ensuring distinct payload hashes."
            icon={<AlertOctagon className="h-4.5 w-4.5 text-amber-500" />}
            bgClass="bg-amber-950/40 text-amber-500 border-amber-900/20"
            delay={0.3}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 lg:p-8 backdrop-blur-md opacity-0 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-sm font-bold text-[var(--text-primary)] mb-6 border-b border-[var(--border)] pb-4 flex items-center gap-2">
          <Server className="h-4 w-4 text-violet-400" /> Production Architecture Evolution
        </h2>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs text-[var(--text-secondary)] border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)] font-mono">
                <th className="pb-3 pr-4 uppercase tracking-wider font-semibold text-[10px]">Demo System Scope</th>
                <th className="pb-3 uppercase tracking-wider font-semibold text-[10px]">Production Architecture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] leading-relaxed">
              {[
                ['H2 In-Memory DB', 'PostgreSQL / Oracle Cluster with write replicas'],
                ['JVM ConcurrentHashMap Cache', 'Distributed Redis clusters using SETNX + EX tags'],
                ['Startup Generated RSA Keypair', 'Hardware Security Modules (HSM) / AWS KMS'],
                ['Simulated Bluetooth Gossip', 'Physical BLE GATT / Wi-Fi Direct APIs'],
                ['Pre-loaded Account Balances', 'Real-time NPCI / Bank Core Banking via OAuth'],
              ].map(([demo, prod], idx) => (
                <tr key={idx} className="hover:bg-[var(--bg-subtle)] transition-colors duration-150">
                  <td className="py-3.5 pr-4 font-bold text-[var(--text-primary)]">{demo}</td>
                  <td className="py-3.5 text-[var(--text-secondary)] font-mono">{prod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
export default About;
