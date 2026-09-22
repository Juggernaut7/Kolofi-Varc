'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { ARC_VAULT_ADDRESS, arc, vaultConfigured } from '@/lib/web3/config'
import { arcVaultAbi } from '@/lib/web3/abis'
import { parseUsdc } from '@/lib/web3/format'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import { toast } from 'sonner'

export default function CreateVaultPage() {
  const router = useRouter()
  const { isConnected, chain } = useAccount()
  const { switchChainAsync, isPending: switchingChain } = useSwitchChain()

  const [name, setName] = useState('')
  const [goal, setGoal] = useState('10')
  const [unlockDate, setUnlockDate] = useState('')

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const isWrongChain = isConnected && chain?.id !== arc.id

  if (isSuccess) {
    router.push('/vaults')
  }

  const handleSwitch = async () => {
    try {
      await switchChainAsync({ chainId: arc.id })
      toast.success('Switched to Arc Mainnet')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to switch network')
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vaultConfigured()) {
      toast.error('Vault contract address not configured')
      return
    }

    try {
      if (isWrongChain) {
        toast.info('Switching wallet to Arc Mainnet...')
        await switchChainAsync({ chainId: arc.id })
      }

      const unlockTime = Math.floor(new Date(unlockDate).getTime() / 1000)
      if (!name.trim() || unlockTime <= Math.floor(Date.now() / 1000)) {
        toast.error('Pick a future unlock date and a name')
        return
      }

      writeContract({
        address: ARC_VAULT_ADDRESS,
        abi: arcVaultAbi,
        functionName: 'createVault',
        args: [name.trim(), parseUsdc(goal), BigInt(unlockTime)],
        chainId: arc.id,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed')
    }
  }

  if (!isConnected) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Create Vault</h1>
        <ConnectWalletButton />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <Link href="/vaults" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-3xl font-bold">Create USDC Vault</h1>
      <p className="text-muted-foreground text-sm">
        Locks native USDC on Arc until your unlock date — or withdraw early once you hit the goal.
      </p>

      {isWrongChain && (
        <Card className="p-4 bg-amber-500/10 border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-amber-700 dark:text-amber-400 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Connected to Network #{chain?.id}. Switch to Arc Mainnet to deploy.</span>
          </div>
          <Button size="sm" onClick={handleSwitch} disabled={switchingChain} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0">
            {switchingChain ? 'Switching…' : 'Switch Network'}
          </Button>
        </Card>
      )}

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Vault name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Emergency fund"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal">Goal (USDC)</Label>
            <Input
              id="goal"
              type="number"
              min="0.01"
              step="0.01"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unlock">Unlock date</Label>
            <Input
              id="unlock"
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}

          {isWrongChain ? (
            <Button
              type="button"
              onClick={handleSwitch}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
              disabled={switchingChain}
            >
              {switchingChain ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Switch to Arc Mainnet (5042)
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-primary font-bold"
              disabled={isPending || confirming || switchingChain}
            >
              {(isPending || confirming) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {confirming ? 'Confirming on Arc…' : isPending ? 'Sign in wallet…' : 'Create on Arc'}
            </Button>
          )}
        </form>
      </Card>
    </div>
  )
}
