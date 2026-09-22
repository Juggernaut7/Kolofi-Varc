'use client';

import { motion } from 'framer-motion'
import { Smartphone, Users, Repeat, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    icon: <Smartphone className="w-6 h-6 text-primary" />,
    title: 'Download & Connect',
    description: 'Install Kolofi on your phone as a PWA and connect your wallet or sign up with email.',
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: 'Choose Your Mode',
    description: 'Start a rotational circle, a solo vault, or a targeted group fund based on your goal.',
  },
  {
    icon: <Repeat className="w-6 h-6 text-primary" />,
    title: 'Contribute Weekly',
    description: 'Automated reminders help you stay consistent with your group or personal savings.',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-primary" />,
    title: 'Collect Your Payout',
    description: 'When it is your turn or you reach your goal, funds are released instantly via smart contract.',
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            How Kolofi Works
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-lg text-muted-foreground leading-relaxed"
          >
            Traditional savings circles, reinvented for the blockchain age. Simple, transparent, and built for trust.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/20 -translate-y-1/2 hidden md:block" />
          
          <div className="grid gap-12 md:grid-cols-4 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center mb-6 relative z-10 group-hover:border-primary transition-colors">
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
