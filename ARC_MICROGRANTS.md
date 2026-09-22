# Kolofi × Arc Microgrants

**Kolofi** is a smart group-savings protocol (solo goal vaults + Esusu / Ajo rotating circles) deployed and live on **Arc Mainnet** (Chain ID `5042`).

---

## 🚀 Deployed Contracts on Arc Mainnet

| Contract | Address | Explorer Link |
| :--- | :--- | :--- |
| **ArcVault** | `0xa7Bb4C5EE3aB4601f38aFDB34823EeD376684a8E` | [View on Arc Explorer](https://explorer.arc.io/address/0xa7Bb4C5EE3aB4601f38aFDB34823EeD376684a8E) |
| **ArcCircle** | `0x772668c219B6D35168DA2389cbda5Ca37827d604` | [View on Arc Explorer](https://explorer.arc.io/address/0x772668c219B6D35168DA2389cbda5Ca37827d604) |

- **Network:** Arc Mainnet
- **Chain ID:** `5042`
- **RPC Endpoint:** `https://rpc.mainnet.arc.io`
- **Gas Token:** Native USDC (18 decimals)

---

## 💡 Why Arc?

1. **Native USDC Gas Currency:** Kolofi users save, lock, and rotate the exact same asset they use to pay network gas. There are zero ERC-20 approval transactions, zero wrapped token hurdles, and zero gas-token swap barriers.
2. **Sub-Cent Transactions:** Rotating savings and periodic deposits cost fractions of a cent in USDC, making micropayments and community pooling economically viable.
3. **True On-Chain Execution:** No off-chain custodians or custodial intermediaries. All vault locks, rotating lineups, and pot distributions happen via audited smart contracts directly on Arc Mainnet.

---

## 🛠 Project Architecture

```
Kolofi/
├── contracts/                     # Hardhat smart contracts
│   ├── contracts/
│   │   ├── ArcVault.sol          # Personal savings vaults with target goals & unlock timestamps
│   │   └── ArcCircle.sol         # Rotating Esusu/ROSCA circles with automated lineup payouts
│   ├── test/
│   │   └── Kolofi.test.ts        # Comprehensive unit tests (100% passing)
│   └── scripts/
│       └── deploy.ts             # Arc Mainnet deployment script
│
└── Kolofi-client/                 # Next.js 16 Web3 Frontend
    ├── src/
    │   ├── app/
    │   │   ├── (app)/
    │   │   │   ├── dashboard/    # Live on-chain summary, active vaults & circles
    │   │   │   ├── vaults/       # Create, view, deposit, and withdraw USDC vaults
    │   │   │   ├── circles/      # Create, join, contribute, and claim rotating pots
    │   │   │   └── profile/      # Wallet manager & contract explorer links
    │   ├── components/
    │   │   ├── wallet/           # Web3 wallet connection (MetaMask, Rabby, WalletConnect)
    │   │   └── landing/          # Web3 hero, how-it-works, features, and CTA
    │   └── lib/web3/             # Arc chain definition, ABIs, and USDC formatters
```

---

## ⚡ Progress & Milestones

- [x] **Smart Contracts Developed & Tested:** `ArcVault` & `ArcCircle` passed all Hardhat test suites.
- [x] **Deployed on Arc Mainnet:** Both contracts deployed and live at verified addresses.
- [x] **Web3-Native Authentication:** Replaced Web2 mock email/password auth with direct EVM Web3 wallet connection (MetaMask, Rabby, WalletConnect).
- [x] **Zero Mock Data:** Dashboard, vaults, and circles pages directly query live contract state on Arc Mainnet.
- [x] **Production Build Verified:** Next.js Turbopack build tested with 18/18 static and dynamic routes compiled.

---

## 📋 DoraHacks Submission Details

- **Project Name:** Kolofi – Smart Group Savings on Arc
- **Category:** Arc Microgrants | Circle
- **Repo:** [https://github.com/Juggernaut7/Kolofi-Varc.git](https://github.com/Juggernaut7/Kolofi-Varc.git)
- **Chain:** Arc Mainnet (`5042`)
- **Gas Model:** Native USDC
- **Deadline:** October 14, 2026 (Rolling Review)
