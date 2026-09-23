'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showBadge?: boolean
}

export default function KolofiLogo({
  className,
  size = 'md',
  showBadge = false,
}: LogoProps) {
  const imgHeight = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-14' : 'h-10'

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center rounded-xl bg-white p-1 shadow-sm border border-black/5 dark:border-white/10 shrink-0">
        <img
          src="/kolofi-logo.png"
          alt="Kolofi - Save Smart Together"
          className={cn('w-auto object-contain', imgHeight)}
        />
      </div>
      {showBadge && (
        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/60 px-2 py-0.5 rounded-full border border-border/40 hidden sm:inline-block">
          on Arc
        </span>
      )}
    </div>
  )
}
