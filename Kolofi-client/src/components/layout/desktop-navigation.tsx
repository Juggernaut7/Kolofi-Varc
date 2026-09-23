'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navItems } from './bottom-navigation'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'

import KolofiLogo from '@/components/brand/logo'

export default function DesktopNavigation() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex md:w-64 md:shrink-0 md:flex-col md:border-r md:border-border/60 md:bg-card/60">
      <div className="sticky top-0 flex h-screen flex-col px-5 py-6">
        <Link href="/dashboard" className="mb-8 flex items-center px-1" aria-label="Kolofi home">
          <KolofiLogo size="sm" />
        </Link>

        <nav aria-label="Primary navigation" className="space-y-2 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon size={20} className={cn('transition-colors', isActive ? 'text-primary' : 'group-hover:text-primary')} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-border/60">
          <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            Arc Mainnet
          </p>
          <ConnectWalletButton className="w-full justify-center" />
        </div>
      </div>
    </aside>
  )
}
