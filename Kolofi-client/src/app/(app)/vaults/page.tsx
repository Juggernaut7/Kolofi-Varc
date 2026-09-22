'use client'

import Link from 'next/link'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Target, Plus, Loader2 } from 'lucide-react'
import { ARC_VAULT_ADDRESS, vaultConfigured } from '@/lib/web3/config'
import { arcVaultAbi } from '@/lib/web3/abis'
import { formatUsdcLabel } from '@/lib/web3/format'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'

export default function VaultsPage() {
  const { address, isConnected } = useAccount()
  const ready = vaultConfigured()

  const { data: vaultIds, isLoading: loadingIds } = useReadContract({
    address: ARC_VAULT_ADDRESS,
    abi: arcVaultAbi,
    functionName: 'getUserVaultIds',
    args: address ? [address] : undefined,
    query: { enabled: Boolean(address) && ready },
  })

  const ids = (vaultIds as bigint[] | undefined) ?? []

  const { data: vaultResults, isLoading: loadingVaults } = useReadContracts({
    contracts: ids.map((id) => ({
      address: ARC_VAULT_ADDRESS,
      abi: arcVaultAbi,
      functionName: 'getVault' as const,
      args: [id] as const,
    })),
    query: { enabled: ids.length > 0 },
  })

  const loading = loadingIds || loadingVaults

  if (!isConnected) {
    return (
      <div className="space-y-6 px-4 py-6 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Savings Vaults</h1>
        <Card className="p-10 text-center space-y-4">
          <Target className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Connect your wallet to view USDC vaults on Arc.</p>
          <ConnectWalletButton className="mx-auto" />
        </Card>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="space-y-6 px-4 py-6 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-foreground">Savings Vaults</h1>
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Set <code className="text-foreground">NEXT_PUBLIC_ARC_VAULT_ADDRESS</code> after deploying
          contracts to Arc.
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Savings Vaults</h1>
        <Link href="/vaults/create">
          <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" />
            New
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : ids.length > 0 ? (
        <div className="space-y-4">
          {ids.map((id, index) => {
            const vault = vaultResults?.[index]?.result as
              | {
                  name: string
                  goalAmount: bigint
                  balance: bigint
                  unlockTime: bigint
                  closed: boolean
                }
              | undefined
            if (!vault || vault.closed) return null
            const progress =
              vault.goalAmount > 0n
                ? Number((vault.balance * 10000n) / vault.goalAmount) / 100
                : 0
            return (
              <Link key={id.toString()} href={`/vaults/${id.toString()}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{vault.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatUsdcLabel(vault.balance)} / {formatUsdcLabel(vault.goalAmount)}
                        </p>
                      </div>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Unlocks{' '}
                      {new Date(Number(vault.unlockTime) * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center bg-muted/30">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No vaults yet</h3>
          <p className="text-muted-foreground mb-4">
            Lock USDC on Arc toward a goal or unlock date
          </p>
          <Link href="/vaults/create">
            <Button className="bg-primary hover:bg-primary/90">Create Vault</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
