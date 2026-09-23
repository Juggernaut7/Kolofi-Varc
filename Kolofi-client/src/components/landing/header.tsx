'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X, Moon, Sun, ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import { useAccount } from 'wagmi'
import KolofiLogo from '@/components/brand/logo'

export function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const { isConnected } = useAccount()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50 py-3" : "bg-transparent py-5"
    )}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group shrink-0" aria-label="Kolofi home">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <KolofiLogo size="sm" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border border-border/50">
            {['How It Works', 'Features', 'Security'].map((item) => (
              <Link 
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-background rounded-xl transition-all"
              >
                {item}
              </Link>
            ))}
            <Link 
              href="/circles" 
              className="px-4 py-2 text-sm font-semibold text-primary hover:bg-background rounded-xl transition-all"
            >
              Explore Circles
            </Link>
          </nav>

          {/* CTA & Theme Toggle */}
          <div className="flex items-center gap-1 sm:gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-xl hover:bg-muted"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <div className="hidden sm:flex items-center gap-3">
              <ConnectWalletButton size="default" />
              <Button asChild className="font-bold rounded-xl shadow-lg shadow-primary/20 gap-1.5">
                <Link href="/dashboard">
                  {isConnected ? 'Dashboard' : 'Launch App'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-xl transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pt-6 pb-4 space-y-4"
            >
              {['How It Works', 'Features', 'Security'].map((item) => (
                <Link 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-bold text-muted-foreground hover:text-foreground py-2 border-b border-border/50"
                >
                  {item}
                </Link>
              ))}
              <Link 
                href="/circles" 
                onClick={() => setIsOpen(false)}
                className="block text-lg font-bold text-primary py-2 border-b border-border/50"
              >
                Explore Circles
              </Link>
              <div className="flex flex-col gap-3 pt-4">
                <ConnectWalletButton className="w-full justify-center h-12 text-base font-bold" />
                <Button asChild className="font-bold rounded-xl h-12 shadow-lg shadow-primary/20 w-full">
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    {isConnected ? 'Go to Dashboard' : 'Launch App'}
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
