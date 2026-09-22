'use client'

import { useEffect, useState } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Wallet, LogOut, Loader2, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react'
import { arc, arcTestnet } from '@/lib/web3/config'
import { shortenAddress } from '@/lib/web3/format'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function ConnectWalletButton({
  className,
  size = 'sm',
}: {
  className?: string
  size?: 'sm' | 'default' | 'lg'
}) {
  const { address, isConnected, isConnecting } = useAccount()
  const { connectAsync, connectors, isPending: isConnectingWagmi } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()

  const [mounted, setMounted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingConnectorId, setLoadingConnectorId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onArc = chainId === arc.id || chainId === arcTestnet.id
  const busy = isConnecting || isConnectingWagmi || isSwitching || Boolean(loadingConnectorId)

  // Switch or Add Arc Chain
  const handleSwitchToArc = async () => {
    try {
      if (switchChainAsync) {
        await switchChainAsync({ chainId: arc.id })
        toast.success('Switched to Arc Mainnet!')
        return
      }
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const ethereum = (window as any).ethereum
        try {
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13B2' }], // 5042 in hex
          })
          toast.success('Switched to Arc Mainnet!')
        } catch (switchError: any) {
          if (switchError.code === 4902 || switchError.code === -32603) {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x13B2',
                  chainName: 'Arc Mainnet',
                  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
                  rpcUrls: ['https://rpc.mainnet.arc.io'],
                  blockExplorerUrls: ['https://explorer.arc.io'],
                },
              ],
            })
            toast.success('Added and switched to Arc Mainnet!')
          } else {
            throw switchError
          }
        }
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to switch to Arc Mainnet')
    }
  }

  // Connect handler
  const handleConnect = async (connector: any) => {
    setLoadingConnectorId(connector.id)
    try {
      // Check if injected wallet exists in window
      if (connector.id === 'injected' && typeof window !== 'undefined' && !(window as any).ethereum) {
        toast.error('No Ethereum wallet detected. Please install MetaMask, Rabby, or use WalletConnect.')
        setLoadingConnectorId(null)
        return
      }

      await connectAsync({ connector })
      setModalOpen(false)
      toast.success('Wallet connected!')

      // Check chain and switch if needed
      setTimeout(async () => {
        try {
          if (switchChainAsync) {
            await switchChainAsync({ chainId: arc.id })
          }
        } catch {
          // Ignore switch cancellation
        }
      }, 300)
    } catch (err: any) {
      console.error('Wallet connection error:', err)
      toast.error(err?.shortMessage || err?.message || 'Failed to connect wallet')
    } finally {
      setLoadingConnectorId(null)
    }
  }

  if (!mounted) {
    return (
      <Button size={size} variant="outline" className={cn('gap-2', className)} disabled>
        <Wallet className="w-4 h-4" />
        Connect
      </Button>
    )
  }

  // 1. Connected but wrong network
  if (isConnected && address && !onArc) {
    return (
      <Button
        size={size}
        className={cn('gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold', className)}
        onClick={handleSwitchToArc}
        disabled={busy}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
        Switch to Arc
      </Button>
    )
  }

  // 2. Connected on Arc
  if (isConnected && address) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-black tracking-wide">
          <span className="size-2 rounded-full bg-primary animate-pulse" />
          {shortenAddress(address)}
        </span>
        <Button
          size={size}
          variant="outline"
          className="gap-2 font-bold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          onClick={() => {
            disconnect()
            toast.info('Wallet disconnected')
          }}
        >
          <LogOut className="w-4 h-4" />
          <span className="sm:hidden">{shortenAddress(address, 3)}</span>
          <span className="hidden sm:inline">Disconnect</span>
        </Button>
      </div>
    )
  }

  // 3. Disconnected — opens wallet modal or connects directly
  return (
    <>
      <Button
        size={size}
        className={cn('gap-2 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 cursor-pointer', className)}
        disabled={busy}
        onClick={() => {
          // If only 1 connector or window.ethereum is directly ready, try direct connect or open dialog
          if (connectors.length > 1) {
            setModalOpen(true)
          } else if (connectors.length === 1) {
            handleConnect(connectors[0])
          } else {
            setModalOpen(true)
          }
        }}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
        Connect Wallet
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-black text-center">Connect Your Wallet</DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Select a wallet to interact with Kolofi on Arc Mainnet.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-4">
            {connectors.map((c) => {
              const isLoading = loadingConnectorId === c.id

              let name = c.name
              if (c.id === 'injected') name = 'Browser Wallet (MetaMask / Rabby / Brave)'
              if (c.id === 'walletConnect') name = 'WalletConnect (Mobile / QR Code)'

              return (
                <button
                  key={c.uid || c.id}
                  disabled={busy}
                  onClick={() => handleConnect(c)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-primary/10 border border-border/60 hover:border-primary/40 transition-all font-bold text-sm text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border/50 group-hover:scale-105 transition-transform text-primary">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors">{name}</p>
                      <p className="text-[11px] text-muted-foreground font-normal">
                        {c.id === 'injected' ? 'Extension in your browser' : 'Scan with your mobile wallet app'}
                      </p>
                    </div>
                  </div>

                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  )}
                </button>
              )
            })}

            {connectors.length === 0 && (
              <div className="text-center py-6 space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-sm font-bold">No EVM Wallet Found</p>
                <p className="text-xs text-muted-foreground">
                  Please install MetaMask, Rabby, or an EVM-compatible browser extension.
                </p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline pt-2"
                >
                  <span>Install MetaMask</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border/50 text-center">
            <p className="text-[11px] text-muted-foreground">
              By connecting, you agree to interact on Arc Mainnet (Chain ID 5042).
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
