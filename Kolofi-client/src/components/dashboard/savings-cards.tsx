'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Lock, Plus, ChevronRight, Target, Sparkles, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { arc, ARC_VAULT_ADDRESS, ARC_CIRCLE_ADDRESS, vaultConfigured, circleConfigured } from '@/lib/web3/config';
import { arcVaultAbi, arcCircleAbi } from '@/lib/web3/abis';
import { formatUsdcLabel } from '@/lib/web3/format';
import { useMemo } from 'react';
import ConnectWalletButton from '@/components/wallet/connect-wallet-button';

const MAX_SCAN = 30n;

export default function SavingsCards() {
  const { address, isConnected } = useAccount();

  // Read Vaults
  const readyVault = vaultConfigured();
  const { data: vaultIds, isLoading: loadingVaultIds } = useReadContract({
    address: ARC_VAULT_ADDRESS,
    abi: arcVaultAbi,
    functionName: 'getUserVaultIds',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && readyVault },
  });

  const ids = (vaultIds as bigint[] | undefined) ?? [];

  const { data: vaultResults, isLoading: loadingVaults } = useReadContracts({
    contracts: ids.map((id) => ({
      address: ARC_VAULT_ADDRESS,
      abi: arcVaultAbi,
      functionName: 'getVault' as const,
      args: [id] as const,
    })),
    query: { enabled: ids.length > 0 },
  });

  // Read Circles
  const readyCircle = circleConfigured();
  const { data: nextCircleId, isLoading: loadingCircleNext } = useReadContract({
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
    return list.reverse();
  }, [nextCircleId]);

  const { data: circleResults, isLoading: loadingCircles } = useReadContracts({
    contracts: circleScanIds.map((id) => ({
      address: ARC_CIRCLE_ADDRESS,
      abi: arcCircleAbi,
      functionName: 'getCircle' as const,
      args: [id] as const,
    })),
    query: { enabled: circleScanIds.length > 0 },
  });

  const { data: memberFlags } = useReadContracts({
    contracts: circleScanIds.map((id) => ({
      address: ARC_CIRCLE_ADDRESS,
      abi: arcCircleAbi,
      functionName: 'isMember' as const,
      args: [id, address!] as const,
    })),
    query: { enabled: Boolean(address) && circleScanIds.length > 0 },
  });

  const activeVaults = useMemo(() => {
    if (!vaultResults) return [];
    return ids
      .map((id, index) => {
        const vault = vaultResults[index]?.result as {
          name: string;
          goalAmount: bigint;
          balance: bigint;
          unlockTime: bigint;
          closed: boolean;
        } | undefined;
        if (!vault || vault.closed) return null;
        return { id, vault };
      })
      .filter(Boolean) as Array<{
        id: bigint;
        vault: {
          name: string;
          goalAmount: bigint;
          balance: bigint;
          unlockTime: bigint;
          closed: boolean;
        };
      }>;
  }, [ids, vaultResults]);

  const myCircles = useMemo(() => {
    if (!circleResults || !memberFlags) return [];
    return circleScanIds
      .map((id, index) => {
        const circle = circleResults[index]?.result as {
          name: string;
          contributionAmount: bigint;
          memberCount: bigint;
          maxMembers: bigint;
          pot: bigint;
          active: boolean;
          currentRound: bigint;
        } | undefined;
        const isMember = Boolean(memberFlags[index]?.result);
        if (!circle || !isMember) return null;
        return { id, circle };
      })
      .filter(Boolean) as Array<{
        id: bigint;
        circle: {
          name: string;
          contributionAmount: bigint;
          memberCount: bigint;
          maxMembers: bigint;
          pot: bigint;
          active: boolean;
          currentRound: bigint;
        };
      }>;
  }, [circleScanIds, circleResults, memberFlags]);

  const isLoading = loadingVaultIds || loadingVaults || loadingCircleNext || loadingCircles;

  if (!isConnected) {
    return (
      <div className="rounded-[2.5rem] bg-muted/30 border border-border/60 p-8 text-center space-y-4">
        <Lock className="w-12 h-12 text-primary mx-auto" />
        <h3 className="text-xl font-black">Connect your wallet to see active savings</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Kolofi reads your personal vaults and rotating savings circles directly from Arc Mainnet.
        </p>
        <ConnectWalletButton size="lg" className="mx-auto" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasItems = activeVaults.length > 0 || myCircles.length > 0;

  if (!hasItems) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/vaults/create">
          <div className="group relative overflow-hidden bg-muted/30 hover:bg-muted/50 rounded-[2.5rem] p-6 border border-border/50 transition-all cursor-pointer h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Target className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Create Solo Vault</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Personal Goal Savings</p>
                </div>
              </div>
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Lock native USDC toward a target amount or future date. Withdraw once unlocked or when goal is met.
            </p>
            <Button size="sm" className="w-full bg-primary rounded-xl font-bold">
              New USDC Vault
            </Button>
          </div>
        </Link>

        <Link href="/circles/create">
          <div className="group relative overflow-hidden bg-muted/30 hover:bg-muted/50 rounded-[2.5rem] p-6 border border-border/50 transition-all cursor-pointer h-full flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div className="flex gap-4 items-center">
                <div className="w-14 h-14 rounded-3xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Start Savings Circle</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Community Esusu / Ajo</p>
                </div>
              </div>
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Group savings where members contribute USDC each round and rotate receiving the pooled pot.
            </p>
            <Button size="sm" variant="outline" className="w-full rounded-xl font-bold">
              New Rotating Circle
            </Button>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Vaults */}
      {activeVaults.map(({ id, vault }, index) => {
        const progress = vault.goalAmount > 0n
          ? Number((vault.balance * 10000n) / vault.goalAmount) / 100
          : 0;

        return (
          <motion.div
            key={`vault-${id.toString()}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/vaults/${id.toString()}`}>
              <div className="group relative overflow-hidden bg-muted/30 hover:bg-muted/50 rounded-[2.5rem] p-6 transition-all border border-border/40">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-3xl text-emerald-600 bg-emerald-500/10 flex items-center justify-center">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight">{vault.name}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Solo Vault #{id.toString()}</p>
                    </div>
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 text-[10px] font-black uppercase tracking-wider text-emerald-600">
                    On-Chain
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Saved</p>
                      <p className="text-xl font-black">{formatUsdcLabel(vault.balance)}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Goal</p>
                      <p className="text-sm font-bold opacity-70">{formatUsdcLabel(vault.goalAmount)}</p>
                    </div>
                  </div>

                  <div className="relative pt-2">
                    <Progress value={Math.min(progress, 100)} className="h-2 rounded-full bg-background" />
                    <div className="text-[10px] font-black text-primary uppercase text-right mt-1">
                      {Math.round(Math.min(progress, 100))}%
                    </div>
                  </div>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}

      {/* Circles */}
      {myCircles.map(({ id, circle }, index) => {
        return (
          <motion.div
            key={`circle-${id.toString()}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/circles/${id.toString()}`}>
              <div className="group relative overflow-hidden bg-muted/30 hover:bg-muted/50 rounded-[2.5rem] p-6 transition-all border border-border/40">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-3xl text-orange-600 bg-orange-500/10 flex items-center justify-center">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight">{circle.name}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Circle #{id.toString()}</p>
                    </div>
                  </div>
                  <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border/50 text-[10px] font-black uppercase tracking-wider text-orange-600">
                    Round {Number(circle.currentRound) + 1}/{circle.maxMembers.toString()}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Pot</p>
                      <p className="text-xl font-black">{formatUsdcLabel(circle.pot)}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Contribution</p>
                      <p className="text-sm font-bold opacity-70">{formatUsdcLabel(circle.contributionAmount)} / round</p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground pt-1">
                    {circle.memberCount.toString()} of {circle.maxMembers.toString()} members enrolled
                  </p>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
