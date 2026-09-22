'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Wallet, ExternalLink, ShieldCheck, Copy, LogOut } from 'lucide-react';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { arc, ARC_VAULT_ADDRESS, ARC_CIRCLE_ADDRESS } from '@/lib/web3/config';
import { shortenAddress } from '@/lib/web3/format';
import ConnectWalletButton from '@/components/wallet/connect-wallet-button';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({
    address,
    chainId: arc.id,
    query: { enabled: Boolean(address) },
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pt-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-black text-foreground">Web3 Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your connected Arc wallet and view deployed on-chain smart contracts.
        </p>

        {isConnected && address ? (
          <Card className="p-6 md:p-8 rounded-[2rem]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-black">
                    {address.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-foreground">{shortenAddress(address)}</h2>
                    <button
                      onClick={() => copyToClipboard(address, 'Wallet Address')}
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      title="Copy Address"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{address}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Connected · Arc Mainnet (5042)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={`https://explorer.arc.io/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <span>Arc Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => disconnect()}
                  className="rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Disconnect</span>
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-muted/30 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">USDC Balance</p>
                <p className="text-2xl font-black text-foreground">
                  {balanceData ? `${Number(balanceData.formatted).toFixed(4)} USDC` : '0.00 USDC'}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Network Gas</p>
                <p className="text-2xl font-black text-primary">USDC Native</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center rounded-[2rem] space-y-4">
            <Wallet className="w-12 h-12 text-primary mx-auto" />
            <h3 className="text-xl font-bold">No Wallet Connected</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Connect your EVM wallet on Arc Mainnet to manage your vaults and rotating circles.
            </p>
            <ConnectWalletButton size="lg" className="mx-auto" />
          </Card>
        )}
      </div>

      {/* Deployed Smart Contracts on Arc */}
      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">
          Arc Mainnet Smart Contracts
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* ArcVault Card */}
          <Card className="p-6 rounded-[2rem] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">ArcVault Contract</h3>
                  <p className="text-xs text-muted-foreground">Solo goal-based personal savings</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                Live
              </span>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl font-mono text-xs break-all flex items-center justify-between gap-2">
              <span>{ARC_VAULT_ADDRESS}</span>
              <button
                onClick={() => copyToClipboard(ARC_VAULT_ADDRESS, 'ArcVault Address')}
                className="text-muted-foreground hover:text-foreground shrink-0 p-1"
                title="Copy Address"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href={`https://explorer.arc.io/address/${ARC_VAULT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>View ArcVault on Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </Card>

          {/* ArcCircle Card */}
          <Card className="p-6 rounded-[2rem] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 text-orange-600 rounded-xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">ArcCircle Contract</h3>
                  <p className="text-xs text-muted-foreground">Rotating group circles (Esusu / Ajo)</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600">
                Live
              </span>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl font-mono text-xs break-all flex items-center justify-between gap-2">
              <span>{ARC_CIRCLE_ADDRESS}</span>
              <button
                onClick={() => copyToClipboard(ARC_CIRCLE_ADDRESS, 'ArcCircle Address')}
                className="text-muted-foreground hover:text-foreground shrink-0 p-1"
                title="Copy Address"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href={`https://explorer.arc.io/address/${ARC_CIRCLE_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>View ArcCircle on Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
