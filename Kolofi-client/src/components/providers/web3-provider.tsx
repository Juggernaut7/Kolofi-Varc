'use client'

import { useState, type ReactNode } from 'react'
import { WagmiProvider, type State } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getWagmiConfig } from '@/lib/web3/config'

export function Web3Provider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState?: State
}) {
  const [queryClient] = useState(() => new QueryClient())
  const [config] = useState(() => getWagmiConfig())

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
