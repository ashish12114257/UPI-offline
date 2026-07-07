import { useMemo } from 'react';
import type { Transaction, VirtualDeviceState } from '../types';

export interface DailyAggregate {
  date: string;
  count: number;
  volume: number;
}

export interface AnalyticsData {
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  averageAmount: number;
  totalMeshNodes: number;
  activeNodes: number;
  networkHealth: number;
  packetSuccessRate: number;
  dailyTxData: DailyAggregate[];
  dailyVolumeData: DailyAggregate[];
  pieData: { name: string; value: number; color: string }[];
}

function groupByDate(txns: Transaction[]): DailyAggregate[] {
  const map = new Map<string, { count: number; volume: number }>();
  for (const tx of txns) {
    const day = tx.settledAt?.slice(0, 10) || tx.signedAt?.slice(0, 10) || 'unknown';
    const entry = map.get(day);
    if (entry) {
      entry.count++;
      entry.volume += tx.amount;
    } else {
      map.set(day, { count: 1, volume: tx.amount });
    }
  }
  const sorted = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b));
  return sorted.map(([date, { count, volume }]) => ({ date, count, volume }));
}

export function useAnalytics(
  transactions: Transaction[],
  devices: VirtualDeviceState[],
): AnalyticsData {
  return useMemo(() => {
    const totalTransactions = transactions.length;
    const successfulPayments = transactions.filter(t => t.status === 'SETTLED').length;
    const failedPayments = transactions.filter(t => t.status === 'REJECTED').length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

    const totalMeshNodes = devices.length;
    const activeNodes = devices.filter(d => d.hasInternet).length;
    const networkHealth = totalMeshNodes > 0 ? (activeNodes / totalMeshNodes) * 100 : 0;
    const packetSuccessRate = totalTransactions > 0 ? (successfulPayments / totalTransactions) * 100 : 0;

    const dailyData = groupByDate(transactions);

    const pieData = [
      { name: 'Settled', value: successfulPayments, color: '#22c55e' },
      { name: 'Rejected', value: failedPayments, color: '#ef4444' },
    ];

    return {
      totalTransactions,
      successfulPayments,
      failedPayments,
      averageAmount,
      totalMeshNodes,
      activeNodes,
      networkHealth,
      packetSuccessRate,
      dailyTxData: dailyData,
      dailyVolumeData: dailyData,
      pieData,
    };
  }, [transactions, devices]);
}
