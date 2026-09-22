'use client'

import { use, useState } from 'react'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from 'wagmi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Target, TrendingUp, Calendar, Lock, Loader2 } from 'lucide-react'
import { ARC_VAULT_ADDRESS, arc, vaultConfigured } from '@/lib/web3/config'
import { arcVaultAbi } from '@/lib/web3/abis'
import { formatUsdcLabel, parseUsdc } from '@/lib/web3/format'
import { toast } from 'sonner'

export default function VaultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const vaultId = BigInt(id)
  const { address, isConnected, chain } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const [amount, setAmount] = useState('1')

  const { data: vault, refetch } = useReadContract({
    address: ARC_VAULT_ADDRESS,
    abi: arcVaultAbi,
    functionName: 'getVault',
    args: [vaultId],
    query: { enabled: vaultConfigured() },
  })

  const { data: canWithdraw } = useReadContract({
    address: ARC_VAULT_ADDRESS,
    abi: arcVaultAbi,
    functionName: 'isWithdrawable',
    args: [vaultId],
    query: { enabled: vaultConfigured() },
  })

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  if (isSuccess) {
    refetch()
  }

  const ensureArcChain = async () => {
    if (chain?.id !== arc.id && switchChainAsync) {
      toast.info('Switching wallet to Arc Mainnet...')
      await switchChainAsync({ chainId: arc.id })
    }
  }

  const deposit = async () => {
    try {
      await ensureArcChain()
      writeContract({
        address: ARC_VAULT_ADDRESS,
        abi: arcVaultAbi,
        functionName: 'deposit',
        args: [vaultId],
        value: parseUsdc(amount),
        chainId: arc.id,
      })
    } catch (err: any) {
      toast.error(err?.message || 'Invalid amount')
    }
  }

  const withdraw = async () => {
    try {
      await ensureArcChain()
      writeContract({
        address: ARC_VAULT_ADDRESS,
        abi: arcVaultAbi,
        functionName: 'withdraw',
        args: [vaultId],
        chainId: arc.id,
      })
    } catch (err: any) {
      toast.error(err?.message || 'Withdraw failed')
    }
  }

  if (!vault || vault.owner === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading vault on Arc Mainnet...</p>
      </div>
    )
  }

  const progress =
    vault.goalAmount > 0n
      ? Number((vault.balance * 10000n) / vault.goalAmount) / 100
      : 0

  return (
    <div className="space-y-6 px-4 py-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{vault.name}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Personal USDC vault on Arc · #{id}
        </p>
      </div>

      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/80 text-sm font-medium">Amount Saved</p>
              <h2 className="text-4xl font-bold">{formatUsdcLabel(vault.balance)}</h2>
            </div>
            <div className="p-3 bg-primary-foreground/20 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="opacity-80">Progress to goal</span>
              <span className="font-semibold">{Math.round(Math.min(progress, 100))}%</span>
            </div>
            <Progress value={Math.min(progress, 100)} className="h-3" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
            <div>
              <p className="text-xs opacity-80">Goal</p>
              <p className="text-lg font-semibold">{formatUsdcLabel(vault.goalAmount)}</p>
            </div>
            <div>
              <p className="text-xs opacity-80">Status</p>
              <p className="text-lg font-semibold">{vault.closed ? 'Closed' : 'Locked'}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Unlock Date</p>
            <p className="font-semibold">
              {new Date(Number(vault.unlockTime) * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Owner</p>
            <p className="font-semibold text-xs break-all">{vault.owner}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Created</p>
            <p className="font-semibold">
              {new Date(Number(vault.createdAt) * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {isConnected && isOwner && !vault.closed && (
        <Card className="p-6 space-y-4">
          <h3 className="font-bold">Deposit USDC</h3>
          <div className="flex gap-2">
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button onClick={deposit} disabled={isPending || confirming}>
              {(isPending || confirming) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Deposit
            </Button>
          </div>
          {Boolean(canWithdraw) && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={withdraw}
              disabled={isPending || confirming}
            >
              Withdraw to wallet
            </Button>
          )}
          {error && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}
        </Card>
      )}
    </div>
  )
}
