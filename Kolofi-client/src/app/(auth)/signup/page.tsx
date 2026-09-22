'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import ConnectWalletButton from '@/components/wallet/connect-wallet-button';
import { shortenAddress } from '@/lib/web3/format';

export default function SignupPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, router]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Get Started</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Connect your Web3 wallet to start saving with vaults and rotating circles.
        </p>
      </div>

      <Card className="border-none shadow-2xl shadow-primary/5 bg-card overflow-hidden rounded-[2rem]">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>

          {isConnected && address ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Wallet Connected</p>
                <p className="text-base font-black text-foreground mt-1">{shortenAddress(address)}</p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">✓ Ready on Arc Mainnet</p>
              </div>

              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 gap-2"
              >
                Proceed to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                No sign-up forms required. Connect your wallet to begin.
              </p>
              <ConnectWalletButton size="lg" className="w-full h-14 rounded-2xl font-bold text-base justify-center shadow-lg" />
            </div>
          )}

          <div className="pt-2 border-t border-border/40 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Autonomous Smart Contracts on Arc</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
