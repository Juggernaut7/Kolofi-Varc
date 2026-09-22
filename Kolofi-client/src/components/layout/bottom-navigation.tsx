'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Lock, Zap, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/circles', label: 'Circles', icon: Users },
  { href: '/vaults', label: 'Vaults', icon: Lock },
  { href: '/funds', label: 'Funds', icon: Zap },
  { href: '/profile', label: 'Profile', icon: User },
]

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t border-border/10 bg-background/80 backdrop-blur-xl z-50 safe-area-bottom pb-4 px-4 overflow-hidden">
      <div className="flex items-center justify-between h-20 relative max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
            
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex flex-col items-center justify-center w-16 h-16 gap-1.5 transition-all outline-none',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute inset-0 bg-primary/5 rounded-[2rem] border border-primary/10"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Icon size={isActive ? 24 : 22} className={cn("relative z-10 transition-all", isActive && "scale-110")} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest relative z-10 transition-all text-center leading-none",
                isActive ? "opacity-100" : "opacity-60"
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
