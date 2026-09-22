import { http, createConfig, createStorage, cookieStorage } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'
import { defineChain } from 'viem'

/** Arc mainnet — USDC-native L1 (chain id 5042) */
export const arc = defineChain({
  id: 5042,
  name: 'Arc',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.mainnet.arc.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Arc Explorer', url: 'https://explorer.arc.io' },
  },
})

/** Arc testnet for local experimentation */
export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.arc.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Arc Testnet Explorer', url: 'https://explorer.testnet.arc.io' },
  },
  testnet: true,
})

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || ''

const connectors = [
  injected({ shimDisconnect: true }),
  ...(projectId
    ? [
        walletConnect({
          projectId,
          metadata: {
            name: 'Kolofi',
            description: 'USDC group savings on Arc',
            url: 'https://kolofi.app',
            icons: ['https://kolofi.app/icon.png'],
          },
        }),
      ]
    : []),
]

export function getWagmiConfig() {
  return createConfig({
    chains: [arc, arcTestnet],
    connectors,
    transports: {
      [arc.id]: http('https://rpc.mainnet.arc.io'),
      [arcTestnet.id]: http('https://rpc.testnet.arc.io'),
    },
    ssr: true,
    storage: createStorage({ storage: cookieStorage }),
  })
}

export const ARC_VAULT_ADDRESS = (process.env.NEXT_PUBLIC_ARC_VAULT_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`

export const ARC_CIRCLE_ADDRESS = (process.env.NEXT_PUBLIC_ARC_CIRCLE_ADDRESS ||
  '0x0000000000000000000000000000000000000000') as `0x${string}`

export function vaultConfigured() {
  return ARC_VAULT_ADDRESS !== '0x0000000000000000000000000000000000000000'
}

export function circleConfigured() {
  return ARC_CIRCLE_ADDRESS !== '0x0000000000000000000000000000000000000000'
}

export function contractsConfigured() {
  return vaultConfigured() && circleConfigured()
}
