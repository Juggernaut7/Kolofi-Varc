'use client';

import { useAccount } from 'wagmi';
import SavingsSummary from '@/components/dashboard/savings-summary';
import QuickActions from '@/components/dashboard/quick-actions';
import SavingsCards from '@/components/dashboard/savings-cards';
import { motion } from 'framer-motion';
import { Bell, Coins, Sparkles } from 'lucide-react';
import { shortenAddress } from '@/lib/web3/format';
import Link from 'next/link';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const displayName = isConnected && address ? shortenAddress(address) : 'Saver';

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:pt-10">
      {/* Greeting & Arc Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
              <Coins className="w-3 h-3" /> Arc Mainnet (5042)
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Ayo, {displayName}! 🌿
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Your savings are growing transparently on Arc.
          </p>
        </div>

        <Link href="/notifications">
          <button className="relative p-3 rounded-2xl bg-muted/50 text-foreground hover:bg-muted transition-colors" aria-label="Notifications">
            <Bell className="w-6 h-6" />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full" />
          </button>
        </Link>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)] lg:items-start">
        <SavingsSummary />

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="ml-1 text-sm font-black uppercase tracking-widest text-muted-foreground">Quick Actions</h2>
          <QuickActions />
        </div>
      </div>

      {/* Active Savings */}
      <div className="space-y-4 pb-20">
        <div className="flex items-center justify-between ml-1">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Active Savings</h2>
          <div className="flex gap-4">
            <Link href="/vaults" className="text-xs font-bold text-primary hover:underline">
              All Vaults
            </Link>
            <Link href="/circles" className="text-xs font-bold text-primary hover:underline">
              All Circles
            </Link>
          </div>
        </div>
        <SavingsCards />
      </div>
    </div>
  );
}
