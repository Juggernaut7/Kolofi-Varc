'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useAccount, useReadContract, useReadContracts } from 'wagmi'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Plus, Loader2 } from 'lucide-react'
import { ARC_CIRCLE_ADDRESS, circleConfigured } from '@/lib/web3/config'
import { arcCircleAbi } from '@/lib/web3/abis'
import { formatUsdcLabel } from '@/lib/web3/format'
import ConnectWalletButton from '@/components/wallet/connect-wallet-button'

const MAX_SCAN = 50n

export default function CirclesPage() {
  const { address, isConnected } = useAccount()
  const ready = circleConfigured()

  const { data: nextId, isLoading: loadingNext } = useReadContract({
    address: ARC_CIRCLE_ADDRESS,
    abi: arcCircleAbi,
    functionName: 'nextCircleId',
    query: { enabled: ready },
  })

  const idsToScan = useMemo(() => {
    if (!nextId || nextId <= 1n) return [] as bigint[]
    const latest = nextId - 1n
    const start = latest > MAX_SCAN ? latest - MAX_SCAN + 1n : 1n
    const list: bigint[] = []
    for (let i = start; i <= latest; i++) list.push(i)
    return list.reverse()
  }, [nextId])

  const { data: circleResults, isLoading: loadingCircles } = useReadContracts({
    contracts: idsToScan.map((id) => ({
      address: ARC_CIRCLE_ADDRESS,
      abi: arcCircleAbi,
      functionName: 'getCircle' as const,
      args: [id] as const,
    })),
    query: { enabled: idsToScan.length > 0 },
  })

  const { data: memberFlags } = useReadContracts({
    contracts: idsToScan.map((id) => ({
      address: ARC_CIRCLE_ADDRESS,
      abi: arcCircleAbi,
      functionName: 'isMember' as const,
      args: [id, address!] as const,
    })),
    query: { enabled: Boolean(address) && idsToScan.length > 0 },
  })

  const rows = idsToScan
    .map((id, index) => {
      const circle = circleResults?.[index]?.result as
        | {
            name: string
            contributionAmount: bigint
            memberCount: bigint
            maxMembers: bigint
            pot: bigint
            active: boolean
            creator: string
          }
        | undefined
      if (!circle || circle.creator === '0x0000000000000000000000000000000000000000') {
        return null
      }
      const isMember = Boolean(memberFlags?.[index]?.result)
      const isCreator =
        address && circle.creator.toLowerCase() === address.toLowerCase()
      if (!isMember && !isCreator && !circle.active) return null
      return { id, circle, isMember: isMember || Boolean(isCreator) }
    })
    .filter(Boolean) as Array<{
    id: bigint
    circle: {
      name: string
      contributionAmount: bigint
      memberCount: bigint
      maxMembers: bigint
      pot: bigint
      active: boolean
    }
    isMember: boolean
  }>

  const mine = rows.filter((r) => r.isMember)
  const open = rows.filter((r) => !r.isMember && r.circle.active)
  const loading = loadingNext || loadingCircles

  if (!isConnected) {
    return (
      <div className="space-y-6 px-4 py-6 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold">Savings Circles</h1>
        <Card className="p-10 text-center space-y-4">
          <Users className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Connect a wallet to join USDC rotating circles on Arc.
          </p>
          <ConnectWalletButton className="mx-auto" />
        </Card>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="space-y-6 px-4 py-6 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold">Savings Circles</h1>
        <Card className="p-8 text-center text-sm text-muted-foreground">
          Set <code className="text-foreground">NEXT_PUBLIC_ARC_CIRCLE_ADDRESS</code> after
          deploying contracts.
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Savings Circles</h1>
        <Link href="/circles/create">
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
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              Your circles
            </h2>
            {mine.length === 0 ? (
              <Card className="p-8 text-center bg-muted/30">
                <p className="text-muted-foreground mb-4">No circles yet</p>
                <Link href="/circles/create">
                  <Button className="bg-primary">Create Circle</Button>
                </Link>
              </Card>
            ) : (
              mine.map(({ id, circle }) => (
                <Link key={id.toString()} href={`/circles/${id.toString()}`}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{circle.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {circle.memberCount.toString()}/{circle.maxMembers.toString()} members ·{' '}
                            {formatUsdcLabel(circle.contributionAmount)} / round
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold text-primary">Pot</p>
                        <p className="text-muted-foreground">{formatUsdcLabel(circle.pot)}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </section>

          {open.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                Open to join
              </h2>
              {open.map(({ id, circle }) => (
                <Link key={id.toString()} href={`/circles/${id.toString()}`}>
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold">{circle.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {circle.memberCount.toString()}/{circle.maxMembers.toString()} ·{' '}
                      {formatUsdcLabel(circle.contributionAmount)} USDC
                    </p>
                  </Card>
                </Link>
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}
