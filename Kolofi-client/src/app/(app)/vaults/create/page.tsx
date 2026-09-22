'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ARC_VAULT_ADDRESS, arc, vaultConfigured } from '@/lib/web3/config'
import { arcVaultAbi } from '@/lib/web3/abis'
import { parseUsdc } from '@/lib/web3/format'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import { toast } from 'sonner'

export default function CreateVaultPage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('10')
  const [unlockDate, setUnlockDate] = useState('')

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  if (isSuccess) {
    router.push('/vaults')
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!vaultConfigured()) {
      toast.error('Vault contract address not configured')
      return
    }
    try {
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
      toast.error(err instanceof Error ? err.message : 'Invalid input')
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
          <Button
            type="submit"
            className="w-full bg-primary"
            disabled={isPending || confirming}
          >
            {(isPending || confirming) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {confirming ? 'Confirming…' : isPending ? 'Sign in wallet…' : 'Create on Arc'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
