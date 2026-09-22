'use client'

import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut, Loader2 } from 'lucide-react'
import { arc, arcTestnet } from '@/lib/web3/config'
import { shortenAddress } from '@/lib/web3/format'
import { cn } from '@/lib/utils'

export default function ConnectWalletButton({
  className,
  size = 'sm',
}: {
  className?: string
  size?: 'sm' | 'default' | 'lg'
}) {
  const { address, isConnected, isConnecting } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()
  const [ready, setReady] = useState(false)

  useEffect(() => setReady(true), [])

  const onArc = chainId === arc.id || chainId === arcTestnet.id
  const busy = isConnecting || isPending || isSwitching

  if (!ready) {
    return (
      <Button size={size} variant="outline" className={cn('gap-2', className)} disabled>
        <Wallet className="w-4 h-4" />
        Connect
      </Button>
    )
  }

  if (isConnected && address && !onArc) {
    return (
      <Button
        size={size}
        className={cn('gap-2 bg-amber-600 hover:bg-amber-700 text-white', className)}
        onClick={() => switchChain({ chainId: arc.id })}
        disabled={busy}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
        Switch to Arc
      </Button>
    )
  }

  if (isConnected && address) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="hidden sm:inline text-xs font-bold text-muted-foreground tracking-wide">
          {shortenAddress(address)}
        </span>
        <Button
          size={size}
          variant="outline"
          className="gap-2"
          onClick={() => disconnect()}
        >
          <LogOut className="w-4 h-4" />
          <span className="sm:hidden">{shortenAddress(address, 3)}</span>
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    )
  }

  const injected = connectors.find((c) => c.id === 'injected') ?? connectors[0]

  return (
    <Button
      size={size}
      className={cn('gap-2 bg-primary hover:bg-primary/90', className)}
      disabled={busy || !injected}
      onClick={() => injected && connect({ connector: injected, chainId: arc.id })}
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
      Connect Wallet
    </Button>
  )
}
