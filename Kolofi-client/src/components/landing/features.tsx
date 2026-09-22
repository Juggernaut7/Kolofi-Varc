'use client';

import { motion } from 'framer-motion'
import { Users, Lock, Target, TrendingUp, Shield, Smartphone } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const featureModes = [
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Rotational Circles',
    description: 'Traditional Ajo digitalized. Join a circle, contribute regularly, and take your turn to receive the lump sum—secured by smart contracts.',
    color: 'bg-primary/5',
  },
  {
    icon: <Lock className="w-8 h-8 text-blue-500" />,
    title: 'Solo Saving Vaults',
    description: 'Save for your personal goals with discipline. Lock your funds until you reach your target or a specific date. No temptations, just growth.',
    color: 'bg-blue-500/5',
  },
  {
    icon: <Target className="w-8 h-8 text-purple-500" />,
    title: 'Targeted Group Funds',
    description: 'Planning a wedding, trip, or community project? Pool money together with friends and family towards a single specific recipient or goal.',
    color: 'bg-purple-500/5',
  },
]

const valueProps = [
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: 'Trust & Transparency',
    description: 'Every transaction is recorded on the blockchain. No more arguments over payouts or missing records.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    title: 'Financial Empowerment',
    description: 'Leverage the power of the community to reach your financial milestones faster and more reliably.',
  },
  {
    icon: <Smartphone className="w-6 h-6 text-primary" />,
    title: 'Native PWA Experience',
    description: 'Install Kolofi directly on your home screen. Fast, light, and optimized for mobile devices across Africa.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            How do you want to save?
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-lg text-muted-foreground leading-relaxed"
          >
            Kolofi gives you three ways to grow your wealth. Choose the one that fits your lifestyle or use all three.
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {featureModes.map((mode, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative h-full border-none shadow-none bg-muted/30 hover:bg-muted/50 transition-all group rounded-[2rem] overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 ${mode.color} rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
                <CardHeader className="pt-10">
                  <div className="mb-6">{mode.icon}</div>
                  <CardTitle className="text-2xl font-bold">{mode.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-10">
                  <p className="text-muted-foreground leading-relaxed">{mode.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 grid gap-12 lg:grid-cols-3">
          {valueProps.map((prop, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + (index * 0.1) }}
              className="flex gap-4"
            >
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                {prop.icon}
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-xl">{prop.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{prop.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
