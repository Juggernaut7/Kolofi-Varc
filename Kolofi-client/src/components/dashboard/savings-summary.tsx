'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Wallet, ArrowUpRight, Coins, ShieldCheck } from 'lucide-react';
import { useAccount, useBalance, useReadContract, useReadContracts } from 'wagmi';
import { arc, ARC_VAULT_ADDRESS, ARC_CIRCLE_ADDRESS, vaultConfigured, circleConfigured } from '@/lib/web3/config';
import { arcVaultAbi, arcCircleAbi } from '@/lib/web3/abis';
import { formatUsdcLabel, formatUsdc } from '@/lib/web3/format';
import { useMemo } from 'react';

const MAX_SCAN = 30n;

export default function SavingsSummary() {
  const { address, isConnected } = useAccount();

  // 1. Native USDC wallet balance on Arc
  const { data: balanceData } = useBalance({
    address,
    chainId: arc.id,
    query: { enabled: Boolean(address) },
  });

  // 2. User vault IDs
  const readyVault = vaultConfigured();
  const { data: vaultIds } = useReadContract({
    address: ARC_VAULT_ADDRESS,
    abi: arcVaultAbi,
    functionName: 'getUserVaultIds',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && readyVault },
  });

  const ids = (vaultIds as bigint[] | undefined) ?? [];

  // 3. Vault details to calculate total locked
  const { data: vaultResults } = useReadContracts({
    contracts: ids.map((id) => ({
      address: ARC_VAULT_ADDRESS,
      abi: arcVaultAbi,
      functionName: 'getVault' as const,
      args: [id] as const,
    })),
    query: { enabled: ids.length > 0 },
  });

  const totalVaultBalance = useMemo(() => {
    if (!vaultResults) return 0n;
    return vaultResults.reduce((acc, curr) => {
      const v = curr?.result as { balance?: bigint; closed?: boolean } | undefined;
      if (v && !v.closed && v.balance) {
        return acc + v.balance;
      }
      return acc;
    }, 0n);
  }, [vaultResults]);

  // 4. Circle membership count
  const readyCircle = circleConfigured();
  const { data: nextCircleId } = useReadContract({
    address: ARC_CIRCLE_ADDRESS,
    abi: arcCircleAbi,
    functionName: 'nextCircleId',
    query: { enabled: readyCircle },
  });

  const circleScanIds = useMemo(() => {
    if (!nextCircleId || nextCircleId <= 1n) return [] as bigint[];
    const latest = nextCircleId - 1n;
    const start = latest > MAX_SCAN ? latest - MAX_SCAN + 1n : 1n;
    const list: bigint[] = [];
    for (let i = start; i <= latest; i++) list.push(i);
    return list;
  }, [nextCircleId]);

  const { data: memberFlags } = useReadContracts({
    contracts: circleScanIds.map((id) => ({
      address: ARC_CIRCLE_ADDRESS,
      abi: arcCircleAbi,
      functionName: 'isMember' as const,
      args: [id, address!] as const,
    })),
    query: { enabled: Boolean(address) && circleScanIds.length > 0 },
  });

  const activeCircleCount = useMemo(() => {
    if (!memberFlags) return 0;
    return memberFlags.filter((f) => Boolean(f?.result)).length;
  }, [memberFlags]);

  const activeVaultCount = useMemo(() => {
    if (!vaultResults) return 0;
    return vaultResults.filter((v) => {
      const item = v?.result as { closed?: boolean } | undefined;
      return item && !item.closed;
    }).length;
  }, [vaultResults]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary/95 to-emerald-700 p-8 text-primary-foreground shadow-2xl shadow-primary/20"
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-bl-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
      
      <div className="relative z-10 space-y-8">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary-foreground/80 font-bold text-xs uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Total Locked on Arc</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
              {formatUsdcLabel(totalVaultBalance)}
            </h2>
            <p className="text-xs text-primary-foreground/70 font-medium">
              USDC locked in personal smart vaults
            </p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10"
          >
            <Coins className="w-7 h-7" />
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-3xl bg-white/10 border border-white/10 space-y-1 backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 flex items-center gap-1">
              <Wallet className="w-3 h-3" /> Wallet Balance
            </p>
            <div className="flex items-baseline justify-between">
              <p className="text-lg sm:text-xl font-black">
                {balanceData ? `${Number(balanceData.formatted).toFixed(2)} USDC` : '0.00 USDC'}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-3xl bg-white/10 border border-white/10 space-y-1 backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Active Contracts</p>
            <p className="text-lg sm:text-xl font-black">
              {activeVaultCount} Vaults · {activeCircleCount} Circles
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
