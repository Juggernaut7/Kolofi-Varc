import { formatEther, parseEther } from 'viem'

/** Format native Arc USDC (18 decimals) for display */
export function formatUsdc(wei: bigint, digits = 2): string {
  const n = Number(formatEther(wei))
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatUsdcLabel(wei: bigint, digits = 2): string {
  return `$${formatUsdc(wei, digits)} USDC`
}

/** Parse a human USDC amount string into native 18-decimal wei */
export function parseUsdc(amount: string): bigint {
  const cleaned = amount.trim().replace(/,/g, '')
  if (!cleaned || Number.isNaN(Number(cleaned))) {
    throw new Error('Invalid amount')
  }
  return parseEther(cleaned)
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`
}

export function explorerTxUrl(hash: string, testnet = false): string {
  const base = testnet
    ? 'https://explorer.testnet.arc.io'
    : 'https://explorer.arc.io'
  return `${base}/tx/${hash}`
}

export function explorerAddressUrl(address: string, testnet = false): string {
  const base = testnet
    ? 'https://explorer.testnet.arc.io'
    : 'https://explorer.arc.io'
  return `${base}/address/${address}`
}
