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
import { ARC_CIRCLE_ADDRESS, arc, circleConfigured } from '@/lib/web3/config'
import { arcCircleAbi } from '@/lib/web3/abis'
import { parseUsdc } from '@/lib/web3/format'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'
import { toast } from 'sonner'

export default function CreateCirclePage() {
  const router = useRouter()
  const { isConnected, chain } = useAccount()
  const { switchChainAsync, isPending: switchingChain } = useSwitchChain()

  const [name, setName] = useState('')
  const [contribution, setContribution] = useState('5')
  const [maxMembers, setMaxMembers] = useState('5')

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const isWrongChain = isConnected && chain?.id !== arc.id

  if (isSuccess) {
    router.push('/circles')
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
    if (!circleConfigured()) {
      toast.error('Circle contract address not configured')
      return
    }

    try {
      if (isWrongChain) {
        toast.info('Switching wallet to Arc Mainnet...')
        await switchChainAsync({ chainId: arc.id })
      }

      const members = Number(maxMembers)
      if (!name.trim() || members < 2 || members > 50) {
        toast.error('Name required; members must be 2–50')
        return
      }

      writeContract({
        address: ARC_CIRCLE_ADDRESS,
        abi: arcCircleAbi,
        functionName: 'createCircle',
        args: [name.trim(), parseUsdc(contribution), BigInt(members)],
        chainId: arc.id,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Action failed')
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

      {isWrongChain && (
        <Card className="p-4 bg-primary/10 border-primary/25 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
            <AlertCircle className="w-4 h-4 text-primary shrink-0" />
            <span>Connected to Network #{chain?.id}. Switch to Arc Mainnet to deploy.</span>
          </div>
          <Button size="sm" onClick={handleSwitch} disabled={switchingChain} className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shrink-0 rounded-xl shadow-md shadow-primary/20">
            {switchingChain ? 'Switching…' : 'Switch Network'}
          </Button>
        </Card>
      )}

      <Card className="p-6 rounded-[2rem] border-border/60">
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

          {isWrongChain ? (
            <Button
              type="button"
              onClick={handleSwitch}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl h-12 shadow-lg shadow-primary/25"
              disabled={switchingChain}
            >
              {switchingChain ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Switch to Arc Mainnet (5042)
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-2xl h-12 shadow-lg shadow-primary/25"
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
