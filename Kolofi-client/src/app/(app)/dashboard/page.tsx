'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import SavingsSummary from '@/components/dashboard/savings-summary';
import QuickActions from '@/components/dashboard/quick-actions';
import SavingsCards from '@/components/dashboard/savings-cards';
import { motion } from 'framer-motion';
import { Bell, Coins, Pencil } from 'lucide-react';
import { shortenAddress } from '@/lib/web3/format';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [nickname, setNickname] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(`kolofi_name_${address.toLowerCase()}`);
      if (saved) {
        setNickname(saved);
      } else {
        setNickname(shortenAddress(address));
        const prompted = sessionStorage.getItem(`kolofi_prompted_${address.toLowerCase()}`);
        if (!prompted) {
          sessionStorage.setItem(`kolofi_prompted_${address.toLowerCase()}`, 'true');
          setTempName('');
          setIsEditingName(true);
        }
      }
    } else {
      setNickname('Saver');
    }
  }, [address]);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    if (address) {
      localStorage.setItem(`kolofi_name_${address.toLowerCase()}`, tempName.trim());
    }
    setNickname(tempName.trim());
    setIsEditingName(false);
    toast.success('Display name saved!');
  };

  const isFirstTime = isConnected && address && nickname === shortenAddress(address);

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

          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Welcome back, {nickname || 'Saver'}! 🌿
            </h1>
            {isConnected && (
              <button
                onClick={() => {
                  setTempName(isFirstTime ? '' : nickname);
                  setIsEditingName(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors text-xs font-bold text-muted-foreground border border-border/50"
                title="Change display name"
              >
                <Pencil className="w-3 h-3" />
                <span>{isFirstTime ? 'Set Name' : 'Edit'}</span>
              </button>
            )}
          </div>

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

      {/* Edit Nickname Modal */}
      <Dialog open={isEditingName} onOpenChange={setIsEditingName}>
        <DialogContent className="sm:max-w-sm rounded-[2rem] p-6 bg-card border-border">
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-xl font-black">Set Your Name</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Choose a custom nickname for your wallet on Kolofi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveName} className="space-y-4 pt-2">
            <Input
              placeholder="e.g. Kabir or Savings Star"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="rounded-xl h-12 text-base font-bold bg-muted/50 border-border"
              maxLength={24}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-xl font-bold h-11"
                onClick={() => setIsEditingName(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary font-bold rounded-xl h-11"
                disabled={!tempName.trim()}
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
