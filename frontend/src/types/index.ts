export interface Account {
  vpa: string;
  holderName: string;
  balance: number;
  version: number;
}

export interface Transaction {
  id: number;
  packetHash: string;
  senderVpa: string;
  receiverVpa: string;
  amount: number;
  signedAt: string;
  settledAt: string;
  bridgeNodeId: string;
  hopCount: number;
  status: 'SETTLED' | 'REJECTED';
}

export interface VirtualDeviceState {
  deviceId: string;
  hasInternet: boolean;
  packetCount: number;
  packetIds: string[];
}

export interface MeshState {
  devices: VirtualDeviceState[];
  idempotencyCacheSize: number;
}

export interface ServerKeyResponse {
  publicKey: string;
  algorithm: string;
  hybridScheme: string;
}

export interface InjectResponse {
  packetId: string;
  ciphertextPreview: string;
  ttl: number;
  injectedAt: string;
}

export interface GossipResponse {
  transfers: number;
  deviceCounts: Record<string, number>;
}

export interface FlushResult {
  bridgeNode: string;
  packetId: string;
  outcome: string;
  reason: string;
  transactionId: number;
}

export interface FlushResponse {
  uploadsAttempted: number;
  results: FlushResult[];
}

export interface IngestResponse {
  outcome: string;
  packetHash: string;
  reason: string | null;
  transactionId: number | null;
}

export interface ResetResponse {
  status: string;
}

export interface DemoSendPayload {
  senderVpa: string;
  receiverVpa: string;
  amount: number;
  pin: string;
  ttl?: number;
  startDevice?: string;
}
