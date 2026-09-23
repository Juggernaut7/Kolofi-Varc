'use client';

import { Button } from '@/components/ui/button'
import { LottieAnimation } from '@/components/lottie-animation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Zap, Coins, Users } from 'lucide-react'
import { useAccount } from 'wagmi'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'

export function HeroSection() {
  const { isConnected } = useAccount()

  return (
    <section className="relative overflow-hidden bg-background pt-10 pb-14 sm:pt-16 sm:pb-20 md:pt-24 md:pb-32">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[50%] bg-primary/10 blur-[100px] rounded-full" />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 md:gap-8 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6 sm:gap-8"
          >
            <div className="space-y-5 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 w-fit"
              >
                <Coins size={14} className="animate-spin-slow" />
                <span>Live on Arc Mainnet · Native USDC Gas</span>
              </motion.div>
              
              <h1 className="text-[2.65rem] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[1.05] sm:leading-[1.1]">
                Save together. <br />
                <span className="text-primary italic">Save in USDC on Arc.</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-lg leading-relaxed">
                Kolofi brings traditional rotating group savings (Esusu / Ajo) and personal goal vaults directly on-chain. Transparent, trustless, and zero token approval hassles.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row items-stretch sm:items-center">
              {isConnected ? (
                <>
                  <Button asChild size="xl" className="font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 group">
                    <Link href="/dashboard">
                      Enter Dashboard
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="xl" className="font-bold text-lg rounded-2xl border-2">
                    <Link href="/circles/create">Create Circle</Link>
                  </Button>
                </>
              ) : (
                <>
                  <ConnectWalletButton size="lg" className="h-14 px-8 text-base font-bold rounded-2xl shadow-xl shadow-primary/20" />
                  <Button asChild variant="outline" size="xl" className="font-bold text-lg rounded-2xl border-2">
                    <Link href="/circles">Explore Circles</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShieldCheck className="text-primary w-5 h-5" />
                <span>Verified Arc Mainnet Contracts</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="text-primary w-5 h-5" />
                <span>Autonomous ROSCA & Goal Vaults</span>
              </div>
            </div>
          </motion.div>

          {/* Animation Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative flex items-center justify-center aspect-square md:aspect-auto h-70 sm:h-100 lg:h-150"
          >
            {/* Soft Glow behind animation */}
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
            
            <LottieAnimation
              src="/animations/hero-animation.json"
              autoplay
              loop
              className="w-full h-full max-w-2xl relative z-10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
