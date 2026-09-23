'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import KolofiLogo from '@/components/brand/logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <Link href="/" className="flex justify-center" aria-label="Kolofi home">
          <KolofiLogo size="lg" showBadge />
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
