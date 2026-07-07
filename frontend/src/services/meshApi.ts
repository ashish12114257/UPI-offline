import apiClient from './apiClient';
import type { AxiosRequestConfig } from 'axios';
import type {
  Account,
  Transaction,
  MeshState,
  ServerKeyResponse,
  InjectResponse,
  GossipResponse,
  FlushResponse,
  ResetResponse,
  IngestResponse,
  DemoSendPayload,
} from '../types';

export interface MeshPacket {
  packetId: string;
  ttl: number;
  createdAt: number;
  ciphertext: string;
}

type RequestOptions = { signal?: AbortSignal };

export const meshApi = {
  getServerKey: (opts?: RequestOptions): Promise<ServerKeyResponse> =>
    apiClient.get('/server-key', opts as AxiosRequestConfig).then((r) => r.data),

  getAccounts: (opts?: RequestOptions): Promise<Account[]> =>
    apiClient.get('/accounts', opts as AxiosRequestConfig).then((r) => r.data),

  getTransactions: (opts?: RequestOptions): Promise<Transaction[]> =>
    apiClient.get('/transactions', opts as AxiosRequestConfig).then((r) => r.data),

  getMeshState: (opts?: RequestOptions): Promise<MeshState> =>
    apiClient.get('/mesh/state', opts as AxiosRequestConfig).then((r) => r.data),

  injectPacket: (payload: DemoSendPayload): Promise<InjectResponse> =>
    apiClient.post('/demo/send', payload).then((r) => r.data),

  triggerGossip: (): Promise<GossipResponse> =>
    apiClient.post('/mesh/gossip').then((r) => r.data),

  flushBridges: (): Promise<FlushResponse> =>
    apiClient.post('/mesh/flush').then((r) => r.data),

  resetMesh: (): Promise<ResetResponse> =>
    apiClient.post('/mesh/reset').then((r) => r.data),

  ingestPacket: (
    packet: MeshPacket,
    bridgeNodeId: string,
    hopCount: number
  ): Promise<IngestResponse> =>
    apiClient
      .post('/bridge/ingest', packet, {
        headers: {
          'X-Bridge-Node-Id': bridgeNodeId,
          'X-Hop-Count': hopCount,
        },
      })
      .then((r) => r.data),
};
