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
import { ARC_CIRCLE_ADDRESS, arc, circleConfigured } from '@/lib/web3/config'
import { arcCircleAbi } from '@/lib/web3/abis'
import { parseUsdc } from '@/lib/web3/format'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import { toast } from 'sonner'

export default function CreateCirclePage() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [name, setName] = useState('')
  const [contribution, setContribution] = useState('5')
  const [maxMembers, setMaxMembers] = useState('5')

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  if (isSuccess) {
    router.push('/circles')
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!circleConfigured()) {
      toast.error('Circle contract address not configured')
      return
    }
    const members = Number(maxMembers)
    if (!name.trim() || members < 2 || members > 50) {
      toast.error('Name required; members must be 2–50')
      return
    }
    try {
      writeContract({
        address: ARC_CIRCLE_ADDRESS,
        abi: arcCircleAbi,
        functionName: 'createCircle',
        args: [name.trim(), parseUsdc(contribution), BigInt(members)],
        chainId: arc.id,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid input')
    }
  }

  if (!isConnected) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Create Circle</h1>
        <ConnectWalletButton />
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <Link href="/circles" className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <div>
        <h1 className="text-3xl font-bold">Create Savings Circle</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Esusu / Ajo style rotating pool on Arc. You join as member #1 (first payout).
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Circle name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Friends Esusu"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contribution">Contribution per round (USDC)</Label>
            <Input
              id="contribution"
              type="number"
              min="0.01"
              step="0.01"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="members">Max members</Label>
            <Input
              id="members"
              type="number"
              min="2"
              max="50"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error.message}</p>
          )}
          <Button type="submit" className="w-full bg-primary" disabled={isPending || confirming}>
            {(isPending || confirming) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {confirming ? 'Confirming…' : isPending ? 'Sign in wallet…' : 'Create on Arc'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
