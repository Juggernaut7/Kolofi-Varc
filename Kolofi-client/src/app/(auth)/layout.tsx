'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <Link href="/" className="flex items-center gap-2 group justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl shadow-lg shadow-primary/20">
            K
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight block leading-none">Kolofi</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">on Arc Mainnet</span>
          </div>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        {children}
      </motion.div>

      {/* Footer Support */}
      <div className="mt-12 text-center">
        <p className="text-xs text-muted-foreground font-medium">
          Protected by Kolofi Protocol • Powered by Arc Mainnet (Chain ID 5042)
        </p>
      </div>
    </div>
  );
}
