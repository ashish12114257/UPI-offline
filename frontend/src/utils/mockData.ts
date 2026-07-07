import type { Account, Transaction, VirtualDeviceState } from '../types';

export const mockAccounts: Account[] = [
  { vpa: 'alice@demo', holderName: 'Alice Johnson', balance: 4400.00, version: 1 },
  { vpa: 'bob@demo', holderName: 'Bob Smith', balance: 1600.00, version: 1 },
  { vpa: 'carol@demo', holderName: 'Carol White', balance: 2500.00, version: 1 },
  { vpa: 'dave@demo', holderName: 'Dave Miller', balance: 500.00, version: 1 },
];

export const mockTransactions: Transaction[] = [
  {
    id: 101,
    packetHash: 'd29afbc256ac80f12cde9acde08fa9bfacde67fb02acde68e1a90bc5e87a0fba',
    senderVpa: 'alice@demo',
    receiverVpa: 'bob@demo',
    amount: 500.00,
    signedAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    settledAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    bridgeNodeId: 'phone-bridge',
    hopCount: 3,
    status: 'SETTLED',
  },
  {
    id: 102,
    packetHash: 'fa2e08fcb97ad89cf20eb49fae098fdcb512e09abcde78fc028abcb9efda08fc',
    senderVpa: 'carol@demo',
    receiverVpa: 'alice@demo',
    amount: 150.00,
    signedAt: new Date(Date.now() - 3600000 * 5.8).toISOString(),
    settledAt: new Date(Date.now() - 3600000 * 3.4).toISOString(),
    bridgeNodeId: 'phone-bridge',
    hopCount: 2,
    status: 'SETTLED',
  },
  {
    id: 103,
    packetHash: '2e90fbc98a72b0cde8f1bc4e9abcb80fbcde568fbca98efcd282b0acde1e09bc',
    senderVpa: 'dave@demo',
    receiverVpa: 'bob@demo',
    amount: 600.00, // Dave has only 500
    signedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    settledAt: new Date(Date.now() - 3600000 * 0.8).toISOString(),
    bridgeNodeId: 'phone-bridge',
    hopCount: 4,
    status: 'REJECTED',
  },
  {
    id: 104,
    packetHash: '98facde9a02bcde89fb2a0fd89bcfe498fcde65ba02e3b2e59fa2bcde67da8bf',
    senderVpa: 'alice@demo',
    receiverVpa: 'carol@demo',
    amount: 100.00,
    signedAt: new Date(Date.now() - 3600000 * 12.4).toISOString(),
    settledAt: new Date(Date.now() - 3600000 * 11.2).toISOString(),
    bridgeNodeId: 'phone-bridge',
    hopCount: 1,
    status: 'SETTLED',
  },
  {
    id: 105,
    packetHash: 'bcde298afc02be49fc02efd98acde67fa09bc5e90f23ba8df932acde6fba8934',
    senderVpa: 'bob@demo',
    receiverVpa: 'dave@demo',
    amount: 250.00,
    signedAt: new Date(Date.now() - 3600000 * 24.2).toISOString(),
    settledAt: new Date(Date.now() - 3600000 * 22.8).toISOString(),
    bridgeNodeId: 'phone-bridge',
    hopCount: 3,
    status: 'SETTLED',
  },
  {
    id: 106,
    packetHash: 'acdeef9283ba04de8fbe49fbc02ef89acde67fb02e89abcf283adcb9ecfe08fa',
    senderVpa: 'carol@demo',
    receiverVpa: 'bob@demo',
    amount: 1000.00,
    signedAt: new Date(Date.now() - 3600000 * 30.5).toISOString(),
    settledAt: new Date(Date.now() - 3600000 * 28.1).toISOString(),
    bridgeNodeId: 'phone-bridge',
    hopCount: 2,
    status: 'SETTLED',
  }
];

export const mockDevices: VirtualDeviceState[] = [
  {
    deviceId: 'phone-alice',
    hasInternet: false,
    packetCount: 1,
    packetIds: ['pkt-3b8c2a5d'],
  },
  {
    deviceId: 'phone-stranger1',
    hasInternet: false,
    packetCount: 1,
    packetIds: ['pkt-3b8c2a5d'],
  },
  {
    deviceId: 'phone-stranger2',
    hasInternet: false,
    packetCount: 1,
    packetIds: ['pkt-3b8c2a5d'],
  },
  {
    deviceId: 'phone-stranger3',
    hasInternet: false,
    packetCount: 0,
    packetIds: [],
  },
  {
    deviceId: 'phone-bridge',
    hasInternet: true,
    packetCount: 1,
    packetIds: ['pkt-3b8c2a5d'],
  },
];

export const mockLogs = [
  { level: 'INFO', time: '12:05:22', service: 'ServerKeyHolder', msg: 'Server RSA keypair generated (2048-bit).' },
  { level: 'INFO', time: '12:05:22', service: 'DemoService', msg: 'Seeded 4 demo accounts.' },
  { level: 'INFO', time: '12:05:35', service: 'DemoService', msg: 'Packet 3b8c2a5d encrypted & injected at phone-alice' },
  { level: 'INFO', time: '12:05:40', service: 'MeshSimulatorService', msg: 'Gossip round complete: 4 packet transfers.' },
  { level: 'INFO', time: '12:05:48', service: 'BridgeIngestionService', msg: 'POST /api/bridge/ingest received from phone-bridge' },
  { level: 'INFO', time: '12:05:48', service: 'IdempotencyService', msg: 'Claiming hash [d29afbc256ac...]: Hash claimed successfully.' },
  { level: 'INFO', time: '12:05:48', service: 'HybridCryptoService', msg: 'RSA-OAEP decryption succeeded. Key size: 256 bits.' },
  { level: 'INFO', time: '12:05:48', service: 'HybridCryptoService', msg: 'AES-256-GCM authentication verified. Decrypted payload matches schema.' },
  { level: 'INFO', time: '12:05:48', service: 'SettlementService', msg: 'SETTLED ₹500.00 from alice@demo to bob@demo (packetHash=d29afbc2...)' },
];
