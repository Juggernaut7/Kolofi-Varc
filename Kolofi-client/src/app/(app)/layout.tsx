'use client';

import { ReactNode } from 'react';
import BottomNavigation from '@/components/layout/bottom-navigation';
import DesktopNavigation from '@/components/layout/desktop-navigation';
import ConnectWalletButton from '@/components/wallet/connect-wallet-button';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background pb-20 md:pb-0">
      <DesktopNavigation />
      <main className="min-w-0 flex-1">
        <div className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border/60 bg-background/90 backdrop-blur-xl px-4 py-3">
          <span className="text-sm font-black tracking-tight">Kolofi</span>
          <ConnectWalletButton />
        </div>
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
