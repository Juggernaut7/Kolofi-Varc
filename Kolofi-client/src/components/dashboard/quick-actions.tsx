'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Lock, Zap, ArrowRight } from 'lucide-react';

const actions = [
  { 
    label: 'Join Circle', 
    sub: 'Community', 
    href: '/circles', 
    icon: Users,
    color: 'bg-orange-500/10 text-orange-600',
    border: 'border-orange-500/20'
  },
  { 
    label: 'Lock Vault', 
    sub: 'Solo Savings', 
    href: '/vaults', 
    icon: Lock,
    color: 'bg-emerald-500/10 text-emerald-600',
    border: 'border-emerald-500/20'
  },
  { 
    label: 'Goal Fund', 
    sub: 'Targeted', 
    href: '/funds', 
    icon: Zap,
    color: 'bg-blue-500/10 text-blue-600',
    border: 'border-blue-500/20'
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={action.href}
              className={`flex flex-col items-center justify-center p-4 rounded-[2.5rem] bg-background border ${action.border} hover:shadow-lg transition-all group`}
            >
              <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-center">{action.label}</span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
