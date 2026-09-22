'use client'

import { use, useState } from 'react'
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from 'wagmi'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Users,
  Wallet,
  CheckCircle2,
  Clock,
  Loader2,
  Copy,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ARC_CIRCLE_ADDRESS, arc, circleConfigured } from '@/lib/web3/config'
import { arcCircleAbi } from '@/lib/web3/abis'
import { formatUsdcLabel, shortenAddress } from '@/lib/web3/format'
import { toast } from 'sonner'

export default function CircleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const circleId = BigInt(id)
  const { address, isConnected, chain } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const [copied, setCopied] = useState(false)

  const { data: circle, refetch: refetchCircle } = useReadContract({
    address: ARC_CIRCLE_ADDRESS,
    abi: arcCircleAbi,
    functionName: 'getCircle',
    args: [circleId],
    query: { enabled: circleConfigured() },
  })

  const { data: members, refetch: refetchMembers } = useReadContract({
    address: ARC_CIRCLE_ADDRESS,
    abi: arcCircleAbi,
    functionName: 'getMembers',
    args: [circleId],
    query: { enabled: circleConfigured() },
  })

  const { data: isMember } = useReadContract({
    address: ARC_CIRCLE_ADDRESS,
    abi: arcCircleAbi,
    functionName: 'isMember',
    args: address ? [circleId, address] : undefined,
    query: { enabled: Boolean(address) && circleConfigured() },
  })

  const { data: recipient } = useReadContract({
    address: ARC_CIRCLE_ADDRESS,
    abi: arcCircleAbi,
    functionName: 'currentRecipient',
    args: [circleId],
    query: { enabled: circleConfigured() },
  })

  const { data: myContributed } = useReadContract({
    address: ARC_CIRCLE_ADDRESS,
    abi: arcCircleAbi,
    functionName: 'hasContributed',
    args:
      address && circle
        ? [circleId, circle.currentRound, address]
        : undefined,
    query: { enabled: Boolean(address && circle) },
  })

  const { data: roundCount } = useReadContract({
    address: ARC_CIRCLE_ADDRESS,
    abi: arcCircleAbi,
    functionName: 'getRoundContributionCount',
    args: circle ? [circleId, circle.currentRound] : undefined,
    query: { enabled: Boolean(circle) },
  })

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  if (isSuccess) {
    refetchCircle()
    refetchMembers()
  }

  const ensureArcChain = async () => {
    if (chain?.id !== arc.id && switchChainAsync) {
      toast.info('Switching wallet to Arc Mainnet...')
      await switchChainAsync({ chainId: arc.id })
    }
  }

  const run = async (fn: 'joinCircle' | 'contribute' | 'claimPayout') => {
    try {
      await ensureArcChain()
      if (fn === 'contribute') {
        writeContract({
          address: ARC_CIRCLE_ADDRESS,
          abi: arcCircleAbi,
          functionName: 'contribute',
          args: [circleId],
          value: circle?.contributionAmount,
          chainId: arc.id,
        })
        return
      }
      writeContract({
        address: ARC_CIRCLE_ADDRESS,
        abi: arcCircleAbi,
        functionName: fn,
        args: [circleId],
        chainId: arc.id,
      })
    } catch (err: any) {
      toast.error(err?.message || 'Transaction failed')
    }
  }

  if (!circle || circle.creator === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading circle on Arc Mainnet...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 px-4 py-8 pb-24 max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 text-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
          <Users size={12} />
          <span>{circle.active ? 'Active on Arc' : 'Completed'}</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">{circle.name}</h1>
        <p className="text-muted-foreground font-medium text-sm">
          Circle #{id} · {formatUsdcLabel(circle.contributionAmount)} per member / round
        </p>
      </motion.div>

      <Card className="rounded-[2.5rem] bg-primary text-primary-foreground border-none shadow-2xl shadow-primary/20 overflow-hidden relative">
        <CardContent className="p-8 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Current pot
              </p>
              <h2 className="text-4xl font-black">{formatUsdcLabel(circle.pot)}</h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Wallet size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-white/10 border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Contribution
              </p>
              <p className="text-xl font-black">
                {formatUsdcLabel(circle.contributionAmount)}
              </p>
            </div>
            <div className="p-4 rounded-3xl bg-white/10 border border-white/5 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Round
              </p>
              <p className="text-xl font-black">
                {Number(circle.currentRound) + 1}/{circle.maxMembers.toString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
              <span>Round contributions</span>
              <span>
                {roundCount?.toString() ?? '0'}/{circle.memberCount.toString()}
              </span>
            </div>
            <Progress value={contribProgress} className="h-2 rounded-full bg-white/20" />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {canJoin && (
          <Button
            className="flex-1 bg-primary"
            disabled={isPending || confirming}
            onClick={() => run('joinCircle')}
          >
            {(isPending || confirming) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Join circle
          </Button>
        )}
        {canContribute && (
          <Button
            className="flex-1 bg-primary"
            disabled={isPending || confirming}
            onClick={() => run('contribute')}
          >
            {(isPending || confirming) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Contribute {formatUsdcLabel(circle.contributionAmount)}
          </Button>
        )}
        {canClaim && (
          <Button
            className="flex-1"
            variant="secondary"
            disabled={isPending || confirming}
            onClick={() => run('claimPayout')}
          >
            Claim payout
          </Button>
        )}
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => {
            navigator.clipboard.writeText(inviteLink)
            setCopied(true)
            toast.success('Invite link copied')
            setTimeout(() => setCopied(false), 2000)
          }}
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied' : 'Invite'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">
          {error.message}
        </p>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between ml-1">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            The Lineup
          </h2>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="space-y-3">
          {memberList.map((member, index) => {
            const isNext = recipient?.toLowerCase() === member.toLowerCase()
            const paidRound =
              circle.currentRound > BigInt(index) ||
              (!circle.active && circle.currentRound >= circle.memberCount)
            return (
              <motion.div
                key={member}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    'rounded-[2rem] p-4 border-none shadow-none',
                    isNext ? 'bg-primary/5 ring-2 ring-primary/20' : 'bg-muted/30',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 border-2 border-background">
                        <AvatarFallback className="font-bold">
                          {member.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-sm">{shortenAddress(member)}</p>
                        <p className="text-xs text-muted-foreground">
                          Position #{index + 1}
                          {address?.toLowerCase() === member.toLowerCase() ? ' · You' : ''}
                        </p>
                      </div>
                    </div>
                    {paidRound ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : isNext ? (
                      <span className="text-[10px] font-black uppercase text-primary">
                        Receiving
                      </span>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-muted-foreground">
                        Waiting
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
