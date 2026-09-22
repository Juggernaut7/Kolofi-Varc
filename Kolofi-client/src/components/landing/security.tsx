'use client';

import { motion } from 'framer-motion'
import { ShieldCheck, Eye, Lock, Globe } from 'lucide-react'

const securityFeatures = [
  {
    icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    title: 'Smart Contract Escrow',
    description: 'Your funds are never held by an individual. They are locked in secure Solana smart contracts and released automatically.',
  },
  {
    icon: <Eye className="w-10 h-10 text-primary" />,
    title: 'Full Transparency',
    description: 'Every contribution and payout is visible on the public ledger. No more disputes over who paid what or when.',
  },
  {
    icon: <Lock className="w-10 h-10 text-primary" />,
    title: 'Bank-Grade Security',
    description: 'We use the same encryption standards as top global fintechs to protect your data and transactions.',
  },
  {
    icon: <Globe className="w-10 h-10 text-primary" />,
    title: 'Decentralized Trust',
    description: 'Kolofi removes the middleman. The community governs the circle, while the blockchain enforces the rules.',
  },
]

export function SecuritySection() {
  return (
    <section id="security" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Security you can <span className="text-primary italic">actually see.</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Traditional Ajo relies on trust in a person. Kolofi relies on mathematics and code. We’ve built a system where transparency is the default, and your money is always protected.
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="mb-2">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Abstract Security Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-full bg-primary/5 absolute inset-0 blur-[100px] animate-pulse" />
            <div className="relative z-10 p-8 md:p-12 bg-muted/50 rounded-[3rem] border border-border/50 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-background border border-border flex items-center gap-4 shadow-xl">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Lock size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-24 bg-muted rounded-full mb-2" />
                    <div className="h-2 w-16 bg-muted/50 rounded-full" />
                  </div>
                  <div className="text-primary font-bold text-sm">Verified</div>
                </div>
                
                <div className="p-4 rounded-2xl bg-background border border-border flex items-center gap-4 shadow-xl translate-x-8">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <ShieldCheck size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-32 bg-muted rounded-full mb-2" />
                    <div className="h-2 w-20 bg-muted/50 rounded-full" />
                  </div>
                  <div className="text-blue-500 font-bold text-sm">Active</div>
                </div>

                <div className="p-4 rounded-2xl bg-background border border-border flex items-center gap-4 shadow-xl -translate-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                    <Globe size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-28 bg-muted rounded-full mb-2" />
                    <div className="h-2 w-24 bg-muted/50 rounded-full" />
                  </div>
                  <div className="text-purple-500 font-bold text-sm">Global</div>
                </div>
              </div>

              <div className="mt-12 text-center p-6 bg-primary/10 rounded-2xl border border-primary/20">
                <p className="text-primary font-bold text-lg mb-1">99.9% Up-time</p>
                <p className="text-muted-foreground text-sm">Powered by the Solana Blockchain</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
