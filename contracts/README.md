# Kolofi Contracts (Arc)

Solidity contracts for **Arc Microgrants**: personal USDC vaults and rotating savings circles on Arc mainnet.

## Contracts

| Contract | Purpose |
|----------|---------|
| `ArcVault` | Lock native USDC toward a goal / unlock time, then withdraw |
| `ArcCircle` | ROSCA / Esusu pool — fixed contribution, rotating payouts |

Both use **Arc native USDC** (`msg.value`, 18 decimals). Gas on Arc is also USDC, so users only need one asset.

## Setup

```bash
cd contracts
npm install
cp .env.example .env
# Add PRIVATE_KEY with USDC on Arc for gas
```

## Test & compile

```bash
npm test
npm run compile
```

## Deploy

**Testnet first (recommended):**
```bash
npm run deploy:arcTestnet
```

**Mainnet (required for Arc Microgrants submission):**
```bash
npm run deploy:arc
```

Copy the printed addresses into `Kolofi-client/.env.local`.

## Network

| Network | Chain ID | RPC |
|---------|----------|-----|
| Arc | 5042 | https://rpc.mainnet.arc.io |
| Arc Testnet | 5042002 | https://rpc.testnet.arc.io |
