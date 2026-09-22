'use client';

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import { useAccount } from 'wagmi'

export function CTASection() {
  const { isConnected } = useAccount()

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-primary text-primary-foreground">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-10"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span>Built natively for Arc Network</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Start building wealth together on Arc Mainnet
            </h2>
            <p className="text-xl md:text-2xl opacity-90 text-white/80 max-w-2xl mx-auto leading-relaxed">
              No banks, no manual spreadsheets. Lock personal USDC vaults or rotate pots with your community circle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ConnectWalletButton size="lg" className="h-14 px-8 text-base font-bold bg-white text-primary hover:bg-white/90 rounded-2xl shadow-2xl" />
            <Button asChild size="xl" variant="outline" className="h-14 px-8 font-bold border-2 border-white/40 bg-transparent text-white hover:bg-white/10 rounded-2xl">
              <Link href="/dashboard" className="gap-2">
                Launch App
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <p className="text-sm font-medium opacity-80 pt-4">
            Arc Mainnet Chain ID: 5042 · Gas paid in native USDC
          </p>
        </motion.div>
      </div>
    </section>
  )
}
