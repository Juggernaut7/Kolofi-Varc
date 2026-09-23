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
  const { address, isConnected, isConnecting, chain } = useAccount()
  const { connectAsync, connectors, isPending: isConnectingWagmi } = useConnect()
  const { disconnect } = useDisconnect()
  const fallbackChainId = useChainId()
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain()

  const [mounted, setMounted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingConnectorId, setLoadingConnectorId] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check the wallet's actual active chain
  const activeChainId = chain?.id ?? fallbackChainId
  const onArc = activeChainId === arc.id || activeChainId === arcTestnet.id
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
        className={cn('gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20', className)}
        onClick={handleSwitchToArc}
        disabled={busy}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
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
        onClick={() => setModalOpen(true)}
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
        Connect Wallet
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md w-[94vw] max-h-[85vh] flex flex-col overflow-hidden rounded-[2rem] p-6 shadow-2xl bg-card border-border/80">
          <DialogHeader className="space-y-1.5 shrink-0 text-center pb-1">
            <DialogTitle className="text-2xl font-black text-center text-foreground">
              Connect Your Wallet
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Select your wallet to interact with Kolofi on Arc Mainnet.
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable list container */}
          <div className="space-y-2.5 overflow-y-auto flex-1 min-h-0 pr-1.5 py-2 my-1 focus:outline-none scrollbar-thin">
            {connectors.map((c) => {
              const isLoading = loadingConnectorId === c.id

              let name = c.name
              if (c.id === 'injected' && name.toLowerCase() === 'injected') {
                name = 'Browser Wallet (MetaMask / Rabby / Brave)'
              }
              if (c.id === 'walletConnect') {
                name = 'WalletConnect (Mobile / QR Code)'
              }

              const isWalletConnect = c.id === 'walletConnect'
              const subtext = isWalletConnect
                ? 'Scan QR with your mobile wallet app'
                : 'Browser extension or installed desktop wallet'

              return (
                <button
                  key={c.uid || c.id}
                  disabled={busy}
                  onClick={() => handleConnect(c)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 hover:bg-primary/10 border border-border/60 hover:border-primary/40 transition-all font-bold text-sm text-left group cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border/50 group-hover:scale-105 transition-transform text-primary shrink-0 overflow-hidden p-1.5">
                      {c.icon ? (
                        <img src={c.icon} alt={c.name} className="w-full h-full object-contain rounded-lg" />
                      ) : (
                        <Wallet className="w-5 h-5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {name}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-normal truncate">
                        {subtext}
                      </p>
                    </div>
                  </div>

                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0 ml-2" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
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

          <div className="pt-3 border-t border-border/50 text-center shrink-0">
            <p className="text-[11px] text-muted-foreground font-medium">
              Arc Mainnet (Chain ID 5042) · Gas paid in native USDC
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
